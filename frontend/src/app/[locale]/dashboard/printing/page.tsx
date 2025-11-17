"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteProjectPublic, ThemeJson } from "@/lib/types/sitePublic";

type Props = {
  params: { locale: string };
};

// [PRINTING] Product categories for print materials
interface PrintProduct {
  id: string;
  title: string;
  description: string;
  status: "available" | "coming-soon" | "future";
  category: "bizay" | "printful" | "pos";
}

const PRINT_PRODUCTS: PrintProduct[] = [
  {
    id: "business-cards",
    title: "Business Cards",
    description: "Professional cards with your branding and contact details",
    status: "available",
    category: "bizay"
  },
  {
    id: "flyers-brochures", 
    title: "Flyers & Brochures",
    description: "Marketing materials for promotions and events",
    status: "coming-soon",
    category: "bizay"
  },
  {
    id: "posters-banners",
    title: "Posters & Banners", 
    description: "Large format displays for your business",
    status: "coming-soon",
    category: "bizay"
  },
  {
    id: "stickers-labels",
    title: "Stickers & Labels",
    description: "Custom labels and branded stickers",
    status: "coming-soon", 
    category: "bizay"
  },
  {
    id: "clothing-merch",
    title: "Clothing & Merch",
    description: "T-shirts, hoodies, mugs and promotional items",
    status: "future",
    category: "printful"
  },
  {
    id: "pos-materials",
    title: "POS Materials",
    description: "Table tents, receipts, and point-of-sale items",
    status: "future",
    category: "pos"
  }
];

// [PRINTING] Business card preview component
function BusinessCardPreview({ 
  siteName, 
  theme, 
  contactInfo 
}: { 
  siteName: string;
  theme?: ThemeJson;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}) {
  return (
    <div className="mt-3 flex flex-col sm:flex-row gap-3">
      {/* Front */}
      <div 
        className="flex-1 rounded-md shadow-inner aspect-[1.7] flex items-center justify-center text-xs relative overflow-hidden"
        style={{ backgroundColor: theme?.primary_color || "#111827" }}
      >
        <div className="text-center z-10">
          <div className="font-semibold text-white text-sm mb-1">{siteName}</div>
          <div 
            className="text-sm opacity-90"
            style={{ color: theme?.secondary_color || "#e5e7eb" }}
          >
            Your main service here
          </div>
        </div>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>

      {/* Back */}
      <div className="flex-1 rounded-md shadow-inner aspect-[1.7] border border-dashed border-gray-400 flex items-center justify-center text-[11px] bg-gray-50 dark:bg-gray-800">
        <div className="text-gray-700 dark:text-gray-200 space-y-1 text-left">
          <div className="font-medium">Contact Name</div>
          <div>{contactInfo?.phone || "Phone: +31 6 000 000 00"}</div>
          <div>{contactInfo?.email || "email@example.com"}</div>
          <div>{contactInfo?.address || "City, Country"}</div>
        </div>
      </div>
    </div>
  );
}

