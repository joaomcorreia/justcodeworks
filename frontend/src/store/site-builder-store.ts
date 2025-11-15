"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TemplateDefinition } from "@/config/templates-catalog";
import { templatesCatalog } from "@/config/templates-catalog";

export type SitePrimaryGoal =
  | "get-leads"
  | "show-info"
  | "sell-online"
  | "take-bookings"
  | "other";

export type BuilderStep = "choose-template" | "configure" | "review";

type SiteBuilderState = {
  selectedTemplateId: string | null;
  currentStep: BuilderStep;

  siteName: string;
  businessType: string;
  primaryGoal: SitePrimaryGoal | null;
  mainLocale: string;
  additionalLocales: string[];
  primaryColor: string;
  notes: string;

  setSelectedTemplateId: (id: string | null) => void;
  setCurrentStep: (step: BuilderStep) => void;

  updateConfigField: <K extends keyof Omit<
    SiteBuilderState,
    "setSelectedTemplateId" | "setCurrentStep" | "updateConfigField" | "addAdditionalLocale" | "removeAdditionalLocale" | "getSelectedTemplate"
  >>(
    key: K,
    value: SiteBuilderState[K],
  ) => void;

  addAdditionalLocale: (locale: string) => void;
  removeAdditionalLocale: (locale: string) => void;

  getSelectedTemplate: () => TemplateDefinition | null;
};

export const useSiteBuilderStore = create<SiteBuilderState>()(
  persist(
    (set, get) => ({
      selectedTemplateId: null,
      currentStep: "choose-template",

      siteName: "",
      businessType: "",
      primaryGoal: null,
      mainLocale: "en",
      additionalLocales: [],
      primaryColor: "",
      notes: "",

      setSelectedTemplateId: (id) =>
        set(() => ({
          selectedTemplateId: id,
          currentStep: id ? "configure" : "choose-template",
        })),

      setCurrentStep: (step) => set(() => ({ currentStep: step })),

      updateConfigField: (key, value) =>
        set((state) => ({
          ...state,
          [key]: value,
        })),

      addAdditionalLocale: (locale) =>
        set((state) => {
          if (!locale.trim()) return state;
          if (state.additionalLocales.includes(locale)) return state;
          return {
            ...state,
            additionalLocales: [...state.additionalLocales, locale],
          };
        }),

      removeAdditionalLocale: (locale) =>
        set((state) => ({
          ...state,
          additionalLocales: state.additionalLocales.filter(
            (l) => l !== locale,
          ),
        })),

      getSelectedTemplate: () => {
        const id = get().selectedTemplateId;
        if (!id) return null;
        return templatesCatalog.find((t) => t.id === id) ?? null;
      },
    }),
    {
      name: "jcw_site_builder_store_v1",
    },
  ),
);
