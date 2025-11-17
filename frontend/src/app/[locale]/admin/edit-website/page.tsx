// [ADMIN] Edit Website - Live website editing interface
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import WebsiteEditor from "@/components/admin/WebsiteEditor";

// [TYPES] Site and project interfaces
interface SiteProject {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  is_active: boolean;
  site_template?: {
    key: string;
    name: string;
  };
  pages: SitePage[];
}

interface SitePage {
  id: string;
  title: string;
  slug: string;
  is_homepage: boolean;
  sections: SiteSection[];
}

interface SiteSection {
  id: string;
  name: string;
  section_type: string;
  order: number;
  is_active: boolean;
  fields: SectionField[];
}

interface SectionField {
  id: string;
  field_key: string;
  field_type: string;
  content: any;
}

// [API] Fetch user's sites
async function fetchUserSites(): Promise<SiteProject[]> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  
  if (!sessionId) {
    return [];
  }

  try {
    const response = await fetch(`http://localhost:8000/api/admin/user-sites/`, {
      headers: {
        "Cookie": `sessionid=${sessionId}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(`[API] User sites fetch failed: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] User sites fetch error:", error);
    return [];
  }
}

// [API] Fetch specific site data for editing
async function fetchSiteForEditing(slug: string): Promise<SiteProject | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid")?.value;
  
  if (!sessionId) {
    return null;
  }

  try {
    const response = await fetch(`http://localhost:8000/api/admin/sites/${slug}/public/`, {
      headers: {
        "Cookie": `sessionid=${sessionId}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(`[API] Site data fetch failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Site data fetch error:", error);
    return null;
  }
}

// [MAIN] Edit Website Page Component
export default async function EditWebsitePage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams?: { site?: string };
}) {
  const { locale } = params;
  const selectedSiteSlug = searchParams?.site;

  // Fetch user's sites
  const userSites = await fetchUserSites();
  
  // If a site is selected, fetch its full data
  let selectedSiteData: SiteProject | null = null;
  if (selectedSiteSlug) {
    selectedSiteData = await fetchSiteForEditing(selectedSiteSlug);
  }

  return (
    <div className="space-y-6">
      {/* [HEADER] Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Website</h1>
          <p className="text-sm text-gray-500">
            Select a website to edit and make changes in real-time
          </p>
        </div>
      </div>

      {/* [CONTENT] Main editing interface */}
      {!selectedSiteSlug ? (
        /* Site Selection */
        <SiteSelector userSites={userSites} locale={locale} />
      ) : selectedSiteData ? (
        /* Website Editor Interface */
        <WebsiteEditor siteData={selectedSiteData} locale={locale} />
      ) : (
        /* Error State */
        <div className="rounded-xl border bg-white p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Site Not Found
            </h3>
            <p className="text-gray-500 mb-4">
              The selected site could not be loaded.
            </p>
            <a
              href={`/${locale}/admin/edit-website`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              ← Back to Site Selection
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// [COMPONENT] Site Selection Component
function SiteSelector({ 
  userSites, 
  locale 
}: { 
  userSites: SiteProject[]; 
  locale: string; 
}) {
  if (userSites.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Websites Found
          </h3>
          <p className="text-gray-500 mb-4">
            You don't have any websites to edit yet.
          </p>
          <a
            href={`/${locale}/admin/dashboard`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Select a Website to Edit
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userSites.map((site) => (
          <a
            key={site.id}
            href={`/${locale}/admin/edit-website?site=${site.slug}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{site.name}</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                site.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {site.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-2">/{site.slug}</p>
            {site.site_template && (
              <p className="text-xs text-blue-600">
                Template: {site.site_template.name}
              </p>
            )}
            <div className="mt-3 text-sm text-gray-500">
              {site.pages?.length || 0} pages
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}