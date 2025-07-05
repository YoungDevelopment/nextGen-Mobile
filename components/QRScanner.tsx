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
      /* verbose */ false
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">QR Code Scanner</h1>

      {scannedData ? (
        <div className="bg-white p-4 rounded shadow w-full max-w-md text-center">
          <p className="font-semibold text-black">Scanned Data:</p>
          <p className="break-words text-black">{scannedData}</p>
        </div>
      ) : (
        <div id="qr-reader" ref={scannerRef} className="w-full max-w-md" />
      )}
    </div>
  );
}
