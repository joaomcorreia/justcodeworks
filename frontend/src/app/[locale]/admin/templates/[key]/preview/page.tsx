// [ADMIN] Template Preview with Edit Mode
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import TemplatePreviewEditor from "@/components/template-editor/TemplatePreviewEditor";

// Type definitions
type AdminSiteTemplateDetail = {
  id: string;
  key: string;
  name: string;
  description?: string;
  status?: string;
  is_active: boolean;
  type?: string;
  category?: string;
  sections_count: number;
  usage_count: number;
  site_count: number;
  updated_at: string;
  sections: AdminTemplateSection[];
};

type AdminTemplateSection = {
  id: string;
  name: string;
  type: string;
  internal_name: string;
  code: string;
  section_type?: string;
  min_plan?: string;
  group?: string;
  variant_index?: number;
  default_order: number;
  is_active: boolean;
  notes?: string;
};

// [API] Fetch template details
async function fetchTemplateDetail(key: string): Promise<AdminSiteTemplateDetail | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid");

  if (!sessionId) {
    console.log("[AUTH] No session cookie found");
    return null;
  }

  try {
    const response = await fetch(`http://localhost:8000/api/admin/site-templates/${key}/`, {
      headers: {
        "Cookie": `sessionid=${sessionId.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(`[API] Template detail fetch failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Template detail fetch error:", error);
    return null;
  }
}

// [API] Fetch template preview content
async function fetchTemplatePreviewContent(key: string) {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionid");

  if (!sessionId) {
    console.log("[AUTH] No session cookie found for preview");
    return null;
  }

  try {
    // Use the same preview URLs as the existing system
  const previewMapping: Record<string, string> = {
    "restaurant-modern": "marys-restaurant",
    "auto-garage-modern": "oficina-paulo-calibra",
    // jcw-main has no sample site - it's the platform template
  };    const siteslug = previewMapping[key];
    if (!siteslug) {
      console.log(`[PREVIEW] No preview site found for template: ${key}`);
      return null;
    }

    const response = await fetch(`http://localhost:8000/api/sites/${siteslug}/`, {
      headers: {
        "Cookie": `sessionid=${sessionId.value}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.log(`[API] Preview content fetch failed: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[API] Preview content fetch error:", error);
    return null;
  }
}

// [MAIN] Template Preview Editor Page
export default async function TemplatePreviewPage({ 
  params 
}: { 
  params: { locale: string; key: string } 
}) {
  const { key } = params;

  // Fetch template details and preview content
  const [template, previewContent] = await Promise.all([
    fetchTemplateDetail(key),
    fetchTemplatePreviewContent(key)
  ]);

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* [UI] Header with template info and controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Editing: {template.name}
              </h1>
              <p className="text-sm text-gray-500">
                Template Key: {template.key}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Edit Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Edit Mode</span>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                  type="checkbox" 
                  name="editMode" 
                  id="editMode" 
                  defaultChecked
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label 
                  htmlFor="editMode" 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-500 cursor-pointer"
                ></label>
              </div>
            </div>
            
            {/* Save/Cancel buttons */}
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* [EDITOR] Template Preview with Editing Capabilities */}
      <TemplatePreviewEditor 
        template={template}
        previewContent={previewContent}
        templateKey={key}
      />
    </div>
  );
}

// [CSS] Toggle switch styles
const toggleStyles = `
.toggle-checkbox:checked {
  right: 0;
  border-color: #3b82f6;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #3b82f6;
}
`;