"use client";

import { useEditMode } from "./edit-mode-provider";
import { useAuth } from "@/contexts/auth-context";

export function EditModeToggle() {
  const { editMode, toggle } = useEditMode();
  const { user } = useAuth();

  // [JCW] toggle gated - only show to authenticated users
  if (!user) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className={[
        "rounded-full border px-3 py-1 text-[11px] font-medium",
        editMode
          ? "border-emerald-400 bg-emerald-400/10 text-emerald-300"
          : "border-slate-700 bg-slate-900/60 text-slate-200",
      ].join(" ")}
    >
      {editMode ? "Editing homepage" : "View mode"}
    </button>
  );
}
