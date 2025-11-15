"use client";

import type { Locale } from "@/i18n";
import { MarketingPageShell, MarketingHero, MarketingSection } from "@/components/marketing-layout";
import { useEditMode } from "@/components/edit-mode-provider";
import { useAuth } from "@/contexts/auth-context";
import { useCustomPageConfig, getCustomFieldValue } from "@/store/custom-website-config";
import { CustomEditorPanel } from "@/components/custom-editor-panel";

export default function CustomWebsitesPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { user } = useAuth();
  const { editMode } = useEditMode();
  const { config } = useCustomPageConfig();

  const heroEyebrow = getCustomFieldValue(config, "jcw-main-custom-hero01", "eyebrow") ?? "Custom websites";
  const heroTitle = getCustomFieldValue(config, "jcw-main-custom-hero01", "title") ?? "Custom Websites";
  const heroSubtitle = getCustomFieldValue(config, "jcw-main-custom-hero01", "subtitle") ?? "Need something unique? We build custom websites tailored to your exact requirements — from complex functionality to specialized design.";

  const overviewTitle = getCustomFieldValue(config, "jcw-main-custom-overview01", "title") ?? "Built Exactly How You Need It";
  const overviewParagraph = getCustomFieldValue(config, "jcw-main-custom-overview01", "paragraph") ?? "When off-the-shelf solutions don't fit, we create custom websites designed around your specific business processes, brand identity, and user experience goals.";

  const includedTitle = getCustomFieldValue(config, "jcw-main-custom-included01", "title") ?? "Custom Solutions We Build";

  const benefitsTitle = getCustomFieldValue(config, "jcw-main-custom-benefits01", "title") ?? "Why Choose Custom Development?";
  const benefitsParagraph = getCustomFieldValue(config, "jcw-main-custom-benefits01", "paragraph") ?? "Custom websites are an investment in your business's future. When you need something that can't be done with standard templates, we're ready to build it.";

  return (
    <MarketingPageShell>
      {/* [AUTH] editor gated - only show for authenticated users */}
      {user && <CustomEditorPanel />}
      
      <section id="jcw-main-custom-hero01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Hero
          </div>
        )}
        <MarketingHero
          id="jcw-main-custom-hero01"
          eyebrow={heroEyebrow}
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      <section id="jcw-main-custom-overview01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Overview
          </div>
        )}
        <MarketingSection id="jcw-main-custom-overview01">
          <div className="text-sm">
            <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              Tailored Solutions
            </div>
            <h2 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-50">
              {overviewTitle}
            </h2>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              {overviewParagraph}
            </p>
          </div>
        </MarketingSection>
      </section>

      <section id="jcw-main-custom-examples01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Examples
          </div>
        )}
        <MarketingSection id="jcw-main-custom-examples01" wide>
          <div className="text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{includedTitle}</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
                <li>Membership and subscription platforms</li>
                <li>Booking and appointment systems</li>
                <li>Custom e-learning and training portals</li>
                <li>Real estate listing platforms</li>
                <li>Job board and recruitment sites</li>
                <li>Event management systems</li>
                <li>Directory and marketplace websites</li>
                <li>Customer portals and dashboards</li>
                <li>Integration with existing business systems</li>
                <li>Custom data visualization and reporting tools</li>
                <li>Specialized industry solutions</li>
              </ul>
            </div>
          </div>
        </MarketingSection>
      </section>

      <MarketingSection id="jcw-main-custom-process01">
        <div className="text-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Our Custom Development Process</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/80">
              <h4 className="font-semibold text-slate-900 dark:text-slate-50">1. Discovery & Planning</h4>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                We start by understanding your business, users, and goals. We map out
                features, functionality, and user flows.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/80">
              <h4 className="font-semibold text-slate-900 dark:text-slate-50">2. Design & Prototyping</h4>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                We create wireframes and design mockups that reflect your brand and
                provide an intuitive user experience.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/80">
              <h4 className="font-semibold text-slate-900 dark:text-slate-50">3. Development & Testing</h4>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                We build your custom solution using modern, secure technologies. Rigorous
                testing ensures everything works perfectly.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/80">
              <h4 className="font-semibold text-slate-900 dark:text-slate-50">4. Launch & Support</h4>
              <p className="mt-1 text-slate-700 dark:text-slate-300">
                We deploy your website and provide training. Ongoing support and
                maintenance keep everything running smoothly.
              </p>
            </div>
          </div>
        </div>
      </MarketingSection>

      <section id="jcw-main-custom-benefits01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Benefits
          </div>
        )}
        <MarketingSection id="jcw-main-custom-benefits01">
          <div className="text-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {benefitsTitle}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
              <li>Perfect fit for your unique business processes</li>
              <li>Scalable architecture that grows with your needs</li>
              <li>Competitive advantage with features competitors don't have</li>
              <li>Better user experience tailored to your audience</li>
              <li>Full ownership and control of your platform</li>
              <li>Integration with your existing systems and tools</li>
              <li>Ongoing support and feature development</li>
            </ul>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              {benefitsParagraph}
            </p>
          </div>
        </MarketingSection>
      </section>
    </MarketingPageShell>
  );
}
