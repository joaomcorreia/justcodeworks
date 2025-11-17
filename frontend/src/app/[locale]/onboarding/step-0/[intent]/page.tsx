'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getDictionary } from '@/i18n'

export default function Step0OnboardingPage() {
  const params = useParams()
  const router = useRouter()
  const { user, accessToken } = useAuth()
  const [dictionary, setDictionary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const intent = params?.intent as string
  const locale = (params?.locale as string) || 'en'

  const [formData, setFormData] = useState({
    entry_intent: intent || 'website',
    business_name: '',
    business_type: '',
    primary_country: 'United States',
    primary_language: locale,
    brand_primary_color: '#1D4ED8',
    brand_secondary_color: '#6366F1',
    preferred_theme_mode: 'dark',
    primary_goal: 'get-leads',
    onboarding_notes: ''
  })

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(locale)
      setDictionary(dict)
    }
    loadDictionary()
  }, [locale])

  useEffect(() => {
    if (intent) {
      setFormData(prev => ({ ...prev, entry_intent: intent }))
    }
  }, [intent])

  useEffect(() => {
    if (!user && dictionary) {
      router.push(`/${locale}/login`)
    }
  }, [user, router, locale, dictionary])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/api/onboarding/step-0/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push(`/${locale}/dashboard?section=${intent}`)
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to save onboarding data')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!dictionary) {
    return <div className="min-h-screen flex items-center justify-center"><div>Loading...</div></div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Let's Build Your Digital Presence
          </h1>
          <p className="text-xl text-slate-300">
            Tell us about your business goals and preferences
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold">
            {intent === 'website' && 'Website Creation'}
            {intent === 'prints' && 'Print Design'}
            {intent === 'pos' && 'POS System'}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Business Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.business_name}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                    placeholder="Your Business Name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.business_type}
                    onChange={(e) => handleInputChange('business_type', e.target.value)}
                    placeholder="e.g. Restaurant, Tech Startup, Retail"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Country
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.primary_country}
                    onChange={(e) => handleInputChange('primary_country', e.target.value)}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Language
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.primary_language}
                    onChange={(e) => handleInputChange('primary_language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Brand Preferences
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Brand Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      className="w-20 h-10 border border-gray-300 rounded-md cursor-pointer"
                      value={formData.brand_primary_color}
                      onChange={(e) => handleInputChange('brand_primary_color', e.target.value)}
                    />
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.brand_primary_color}
                      onChange={(e) => handleInputChange('brand_primary_color', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Brand Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      className="w-20 h-10 border border-gray-300 rounded-md cursor-pointer"
                      value={formData.brand_secondary_color}
                      onChange={(e) => handleInputChange('brand_secondary_color', e.target.value)}
                    />
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.brand_secondary_color}
                      onChange={(e) => handleInputChange('brand_secondary_color', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Theme
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.preferred_theme_mode}
                    onChange={(e) => handleInputChange('preferred_theme_mode', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Goal
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.primary_goal}
                    onChange={(e) => handleInputChange('primary_goal', e.target.value)}
                  >
                    <option value="get-leads">Generate Leads</option>
                    <option value="sell-online">Sell Online</option>
                    <option value="showcase">Showcase Work</option>
                    <option value="informational">Share Information</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.onboarding_notes}
                onChange={(e) => handleInputChange('onboarding_notes', e.target.value)}
                placeholder="Any specific requirements or preferences..."
              />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-red-200 rounded-md">
                <p className="text-green-600">
                  Onboarding completed successfully! Redirecting to dashboard...
                </p>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || success}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}