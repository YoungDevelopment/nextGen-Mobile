"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scannedData) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (text) => {
        setScannedData(text);
        scanner.clear();
      },
      (err) => {
        console.warn("Scan error", err);
      }
    );

    return () => {
      scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
    };
  }, [scannedData]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: "black" }}
    >
      <h1 className="text-2xl font-bold mb-4 text-white">QR Code Scanner</h1>

      {scannedData ? (
        <div
          className="p-4 rounded shadow w-full max-w-md text-center"
          style={{ backgroundColor: "black" }}
        >
          <p className="font-semibold text-white">Scanned Data:</p>
          <p className="break-words text-white">{scannedData}</p>
        </div>
      ) : (
        <div id="qr-reader" ref={scannerRef} className="w-full max-w-md" />
      )}
    </div>
  );
}