// [PRINTING] Product category card component
function ProductCategoryCard({ 
  product, 
  siteName, 
  theme, 
  contactInfo 
}: { 
  product: PrintProduct;
  siteName: string;
  theme?: ThemeJson;
  contactInfo?: any;
}) {
  const getStatusBadge = (status: PrintProduct['status']) => {
    switch (status) {
      case 'available':
        return <span className="text-[10px] px-2 py-1 rounded bg-emerald-600/80 text-white">Available</span>;
      case 'coming-soon':
        return <span className="text-[10px] px-2 py-1 rounded bg-amber-600/80 text-white">Coming Soon</span>;
      case 'future':
        return <span className="text-[10px] px-2 py-1 rounded bg-gray-600/80 text-white">Future</span>;
      default:
        return null;
    }
  };

  const getButtonText = (status: PrintProduct['status']) => {
    switch (status) {
      case 'available':
        return `Open ${product.title} Builder (coming next)`;
      case 'coming-soon':
        return 'Not available yet';
      case 'future':
        return 'Planned for later';
      default:
        return 'Coming soon';
    }
  };

  return (
    <div className="border rounded-lg bg-white dark:bg-gray-800 p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm">{product.title}</h3>
        {getStatusBadge(product.status)}
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300">
        {product.description}
        {product.status !== 'available' && (
          <span className="block mt-1 text-gray-500 italic">
            We'll use your website design to create matching materials here later.
          </span>
        )}
      </p>

      {/* Special preview for business cards */}
      {product.id === "business-cards" && product.status === "available" && (
        <BusinessCardPreview 
          siteName={siteName}
          theme={theme}
          contactInfo={contactInfo}
        />
      )}

      <button 
        className={`mt-3 w-full text-xs px-3 py-2 rounded transition-colors ${
          product.status === 'available'
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
        disabled={product.status !== 'available'}
      >
        {getButtonText(product.status)}
      </button>
    </div>
  );
}

// [PRINTING] Main printing dashboard page
export default function PrintingPage({ params }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [siteData, setSiteData] = useState<SiteProjectPublic | null>(null);
  const [siteLoading, setSiteLoading] = useState(true);
  const [siteError, setSiteError] = useState<string | null>(null);
  
  // For now, use Mary's Restaurant slug as example (same as website builder)
  const projectSlug = "marys-restaurant";
  
  // Fetch site data - reusing the same pattern as website builder
  const fetchSiteData = async () => {
    try {
      setSiteLoading(true);
      setSiteError(null);
      
      const response = await fetch(`http://localhost:8000/api/sites/${projectSlug}/public/`);
      if (!response.ok) {
        throw new Error(`Failed to load site: ${response.status}`);
      }
      
      const data = await response.json();
      setSiteData(data);
    } catch (err) {
      setSiteError(err instanceof Error ? err.message : "Failed to load site data");
    } finally {
      setSiteLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSiteData();
  }, [projectSlug]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.locale}/login`);
    }
  }, [user, isLoading, router, params.locale]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-sm text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (siteLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Loading business data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (siteError || !siteData || !siteData.theme) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
            <div className="text-red-600 dark:text-red-400">Error loading business data: {siteError || "Site data or theme not available"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Print Materials</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Cards, flyers, merch — all powered by your website data.
          </p>
        </div>

        {/* Top summary card */}
        <div className="mb-8 border rounded-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Print Studio</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Based on your website: <span className="font-medium">{siteData.name}</span>
              </p>
            </div>
            <Link
              href={`/sites/${siteData.slug}`}
              target="_blank"
              className="text-xs px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              View live site ↗
            </Link>
          </div>

          {/* Theme preview */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Theme preview:</span>
            <div className="flex gap-1">
              <div 
                className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                style={{ backgroundColor: siteData.theme?.primary_color || '#3b82f6' }}
                title={`Primary: ${siteData.theme?.primary_color || '#3b82f6'}`}
              ></div>
              <div 
                className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                style={{ backgroundColor: siteData.theme?.secondary_color || '#64748b' }}
                title={`Secondary: ${siteData.theme?.secondary_color || '#64748b'}`}
              ></div>
              <div 
                className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                style={{ backgroundColor: siteData.theme?.accent_color || '#10b981' }}
                title={`Accent: ${siteData.theme?.accent_color || '#10b981'}`}
              ></div>
            </div>
            <span className="text-xs">
              Template: <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">{siteData.site_template_key}</code>
            </span>
          </div>
        </div>

        {/* Product categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PRINT_PRODUCTS.map((product) => (
            <ProductCategoryCard
              key={product.id}
              product={product}
              siteName={siteData.name}
              theme={siteData.theme}
              contactInfo={{
                email: "contact@example.com", // TODO: Extract from site data when available
                phone: "+31 6 000 000 00",
                address: "City, Country"
              }}
            />
          ))}
        </div>

        {/* Info footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Print materials automatically use your website's branding and content. 
            <br />
            Business cards are ready now • Other products coming soon
          </p>
        </div>
      </div>
    </div>
  );
}