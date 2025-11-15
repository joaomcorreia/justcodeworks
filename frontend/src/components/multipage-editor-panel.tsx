"use client";

import { useEditMode } from "@/components/edit-mode-provider";
import { useMultiPagePageConfig } from "@/store/multipage-website-config";
import { type MultiPageSectionId } from "@/config/multipage-website-sections";
import { useState } from "react";

export function MultiPageEditorPanel() {
  const { editMode } = useEditMode();
  const { config, updateField, resetConfig } = useMultiPagePageConfig();
  const [selectedSection, setSelectedSection] =
    useState<MultiPageSectionId>("jcw-main-multipage-hero01");

  if (!editMode) return null;

  const section = config.sections.find((s) => s.id === selectedSection);
  if (!section) return null;

  return (
    <div className="fixed right-3 top-20 z-40 w-80 rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Multi page website editor
      </h2>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Section
        </label>
        <select
          value={selectedSection}
          onChange={(e) =>
            setSelectedSection(e.target.value as MultiPageSectionId)
          }
          className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          {config.sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.internalName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {section.fields.map((field) => (
          <div key={field.id}>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              {field.label}
            </label>
            <textarea
              value={field.value}
              onChange={(e) =>
                updateField(selectedSection, field.id, e.target.value)
              }
              rows={field.value.split("\n").length + 1}
              className="w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        ))}
      </div>

      <button
        onClick={resetConfig}
        className="mt-4 w-full rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Reset to defaults
      </button>
    </div>
  );
}
