"use client";

import type { Locale } from "@/i18n";
import { getDictionary } from "@/i18n";
import { useEffect, useState } from "react";
import { MarketingPageShell, MarketingHero, MarketingSection } from "@/components/marketing-layout";
import { useEditMode } from "@/components/edit-mode-provider";
import { useAuth } from "@/contexts/auth-context";
import { useOnePageWebsitesConfig, getOnePageFieldValue } from "@/hooks/use-onepage-websites-config";
import { OnePageEditorPanel } from "@/components/onepage-editor-panel";
import MainNavigation from "@/components/MainNavigation";
import Footer from "@/components/Footer";

export default function OnePageWebsitesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const { user } = useAuth();
  const { editMode } = useEditMode();
  const { config, loading, error, source, saveField } = useOnePageWebsitesConfig();
  const [t, setT] = useState<any>(null);

  useEffect(() => {
    getDictionary(locale).then(setT);
  }, [locale]);

  const heroTitle =
    getOnePageFieldValue(config, "jcw-onepage-hero01", "title") ??
    t?.websiteTypes?.onePage?.hero?.title ?? "One Page Website";
  const heroSubtitle =
    getOnePageFieldValue(config, "jcw-onepage-hero01", "subtitle") ??
    t?.websiteTypes?.onePage?.hero?.subtitle ?? "The fastest way to go online. One clean, professional page that says who you are, what you do, and how to contact you.";

  const overviewTitle =
    getOnePageFieldValue(config, "jcw-onepage-overview01", "title") ??
    t?.websiteTypes?.onePage?.overview?.title ?? "Perfect for small businesses and freelancers";
  const overviewBody =
    getOnePageFieldValue(config, "jcw-onepage-overview01", "body") ??
    t?.websiteTypes?.onePage?.overview?.subtitle ?? "If you just need to appear online – fast, simple and reliable – the One Page Website is your best starting point.";

  const includedTitle =
    getOnePageFieldValue(config, "jcw-onepage-included01", "title") ??
    t?.websiteTypes?.onePage?.included?.title ?? "What's included";
  const includedNote =
    getOnePageFieldValue(config, "jcw-onepage-included01", "subtitle") ??
    t?.websiteTypes?.onePage?.included?.subtitle ?? "One page, all basics covered:";

  const benefitsTitle =
    getOnePageFieldValue(config, "jcw-onepage-benefits01", "title") ??
    t?.websiteTypes?.onePage?.benefits?.title ?? "Why choose a One Page Website?";
  const benefitsBody =
    getOnePageFieldValue(config, "jcw-onepage-benefits01", "subtitle") ??
    t?.websiteTypes?.onePage?.benefits?.subtitle ?? "Fast to set up, easy to maintain, mobile-friendly by default.";

  return (
    <>
      <MainNavigation locale={locale} />
      <MarketingPageShell>
        {/* [AUTH] editor gated - only show for authenticated users */}
        {user && <OnePageEditorPanel />}

      <section
        id="jcw-main-onepage-hero01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-5xl px-4 pb-2 pt-4">
            <div className="inline-flex rounded-full border border-emerald-400/60 bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300">
              Editing: One Page hero
            </div>
          </div>
        )}
        <MarketingHero
          eyebrow={t?.websiteTypes?.onePage?.hero?.eyebrow ?? "One page website"}
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      <section
        id="jcw-main-onepage-overview01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        <MarketingSection>
          <div className="text-sm">
            <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              {t?.websiteTypes?.onePage?.overview?.badge ?? "Simple & Effective"}
            </div>
            <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-50">
              {overviewTitle}
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              {overviewBody}
            </p>
          </div>
        </MarketingSection>
      </section>

      <section
        id="jcw-main-onepage-included01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        <MarketingSection wide>
        <div className="text-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{includedTitle}</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
              {(t?.websiteTypes?.onePage?.included?.items || [
                "One professional landing page with clean design",
                "Sections for your services, photos, contact details, and business info",
                "Google Maps integration for your business location", 
                "Contact form (customizable)",
                "Option to add up to 2 custom forms — for quotes, requests, or bookings*",
                "Mobile-friendly and SEO-ready",
                "Free domain and hosting for the first year",
                "SSL security, backups, and analytics included"
              ]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              {includedNote}
            </p>
          </div>
        </div>
        </MarketingSection>
      </section>

      <section
        id="jcw-main-onepage-benefits01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        <MarketingSection>
        <div className="text-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            {benefitsTitle}
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
            <li>Fastest way to go live — usually ready within 1 day</li>
            <li>Simple structure: visitors find everything in one scroll</li>
            <li>Ideal for small businesses, startups, and quick promotions</li>
            <li>Low maintenance and easy to upgrade later</li>
            <li>Looks great on mobile and desktop</li>
          </ul>
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            {benefitsBody}
          </p>
        </div>
        </MarketingSection>
      </section>

        {editMode && user && (
          <p className="fixed left-3 bottom-20 z-30 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] text-slate-300">
            One-page websites source:{" "}
            {source === "backend" ? "Django API" : "Local storage"}
            {error ? ` · ${error}` : ""}
          </p>
        )}
      </MarketingPageShell>
      <Footer dict={t} />
    </>
  );
}
