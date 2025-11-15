"use client";

// [CONTENT]
import { useState } from "react";
import type { SiteProjectPublic, PageJson, SectionJson, FieldJson } from "@/lib/types/sitePublic";
import { updateSectionContent } from "@/lib/api/sections";

interface RestaurantModernContentEditorProps {
  project: SiteProjectPublic;
  pageSlug: string;
  onUpdated?: () => void;
}

export function RestaurantModernContentEditor({
  project,
  pageSlug,
  onUpdated
}: RestaurantModernContentEditorProps) {
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentPage = project.pages.find(p => p.slug === pageSlug);
  
  if (!currentPage) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="text-center text-gray-500">
          Page "{pageSlug}" not found
        </div>
      </div>
    );
  }

  const handleSectionSave = async (section: SectionJson, formData: Record<string, string>) => {
    try {
      setSaving(section.identifier);
      setError(null);

      const fields = Object.entries(formData).map(([key, value]) => ({
        key,
        value: value || ""
      }));

      await updateSectionContent(section.id, { fields });
      
      if (onUpdated) {
        onUpdated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save content");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h3 className="text-xl font-semibold text-gray-900">Content Editor</h3>
        <p className="text-sm text-gray-600">
          Edit content for {currentPage.title} page
        </p>
      </header>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {pageSlug === "home" && (
          <>
            <HeroBannerEditor 
              page={currentPage}
              onSave={handleSectionSave}
              saving={saving === "hero-banner"}
            />
            <AboutUsEditor 
              page={currentPage}
              onSave={handleSectionSave}
              saving={saving === "about-us"}
            />
          </>
        )}

        {pageSlug === "menu" && (
          <>
            <MenuSectionEditor 
              page={currentPage}
              sectionId="appetizers"
              title="Appetizers"
              onSave={handleSectionSave}
              saving={saving === "appetizers"}
            />
            <MenuSectionEditor 
              page={currentPage}
              sectionId="main-courses"
              title="Main Courses"
              onSave={handleSectionSave}
              saving={saving === "main-courses"}
            />
          </>
        )}

        {pageSlug === "contact" && (
          <ContactInfoEditor 
            page={currentPage}
            onSave={handleSectionSave}
            saving={saving === "contact-info"}
          />
        )}
      </div>
    </div>
  );
}

// Helper function to get field value
function getFieldValue(section: SectionJson | undefined, key: string): string {
  if (!section) return "";
  const field = section.fields.find(f => f.key === key);
  return field?.value || "";
}

// Hero Banner Editor
function HeroBannerEditor({ 
  page, 
  onSave, 
  saving 
}: { 
  page: PageJson;
  onSave: (section: SectionJson, data: Record<string, string>) => void;
  saving: boolean;
}) {
  const section = page.sections.find(s => s.identifier === "hero-banner");
  
  const [formData, setFormData] = useState({
    headline: getFieldValue(section, "headline"),
    subheadline: getFieldValue(section, "subheadline"),
    cta_text: getFieldValue(section, "cta_text"),
    cta_link: getFieldValue(section, "cta_link"),
    background_image: getFieldValue(section, "background_image")
  });

  if (!section) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(section, formData);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Hero Banner</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Headline
          </label>
          <input
            type="text"
            value={formData.headline}
            onChange={(e) => setFormData({...formData, headline: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Main headline text"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subheadline
          </label>
          <textarea
            value={formData.subheadline}
            onChange={(e) => setFormData({...formData, subheadline: e.target.value})}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Supporting text"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CTA Text
            </label>
            <input
              type="text"
              value={formData.cta_text}
              onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Button text"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CTA Link
            </label>
            <input
              type="text"
              value={formData.cta_link}
              onChange={(e) => setFormData({...formData, cta_link: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/menu or https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Image URL
          </label>
          <input
            type="text"
            value={formData.background_image}
            onChange={(e) => setFormData({...formData, background_image: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="/images/hero-bg.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Hero Content"}
        </button>
      </form>
    </div>
  );
}

// About Us Editor
function AboutUsEditor({ 
  page, 
  onSave, 
  saving 
}: { 
  page: PageJson;
  onSave: (section: SectionJson, data: Record<string, string>) => void;
  saving: boolean;
}) {
  const section = page.sections.find(s => s.identifier === "about-us");
  
  const [formData, setFormData] = useState({
    title: getFieldValue(section, "title"),
    content: getFieldValue(section, "content"),
    image: getFieldValue(section, "image")
  });

  if (!section) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(section, formData);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">About Us</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Our Story"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell your restaurant's story..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="/images/about-us.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save About Content"}
        </button>
      </form>
    </div>
  );
}

// Menu Section Editor
function MenuSectionEditor({ 
  page, 
  sectionId, 
  title, 
  onSave, 
  saving 
}: { 
  page: PageJson;
  sectionId: string;
  title: string;
  onSave: (section: SectionJson, data: Record<string, string>) => void;
  saving: boolean;
}) {
  const section = page.sections.find(s => s.identifier === sectionId);
  
  const [formData, setFormData] = useState({
    item_1_name: getFieldValue(section, "item_1_name"),
    item_1_description: getFieldValue(section, "item_1_description"),
    item_1_price: getFieldValue(section, "item_1_price"),
    item_2_name: getFieldValue(section, "item_2_name"),
    item_2_description: getFieldValue(section, "item_2_description"),
    item_2_price: getFieldValue(section, "item_2_price")
  });

  if (!section) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(section, formData);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {[1, 2].map(num => (
          <div key={num} className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Item {num}</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData[`item_${num}_name` as keyof typeof formData]}
                  onChange={(e) => setFormData({
                    ...formData, 
                    [`item_${num}_name`]: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Dish name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData[`item_${num}_description` as keyof typeof formData]}
                  onChange={(e) => setFormData({
                    ...formData, 
                    [`item_${num}_description`]: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  value={formData[`item_${num}_price` as keyof typeof formData]}
                  onChange={(e) => setFormData({
                    ...formData, 
                    [`item_${num}_price`]: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$12.99"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : `Save ${title} Content`}
        </button>
      </form>
    </div>
  );
}

// Contact Info Editor
function ContactInfoEditor({ 
  page, 
  onSave, 
  saving 
}: { 
  page: PageJson;
  onSave: (section: SectionJson, data: Record<string, string>) => void;
  saving: boolean;
}) {
  const section = page.sections.find(s => s.identifier === "contact-info");
  
  const [formData, setFormData] = useState({
    address: getFieldValue(section, "address"),
    phone: getFieldValue(section, "phone"),
    email: getFieldValue(section, "email"),
    hours_mon_fri: getFieldValue(section, "hours_mon_fri"),
    hours_weekend: getFieldValue(section, "hours_weekend"),
    closed: getFieldValue(section, "closed")
  });

  if (!section) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(section, formData);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="123 Main St, City, State 12345"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="info@restaurant.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours (Mon-Fri)
            </label>
            <input
              type="text"
              value={formData.hours_mon_fri}
              onChange={(e) => setFormData({...formData, hours_mon_fri: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="11:00 AM - 10:00 PM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hours (Weekend)
            </label>
            <input
              type="text"
              value={formData.hours_weekend}
              onChange={(e) => setFormData({...formData, hours_weekend: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12:00 PM - 11:00 PM"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Closed Days
          </label>
          <input
            type="text"
            value={formData.closed}
            onChange={(e) => setFormData({...formData, closed: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Mondays"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Contact Info"}
        </button>
      </form>
    </div>
  );
}