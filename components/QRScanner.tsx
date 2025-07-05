"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface DecryptResponse {
  success: boolean;
  decrypted_otp?: string;
  message?: string;
  error?: string;
  record_id?: number;
}

export default function QRScanner({ uid }: { uid: string | null }) {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [response, setResponse] = useState<DecryptResponse | null>(null);
  const [mobileIp, setMobileIp] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  // Fetch the public IP once on component mount
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        setMobileIp(data.ip);
      })
      .catch((err) => {
        console.warn("Failed to fetch public IP:", err);
        setMobileIp(null);
      });
  }, []);

  // When QR is scanned and uid & mobileIp are available, call decrypt_otp API
  useEffect(() => {
    if (scannedData && uid && mobileIp) {
      fetch(
        "http://rnxou-2400-adc5-142-6f00-244d-3b1d-fd1d-b579.a.free.pinggy.link/decrypt_otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cipher_text: scannedData,
            uid: uid,
            mobile_ip: mobileIp,
          }),
        }
      )
        .then((res) => res.json())
        .then((data: DecryptResponse) => {
          setResponse(data);
        })
        .catch((err) => {
          setResponse({
            success: false,
            error: "Network error: " + err.message,
          });
        });
    }
  }, [scannedData, uid, mobileIp]);

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

          {response ? (
            response.success ? (
              <div className="mt-4 text-green-400">
                <p>OTP Verified!</p>
                <p>Decrypted OTP: {response.decrypted_otp}</p>
                <p>Record ID: {response.record_id}</p>
                <p>{response.message}</p>
              </div>
            ) : (
              <div className="mt-4 text-red-400">
                <p>Error: {response.error || "Unknown error"}</p>
              </div>
            )
          ) : (
            <p className="mt-4 text-yellow-400">Verifying OTP...</p>
          )}
        </div>
      ) : (
        <div id="qr-reader" ref={scannerRef} className="w-full max-w-md" />
      )}
    </div>
  );
}
