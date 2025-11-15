"use client";

import type { SiteProjectPublic } from "@/lib/types/sitePublic";

type Props = {
  project: SiteProjectPublic;
};

export default function JsonDebugView({ project }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">{project.name}</h1>
          <p className="text-slate-600 mb-4">
            <strong>Template:</strong> {project.site_template_key || 'Unknown'}
          </p>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <p className="text-red-700 text-sm">
              <strong>Template not supported:</strong> This site uses the template "{project.site_template_key}" 
              which doesn't have a renderer implemented yet. Showing raw data for debugging.
            </p>
          </div>
          <pre className="bg-slate-900 text-green-400 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(project, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}