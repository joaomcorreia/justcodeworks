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
    link.download = "jcw-corte.png";
    link.click();
  }

  const hasImage = !!loaded;

  return (
    <>
    <MainNavigation locale={params.locale} />
    <UtilityPageShell
      label="Ferramentas"
      title="Editor de Imagens"
      description="Corte uma área específica de uma imagem e transfira o resultado. Edição simples baseada no browser."
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

              <div className="space-y-3">
                <div className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  Área de Corte
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-[10px] text-slate-600 dark:text-slate-300">
                      X (esquerda)
                    </label>
                    <input
                      type="number"
                      value={cropX}
                      onChange={(e) => setCropX(Number(e.target.value))}
                      className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-900 dark:text-slate-100"
                      min="0"
                      max={loaded!.width - 1}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-slate-600 dark:text-slate-300">
                      Y (topo)
                    </label>
                    <input
                      type="number"
                      value={cropY}
                      onChange={(e) => setCropY(Number(e.target.value))}
                      className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-900 dark:text-slate-100"
                      min="0"
                      max={loaded!.height - 1}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-[10px] text-slate-600 dark:text-slate-300">
                      Largura
                    </label>
                    <input
                      type="number"
                      value={cropWidth}
                      onChange={(e) => setCropWidth(Number(e.target.value))}
                      className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-900 dark:text-slate-100"
                      min="1"
                      max={loaded!.width - cropX}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] text-slate-600 dark:text-slate-300">
                      Altura
                    </label>
                    <input
                      type="number"
                      value={cropHeight}
                      onChange={(e) => setCropHeight(Number(e.target.value))}
                      className="w-full rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-[11px] text-slate-900 dark:text-slate-100"
                      min="1"
                      max={loaded!.height - cropY}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => {
                      const size = Math.min(loaded!.width, loaded!.height);
                      setCropX(0);
                      setCropY(0);
                      setCropWidth(size);
                      setCropHeight(size);
                    }}
                    className="rounded bg-slate-200 dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    Quadrado
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCropX(0);
                      setCropY(0);
                      setCropWidth(loaded!.width);
                      setCropHeight(Math.floor(loaded!.width * 9 / 16));
                    }}
                    className="rounded bg-slate-200 dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    16:9
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCropX(0);
                      setCropY(0);
                      setCropWidth(loaded!.width);
                      setCropHeight(Math.floor(loaded!.width * 4 / 5));
                    }}
                    className="rounded bg-slate-200 dark:bg-slate-800 px-2 py-1 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    4:5
                  </button>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="w-full rounded bg-yellow-500 px-3 py-2 text-[11px] font-medium text-slate-900 hover:bg-yellow-400"
              >
                Transferir Imagem Cortada
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
                  Pré-visualização do Corte
                </div>
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-64 rounded border border-slate-200 dark:border-slate-700"
                />
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Tamanho do corte: {canvasRef.current?.width || 0} × {canvasRef.current?.height || 0}px
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