"use client";

import { useEffect, useState } from "react";
import type { ApiSiteProject, ApiPage } from "@/lib/api";
import { fetchProjects, fetchPagesForProject } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

type UseAdminProjectsState = {
  projects: ApiSiteProject[];
  loadingProjects: boolean;
  projectsError: string | null;

  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  pages: ApiPage[];
  loadingPages: boolean;
  pagesError: string | null;
};

export function useAdminProjects(): UseAdminProjectsState {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState<ApiSiteProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const [pages, setPages] = useState<ApiPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [pagesError, setPagesError] = useState<string | null>(null);

  // Load projects
  useEffect(() => {
    if (!accessToken) {
      setProjects([]);
      setLoadingProjects(false);
      setProjectsError("Not authenticated.");
      return;
    }

    let cancelled = false;

    async function loadProjects() {
      setLoadingProjects(true);
      setProjectsError(null);
      try {
        const data = await fetchProjects(accessToken);
        if (cancelled) return;
        setProjects(data);
        setLoadingProjects(false);
        if (data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error("Failed to load projects", err);
        setProjectsError(
          err?.message ?? "Could not load projects from backend.",
        );
        setLoadingProjects(false);
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  // Load pages when selected project changes
  useEffect(() => {
    let cancelled = false;

    async function loadPages() {
      if (!selectedProjectId || !accessToken) {
        setPages([]);
        return;
      }

      setLoadingPages(true);
      setPagesError(null);

      try {
        const data = await fetchPagesForProject(selectedProjectId, accessToken);
        if (cancelled) return;
        const sorted = data.slice().sort((a, b) => {
          if (a.order === b.order) return a.id - b.id;
          return a.order - b.order;
        });
        setPages(sorted);
        setLoadingPages(false);
      } catch (err: any) {
        if (cancelled) return;
        console.error("Failed to load pages", err);
        setPagesError(err?.message ?? "Could not load pages for project.");
        setLoadingPages(false);
      }
    }

    loadPages();

    return () => {
      cancelled = true;
    };
  }, [selectedProjectId, accessToken]);

  return {
    projects,
    loadingProjects,
    projectsError,
    selectedProjectId,
    setSelectedProjectId,
    pages,
    loadingPages,
    pagesError,
  };
}