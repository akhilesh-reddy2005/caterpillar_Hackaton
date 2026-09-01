import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

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
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          onResult(decodedText);
          stop();
        },
        () => {}
      );
      setScanning(true);
    } catch (err) {
      setError("Could not start camera. Use manual entry below.");
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
      <div
        id={regionId}
        className="w-full max-w-xs mx-auto rounded-lg overflow-hidden bg-gray-100"
      />
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <div className="mt-3 text-center">
        {!scanning ? (
          <button
            onClick={start}
            className="bg-cat-yellow text-cat-black font-semibold px-4 py-2 rounded-lg"
          >
            Start Camera
          </button>
        ) : (
          <button
            onClick={stop}
            className="bg-gray-200 font-semibold px-4 py-2 rounded-lg"
          >
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}
