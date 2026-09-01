import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Icon from "./Icon.jsx";

// Camera QR scanner. Calls onResult(decodedText) once on a successful scan.
export default function QRScanner({ onResult }) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const scannerRef = useRef(null);
  const regionId = "qr-reader-region";

  async function start() {
    setError("");
    try {
      const html5Qr = new Html5Qrcode(regionId);
      scannerRef.current = html5Qr;
      await html5Qr.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 240 },
        (decodedText) => {
          onResult(decodedText);
          stop();
        },
        () => {}
      );
      setScanning(true);
    } catch {
      setError("Could not start the camera. Use manual entry below.");
    }
  }

  async function stop() {
    const s = scannerRef.current;
    if (s) {
      try {
        await s.stop();
        await s.clear();
      } catch {
        /* ignore */
      }
      scannerRef.current = null;
    }
    setScanning(false);
  }

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="relative mx-auto grid min-h-[220px] max-w-xs place-items-center overflow-hidden rounded-xl border border-stone-200 bg-stone-900">
        <div id={regionId} className="w-full" />
        {!scanning && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-stone-500">
            <div className="text-center">
              <Icon name="camera" className="mx-auto h-8 w-8" />
              <p className="mt-1 text-xs">Camera preview</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3 text-center">
        {!scanning ? (
          <button onClick={start} className="btn btn-primary btn-sm">
            <Icon name="camera" className="h-4 w-4" />
            Start camera
          </button>
        ) : (
          <button onClick={stop} className="btn btn-ghost btn-sm">
            Stop camera
          </button>
        )}
      </div>
    </div>
  );
}
