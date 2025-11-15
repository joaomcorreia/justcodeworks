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

export default function ImageResizerPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const [loaded, setLoaded] = useState<LoadedImage | null>(null);
  const [targetWidth, setTargetWidth] = useState<number | "">("");
  const [targetHeight, setTargetHeight] = useState<number | "">("");
  const [keepAspect, setKeepAspect] = useState(true);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
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
        setTargetWidth(img.width);
        setTargetHeight(img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = typeof targetWidth === "number" && targetWidth > 0
      ? targetWidth
      : loaded.width;
    let height = typeof targetHeight === "number" && targetHeight > 0
      ? targetHeight
      : loaded.height;

    if (keepAspect) {
      const ratio = loaded.width / loaded.height;
      if (typeof targetWidth === "number" && targetWidth > 0) {
        width = targetWidth;
        height = Math.round(width / ratio);
      } else if (typeof targetHeight === "number" && targetHeight > 0) {
        height = targetHeight;
        width = Math.round(height * ratio);
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      if (keepAspect) {
        setTargetWidth(width);
        setTargetHeight(height);
      }
    };
    img.src = loaded.src;
  }, [loaded, targetWidth, targetHeight, keepAspect]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;
    const mime = format === "png" ? "image/png" : "image/jpeg";
    const url = canvas.toDataURL(mime);

    const link = document.createElement("a");
    link.href = url;
    link.download = `jcw-resized.${format === "png" ? "png" : "jpg"}`;
    link.click();
  }

  const hasImage = !!loaded;

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Utilities"
      title="Image Resizer"
      description="Upload an image, resize it to specific dimensions and download it. Everything is processed locally in your browser."
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
              Images are not uploaded anywhere. They stay in your browser.
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
                    Width (px)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={targetWidth}
                    onChange={(e) =>
                      setTargetWidth(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[12px] text-slate-900 outline-none focus:border-yellow-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-100">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={targetHeight}
                    onChange={(e) =>
                      setTargetHeight(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-[12px] text-slate-900 outline-none focus:border-yellow-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <label className="mt-2 inline-flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={keepAspect}
                  onChange={(e) => setKeepAspect(e.target.checked)}
                />
                Keep aspect ratio
              </label>

              <div className="mt-3">
                <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-100">
                  Output format
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat("png")}
                    className={[
                      "rounded-full border px-3 py-1 text-[11px]",
                      format === "png"
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-600 dark:text-yellow-300"
                        : "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
                    ].join(" ")}
                  >
                    PNG
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormat("jpeg")}
                    className={[
                      "rounded-full border px-3 py-1 text-[11px]",
                      format === "jpeg"
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-600 dark:text-yellow-300"
                        : "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
                    ].join(" ")}
                  >
                    JPEG
                  </button>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!hasImage}
                  className="rounded-full bg-yellow-400 px-4 py-1.5 text-[11px] font-semibold text-slate-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-slate-600"
                >
                  Download resized image
                </button>
              </div>
            </>
          )}
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-xs dark:border-slate-800 dark:bg-slate-950/80">
          {!loaded ? (
            <p className="max-w-xs text-center text-[11px] text-slate-500">
              Upload an image to see a preview of the resized result.
            </p>
          ) : (
            <>
              <canvas
                ref={canvasRef}
                className="max-h-[320px] max-w-full rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
              />
              <p className="mt-2 text-[11px] text-slate-500">
                This preview shows the resized image. Download to save it.
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
