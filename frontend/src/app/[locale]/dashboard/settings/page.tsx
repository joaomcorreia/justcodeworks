"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  params: { locale: string };
};

interface SiteProject {
  id: string;
  name: string;
  slug: string;
  enable_arabic_language: boolean;
  primary_locale: string;
  additional_locales: string[];
}

// [JCW] Dashboard settings page
export default function SettingsPage({ params }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [siteProjects, setSiteProjects] = useState<SiteProject[]>([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  // Fetch user's site projects
  const fetchSiteProjects = async () => {
    if (!user) return;
    
    setSitesLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/projects/", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch site projects");
      }
      
      const data = await response.json();
      setSiteProjects(data);
    } catch (error) {
      console.error("Error fetching site projects:", error);
    } finally {
      setSitesLoading(false);
    }
  };

  // Update Arabic language setting for a site project
  const updateArabicLanguageSetting = async (projectId: string, enabled: boolean) => {
    setUpdateLoading(projectId);
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enable_arabic_language: enabled,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update Arabic language setting");
      }
      
      // Update local state
      setSiteProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, enable_arabic_language: enabled }
            : project
        )
      );
    } catch (error) {
      console.error("Error updating Arabic language setting:", error);
    } finally {
      setUpdateLoading(null);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/${params.locale}/login`);
    } else if (user && activeTab === "website") {
      fetchSiteProjects();
    }
  }, [user, isLoading, router, params.locale, activeTab]);

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
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-600">
            Manage your account preferences and configurations.
          </p>
        </div>

        {/* Settings Navigation */}
        <div className="mb-8 border-b border-slate-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`border-b-2 pb-2 text-sm font-medium ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`border-b-2 pb-2 text-sm font-medium ${
                activeTab === "account"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`border-b-2 pb-2 text-sm font-medium ${
                activeTab === "notifications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("website")}
              className={`border-b-2 pb-2 text-sm font-medium ${
                activeTab === "website"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Website
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`border-b-2 pb-2 text-sm font-medium ${
                activeTab === "billing"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Billing
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Profile Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.firstName || ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.lastName || ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Account Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">Email Notifications</h4>
                    <p className="text-sm text-slate-600">Receive updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">Order Updates</h4>
                    <p className="text-sm text-slate-600">Get notified about order status changes</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">Marketing Communications</h4>
                    <p className="text-sm text-slate-600">Receive tips and promotional offers</p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Website Tab */}
        {activeTab === "website" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Website Language Settings</h3>
              <p className="mb-6 text-sm text-slate-600">
                Manage language options for your websites. Control which languages are available to your visitors.
              </p>
              
              {sitesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-pulse text-sm text-slate-600">Loading websites...</div>
                </div>
              ) : siteProjects.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm text-slate-600">No websites found. Create your first website to manage language settings.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {siteProjects.map((project) => (
                    <div key={project.id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900">{project.name}</h4>
                          <p className="text-sm text-slate-600">
                            Primary: <span className="font-medium">{project.primary_locale.toUpperCase()}</span>
                            {project.additional_locales?.length > 0 && (
                              <span className="ml-2">
                                • Additional: {project.additional_locales.map(l => l.toUpperCase()).join(", ")}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 mb-1">/{project.slug}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">🇸🇦</span>
                              <div>
                                <h5 className="font-medium text-slate-900">Arabic Language</h5>
                                <p className="text-sm text-slate-600">
                                  Enable Arabic for visitors to this website. Arabic uses right-to-left (RTL) layout.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {updateLoading === project.id && (
                              <div className="mr-3 text-xs text-slate-500">Updating...</div>
                            )}
                            <button
                              onClick={() => updateArabicLanguageSetting(project.id, !project.enable_arabic_language)}
                              disabled={updateLoading === project.id}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                project.enable_arabic_language
                                  ? 'bg-blue-600'
                                  : 'bg-slate-200'
                              } ${updateLoading === project.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                  project.enable_arabic_language ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        
                        {project.enable_arabic_language && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                              ✓ Arabic is enabled for this website. Visitors can switch to Arabic using the language selector.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Available Languages</h4>
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>🇬🇧</span>
                    <span>English</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🇳🇱</span>
                    <span>Nederlands</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🇫🇷</span>
                    <span>Français</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🇩🇪</span>
                    <span>Deutsch</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🇪🇸</span>
                    <span>Español</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🇮🇹</span>
                    <span>Italiano</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🇵🇹</span>
                    <span>Português</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🇸🇦</span>
                    <span>العربية (Optional)</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-3">
                  All languages except Arabic are enabled by default. Arabic can be enabled per website above.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Billing Information</h3>
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900">Current Plan</h4>
                    <p className="text-sm text-slate-600">Basic Plan - $9.99/month</p>
                  </div>
                  <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Upgrade Plan
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="mb-2 font-medium text-slate-900">Payment Method</h4>
                <div className="flex items-center space-x-3 rounded-lg border border-slate-200 p-4">
                  <div className="flex h-8 w-12 items-center justify-center rounded bg-slate-100">
                    <span className="text-xs font-medium text-slate-600">****</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">**** **** **** 1234</p>
                    <p className="text-xs text-slate-600">Expires 12/25</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}