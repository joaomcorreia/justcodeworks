"use client";

import type { Locale } from "@/i18n";
import { getDictionary } from "@/i18n";
import { useEffect, useState } from "react";
import { MarketingPageShell, MarketingHero, MarketingSection } from "@/components/marketing-layout";
import { useEditMode } from "@/components/edit-mode-provider";
import { useAuth } from "@/contexts/auth-context";
import { useStorePageConfig, getStoreFieldValue } from "@/store/online-store-config";
import { StoreEditorPanel } from "@/components/store-editor-panel";
import MainNavigation from "@/components/MainNavigation";
import Footer from "@/components/Footer";

export default function OnlineShopsPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const { user } = useAuth();
  const { editMode } = useEditMode();
  const { config } = useStorePageConfig();
  const [t, setT] = useState<any>(null);

  useEffect(() => {
    getDictionary(locale).then(setT);
  }, [locale]);

  const heroEyebrow = getStoreFieldValue(config, "jcw-main-store-hero01", "eyebrow") ?? "Online shops";
  const heroTitle = getStoreFieldValue(config, "jcw-main-store-hero01", "title") ?? "Online Shops";
  const heroSubtitle = getStoreFieldValue(config, "jcw-main-store-hero01", "subtitle") ?? "Start selling online with a complete e-commerce solution. Manage products, accept payments, and fulfill orders — all integrated and ready to go.";

  const overviewTitle = getStoreFieldValue(config, "jcw-main-store-overview01", "title") ?? "Sell Products or Services Online";
  const overviewParagraph = getStoreFieldValue(config, "jcw-main-store-overview01", "paragraph") ?? "Our online shop solution gives you everything you need to start selling: product catalog, shopping cart, secure checkout, payment processing, and order management — all in one integrated system.";

  const includedTitle = getStoreFieldValue(config, "jcw-main-store-included01", "title") ?? "E-Commerce Features";

  const benefitsTitle = getStoreFieldValue(config, "jcw-main-store-benefits01", "title") ?? "Why Choose JCW for Your Online Shop?";
  const benefitsParagraph = getStoreFieldValue(config, "jcw-main-store-benefits01", "paragraph") ?? "Whether you're selling physical products, digital downloads, or services, our online shop platform adapts to your business model and grows with you.";

  return (
    <>
      <MainNavigation locale={locale} />
      <MarketingPageShell>
        {/* [AUTH] editor gated - only show for authenticated users */}
        {user && <StoreEditorPanel />}
      
      <section id="jcw-main-store-hero01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Hero
          </div>
        )}
        <MarketingHero
          id="jcw-main-store-hero01"
          eyebrow={heroEyebrow}
          title={heroTitle}
          subtitle={heroSubtitle}
        />
      </section>

      <section id="jcw-main-store-overview01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Overview
          </div>
        )}
        <MarketingSection id="jcw-main-store-overview01">
          <div className="text-sm">
            <div className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              E-Commerce Solution
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

      <section id="jcw-main-store-features01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Features
          </div>
        )}
        <MarketingSection id="jcw-main-store-features01" wide>
          <div className="text-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">{includedTitle}</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
                <li>Product management dashboard with categories and variants</li>
                <li>Shopping cart and checkout system</li>
                <li>EU payment integration (iDEAL, Bancontact, credit cards, etc.)</li>
                <li>Automatic tax and shipping calculations</li>
                <li>Inventory management and stock tracking</li>
                <li>Order management system with status updates</li>
                <li>Customer accounts and order history</li>
                <li>Automatic invoices and email receipts</li>
                <li>Multi-currency and multi-language support</li>
                <li>Product search and filtering</li>
                <li>Discount codes and promotional tools</li>
                <li>SEO-optimized product pages</li>
              </ul>
            </div>
          </div>
        </MarketingSection>
      </section>

      <section id="jcw-main-store-benefits01" className={editMode ? "relative border-2 border-dashed border-blue-500" : ""}>
        {editMode && (
          <div className="absolute left-2 top-2 z-10 rounded bg-blue-600 px-2 py-1 text-xs text-white">
            Editing: Benefits
          </div>
        )}
        <MarketingSection id="jcw-main-store-benefits01">
          <div className="text-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {benefitsTitle}
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
              <li>No transaction fees beyond standard payment processing</li>
              <li>Secure, PCI-compliant payment handling</li>
              <li>EU-based hosting with GDPR compliance</li>
              <li>Easy to add products and manage inventory</li>
              <li>Automatic backups and security updates</li>
              <li>Mobile-optimized shopping experience</li>
              <li>Analytics and sales reporting</li>
              <li>Integration options for accounting and CRM systems</li>
            </ul>
            <p className="mt-3 text-slate-700 dark:text-slate-300">
              {benefitsParagraph}
            </p>
          </div>
        </MarketingSection>
      </section>

      <MarketingSection id="jcw-main-store-setup01">
        <div className="text-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Simple Setup, Powerful Features
          </h2>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            We help you set up your shop with products, payment methods, and shipping
            options. You get a complete admin dashboard where you can manage everything —
            no technical knowledge required.
          </p>
          <p className="mt-2 text-slate-700 dark:text-slate-300">
            Start with a few products and expand as you grow. Add categories, product
            variants, promotional campaigns, and more — all through your easy-to-use
            dashboard.
          </p>
        </div>
      </MarketingSection>
      </MarketingPageShell>
      <Footer dict={t} />
    </>
  );
}
