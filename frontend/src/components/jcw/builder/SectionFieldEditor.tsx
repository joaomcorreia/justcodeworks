// [JCW] Builder v2 - Section Field Editor
// Editable form for section fields with save to backend

import { useState, useEffect, useRef } from 'react';
import type { SectionJson } from '@/lib/types/sitePublic';
import { updateSectionContent } from '@/lib/api/sections';
import { useAuth } from '@/contexts/auth-context';

type Props = {
  section: SectionJson | null;
  onSave?: () => void; // Callback after successful save for preview refresh
  onFieldChange?: (sectionId: string, fieldKey: string, value: string) => void; // Real-time field change callback
};

export function SectionFieldEditor({ section, onSave, onFieldChange }: Props) {
  const { user } = useAuth();
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  // [AI] Smart suggestion state
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  // Real-time update debouncing
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize field values when section changes
  useEffect(() => {
    if (section && section.fields) {
      const initialValues: Record<string, string> = {};
      section.fields.forEach((field) => {
        initialValues[field.key] = field.value || "";
      });
      setFieldValues(initialValues);
    } else {
      setFieldValues({});
    }
    
    // Clear messages when section changes
    setSaveError(null);
    setSaveSuccess(false);
    setSuggestError(null);
  }, [section]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
    setSaveError(null);
    setSaveSuccess(false);
    setSuggestError(null);
    
    // Real-time preview update with debouncing
    if (onFieldChange && section) {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Set new timer for debounced update
      debounceTimerRef.current = setTimeout(() => {
        onFieldChange(section.id.toString(), key, value);
      }, 300); // 300ms debounce
    }
  };

  const handleSave = async () => {
    if (!section || !user) {
      setSaveError("Authentication required");
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Build payload using existing API format
      const payload = {
        fields: section.fields?.map((field) => ({
          key: field.key,
          value: fieldValues[field.key] || "",
        })) || [],
      };

      await updateSectionContent(section.id, payload);
      
      setSaveSuccess(true);
      onSave?.(); // Trigger preview refresh
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (section && section.fields) {
      const originalValues: Record<string, string> = {};
      section.fields.forEach((field) => {
        originalValues[field.key] = field.value || "";
      });
      setFieldValues(originalValues);
    }
    setSaveError(null);
    setSaveSuccess(false);
  };

  // [AI] Smart suggestion handler
  const handleSmartSuggest = async () => {
    if (!section) return;
    setSuggesting(true);
    setSuggestError(null);

    try {
      const API_BASE = "http://localhost:8000/api";
      
      // Get a fresh CSRF token
      await fetch(`${API_BASE}/csrf/`, {
        credentials: "include",
      });

      // Get CSRF token from cookies
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const res = await fetch(`${API_BASE}/builder/sections/${section.id}/ai-suggest/`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          locale: "en", // TODO: Get from context if needed
          tone: "friendly and professional",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to get suggestion");
      }

      const data = await res.json();
      const suggested = data?.suggested as Record<string, string> | undefined;
      
      if (!suggested) {
        throw new Error("No suggestion received");
      }

      // Merge suggestions into field values
      setFieldValues((prev) => {
        const next = { ...prev };
        Object.entries(suggested).forEach(([key, value]) => {
          if (value) {
            next[key] = value;
          }
        });
        return next;
      });

    } catch (err: any) {
      setSuggestError(err.message || "Failed to get suggestion");
    } finally {
      setSuggesting(false);
    }
  };

  if (!section) {
    return (
      <div className="p-6 text-center text-slate-500">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <p className="text-sm">Select a section to edit its content</p>
      </div>
    );
  }

  if (!section.fields || section.fields.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-sm">This section has no editable fields</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Edit {section.internal_name || 'Section'}
        </h3>
        <p className="text-sm text-slate-600">
          Modify the content fields below and click Save to update your website.
        </p>
      </div>

      {/* Fields Form */}
      <div className="space-y-4 mb-6">
        {section.fields
          .sort((a, b) => a.order - b.order)
          .map((field) => {
            const value = fieldValues[field.key] || "";
            const isLongText = value.length > 80;
            
            return (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  {field.label || field.key}
                </label>
                
                {isLongText || field.key.toLowerCase().includes('content') || field.key.toLowerCase().includes('description') ? (
                  <textarea
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={value.length > 200 ? 6 : 4}
                    value={value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={`Enter ${field.label || field.key}...`}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={value}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={`Enter ${field.label || field.key}...`}
                  />
                )}
                
                {/* Character count for longer fields */}
                {value.length > 50 && (
                  <p className="text-xs text-slate-500">
                    {value.length} characters
                  </p>
                )}
              </div>
            );
          })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* [AI] Smart suggestion button */}
        <button
          onClick={handleSmartSuggest}
          disabled={suggesting || saving}
          className="inline-flex items-center gap-2 rounded-md bg-slate-700 px-3 py-2 text-xs font-medium text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {suggesting && (
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {suggesting ? 'Generating...' : 'Smart suggestion'}
        </button>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {saving && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        
        <button
          onClick={handleReset}
          disabled={saving}
          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Status Messages */}
      {saveSuccess && (
        <div className="mt-4 rounded-md bg-green-50 border border-green-200 p-3">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Changes saved successfully!
          </div>
        </div>
      )}

      {saveError && (
        <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3">
          <div className="text-sm text-red-800">
            <strong>Error:</strong> {saveError}
          </div>
        </div>
      )}

      {suggestError && (
        <div className="mt-4 rounded-md bg-amber-50 border border-amber-200 p-3">
          <div className="text-sm text-amber-800">
            <strong>Suggestion Error:</strong> {suggestError}
          </div>
        </div>
      )}

      {/* Field Count Info */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500">
          {section.fields.length} field{section.fields.length !== 1 ? 's' : ''} • Section #{section.order}
        </p>
      </div>
    </div>
  );
}