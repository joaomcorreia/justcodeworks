// [TEMPLAB] Admin Template Library Page - Visual cards with hover preview
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminSiteTemplates } from "@/lib/api";
import type { AdminSiteTemplate } from "@/lib/api-types";

// [TEMPLAB] Auto-scrolling Preview Component
interface TemplatePreviewScrollerProps {
  imageUrl: string;
  isActive: boolean;
  onError?: () => void;
}

function TemplatePreviewScroller({ imageUrl, isActive, onError }: TemplatePreviewScrollerProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && imageHeight > 0) {
      const containerHeight = 288; // h-72 = 288px
      const maxScroll = Math.max(0, imageHeight - containerHeight);
      
      if (maxScroll <= 0) return;

      const startTime = Date.now();
      const duration = 6000; // 6 seconds for full scroll

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
        
        const newScrollPosition = easeProgress * maxScroll;
        setScrollPosition(newScrollPosition);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Reset scroll when not active
      setScrollPosition(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, imageHeight]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageHeight(imageRef.current.naturalHeight * (320 / imageRef.current.naturalWidth));
    }
  };

  const handleImageError = () => {
    console.warn(`Failed to load template preview image: ${imageUrl}`);
    onError?.();
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Template preview"
        className="w-full h-auto object-cover transition-transform duration-75 ease-linear"
        style={{
          transform: `translateY(-${scrollPosition}px)`,
          minHeight: '100%',
          width: '320px', // Fixed width for consistency
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
}

// [TEMPLAB] Template Card Component with Hover Preview
interface TemplateCardProps {
  template: AdminSiteTemplate;
  locale: string;
}

function TemplateCard({ template, locale }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  const handlePreview = () => {
    router.push(`/${locale}/admin/templates/${template.key}`);
  };

  // Get preview image URL using the established pattern - prioritize local screenshots
  const previewImageUrl = `/template-previews/${template.key}-01.jpg`;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview Container */}
      <div className="relative h-72 bg-gray-100 overflow-hidden">
        {!imageError ? (
          <div className="relative h-full">
            <TemplatePreviewScroller
              imageUrl={previewImageUrl}
              isActive={isHovered}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          // Fallback when image fails to load
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="text-4xl mb-2">🎨</div>
            <div className="text-sm font-medium">{template.name}</div>
            <div className="text-xs mt-1">{template.key}</div>
          </div>
        )}

        {/* Template Key Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/70 text-white backdrop-blur-sm">
            {template.key}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              template.status === "published"
                ? "bg-green-500/90 text-white"
                : template.status === "draft"
                ? "bg-yellow-500/90 text-white"
                : "bg-gray-500/90 text-white"
            }`}
          >
            {template.status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {template.name}
            </h3>
            {template.category && (
              <p className="text-sm text-blue-600 font-medium mt-1">
                {template.category}
              </p>
            )}
          </div>
        </div>

        {template.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {template.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {template.site_count || 0} sites
            </span>
            <span>
              {new Date(template.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 mt-4">
          <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            Edit Template
          </button>
          <button 
            onClick={handlePreview}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}

// [TEMPLAB] Admin Template Library Page
export default function AdminTemplatesPage({ params }: { params: { locale: string } }) {
  const [templates, setTemplates] = useState<AdminSiteTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const locale = params?.locale || 'en';

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminSiteTemplates();
      setTemplates(data);
    } catch (err) {
      console.error("Failed to load templates:", err);
      setError(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  // Filter templates by category
  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory || (!t.category && selectedCategory === "uncategorized"));

  // Get unique categories for filter
  const categories = ["all", ...Array.from(new Set(
    templates.map(t => t.category || "uncategorized")
  ))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="h-72 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Templates</h2>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={loadTemplates}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Library</h1>
        <p className="text-gray-600">
          Browse and manage website templates. Hover over cards to see full screenshot previews.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" 
                ? `All Templates (${templates.length})`
                : category === "uncategorized"
                ? "Uncategorized"
                : category
              }
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">
            {selectedCategory === "all" 
              ? "No templates are available yet."
              : `No templates found in the "${selectedCategory}" category.`
            }
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{templates.length}</div>
          <div className="text-sm text-gray-600">Total Templates</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {templates.filter(t => t.status === "published").length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-amber-600 mb-2">
            {templates.reduce((total, t) => total + (t.site_count || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Sites Using Templates</div>
        </div>
      </div>
    </div>
  );
}
