"use client";

import { useState } from "react";

interface OnePageWebsiteFormValues {
  owner_name: string;
  owner_is_real_owner: boolean;
  business_address: string;
  business_email: string;
  business_phone: string;
  business_name: string;
  business_type: string;
  business_services: string;
  business_description: string;
  business_website?: string;
  favorite_colors: string;
  account_email: string;
  account_password: string;
}

interface OnePageWebsiteModalProps {
  children: React.ReactNode;
}

export function OnePageWebsiteModal({ children }: OnePageWebsiteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<OnePageWebsiteFormValues>({
    owner_name: "",
    owner_is_real_owner: true,
    business_address: "",
    business_email: "",
    business_phone: "",
    business_name: "",
    business_type: "",
    business_services: "",
    business_description: "",
    business_website: "",
    favorite_colors: "",
    account_email: "",
    account_password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/onboarding/one-page-website/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        setShowSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowSuccess(false);
    setError(null);
    // Reset form
    setFormValues({
      owner_name: "",
      owner_is_real_owner: true,
      business_address: "",
      business_email: "",
      business_phone: "",
      business_name: "",
      business_type: "",
      business_services: "",
      business_description: "",
      business_website: "",
      favorite_colors: "",
      account_email: "",
      account_password: "",
    });
  };

  const updateField = (field: keyof OnePageWebsiteFormValues, value: string | boolean) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {showSuccess ? (
              // Success State
              <div className="p-8 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Your account is almost ready
                </h2>
                <p className="text-slate-600 mb-6">
                  We've sent a confirmation link to <strong>{formValues.account_email}</strong>.
                  <br />
                  Please confirm your email, then log in to see your dashboard and continue setting up your website.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href="/en/login"
                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    Go to login
                  </a>
                </div>
              </div>
            ) : (
              // Form State
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">
                    Let's build your one-page website
                  </h2>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  <p className="text-slate-600 mb-6">
                    Please answer these questions as accurately as possible so we can get the best results and help your website appear in search results. Let's build your website.
                  </p>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Business Owner Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Business owner</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business Owner Name (first & last) *
                          </label>
                          <input
                            type="text"
                            required
                            value={formValues.owner_name}
                            onChange={(e) => updateField("owner_name", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="John Doe"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={formValues.owner_is_real_owner}
                              onChange={(e) => updateField("owner_is_real_owner", e.target.checked)}
                              className="text-yellow-500 focus:ring-yellow-500"
                            />
                            <span className="text-sm font-medium text-slate-700">
                              Are you the owner?
                            </span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business address *
                          </label>
                          <input
                            type="text"
                            required
                            value={formValues.business_address}
                            onChange={(e) => updateField("business_address", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="123 Main Street, City, Country"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formValues.business_email}
                            onChange={(e) => updateField("business_email", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="info@yourbusiness.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Phone / WhatsApp *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formValues.business_phone}
                            onChange={(e) => updateField("business_phone", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="+351 912 345 678"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Business Details Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Business details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formValues.business_name}
                            onChange={(e) => updateField("business_name", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="Your Business Name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business type *
                          </label>
                          <input
                            type="text"
                            required
                            value={formValues.business_type}
                            onChange={(e) => updateField("business_type", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="e.g. Local services, Restaurant, Consulting"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business main services *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={formValues.business_services}
                            onChange={(e) => updateField("business_services", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="Plumbing, heating, emergency repairs"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business small description *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={formValues.business_description}
                            onChange={(e) => updateField("business_description", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="This helps our system know how to fill your website."
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            This helps our system know how to fill your website.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Business website (optional)
                          </label>
                          <input
                            type="text"
                            value={formValues.business_website || ""}
                            onChange={(e) => updateField("business_website", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="www.yourbusiness.com or https://yourbusiness.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Favorite colors *
                          </label>
                          <input
                            type="text"
                            required
                            value={formValues.favorite_colors}
                            onChange={(e) => updateField("favorite_colors", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="Dark blue and yellow"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Login Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Account login</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email login *
                          </label>
                          <input
                            type="email"
                            required
                            value={formValues.account_email}
                            onChange={(e) => updateField("account_email", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="your@email.com"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={formValues.account_password}
                            onChange={(e) => updateField("account_password", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-slate-900 placeholder-slate-500"
                            placeholder="Choose a secure password"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-slate-200">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? "Building..." : "Build my website"}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
