/**
 * Caterpillar Equipment Telematics Simulator
 * 
 * Simulates an IoT telematic unit on heavy construction/mining machinery
 * sending real-time heartbeats and operating metrics to the backend.
 * 
 * Usage:
 *   node simulator.js
 * 
 * Configuration options via environment variables or CLI args:
 *   SERVER_URL=http://localhost:5000 (or IP address of your server)
 *   EQUIPMENT_ID=EQ1001
 *   SITE_ID=S003
 *   INTERVAL_MS=5000
 *   MACHINE_STATUS=running (running | idle | stopped)
 * 
 * Examples:
 *   SERVER_URL=http://192.168.1.15:5000 EQUIPMENT_ID=EQ1001 node simulator.js
 *   node simulator.js --url=http://192.168.1.15:5000 --id=EQ1001
 */

const http = require("http");
const https = require("https");
const url = require("url");

// Parse CLI arguments: e.g. --url=http://... --id=EQ1001 --status=running
const args = {};
process.argv.slice(2).forEach((arg) => {
  if (arg.startsWith("--")) {
    const [key, val] = arg.slice(2).split("=");
    args[key] = val || true;
  }
});

const SERVER_URL = (
  process.env.SERVER_URL ||
  args.url ||
  "http://localhost:5000"
).replace(/\/$/, "");

const EQUIPMENT_ID = process.env.EQUIPMENT_ID || args.id || "EQ1001";
const SITE_ID = process.env.SITE_ID || args.site || "S003";
const INTERVAL_MS = parseInt(
  process.env.INTERVAL_MS || args.interval || "5000",
  10
);
let MACHINE_STATUS = process.env.MACHINE_STATUS || args.status || "running";

// Initial machine metric values
let engineHours = 7.5;
let idleHours = 1.2;
let heartbeatCount = 0;

console.log("==================================================");
console.log("🚜 CATERPILLAR EQUIPMENT TELEMETRY SIMULATOR");
console.log("==================================================");
console.log(` Target Server:   ${SERVER_URL}`);
console.log(` Equipment ID:    ${EQUIPMENT_ID}`);
console.log(` Site ID:         ${SITE_ID}`);
console.log(` Initial Status:  ${MACHINE_STATUS.toUpperCase()}`);
console.log(` Heartbeat Every: ${INTERVAL_MS / 1000}s`);
console.log("==================================================");
console.log("Press Ctrl+C to STOP heartbeat (machine goes OFFLINE)");
console.log("==================================================\n");

function sendTelemetry() {
  heartbeatCount++;

  // Realistic simulation changes:
  if (MACHINE_STATUS === "running") {
    // Engine hours increment slowly (~0.01 per cycle)
    engineHours = parseFloat((engineHours + 0.01).toFixed(2));
  } else if (MACHINE_STATUS === "idle") {
    // Idle hours increment slowly (~0.01 per cycle)
    idleHours = parseFloat((idleHours + 0.01).toFixed(2));
  }

  const payload = {
    equipmentId: EQUIPMENT_ID,
    machineStatus: MACHINE_STATUS,
    engineHours,
    idleHours,
    siteId: SITE_ID,
  };

  const payloadString = JSON.stringify(payload);
  const targetEndpoint = `${SERVER_URL}/api/telemetry/${EQUIPMENT_ID}`;
  const parsedUrl = url.parse(targetEndpoint);
  const client = parsedUrl.protocol === "https:" ? https : http;

  const reqOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
    path: parsedUrl.path,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payloadString),
    },
    timeout: 4000,
  };

  const timestamp = new Date().toLocaleTimeString();

  const req = client.request(reqOptions, (res) => {
    let responseData = "";
    res.on("data", (chunk) => (responseData += chunk));
    res.on("end", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log(
          `[${timestamp}] 🟢 Heartbeat #${heartbeatCount} sent OK -> ${EQUIPMENT_ID} (${MACHINE_STATUS.toUpperCase()}) | Engine: ${engineHours}h | Idle: ${idleHours}h | Site: ${SITE_ID}`
        );
      } else {
        console.warn(
          `[${timestamp}] ⚠️ Server responded with HTTP ${res.statusCode}: ${responseData}`
        );
      }
    });
  });

  req.on("error", (err) => {
    console.error(
      `[${timestamp}] 🔴 Connection error sending heartbeat to ${SERVER_URL}: ${err.message}`
    );
  });

  req.on("timeout", () => {
    req.destroy();
    console.error(`[${timestamp}] ⏱️ Request timed out`);
  });

  req.write(payloadString);
  req.end();
}

// Send initial heartbeat immediately, then periodically
sendTelemetry();
const timer = setInterval(sendTelemetry, INTERVAL_MS);

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n🛑 Simulator STOPPED.");
  console.log("Heartbeat stream paused. Backend will detect equipment as OFFLINE after timeout.");
  clearInterval(timer);
  process.exit(0);
});
