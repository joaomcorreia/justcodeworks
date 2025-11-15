"use client";

import type { Locale } from "@/i18n";
import { useEffect, useRef, useState } from "react";
import { UtilityPageShell } from "@/components/utility-page-shell";
import Footer from "@/components/Footer";
import MainNavigation from "@/components/MainNavigation";

type LoadedImage = {
  src: string;
  width: number;
  height: number;
};

export default function ImageCropperPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(100);
  const [cropHeight, setCropHeight] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setLoaded({
          src,
          width: img.width,
          height: img.height,
        });
        setCropX(0);
        setCropY(0);
        setCropWidth(Math.min(300, img.width));
        setCropHeight(Math.min(300, img.height));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = Math.max(0, Math.min(cropX, loaded.width - 1));
    const y = Math.max(0, Math.min(cropY, loaded.height - 1));
    const w = Math.max(
      1,
      Math.min(cropWidth, loaded.width - x),
    );
    const h = Math.max(
      1,
      Math.min(cropHeight, loaded.height - y),
    );

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
    };
    img.src = loaded.src;
  }, [loaded, cropX, cropY, cropWidth, cropHeight]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "jcw-crop.png";
    link.click();
  }

  const hasImage = !!loaded;

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Utilities"
      title="Image Cropper"
      description="Cut a specific area of an image and download the result. Simple, browser-based cropping."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] text-xs">
        {/* Controls */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-100">
              Pick an image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-[11px] text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-slate-50 hover:file:bg-slate-800 dark:text-slate-200"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Images stay in your browser – nothing is uploaded.
            </p>
          </div>

          {loaded && (
            <>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                Original size:{" "}
                <span className="font-mono">
                  {loaded.width} × {loaded.height}px
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-100">
                    X (start)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={loaded.width}
                    value={cropX}
                    onChange={(e) => setCropX(Number(e.target.value) || 0)}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[12px] text-slate-900 outline-none focus:border-yellow-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-100">
                    Y (start)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={loaded.height}
                    value={cropY}
                    onChange={(e) => setCropY(Number(e.target.value) || 0)}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[12px] text-slate-900 outline-none focus:border-yellow-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-100">
                    Width
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={loaded.width}
                    value={cropWidth}
                    onChange={(e) =>
                      setCropWidth(Number(e.target.value) || 1)
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[12px] text-slate-900 outline-none focus:border-yellow-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-100">
                    Height
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={loaded.height}
                    value={cropHeight}
                    onChange={(e) =>
                      setCropHeight(Number(e.target.value) || 1)
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[12px] text-slate-900 outline-none focus:border-yellow-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <p className="mt-2 text-[10px] text-slate-500">
                Tip: start with a smaller crop area (e.g. 300×300) and adjust
                from there.
              </p>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!hasImage}
                  className="rounded-full bg-yellow-400 px-4 py-1.5 text-[11px] font-semibold text-slate-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  Download cropped image
                </button>
              </div>
            </>
          )}
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-950/80">
          {!loaded ? (
            <p className="max-w-xs text-center text-[11px] text-slate-500">
              Upload an image and adjust the crop values to see the result.
            </p>
          ) : (
            <>
              <div className="w-full max-w-xs">
                <p className="mb-1 text-[11px] font-semibold text-slate-700 dark:text-slate-100">
                  Cropped preview
                </p>
                <canvas
                  ref={canvasRef}
                  className="max-h-[320px] w-full rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                />
              </div>
              <p className="max-w-xs text-center text-[11px] text-slate-500">
                The downloaded file will match what you see here.
              </p>
            </>
          )}
        </div>
      </div>
      </UtilityPageShell>
      <Footer />
    </>
  );
}
