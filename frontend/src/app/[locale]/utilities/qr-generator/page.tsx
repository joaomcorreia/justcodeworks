"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import { UtilityPageShell } from "@/components/utility-page-shell";
import Footer from "@/components/Footer";
import MainNavigation from "@/components/MainNavigation";

export default function QrGeneratorPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const [text, setText] = useState("https://justcodeworks.com");
  const [size, setSize] = useState(256);
  const [qrUrl, setQrUrl] = useState<string>("");

  function generateQr() {
    if (!text.trim()) return;
    
    // Using QR Server API for QR generation
    const encodedText = encodeURIComponent(text.trim());
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
    setQrUrl(url);
  }

  function downloadQr() {
    if (!qrUrl) return;
    
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `jcw-qr-code.png`;
    link.click();
  }

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Utilities"
      title="QR Code Generator"
      description="Generate QR codes for URLs, text, contact info, or any content. Perfect for business cards, marketing materials, and quick sharing."
    >
        <div className="grid gap-6 md:grid-cols-2 text-sm">
          {/* Controls */}
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Text or URL to encode
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-yellow-500 dark:focus:border-yellow-400 resize-none"
                placeholder="Enter URL, text, contact info, etc."
                rows={4}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                QR Code Size: {size}x{size}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="32"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>128px</span>
                <span>320px</span>
                <span>512px</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateQr}
                disabled={!text.trim()}
                className="flex-1 rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Generate QR Code
              </button>
              
              {qrUrl && (
                <button
                  onClick={downloadQr}
                  className="rounded-md bg-slate-200 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  Download
                </button>
              )}
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
            <div className="text-center">
              {qrUrl ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={qrUrl}
                      alt="Generated QR Code"
                      className="rounded-lg border border-slate-200 dark:border-slate-700"
                      style={{ width: Math.min(size, 320), height: Math.min(size, 320) }}
                    />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <p>QR Code ready for use!</p>
                    <p className="mt-1 break-all">Contains: {text.length > 50 ? text.substring(0, 50) + "..." : text}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <div className="mb-4 rounded-full bg-slate-100 dark:bg-slate-800 p-6">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm">Enter text and click "Generate QR Code"</p>
                  <p className="mt-1 text-xs">Your QR code will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Common QR Code Uses
          </h3>
          <div className="grid gap-4 md:grid-cols-3 text-xs">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700 dark:text-slate-300">Website URLs</h4>
              <p className="text-slate-600 dark:text-slate-400">
                Link to your website, online store, or landing pages for easy mobile access.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700 dark:text-slate-300">Contact Info</h4>
              <p className="text-slate-600 dark:text-slate-400">
                Share vCard format with name, phone, email, and address for business cards.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-slate-700 dark:text-slate-300">WiFi Access</h4>
              <p className="text-slate-600 dark:text-slate-400">
                Generate WiFi credentials in format: WIFI:T:WPA;S:NetworkName;P:Password;;
              </p>
            </div>
          </div>
        </div>
      </UtilityPageShell>
      <Footer />
    </>
  );
}