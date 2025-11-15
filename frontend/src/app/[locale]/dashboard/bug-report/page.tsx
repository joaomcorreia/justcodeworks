"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  params: { locale: string };
};

type BugReport = {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
};

// [JCW] Dashboard bug report page
export default function BugReportPage({ params }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.locale}/login`);
    }
  }, [user, isLoading, router, params.locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
    });
    setIsSubmitting(false);
    
    // Show success message (you could add a toast notification here)
    alert("Bug report submitted successfully!");
  };

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

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Bug Report</h1>
          <p className="text-sm text-slate-600">
            Report issues, bugs, or feature requests to help us improve your experience.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bug Report Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Submit a Bug Report</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief description of the issue"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Please provide detailed steps to reproduce the issue, expected behavior, and what actually happened..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar with Guidelines */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Reporting Guidelines</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <h4 className="font-medium text-slate-900">What to Include:</h4>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    <li>Steps to reproduce the issue</li>
                    <li>Expected vs actual behavior</li>
                    <li>Browser and device information</li>
                    <li>Screenshots if applicable</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">Priority Levels:</h4>
                  <ul className="mt-1 space-y-1">
                    <li><span className="font-medium text-red-600">High:</span> Blocking functionality</li>
                    <li><span className="font-medium text-orange-600">Medium:</span> Important but not blocking</li>
                    <li><span className="font-medium text-green-600">Low:</span> Minor issues or suggestions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Contact Support</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <p>For urgent issues, you can also contact us directly:</p>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-slate-900">Email:</span>
                    <br />
                    support@justcodeworks.com
                  </div>
                  <div>
                    <span className="font-medium text-slate-900">Response Time:</span>
                    <br />
                    Usually within 24 hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Your Recent Reports</h2>
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">No reports submitted yet</h3>
                  <p className="text-sm text-slate-600">Your bug reports will appear here once submitted.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}