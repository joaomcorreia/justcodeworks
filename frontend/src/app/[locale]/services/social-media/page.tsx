"use client";

import type { Locale } from "@/i18n";
import { MarketingPageShell, MarketingHero, MarketingSection } from "@/components/marketing-layout";
import { useEditMode } from "@/components/edit-mode-provider";
import { useAuth } from "@/contexts/auth-context";
import {
  useSocialPageConfig,
  getSocialFieldValue,
} from "@/store/social-service-config";
import { SocialEditorPanel } from "@/components/social-editor-panel";

export default function SocialMediaServicePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { user } = useAuth();
  const { editMode } = useEditMode();
  const { config } = useSocialPageConfig();

  const heroTitle =
    getSocialFieldValue(config, "jcw-main-social-hero01", "title") ??
    "Social Media support";
  const heroSubtitle =
    getSocialFieldValue(config, "jcw-main-social-hero01", "subtitle") ??
    "Keep your website and social channels connected so people always land on the right place.";

  const overviewTitle =
    getSocialFieldValue(config, "jcw-main-social-overview01", "title") ??
    "From posts to landing pages";
  const overviewBody =
    getSocialFieldValue(config, "jcw-main-social-overview01", "body") ??
    "We prepare basic content ideas and simple landing pages so your social traffic doesn't get lost.";

  const includedTitle =
    getSocialFieldValue(config, "jcw-main-social-included01", "title") ??
    "What's included";
  const includedNote =
    getSocialFieldValue(config, "jcw-main-social-included01", "note") ??
    "We don't try to replace a full-time social agency – we focus on what connects to your website.";

  const benefitsTitle =
    getSocialFieldValue(config, "jcw-main-social-benefits01", "title") ??
    "Why add Social Media support?";
  const benefitsBody =
    getSocialFieldValue(config, "jcw-main-social-benefits01", "body") ??
    "Your website becomes the hub: posts, campaigns and ads always lead back to a page that can convert.";

  return (
    <MarketingPageShell>
      {/* [AUTH] editor gated - only show for authenticated users */}
      {user && <SocialEditorPanel />}

      <section
        id="jcw-main-social-hero01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="absolute left-2 top-2 z-10 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
            Editing: Hero
          </div>
        )}
        <MarketingHero
          id="jcw-main-social-hero01"
          eyebrow="Services / Social Media"
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      <section
        id="jcw-main-social-overview01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
              Editing: Overview
            </div>
          </div>
        )}
        <MarketingSection id="jcw-main-social-overview01">
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
        id="jcw-main-social-included01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-6xl px-4 pt-8">
            <div className="mb-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
              Editing: What's included
            </div>
          </div>
        )}
        <MarketingSection id="jcw-main-social-included01" wide>
          <div className="text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {includedTitle}
              </h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
                <li>Social media profile setup and optimization</li>
                <li>Content calendar planning</li>
                <li>Post creation and scheduling</li>
                <li>Landing page creation for campaigns</li>
                <li>Social media advertising setup</li>
                <li>Performance tracking and reporting</li>
              </ul>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                {includedNote}
              </p>
            </div>
          </div>
        </MarketingSection>
      </section>

      <section
        id="jcw-main-social-benefits01"
        className={editMode ? "ring-1 ring-emerald-400/60" : ""}
      >
        {editMode && (
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-3 inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300 ring-1 ring-emerald-400/60">
              Editing: Benefits
            </div>
          </div>
        )}
        <MarketingSection id="jcw-main-social-benefits01">
          <div className="text-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {benefitsTitle}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
              <li>Consistent brand presence across platforms</li>
              <li>Better engagement with your audience</li>
              <li>Integrated strategy between social and website</li>
              <li>Clear conversion paths from social traffic</li>
            </ul>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              {benefitsBody}
            </p>
          </div>
        </MarketingSection>
      </section>
    </MarketingPageShell>
  );
}
