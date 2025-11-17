// [TEMPLAB] Template Preview & Sections Explorer Page
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";

// [TEMPLAB] Type definitions
type AdminSiteTemplate = {
  id: string;
  key: string;
  name: string;
  description?: string;
  status?: string;
  category?: string;
  sections_count: number;
  usage_count: number;
  site_count: number;
  updated_at: string;
};

type SampleSiteMapping = {
  template_key: string;
  sample_site_slug: string;
};

type SiteSection = {
  id: string;
  identifier: string;
  internal_name?: string;
  order: number;
  section_type: string;
};

type SitePublicData = {
  name: string;
  slug: string;
  pages: Array<{
    id: string;
    title: string;
    slug: string;
    sections: SiteSection[];
  }>;
};

// [TEMPLAB] Helper to determine section type tag from identifier
function getSectionTypeTag(identifier: string): string {
  const id = identifier.toLowerCase();
  
  if (id.includes('hero') || id.includes('banner') || id.includes('header')) {
    return 'hero';
  }
  if (id.includes('form') || id.includes('contact') || id.includes('quote')) {
    return 'form';
  }
  if (id.includes('service') || id.includes('offering')) {
    return 'services';
  }
  if (id.includes('testimonial') || id.includes('review')) {
    return 'testimonials';
  }
  if (id.includes('contact') || id.includes('footer')) {
    return 'contact';
  }
  
  return 'generic';
}

// [TEMPLAB] Helper to generate section description
function getSectionDescription(identifier: string, internalName?: string): string {
  const typeTag = getSectionTypeTag(identifier);
  
  const descriptions: Record<string, string> = {
    hero: "Top hero section with call-to-action",
    form: "Interactive form for user input",
    services: "Services or offerings display",
    testimonials: "Customer reviews and testimonials",
    contact: "Contact information and details",
    generic: "Content section"
  };
  
  if (internalName) {
    return `${descriptions[typeTag]} - ${internalName}`;
  }
  
  return descriptions[typeTag];
}

