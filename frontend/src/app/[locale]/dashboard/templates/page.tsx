"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import type { Locale } from "@/i18n";
import { assignTemplateToProject } from "@/lib/api"; // [TEMPLAB] template assign fetch wiring

// [TEMPLAB] template picker page types
interface SiteTemplate {
  id: number;
  key: string;
  name: string;
  description: string;
  type: string;
  category: string;
  status: string;
  usage_count: number;
  version: string;
  is_user_selectable: boolean;  // [TEMPLAB] respect is_user_selectable
}

interface SiteProject {
  id: string;
  name: string;
  template_key?: string;
  template_name?: string;
}

interface TemplatePickerPageProps {
  params: { locale: Locale };
}

export default function TemplatePickerPage({ params }: TemplatePickerPageProps) {
  const { user, accessToken } = useAuth();
  const [templates, setTemplates] = useState<SiteTemplate[]>([]);
  const [currentProject, setCurrentProject] = useState<SiteProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // [TEMPLAB] fetch templates and current project
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // [TEMPLAB] only need user, not accessToken for session auth

      try {
        setLoading(true);
        setError(null);

        // [TEMPLAB] template fetch wiring - use session auth, not JWT  
        const templatesResponse = await fetch("http://localhost:8000/api/templates/", {
          method: "GET",
          credentials: "include", // Use session cookies instead of JWT
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!templatesResponse.ok) {
          const errorText = await templatesResponse.text().catch(() => "");
          console.error("Template list error:", templatesResponse.status, errorText);
          throw new Error(`Failed to fetch templates (${templatesResponse.status})`);
        }

        const templatesData = await templatesResponse.json();
        setTemplates(templatesData);

        // [TEMPLAB] fetch current user's project - use session auth, not JWT
        const projectsResponse = await fetch("http://localhost:8000/api/projects/", {
          method: "GET",
          credentials: "include", // Use session cookies instead of JWT
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          if (projectsData.length > 0) {
            setCurrentProject(projectsData[0]);
          }
        }

      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // [TEMPLAB] template fetch wiring - only depend on user for session auth

  // [TEMPLAB] assign template to project
  const assignTemplate = async (templateId: number, templateName: string) => {
    if (!currentProject || !user) return; // [TEMPLAB] only need user, not accessToken for session auth

    try {
      setAssigning(templateId);
      setError(null);
      setSuccess(null);

      // [TEMPLAB] template assign handler - use centralized API helper with session auth
      const result = await assignTemplateToProject(currentProject.id, templateId);
      
      // Update current project state
      setCurrentProject(prev => prev ? {
        ...prev,
        template_key: result.project.template_key,
        template_name: result.project.template_name,
      } : null);

      setSuccess(`Template "${templateName}" assigned successfully!`);

    } catch (err: any) {
      console.error("Error assigning template:", err);
      setError(err.message || "Failed to assign template");
    } finally {
      setAssigning(null);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">Please log in to select a template.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* [TEMPLAB] template picker header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Choose your website template
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Start by picking a base layout. You can customize content and sections later.
        </p>
        {currentProject && (
          <div className="mt-3 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Project: </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{currentProject.name}</span>
            {currentProject.template_name && (
              <>
                <span className="text-slate-500 dark:text-slate-400 mx-2">•</span>
                <span className="text-blue-600 dark:text-blue-400">Current: {currentProject.template_name}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* [TEMPLAB] status messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300">
          {success}
        </div>
      )}

      {/* [TEMPLAB] templates grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.filter(template => template.is_user_selectable).map((template) => {  // [TEMPLAB] respect is_user_selectable
          const isCurrentTemplate = currentProject?.template_key === template.key;
          const isAssigningThis = assigning === template.id;

          return (
            <div
              key={template.id}
              className={`rounded-lg border p-6 transition-all ${
                isCurrentTemplate
                  ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                  : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
              }`}
            >
              {/* Template info */}
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {template.name}
                  </h3>
                  <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {template.key}
                  </span>
                </div>

                {template.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {template.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {template.category && (
                    <span className="rounded bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                      {template.category}
                    </span>
                  )}
                  <span className="rounded bg-green-100 px-2 py-1 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {template.status}
                  </span>
                  {template.usage_count > 0 && (
                    <span className="rounded bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Used by {template.usage_count} sites
                    </span>
                  )}
                </div>
              </div>

              {/* Action button */}
              <div>
                {isCurrentTemplate ? (
                  <div className="w-full rounded-md border border-blue-300 bg-blue-100 px-4 py-2 text-center text-sm font-medium text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    Current template
                  </div>
                ) : (
                  <button
                    onClick={() => assignTemplate(template.id, template.name)}
                    disabled={isAssigningThis || assigning !== null}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    {isAssigningThis ? "Assigning..." : "Use this template"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {templates.filter(template => template.is_user_selectable).length === 0 && !loading && (  // [TEMPLAB] respect is_user_selectable
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">No templates available.</p>
        </div>
      )}
    </div>
  );
}