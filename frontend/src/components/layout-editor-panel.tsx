"use client";

import { useState } from "react";
import { useEditMode } from "./edit-mode-provider";
import { useNavigationConfig } from "@/store/navigation-config";

type EditorSection = "main-nav" | "footer-columns" | "subfooter";

export function LayoutEditorPanel() {
  const { editMode } = useEditMode();
  const { config, updateConfig, resetConfig } = useNavigationConfig();
  const [section, setSection] = useState<EditorSection>("main-nav");
  const [selectedFooterColumnId, setSelectedFooterColumnId] =
    useState<string | null>(config.footerColumns[0]?.id ?? null);

  if (!editMode) return null;

  const selectedFooterColumn = config.footerColumns.find(
    (c) => c.id === selectedFooterColumnId,
  );

  return (
    <aside className="fixed right-3 bottom-3 z-40 w-80 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Layout editor
          </div>
          <div className="text-[10px] text-slate-500">
            Header &amp; footer text stored locally for now.
          </div>
        </div>
        <button
          type="button"
          onClick={resetConfig}
          className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-300 hover:border-slate-500"
        >
          Reset
        </button>
      </div>

      {/* Section tabs */}
      <div className="mb-2 flex gap-1">
        <button
          type="button"
          onClick={() => setSection("main-nav")}
          className={[
            "flex-1 rounded-full px-2 py-1 text-[10px]",
            section === "main-nav"
              ? "bg-yellow-400 text-slate-950"
              : "bg-slate-900 text-slate-300",
          ].join(" ")}
        >
          Main nav
        </button>
        <button
          type="button"
          onClick={() => setSection("footer-columns")}
          className={[
            "flex-1 rounded-full px-2 py-1 text-[10px]",
            section === "footer-columns"
              ? "bg-yellow-400 text-slate-950"
              : "bg-slate-900 text-slate-300",
          ].join(" ")}
        >
          Footer
        </button>
        <button
          type="button"
          onClick={() => setSection("subfooter")}
          className={[
            "flex-1 rounded-full px-2 py-1 text-[10px]",
            section === "subfooter"
              ? "bg-yellow-400 text-slate-950"
              : "bg-slate-900 text-slate-300",
          ].join(" ")}
        >
          Subfooter
        </button>
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-auto pr-1">
        {section === "main-nav" && (
          <div className="space-y-2">
            {config.mainNav.map((item, index) => (
              <div
                key={item.id}
                className="rounded-md border border-slate-800 bg-slate-950/60 p-2"
              >
                <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Item {index + 1}</span>
                  <span className="font-mono text-slate-500">{item.id}</span>
                </div>
                <label className="mb-1 block text-[10px] font-semibold text-slate-300">
                  Label
                </label>
                <input
                  value={item.label}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      mainNav: prev.mainNav.map((nav) =>
                        nav.id === item.id
                          ? { ...nav, label: e.target.value }
                          : nav,
                      ),
                    }))
                  }
                  className="mb-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-yellow-400"
                />
                <label className="mb-1 block text-[10px] font-semibold text-slate-300">
                  Href (path)
                </label>
                <input
                  value={item.href}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      mainNav: prev.mainNav.map((nav) =>
                        nav.id === item.id
                          ? { ...nav, href: e.target.value }
                          : nav,
                      ),
                    }))
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-yellow-400"
                />
              </div>
            ))}
          </div>
        )}

        {section === "footer-columns" && (
          <div className="space-y-2">
            <label className="mb-1 block text-[10px] font-semibold text-slate-300">
              Footer column
            </label>
            <select
              value={selectedFooterColumnId ?? ""}
              onChange={(e) => setSelectedFooterColumnId(e.target.value)}
              className="mb-2 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-yellow-400"
            >
              {config.footerColumns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>

            {selectedFooterColumn && (
              <div className="space-y-2">
                <div className="rounded-md border border-slate-800 bg-slate-950/60 p-2">
                  <label className="mb-1 block text-[10px] font-semibold text-slate-300">
                    Column title
                  </label>
                  <input
                    value={selectedFooterColumn.title}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        footerColumns: prev.footerColumns.map((col) =>
                          col.id === selectedFooterColumn.id
                            ? { ...col, title: e.target.value }
                            : col,
                        ),
                      }))
                    }
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-yellow-400"
                  />
                </div>

                {selectedFooterColumn.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-slate-800 bg-slate-950/60 p-2"
                  >
                    <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Link</span>
                      <span className="font-mono text-slate-500">
                        {item.id}
                      </span>
                    </div>
                    <label className="mb-1 block text-[10px] font-semibold text-slate-300">
                      Label
                    </label>
                    <input
                      value={item.label}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          footerColumns: prev.footerColumns.map((col) =>
                            col.id === selectedFooterColumn.id
                              ? {
                                  ...col,
                                  items: col.items.map((link) =>
                                    link.id === item.id
                                      ? { ...link, label: e.target.value }
                                      : link,
                                  ),
                                }
                              : col,
                          ),
                        }))
                      }
                      className="mb-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-yellow-400"
                    />
                    <label className="mb-1 block text-[10px] font-semibold text-slate-300">
                      Href
                    </label>
                    <input
                      value={item.href}
                      onChange={(e) =>
                        updateConfig((prev) => ({
                          ...prev,
                          footerColumns: prev.footerColumns.map((col) =>
                            col.id === selectedFooterColumn.id
                              ? {
                                  ...col,
                                  items: col.items.map((link) =>
                                    link.id === item.id
                                      ? { ...link, href: e.target.value }
                                      : link,
                                  ),
                                }
                              : col,
                          ),
                        }))
                      }
                      className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-yellow-400"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section === "subfooter" && (
          <div className="space-y-2">
            <label className="mb-1 block text-[10px] font-semibold text-slate-300">
              Copyright / subfooter text
            </label>
            <textarea
              rows={3}
              value={config.subfooter.text}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  subfooter: { text: e.target.value },
                }))
              }
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-yellow-400"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
