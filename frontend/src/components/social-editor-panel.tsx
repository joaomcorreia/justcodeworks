"use client";

import { useState } from "react";
import { useEditMode } from "./edit-mode-provider";
import { useSocialPageConfig } from "@/store/social-service-config";
import {
  defaultSocialPageConfig,
  type SocialSectionId,
} from "@/config/social-service-sections";

type SectionOption = {
  id: SocialSectionId;
  label: string;
};

const SECTION_OPTIONS: SectionOption[] = defaultSocialPageConfig.sections.map(
  (section) => ({
    id: section.id,
    label: section.internalName,
  }),
);

export function SocialEditorPanel() {
  const { editMode } = useEditMode();
  const { config, updateField, resetConfig } = useSocialPageConfig();
  const [selectedSectionId, setSelectedSectionId] = useState<SocialSectionId>(
    "jcw-main-social-hero01",
  );

  if (!editMode) return null;

  const selectedSection = config.sections.find(
    (s) => s.id === selectedSectionId,
  );

  return (
    <aside className="fixed right-3 top-20 z-40 w-72 rounded-2xl border border-slate-800 bg-slate-950/95 p-3 text-xs text-slate-100 shadow-xl backdrop-blur">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Social Media editor
          </div>
          <div className="text-[10px] text-slate-500">
            Stored locally for now.
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

      <div className="mb-3">
        <label className="mb-1 block text-[10px] font-semibold text-slate-300">
          Section
        </label>
        <select
          value={selectedSectionId}
          onChange={(e) =>
            setSelectedSectionId(e.target.value as SocialSectionId)
          }
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-yellow-400"
        >
          {SECTION_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {selectedSection ? (
        <div className="max-h-64 space-y-2 overflow-auto pr-1">
          {selectedSection.fields.map((field) => (
            <div key={field.id}>
              <label className="mb-1 block text-[10px] font-semibold text-slate-300">
                {field.label}
              </label>
              <textarea
                rows={field.value.length > 90 ? 3 : 2}
                value={field.value}
                onChange={(e) =>
                  updateField(selectedSection.id, field.id, e.target.value)
                }
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 outline-none focus:border-yellow-400"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-slate-500">
          Section not found in config.
        </div>
      )}
    </aside>
  );
}
