"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

type EditModeContextType = {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  toggle: () => void;
};

const EditModeContext = createContext<EditModeContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "jcw_homepage_edit_mode";

export function EditModeProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [editMode, setEditModeState] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check URL parameters first
    const urlEdit = searchParams.get("edit") === "1" || searchParams.get("jcw_edit") === "1";
    if (urlEdit) {
      setEditModeState(true);
      return;
    }
    
    // Fall back to localStorage
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "1") setEditModeState(true);
  }, [searchParams]);

  function setEditMode(value: boolean) {
    setEditModeState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    }
  }

  function toggle() {
    setEditMode(!editMode);
  }

  return (
    <EditModeContext.Provider value={{ editMode, setEditMode, toggle }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode(): EditModeContextType {
  const ctx = useContext(EditModeContext);
  if (!ctx) {
    throw new Error("useEditMode must be used within EditModeProvider");
  }
  return ctx;
}