// [TEMPLAB] Fetch template details
async function fetchTemplateByKey(key: string): Promise<AdminSiteTemplate | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;
  
  if (!sessionId) {
    return null;
  }

  const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

  try {
    const res = await fetch(`http://localhost:8000/api/admin/templates/key/${key}/`, {
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to load template details");
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching template ${key}:`, error);
    return null;
  }
}

// [TEMPLAB] Fetch sample site mapping
async function fetchSampleSiteMapping(templateKey: string): Promise<SampleSiteMapping | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  const csrfToken = cookieStore.get("csrftoken")?.value;
  
  if (!sessionId) {
    return null;
  }

  const cookieHeader = `sessionid=${sessionId}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;

  try {
    const res = await fetch(`http://localhost:8000/api/admin/templates/${templateKey}/sample-site/`, {
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching sample site mapping for ${templateKey}:`, error);
    return null;
  }
}

// [TEMPLAB] Fetch sample site data
async function fetchSampleSiteData(siteSlug: string): Promise<SitePublicData | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/sites/${siteSlug}/public/?locale=en`, {
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;
    
    return res.json();
  } catch (error) {
    console.error(`Error fetching site data for ${siteSlug}:`, error);
    return null;
  }
}

// [TEMPLAB] Template Preview Page Component
export default async function TemplatePreviewPage({ 
  params 
}: { 
  params: { locale: string; key: string } 
}) {
  const { locale, key: templateKey } = params;

  // Fetch template details
  const template = await fetchTemplateByKey(templateKey);
  
  if (!template) {
    notFound();
  }

  // Fetch sample site mapping
  const sampleMapping = await fetchSampleSiteMapping(templateKey);
  
  // Fetch sample site data if mapping exists
  let sampleSiteData: SitePublicData | null = null;
  let sampleSiteError: string | null = null;
  
  if (sampleMapping) {
    try {
      sampleSiteData = await fetchSampleSiteData(sampleMapping.sample_site_slug);
      if (!sampleSiteData) {
        sampleSiteError = `Could not load sections for sample site (slug: ${sampleMapping.sample_site_slug}). Please verify the site exists and has published content.`;
      }
    } catch (error) {
      sampleSiteError = `Could not load sections for sample site (slug: ${sampleMapping.sample_site_slug}). Please verify the site exists and has published content.`;
    }
  }

  // Get home page sections (first page)
  const homePageSections = sampleSiteData?.pages?.[0]?.sections || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <nav className="text-sm text-gray-500">
              <Link href={`/${locale}/admin`} className="hover:underline">Admin Panel</Link>
              {" / "}
              <Link href={`/${locale}/admin/templates`} className="hover:underline">Templates</Link>
              {" / "}
              <span className="text-gray-900">{template.name} Preview</span>
            </nav>
            <Link
              href={`/${locale}/admin/templates`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Templates
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Template Info & Screenshot */}
          <div className="space-y-6">
            {/* Template Metadata */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                {template.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {template.category}
                  </span>
                )}
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  template.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : template.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.status}
                </span>
              </div>

              {template.description && (
                <p className="text-gray-600 mb-4">{template.description}</p>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Sites using:</span>
                  <div className="font-semibold text-gray-900">{template.site_count || 0}</div>
                </div>
                <div>
                  <span className="text-gray-500">Sections:</span>
                  <div className="font-semibold text-gray-900">{template.sections_count || 0}</div>
                </div>
                <div>
                  <span className="text-gray-500">Usage:</span>
                  <div className="font-semibold text-gray-900">{template.usage_count || 0}</div>
                </div>
              </div>
            </div>

            {/* Template Screenshot */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Template Preview</h2>
              </div>
              
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={`/template-previews/${templateKey}-01.jpg`}
                  alt={`${template.name} preview`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Hide image on error and show placeholder
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextElementSibling;
                    if (placeholder) {
                      placeholder.classList.remove('hidden');
                    }
                  }}
                />
                
                {/* Placeholder for missing image */}
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center hidden">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-gray-500">Preview image coming soon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Site Link */}
            {sampleMapping && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h2>
                <Link
                  href={`/sites/${sampleMapping.sample_site_slug}`}
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M7 7h10v10M17 7l-10 10" />
                  </svg>
                  Open Sample Site in New Tab
                </Link>
                <p className="text-sm text-gray-500 mt-2">
                  View the full live site: {sampleMapping.sample_site_slug}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sections Explorer */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Sections Explorer</h2>
              <p className="text-sm text-gray-500 mt-1">
                Template structure and content sections
              </p>
            </div>

            <div className="p-6">
              {!sampleMapping ? (
                // No sample site mapping
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Sample Site Linked</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    No sample site is linked to this template yet. Once a demo site is created for this template, 
                    its sections will appear here.
                  </p>
                </div>
              ) : sampleSiteError ? (
                // Sample site mapping exists but data failed to load
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Sections</h3>
                  <p className="text-red-600 max-w-md mx-auto text-sm">
                    {sampleSiteError}
                  </p>
                </div>
              ) : (
                // Display sections list
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Showing sections from sample site: <span className="font-medium">{sampleMapping.sample_site_slug}</span>
                  </div>
                  
                  {homePageSections.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No sections found in the sample site.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {homePageSections
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => {
                          const typeTag = getSectionTypeTag(section.identifier);
                          const description = getSectionDescription(section.identifier, section.internal_name);
                          
                          return (
                            <div 
                              key={section.id}
                              className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full mr-4 flex-shrink-0">
                                {index + 1}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                      {section.identifier}
                                    </h3>
                                    {section.internal_name && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {section.internal_name}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                      {description}
                                    </p>
                                  </div>
                                  
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                                    typeTag === 'hero' ? 'bg-purple-100 text-purple-800' :
                                    typeTag === 'form' ? 'bg-green-100 text-green-800' :
                                    typeTag === 'services' ? 'bg-blue-100 text-blue-800' :
                                    typeTag === 'testimonials' ? 'bg-yellow-100 text-yellow-800' :
                                    typeTag === 'contact' ? 'bg-indigo-100 text-indigo-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {typeTag}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}