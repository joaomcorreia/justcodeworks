"use client";

import { useAuth } from "@/contexts/auth-context";

export function authHeaders(accessToken: string | null | undefined) {
  if (!accessToken) return {};
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

// This hook returns auth headers for use in components
export function useAuthHeaders() {
  const { accessToken } = useAuth();
  return authHeaders(accessToken);
}