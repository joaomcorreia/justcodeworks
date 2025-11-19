"use client";

import type { Locale } from "@/i18n";
import { getDictionary } from "@/i18n";
import { useEffect, useState } from "react";
import { MarketingPageShell, MarketingHero, MarketingSection } from "@/components/marketing-layout";
import { useEditMode } from "@/components/edit-mode-provider";
import { useAuth } from "@/contexts/auth-context";
import {
  useSeoPageConfig,
  getSeoFieldValue,
} from "@/store/seo-service-config";
import { SeoEditorPanel } from "@/components/seo-editor-panel";
import MainNavigation from "@/components/MainNavigation";
import Footer from "@/components/Footer";

export default function SeoServicePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const { user } = useAuth();
  const { editMode } = useEditMode();
  const { config } = useSeoPageConfig();
  const [t, setT] = useState<any>(null);

  useEffect(() => {
    getDictionary(locale).then(setT);
  }, [locale]);

  const heroTitle =
    getSeoFieldValue(config, "jcw-main-seo-hero01", "title") ??
    "Search engine optimization (SEO)";
  const heroSubtitle =
    getSeoFieldValue(config, "jcw-main-seo-hero01", "subtitle") ??
    "Simple, practical SEO work so your website can be found by the right people – not just 'anyone' on Google.";

  const overviewTitle =
    getSeoFieldValue(config, "jcw-main-seo-overview01", "title") ??
    "Focused on the keywords that actually matter";
  const overviewBody =
    getSeoFieldValue(config, "jcw-main-seo-overview01", "body") ??
    "We look at what your customers are already searching for and adjust your pages, structure and content around that.";

  const includedTitle =
    getSeoFieldValue(config, "jcw-main-seo-included01", "title") ??
    "What's included";
  const includedNote =
    getSeoFieldValue(config, "jcw-main-seo-included01", "note") ??
    "We keep SEO recommendations realistic for small businesses – no fake promises or 'instant ranking' tricks.";

  const benefitsTitle =
    getSeoFieldValue(config, "jcw-main-seo-benefits01", "title") ??
    "Why choose SEO with JCW?";
  const benefitsBody =
    getSeoFieldValue(config, "jcw-main-seo-benefits01", "body") ??
    "You don't have to become an SEO expert – we translate everything into clear actions and results.";

  return (
    <>
      <MainNavigation locale={locale} />
      <MarketingPageShell>
        {/* [AUTH] editor gated - only show for authenticated users */}
        {user && <SeoEditorPanel />}

      <section
        id="jcw-main-seo-hero01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="absolute left-2 top-2 z-10 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
            Editing: Hero
          </div>
        )}
        <MarketingHero
          id="jcw-main-seo-hero01"
          eyebrow="Services / SEO"
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      <section
        id="jcw-main-seo-overview01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
              Editing: Overview
            </div>
          </div>
        )}
        <MarketingSection id="jcw-main-seo-overview01">
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
        id="jcw-main-seo-included01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-6xl px-4 pt-8">
            <div className="mb-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
              Editing: What's included
            </div>
          </div>
        )}
        <MarketingSection id="jcw-main-seo-included01" wide>
          <div className="text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {includedTitle}
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
                <li>Keyword research and strategy</li>
                <li>On-page optimization (titles, meta descriptions, headers)</li>
                <li>Technical SEO audit and fixes</li>
                <li>Content optimization recommendations</li>
                <li>Google Search Console setup and monitoring</li>
                <li>Local SEO optimization (Google Business Profile)</li>
                <li>Monthly performance reports</li>
              </ul>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                {includedNote}
              </p>
            </div>
          </div>
        </MarketingSection>
      </section>

      <section
        id="jcw-main-seo-benefits01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
              Editing: Benefits
            </div>
          </div>
        )}
        <MarketingSection id="jcw-main-seo-benefits01">
          <div className="text-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {benefitsTitle}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
              <li>More qualified traffic from search engines</li>
              <li>Better visibility for your target keywords</li>
              <li>Improved website structure and user experience</li>
              <li>Long-term sustainable growth</li>
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
