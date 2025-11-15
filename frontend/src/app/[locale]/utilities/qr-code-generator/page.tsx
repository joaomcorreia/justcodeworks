"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import { UtilitiesSidebarLayout } from "@/components/layouts/UtilitiesSidebarLayout";

export default function QrCodeGeneratorPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const [value, setValue] = useState("https://example.com");
  const [qrSize, setQrSize] = useState("256");
  const [errorCorrection, setErrorCorrection] = useState("M");

  return (
    <UtilitiesSidebarLayout
      locale={params.locale}
      title="QR Code Generator"
      description="Create QR codes for URLs, text, WiFi passwords, and more. Perfect for marketing materials, business cards, and sharing information quickly."
      currentPageId="qr-code-generator"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Generator Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              QR Code Settings
            </h2>
            
            {/* Text Input */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Text or URL
              </label>
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter URL, text, or other content..."
                rows={4}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Character limit: {value.length}/2000
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Size (pixels)
              </label>
              <select
                value={qrSize}
                onChange={(e) => setQrSize(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="128">128x128 (Small)</option>
                <option value="256">256x256 (Medium)</option>
                <option value="512">512x512 (Large)</option>
                <option value="1024">1024x1024 (Extra Large)</option>
              </select>
            </div>

            {/* Error Correction */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Error Correction Level
              </label>
              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="L">Low (7% recovery)</option>
                <option value="M">Medium (15% recovery)</option>
                <option value="Q">Quartile (25% recovery)</option>
                <option value="H">High (30% recovery)</option>
              </select>
            </div>

            <button
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all duration-200"
            >
              Generate QR Code
            </button>
          </div>

          {/* Quick Templates */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              📱 Quick Templates
            </h3>
            <div className="grid gap-2">
              <button
                onClick={() => setValue("https://example.com")}
                className="text-left p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="text-sm font-medium text-slate-900 dark:text-slate-50">Website URL</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">https://example.com</div>
              </button>
              <button
                onClick={() => setValue("mailto:hello@example.com?subject=Hello")}
                className="text-left p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="text-sm font-medium text-slate-900 dark:text-slate-50">Email</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">mailto:hello@example.com</div>
              </button>
              <button
                onClick={() => setValue("tel:+1234567890")}
                className="text-left p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="text-sm font-medium text-slate-900 dark:text-slate-50">Phone Number</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">tel:+1234567890</div>
              </button>
              <button
                onClick={() => setValue("WIFI:T:WPA;S:MyNetwork;P:MyPassword;;")}
                className="text-left p-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="text-sm font-medium text-slate-900 dark:text-slate-50">WiFi Network</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">WIFI:T:WPA;S:Network;P:Password</div>
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
              QR Code Preview
            </h2>
            
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/50">
              {/* Mock QR Code - in production this would be an actual QR code */}
              <div 
                className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-300 rounded-lg flex items-center justify-center"
                style={{ width: `${Math.min(parseInt(qrSize), 300)}px`, height: `${Math.min(parseInt(qrSize), 300)}px` }}
              >
                <div className="text-white dark:text-slate-800 text-xs font-mono text-center p-4">
                  QR CODE<br/>
                  {qrSize}x{qrSize}<br/>
                  Level: {errorCorrection}
                </div>
              </div>
              
              <p className="mt-4 text-xs text-center text-slate-600 dark:text-slate-400 break-all max-w-xs">
                {value.length > 50 ? `${value.substring(0, 50)}...` : value}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors">
                📥 Download PNG
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors">
                📄 Download SVG
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
              💡 This is a preview. The production version will generate real QR codes.
            </p>
          </div>

          {/* Usage Tips */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
              💡 Usage Tips
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Higher error correction allows QR codes to work even if partially damaged
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Use larger sizes (512px+) for print materials
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Keep URLs short for better scanning reliability
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Test your QR codes on multiple devices before printing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </UtilitiesSidebarLayout>
  );
}
