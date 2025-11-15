"use client";

import { useEffect, useState } from "react";
import type {
  ApiBugReport,
  BugReportStatus,
} from "@/lib/api";
import { fetchBugReports, fetchBugReport, updateBugReportStatus } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

type UseAdminBugsState = {
  bugs: ApiBugReport[];
  loadingList: boolean;
  listError: string | null;

  selectedBugId: string | null;
  setSelectedBugId: (id: string | null) => void;

  selectedBug: ApiBugReport | null;
  loadingDetail: boolean;
  detailError: string | null;

  statusFilter: BugReportStatus | "all";
  setStatusFilter: (status: BugReportStatus | "all") => void;

  setStatus: (status: BugReportStatus) => Promise<void>;
};

export function useAdminBugs(): UseAdminBugsState {
  const { accessToken } = useAuth();
  const [bugs, setBugs] = useState<ApiBugReport[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [selectedBugId, setSelectedBugId] = useState<string | null>(null);
  const [selectedBug, setSelectedBug] = useState<ApiBugReport | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<BugReportStatus | "all">(
    "new",
  );

  // Load bug list
  useEffect(() => {
    if (!accessToken) {
      setBugs([]);
      setLoadingList(false);
      setListError("Not authenticated.");
      return;
    }

    let cancelled = false;

    async function load() {
      setLoadingList(true);
      setListError(null);
      try {
        const data = await fetchBugReports(
          {
            status: statusFilter === "all" ? undefined : statusFilter,
          },
          accessToken,
        );
        if (cancelled) return;
        const sorted = data
          .slice()
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          );
        setBugs(sorted);
        setLoadingList(false);
        if (!selectedBugId && sorted.length > 0) {
          setSelectedBugId(sorted[0].id);
        }
      } catch (err: any) {
        if (cancelled) return;
        console.error("Failed to load bugs", err);
        setListError(err?.message ?? "Could not load bug reports.");
        setLoadingList(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [statusFilter, accessToken]);

  // Load detail when selectedBugId changes
  useEffect(() => {
    let cancelled = false;

    async function loadDetail() {
      if (!selectedBugId || !accessToken) {
        setSelectedBug(null);
        return;
      }

      setLoadingDetail(true);
      setDetailError(null);
      try {
        const bug = await fetchBugReport(selectedBugId, accessToken);
        if (cancelled) return;
        setSelectedBug(bug);
        setLoadingDetail(false);
      } catch (err: any) {
        if (cancelled) return;
        console.error("Failed to load bug detail", err);
        setDetailError(err?.message ?? "Could not load bug report.");
        setLoadingDetail(false);
      }
    }

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedBugId, accessToken]);

  async function setStatus(status: BugReportStatus) {
    if (!selectedBugId || !selectedBug || !accessToken) return;
    try {
      const updated = await updateBugReportStatus(selectedBugId, status, accessToken);
      setSelectedBug(updated);
      setBugs((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b)),
      );
    } catch (err: any) {
      console.error("Failed to update bug status", err);
      setDetailError(
        err?.message ?? "Could not update bug status. Try again.",
      );
    }
  }

  return {
    bugs,
    loadingList,
    listError,
    selectedBugId,
    setSelectedBugId,
    selectedBug,
    loadingDetail,
    detailError,
    statusFilter,
    setStatusFilter,
    setStatus,
  };
}