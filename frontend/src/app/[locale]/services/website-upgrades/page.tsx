"use client";

import type { Locale } from "@/i18n";
import { getDictionary } from "@/i18n";
import { useEffect, useState } from "react";
import { MarketingPageShell, MarketingHero, MarketingSection } from "@/components/marketing-layout";
import { useEditMode } from "@/components/edit-mode-provider";
import { useAuth } from "@/contexts/auth-context";
import {
  useUpgradesPageConfig,
  getUpgradesFieldValue,
} from "@/store/upgrades-service-config";
import { UpgradesEditorPanel } from "@/components/upgrades-editor-panel";
import MainNavigation from "@/components/MainNavigation";
import Footer from "@/components/Footer";

export default function WebsiteUpgradesServicePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const { user } = useAuth();
  const { editMode } = useEditMode();
  const { config } = useUpgradesPageConfig();
  const [t, setT] = useState<any>(null);

  useEffect(() => {
    getDictionary(locale).then(setT);
  }, [locale]);

  const heroTitle =
    getUpgradesFieldValue(config, "jcw-main-upgrades-hero01", "title") ??
    "Website upgrades & improvements";
  const heroSubtitle =
    getUpgradesFieldValue(config, "jcw-main-upgrades-hero01", "subtitle") ??
    "If you already have a site, we can improve it step by step instead of rebuilding everything from zero.";

  const overviewTitle =
    getUpgradesFieldValue(config, "jcw-main-upgrades-overview01", "title") ??
    "Small, focused changes that add up";
  const overviewBody =
    getUpgradesFieldValue(config, "jcw-main-upgrades-overview01", "body") ??
    "We analyse what's slowing your site down or confusing visitors and suggest clear improvements.";

  const includedTitle =
    getUpgradesFieldValue(config, "jcw-main-upgrades-included01", "title") ??
    "What's included";
  const includedNote =
    getUpgradesFieldValue(config, "jcw-main-upgrades-included01", "note") ??
    "You decide which changes to start with – we can plan upgrades over several months if needed.";

  const benefitsTitle =
    getUpgradesFieldValue(config, "jcw-main-upgrades-benefits01", "title") ??
    "Why focus on upgrades?";
  const benefitsBody =
    getUpgradesFieldValue(config, "jcw-main-upgrades-benefits01", "body") ??
    "Perfect when you want better results without replacing a site that already works for you.";

  return (
    <>
      <MainNavigation locale={locale} />
      <MarketingPageShell>
        {/* [AUTH] editor gated - only show for authenticated users */}
        {user && <UpgradesEditorPanel />}

      <section
        id="jcw-main-upgrades-hero01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="absolute left-2 top-2 z-10 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
            Editing: Hero
          </div>
        )}
        <MarketingHero
          id="jcw-main-upgrades-hero01"
          eyebrow="Services / Upgrades"
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      <section
        id="jcw-main-upgrades-overview01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
              Editing: Overview
            </div>
          </div>
        )}
        <MarketingSection id="jcw-main-upgrades-overview01">
          <div className="text-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              {overviewTitle}
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              {overviewBody}
            </p>
          </div>
        </MarketingSection>
      </section>

      <section
        id="jcw-main-upgrades-included01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-6xl px-4 pt-8">
            <div className="mb-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
              Editing: What's included
            </div>
          </div>
        )}
        <MarketingSection id="jcw-main-upgrades-included01" wide>
          <div className="text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {includedTitle}
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
                <li>Performance optimization and speed improvements</li>
                <li>Mobile responsiveness fixes</li>
                <li>Security updates and vulnerability patches</li>
                <li>Content updates and additions</li>
                <li>New features and functionality</li>
                <li>Design refreshes and modernization</li>
                <li>Integration with third-party services</li>
              </ul>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                {includedNote}
              </p>
            </div>
          </div>
        </MarketingSection>
      </section>

      <section
        id="jcw-main-upgrades-benefits01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
              Editing: Benefits
            </div>
          </div>
        )}
        <MarketingSection id="jcw-main-upgrades-benefits01">
          <div className="text-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {benefitsTitle}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
              <li>Keep your existing investment while adding value</li>
              <li>Incremental improvements spread over time</li>
              <li>Better performance without disruption</li>
              <li>Stay competitive and modern</li>
            </ul>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              {benefitsBody}
            </p>
          </div>
        </MarketingSection>
      </section>
      </MarketingPageShell>
      <Footer dict={t} />
    </>
  );
}
