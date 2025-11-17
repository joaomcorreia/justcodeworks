'use client'
// [ONBOARDING] Step 0 Multi-Intent Onboarding Page
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { api } from '@/lib/api'
import { getDictionary } from '@/i18n/get-dictionary'

interface Step0FormData {
  entry_intent: 'website' | 'prints' | 'pos'
  business_name: string
  business_type: string
  primary_country: string
  primary_language: string
  brand_primary_color: string
  brand_secondary_color: string
  preferred_theme_mode: 'light' | 'dark' | 'auto'
  primary_goal: string
  onboarding_notes: string
}

export default function Step0OnboardingPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  
  const locale = params.locale as string
  const intentParam = params.intent as string
  
  // [I18N] Dictionary state
  const [dict, setDict] = useState<any>(null)
  
  // Form state
  const [formData, setFormData] = useState<Step0FormData>({
    entry_intent: 'website',
    business_name: '',
    business_type: '',
    primary_country: '',
    primary_language: locale || 'en',
    brand_primary_color: '#1D4ED8',
    brand_secondary_color: '#6366F1',
    preferred_theme_mode: 'dark',
    primary_goal: '',
    onboarding_notes: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load dictionary
  useEffect(() => {
    const loadDict = async () => {
      try {
        const dictionary = await getDictionary(locale)
        setDict(dictionary)
      } catch (error) {
        console.error('Failed to load dictionary:', error)
      }
    }
    loadDict()
  }, [locale])

  // Set intent from URL parameter
  useEffect(() => {
    if (intentParam && ['website', 'prints', 'pos'].includes(intentParam)) {
      setFormData(prev => ({
        ...prev,
        entry_intent: intentParam as 'website' | 'prints' | 'pos'
      }))
    }
  }, [intentParam])

  // Auth redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/login?redirect=${encodeURIComponent(`/onboarding/step-0/${intentParam || 'website'}`)}`)
    }
  }, [authLoading, isAuthenticated, locale, router, intentParam])

  const handleInputChange = (field: keyof Step0FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field-specific errors
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Business name is required'
    }
    
    // Brand color validation
    if (formData.brand_primary_color && !formData.brand_primary_color.match(/^#[0-9A-Fa-f]{6}$/)) {
      newErrors.brand_primary_color = 'Please enter a valid hex color (e.g. #1D4ED8)'
    }
    
    if (formData.brand_secondary_color && !formData.brand_secondary_color.match(/^#[0-9A-Fa-f]{6}$/)) {
      newErrors.brand_secondary_color = 'Please enter a valid hex color (e.g. #6366F1)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const response = await api.post('/api/onboarding/step-0/', formData)
      const data = await response.json()
      
      if (data.success) {
        setSubmitSuccess(true)
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push(data.redirect_url || `/${locale}/dashboard?active_section=${formData.entry_intent}`)
        }, 2000)
      } else {
        setErrors(data.errors || { general: 'Something went wrong' })
      }
    } catch (error: any) {
      console.error('Step 0 submission error:', error)
      setErrors({ general: 'Failed to save onboarding data. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || !dict) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading onboarding...</p>
        </div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {dict.onboarding?.step0?.success?.title || "Welcome to JustCodeWorks!"}
            </h2>
            <p className="text-slate-300 mb-4">
              {dict.onboarding?.step0?.success?.subtitle || "Your onboarding is complete. Redirecting to your dashboard..."}
            </p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const intentTitles = {
    website: dict.onboarding?.step0?.intents?.website?.title || 'Build a Website',
    prints: dict.onboarding?.step0?.intents?.prints?.title || 'Design Prints', 
    pos: dict.onboarding?.step0?.intents?.pos?.title || 'Point of Sale'
  }

  const intentDescriptions = {
    website: dict.onboarding?.step0?.intents?.website?.description || 'Create a professional website for your business',
    prints: dict.onboarding?.step0?.intents?.prints?.description || 'Create business cards, flyers, and marketing materials',
    pos: dict.onboarding?.step0?.intents?.pos?.description || 'Set up payment processing and inventory management'
  }

  const countries = dict.onboarding?.step0?.countries || [
    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
    "France", "Spain", "Portugal", "Brazil", "Mexico", "Other"
  ]

  const languages = dict.onboarding?.step0?.languages || {
    en: 'English', pt: 'Português', es: 'Español', fr: 'Français', de: 'Deutsch'
  }

  const goals = dict.onboarding?.step0?.goals || {
    'get-leads': 'Get leads / requests',
    'show-info': 'Show info / menu',
    'sell-online': 'Sell online',
    'take-bookings': 'Take bookings',
    'other': 'Other'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {dict.onboarding?.step0?.title || "Let's Get Started"}
          </h1>
          <p className="text-xl text-slate-300">
            {dict.onboarding?.step0?.subtitle || "Tell us about your business and what you'd like to create"}
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
          {/* Header with Intent */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                {formData.entry_intent === 'website' && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                )}
                {formData.entry_intent === 'prints' && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                {formData.entry_intent === 'pos' && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{intentTitles[formData.entry_intent]}</h2>
                <p className="text-slate-300">{intentDescriptions[formData.entry_intent]}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Intent Selection */}
            <div>
              <label className="block text-white font-medium mb-2">Select Your Primary Intent</label>
              <div className="grid grid-cols-3 gap-3">
                {(['website', 'prints', 'pos'] as const).map((intent) => (
                  <button
                    key={intent}
                    type="button"
                    onClick={() => handleInputChange('entry_intent', intent)}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      formData.entry_intent === intent
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      {intent === 'website' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      )}
                      {intent === 'prints' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {intent === 'pos' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm font-medium">{intentTitles[intent]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label htmlFor="business_name" className="block text-white font-medium mb-2">
                {dict.onboarding?.step0?.form?.businessName?.label || "Business Name"} *
              </label>
              <input
                type="text"
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder={dict.onboarding?.step0?.form?.businessName?.placeholder || "Enter your business name"}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {errors.business_name && (
                <p className="text-red-400 text-sm mt-1">{errors.business_name}</p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <label htmlFor="business_type" className="block text-white font-medium mb-2">
                {dict.onboarding?.step0?.form?.businessType?.label || "Business Type"}
              </label>
              <input
                type="text"
                id="business_type"
                value={formData.business_type}
                onChange={(e) => handleInputChange('business_type', e.target.value)}
                placeholder={dict.onboarding?.step0?.form?.businessType?.placeholder || "e.g., Restaurant, Consulting, Retail Store"}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Primary Country */}
            <div>
              <label htmlFor="primary_country" className="block text-white font-medium mb-2">
                {dict.onboarding?.step0?.form?.primaryCountry?.label || "Primary Country"}
              </label>
              <select
                id="primary_country"
                value={formData.primary_country}
                onChange={(e) => handleInputChange('primary_country', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{dict.onboarding?.step0?.form?.primaryCountry?.placeholder || "Select your country"}</option>
                {countries.map((country: string) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Primary Language */}
            <div>
              <label htmlFor="primary_language" className="block text-white font-medium mb-2">
                {dict.onboarding?.step0?.form?.primaryLanguage?.label || "Primary Language"}
              </label>
              <select
                id="primary_language"
                value={formData.primary_language}
                onChange={(e) => handleInputChange('primary_language', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(languages).map(([code, label]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
            </div>

            {/* Primary Goal (for website intent) */}
            {formData.entry_intent === 'website' && (
              <div>
                <label htmlFor="primary_goal" className="block text-white font-medium mb-2">
                  {dict.onboarding?.step0?.form?.primaryGoal?.label || "Primary Goal"}
                </label>
                <select
                  id="primary_goal"
                  value={formData.primary_goal}
                  onChange={(e) => handleInputChange('primary_goal', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{dict.onboarding?.step0?.form?.primaryGoal?.placeholder || "What's your main goal?"}</option>
                  {Object.entries(goals).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Brand Colors */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand_primary_color" className="block text-white font-medium mb-2">
                  {dict.onboarding?.step0?.form?.brandColors?.primaryLabel || "Primary Brand Color"}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    id="brand_primary_color"
                    value={formData.brand_primary_color}
                    onChange={(e) => handleInputChange('brand_primary_color', e.target.value)}
                    className="w-16 h-10 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.brand_primary_color}
                    onChange={(e) => handleInputChange('brand_primary_color', e.target.value)}
                    placeholder={dict.onboarding?.step0?.form?.brandColors?.primaryPlaceholder || "#1D4ED8"}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.brand_primary_color && (
                  <p className="text-red-400 text-sm mt-1">{errors.brand_primary_color}</p>
                )}
              </div>

              <div>
                <label htmlFor="brand_secondary_color" className="block text-white font-medium mb-2">
                  {dict.onboarding?.step0?.form?.brandColors?.secondaryLabel || "Secondary Brand Color"}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    id="brand_secondary_color"
                    value={formData.brand_secondary_color}
                    onChange={(e) => handleInputChange('brand_secondary_color', e.target.value)}
                    className="w-16 h-10 bg-slate-700 border border-slate-600 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.brand_secondary_color}
                    onChange={(e) => handleInputChange('brand_secondary_color', e.target.value)}
                    placeholder={dict.onboarding?.step0?.form?.brandColors?.secondaryPlaceholder || "#6366F1"}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.brand_secondary_color && (
                  <p className="text-red-400 text-sm mt-1">{errors.brand_secondary_color}</p>
                )}
              </div>
            </div>

            {/* Theme Mode */}
            <div>
              <label className="block text-white font-medium mb-2">
                {dict.onboarding?.step0?.form?.themeMode?.label || "Preferred Theme"}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: dict.onboarding?.step0?.form?.themeMode?.light || 'Light' },
                  { value: 'dark', label: dict.onboarding?.step0?.form?.themeMode?.dark || 'Dark' },
                  { value: 'auto', label: dict.onboarding?.step0?.form?.themeMode?.auto || 'Auto' }
                ].map(theme => (
                  <button
                    key={theme.value}
                    type="button"
                    onClick={() => handleInputChange('preferred_theme_mode', theme.value)}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      formData.preferred_theme_mode === theme.value
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="onboarding_notes" className="block text-white font-medium mb-2">
                {dict.onboarding?.step0?.form?.notes?.label || "Additional Notes"}
              </label>
              <textarea
                id="onboarding_notes"
                value={formData.onboarding_notes}
                onChange={(e) => handleInputChange('onboarding_notes', e.target.value)}
                placeholder={dict.onboarding?.step0?.form?.notes?.placeholder || "Any specific requirements or preferences..."}
                rows={3}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Error Messages */}
            {errors.general && (
              <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <p className="text-red-400">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !formData.business_name.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {dict.onboarding?.step0?.actions?.creating || "Creating..."}
                  </span>
                ) : (
                  <span className="flex items-center">
                    {dict.onboarding?.step0?.actions?.complete || "Complete Setup"}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}