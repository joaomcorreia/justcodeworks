// [GARAGE-FORM] Admin Leads & Quotes Page
"use client";

import { useState, useEffect } from "react";
// Note: Auth will be handled via context or alternative method
import { fetchAdminQuoteRequests, fetchSiteProjects } from "@/lib/api";
import type { AdminQuoteRequest, SiteProject } from "@/lib/api-types";

interface QuoteDetailModalProps {
  quote: AdminQuoteRequest;
  isOpen: boolean;
  onClose: () => void;
}

function QuoteDetailModal({ quote, isOpen, onClose }: QuoteDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Quote Request Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <span className="text-xl">✕</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Site</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.site_project_name} ({quote.site_project_slug})</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(quote.created_at).toLocaleString()}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.name}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {quote.email && <div>Email: {quote.email}</div>}
                  {quote.phone && <div>Phone: {quote.phone}</div>}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Vehicle</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {quote.license_plate && <div>License Plate: {quote.license_plate}</div>}
                  {quote.car_make_model && <div>Make/Model: {quote.car_make_model}</div>}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Service Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{quote.service_type_display}</dd>
              </div>
              
              {quote.message && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Message</dt>
                  <dd className="mt-1 text-sm text-gray-900">{quote.message}</dd>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Source Page</dt>
                  <dd className="mt-1 text-sm text-gray-900">{quote.source_page_slug || "—"}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Locale</dt>
                  <dd className="mt-1 text-sm text-gray-900">{quote.locale.toUpperCase()}</dd>
                </div>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Marketing Consent</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {quote.consent_marketing ? (
                    <span className="text-green-600">✓ Yes</span>
                  ) : (
                    <span className="text-red-600">✗ No</span>
                  )}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLeadsPage() {
  // Note: Auth functionality temporarily disabled
  const user = null;
  const authLoading = false;
  const [quotes, setQuotes] = useState<AdminQuoteRequest[]>([]);
  const [siteProjects, setSiteProjects] = useState<SiteProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedLocale, setSelectedLocale] = useState<string>("all");
  
  // Detail modal
  const [selectedQuote, setSelectedQuote] = useState<AdminQuoteRequest | null>(null);

  // Load initial data
  useEffect(() => {
    if (authLoading) return;
    
    if (!user || !(user as any)?.isStaff) {
      setError("Access denied. Staff privileges required.");
      setLoading(false);
      return;
    }

    loadData();
  }, [user, authLoading, selectedSite, selectedLocale]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load quotes with current filters
      const quotesData = await fetchAdminQuoteRequests({
        site_slug: selectedSite !== "all" ? selectedSite : undefined,
        locale: selectedLocale !== "all" ? selectedLocale : undefined,
      });
      setQuotes(quotesData);

      // Load site projects for filter dropdown (only once)
      if (siteProjects.length === 0) {
        try {
          const projectsData = await fetchSiteProjects();
          setSiteProjects(projectsData);
        } catch (projectsError) {
          console.warn("Failed to load site projects:", projectsError);
          // Don't fail the entire page if projects can't be loaded
        }
      }
    } catch (err) {
      console.error("Failed to load data:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (quote: AdminQuoteRequest) => {
    setSelectedQuote(quote);
  };

  const handleCloseModal = () => {
    setSelectedQuote(null);
  };

  // Auth check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user || !(user as any)?.isStaff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Access denied. Staff privileges required.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads & Quotes</h1>
        <p className="mt-2 text-gray-600">
          Incoming quote requests from all tenant websites.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="site-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Site
            </label>
            <select
              id="site-filter"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Sites</option>
              {siteProjects.map((project) => (
                <option key={project.slug} value={project.slug}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="locale-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Locale
            </label>
            <select
              id="locale-filter"
              value={selectedLocale}
              onChange={(e) => setSelectedLocale(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">All Languages</option>
              <option value="pt">Portuguese</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading quote requests...</div>
        </div>
      ) : (
        <>
          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {quotes.length} quote request{quotes.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Site
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Locale
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source Page
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No quote requests found.
                      {(selectedSite !== "all" || selectedLocale !== "all") && (
                        <div className="mt-2 text-sm">
                          Try clearing the filters to see more results.
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  quotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(quote)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(quote.created_at).toLocaleDateString()}{" "}
                        {new Date(quote.created_at).toLocaleTimeString([], { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {quote.site_project_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {quote.site_project_slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quote.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quote.service_type_display}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {quote.email && <div>{quote.email}</div>}
                          {quote.phone && <div>{quote.phone}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quote.locale.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {quote.source_page_slug || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          isOpen={!!selectedQuote}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}