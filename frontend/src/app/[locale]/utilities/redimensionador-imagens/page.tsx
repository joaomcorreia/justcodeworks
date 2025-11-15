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

    if (keepAspect && typeof targetWidth === "number" && targetWidth > 0) {
      const aspectRatio = loaded.width / loaded.height;
      height = Math.round(targetWidth / aspectRatio);
      if (targetHeight !== height && typeof targetHeight !== "string") {
        setTargetHeight(height);
      }
    } else if (keepAspect && typeof targetHeight === "number" && targetHeight > 0) {
      const aspectRatio = loaded.width / loaded.height;
      width = Math.round(targetHeight * aspectRatio);
      if (targetWidth !== width && typeof targetWidth !== "string") {
        setTargetWidth(width);
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
    link.download = `jcw-redimensionada.${format === "png" ? "png" : "jpg"}`;
    link.click();
  }

  const hasImage = !!loaded;

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Ferramentas"
      title="Redimensionador de Imagens"
      description="Carregue uma imagem, redimensione-a para dimensões específicas e transfira-a. Tudo é processado localmente no seu browser."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] text-xs">
        {/* Controls */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-slate-700 dark:text-slate-100">
              Escolha uma imagem
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-900 dark:text-slate-100 file:mr-2 file:rounded file:border-0 file:bg-yellow-500 file:px-2 file:py-1 file:text-[10px] file:font-medium file:text-slate-900"
            />
          </div>

          {hasImage && (
            <>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Original: {loaded!.width} × {loaded!.height}px
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    Largura (px)
                  </label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => setTargetWidth(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-900 dark:text-slate-100"
                    min="1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    Altura (px)
                  </label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => setTargetHeight(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-900 dark:text-slate-100"
                    min="1"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={keepAspect}
                  onChange={(e) => setKeepAspect(e.target.checked)}
                  className="rounded border-slate-300 text-yellow-500 focus:ring-yellow-500 dark:border-slate-600"
                />
                Manter proporções
              </label>

              <div>
                <label className="mb-1 block text-[10px] font-medium text-slate-600 dark:text-slate-300">
                  Formato
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as "png" | "jpeg")}
                  className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-900 dark:text-slate-100"
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                </select>
              </div>

              <button
                onClick={handleDownload}
                className="w-full rounded bg-yellow-500 px-3 py-2 text-[11px] font-medium text-slate-900 hover:bg-yellow-400"
              >
                Transferir Imagem Redimensionada
              </button>
            </>
          )}
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
          <div className="text-center">
            {hasImage ? (
              <div className="space-y-2">
                <div className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                  Pré-visualização
                </div>
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-64 rounded border border-slate-200 dark:border-slate-700"
                />
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Nova dimensão: {canvasRef.current?.width || 0} × {canvasRef.current?.height || 0}px
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <div className="mb-3 rounded-full bg-slate-100 dark:bg-slate-800 p-4">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[11px]">Carregue uma imagem para começar</p>
                <p className="mt-1 text-[10px]">PNG, JPG, GIF suportados</p>
              </div>
            )}
          </div>
        </div>
      </div>
      </UtilityPageShell>
      <Footer />
    </>
  );
}