"use client";

import { useState, useEffect } from "react";
import { fetchProjectById } from "@/lib/api";
import type { ApiSiteProject } from "@/lib/api";

// Global state for shared project data
let globalProjectData: {
  project: ApiSiteProject | null;
  loading: boolean;
  error: string | null;
  lastRefresh: number;
} = {
  project: null,
  loading: true,
  error: null,
  lastRefresh: Date.now(),
};

// Event emitter for project data changes
const projectDataListeners = new Set<() => void>();

const emitProjectDataChange = () => {
  projectDataListeners.forEach(listener => listener());
};

type ProjectStyleState = {
  loading: boolean;
  error: string | null;
  project: ApiSiteProject | null;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  canToggleTheme: boolean;
  refreshProject: () => void;
  lastRefresh: number;
};

export function useProjectStyle(): ProjectStyleState {
  const [, forceUpdate] = useState({});
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  // Force re-render when global project data changes
  useEffect(() => {
    const handleProjectChange = () => {
      forceUpdate({});
    };
    
    projectDataListeners.add(handleProjectChange);
    return () => {
      projectDataListeners.delete(handleProjectChange);
    };
  }, []);

  const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID;

  const loadProject = async (isInitial = false) => {
    console.log('useProjectStyle: DEFAULT_PROJECT_ID =', DEFAULT_PROJECT_ID);
    
    if (!DEFAULT_PROJECT_ID) {
      console.log('useProjectStyle: No DEFAULT_PROJECT_ID configured');
      globalProjectData.error = "No default project ID configured";
      globalProjectData.loading = false;
      emitProjectDataChange();
      return;
    }

    try {
      console.log('useProjectStyle: Loading project data for ID:', DEFAULT_PROJECT_ID);
      globalProjectData.loading = true;
      globalProjectData.error = null;
      emitProjectDataChange();

      const projectData = await fetchProjectById(DEFAULT_PROJECT_ID!);
      globalProjectData.project = projectData;
      globalProjectData.lastRefresh = Date.now();

      // Only set initial theme on first load, not on refresh
      if (isInitial) {
        const storageKey = `jcw_theme_${DEFAULT_PROJECT_ID}`;
        const savedTheme = localStorage.getItem(storageKey);
        
        let initialTheme: "light" | "dark";
        
        if (savedTheme === "light" || savedTheme === "dark") {
          initialTheme = savedTheme;
        } else if (projectData.default_theme === "light") {
          initialTheme = "light";
        } else {
          initialTheme = "dark";
        }

        setThemeState(initialTheme);
        
        // Apply theme to document
        if (initialTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }

    } catch (err) {
      console.error("Failed to load project style:", err);
      globalProjectData.error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      globalProjectData.loading = false;
      emitProjectDataChange();
    }
  };

  useEffect(() => {
    loadProject(true);
  }, [DEFAULT_PROJECT_ID]);

  const setTheme = (newTheme: "light" | "dark") => {
    console.log('setTheme called with:', newTheme, 'DEFAULT_PROJECT_ID:', DEFAULT_PROJECT_ID);
    
    if (!DEFAULT_PROJECT_ID) {
      console.log('setTheme: No DEFAULT_PROJECT_ID, returning early');
      return;
    }
    
    setThemeState(newTheme);
    
    // Save to localStorage
    const storageKey = `jcw_theme_${DEFAULT_PROJECT_ID}`;
    localStorage.setItem(storageKey, newTheme);
    console.log('setTheme: Saved to localStorage with key:', storageKey, 'value:', newTheme);
    
    // Apply to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      console.log('setTheme: Added dark class to document. Current classes:', document.documentElement.className);
    } else {
      document.documentElement.classList.remove("dark");
      console.log('setTheme: Removed dark class from document. Current classes:', document.documentElement.className);
    }
    
    // Check if the dark class is actually there
    console.log('setTheme: document.documentElement.classList contains dark?', document.documentElement.classList.contains('dark'));
  };

  const canToggleTheme = globalProjectData.project?.allow_theme_toggle ?? true;

  const refreshProject = () => {
    loadProject(false);
  };

  return {
    loading: globalProjectData.loading,
    error: globalProjectData.error,
    project: globalProjectData.project,
    theme,
    setTheme,
    canToggleTheme,
    refreshProject,
    lastRefresh: globalProjectData.lastRefresh,
  };
}