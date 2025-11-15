"use client";

import type { Locale } from "@/i18n";
import { MarketingPageShell, MarketingHero, MarketingSection } from "@/components/marketing-layout";
import { useEditMode } from "@/components/edit-mode-provider";
import { useAuth } from "@/contexts/auth-context";
import { useMultiPageWebsitesConfig, getMultiPageFieldValue } from "@/hooks/use-multipage-websites-config";
import { MultiPageEditorPanel } from "@/components/multipage-editor-panel";

export default function MultiPageWebsitesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { user } = useAuth();
  const { editMode } = useEditMode();
  const { config, loading, error, source, saveField } = useMultiPageWebsitesConfig();

  const heroTitle = getMultiPageFieldValue(config, "jcw-multipage-hero01", "title") ?? "Multi page websites";
  const heroSubtitle = getMultiPageFieldValue(config, "jcw-multipage-hero01", "subtitle") ?? "For businesses that need more space: separate pages for services, team, portfolio, blog and more.";

  const overviewTitle = getMultiPageFieldValue(config, "jcw-multipage-overview01", "title") ?? "Structure your content the way you work";
  const overviewBody = getMultiPageFieldValue(config, "jcw-multipage-overview01", "body") ?? "Multi-page websites let you organize information clearly, improve SEO with more targeted content, and give visitors exactly what they're looking for.";

  const includedTitle = getMultiPageFieldValue(config, "jcw-multipage-included01", "title") ?? "Everything you need for a professional web presence";
  const includedSubtitle = getMultiPageFieldValue(config, "jcw-multipage-included01", "subtitle") ?? "Multiple pages, clear navigation, structured for growth:";

  const benefitsTitle = getMultiPageFieldValue(config, "jcw-multipage-benefits01", "title") ?? "Why choose a Multi-Page Website?";
  const benefitsSubtitle = getMultiPageFieldValue(config, "jcw-multipage-benefits01", "subtitle") ?? "Better organization, improved SEO, room to grow your content and services.";

  return (
    <MarketingPageShell>
      {/* [AUTH] editor gated - only show for authenticated users */}
      {user && <MultiPageEditorPanel />}
      
      <section id="jcw-main-multipage-hero01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Hero
          </div>
        )}
        <MarketingHero
          id="jcw-main-multipage-hero01"
          eyebrow="Websites"
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      <section id="jcw-main-multipage-overview01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Overview
          </div>
        )}
        <MarketingSection id="jcw-main-multipage-overview01">
          <div className="text-sm">
            <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              Complete Business Website
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

      <section id="jcw-main-multipage-included01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Included
          </div>
        )}
        <MarketingSection id="jcw-main-multipage-included01" wide>
          <div className="text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{includedTitle}</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
                <li>Multiple pages: Home, Services, About, Contact, and more</li>
                <li>Professional navigation menu and footer</li>
                <li>Dedicated service pages with detailed descriptions</li>
                <li>Portfolio or project showcase pages</li>
                <li>Blog or news section for updates and articles</li>
                <li>Team page with staff bios and photos</li>
                <li>Custom forms for quotes, bookings, or inquiries</li>
                <li>Google Maps integration and contact details</li>
                <li>Multi-language support (EN, NL, FR, ES, PT)</li>
                <li>SEO optimization for each page</li>
                <li>Free domain and hosting for the first year</li>
                <li>SSL security, daily backups, and analytics</li>
              </ul>
            </div>
          </div>
        </MarketingSection>
      </section>

      <section id="jcw-main-multipage-benefits01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Benefits
          </div>
        )}
        <MarketingSection id="jcw-main-multipage-benefits01">
          <div className="text-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {benefitsTitle}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
              <li>Better organization: each service or topic gets its own space</li>
              <li>Improved SEO: more pages = more opportunities to rank in search</li>
              <li>Professional impression: shows you're serious and established</li>
              <li>Room to grow: add new pages as your business expands</li>
              <li>Better user experience: visitors find what they need faster</li>
              <li>Content management: update individual pages without affecting others</li>
            </ul>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              {benefitsSubtitle}
            </p>
          </div>
        </MarketingSection>
      </section>

      <MarketingSection id="jcw-main-multipage-upgrade01">
        <div className="text-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Easy to Update and Expand
          </h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            With our admin panel, you can edit any page, add new pages, upload images, and
            manage your content without technical skills. Your website grows with your business.
          </p>
        </div>
      </MarketingSection>

      {editMode && user && (
        <p className="fixed left-3 bottom-32 z-30 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] text-slate-300">
          Multi-page websites source:{" "}
          {source === "backend" ? "Django API" : "Local storage"}
          {error ? ` · ${error}` : ""}
        </p>
      )}
    </MarketingPageShell>
  );
}
