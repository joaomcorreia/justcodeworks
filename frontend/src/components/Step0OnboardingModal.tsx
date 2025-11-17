'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { getDictionary } from '@/i18n'

interface Step0OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  intent: 'website' | 'prints' | 'pos'
  locale: string
  onSuccess?: () => void
}

export default function Step0OnboardingModal({ 
  isOpen, 
  onClose, 
  intent, 
  locale,
  onSuccess 
}: Step0OnboardingModalProps) {
  const { user, accessToken } = useAuth()
  const [dictionary, setDictionary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Step 0 Builder data structure
  const [formData, setFormData] = useState({
    website_name: '',
    website_topic: '',
    entry_product: intent === 'prints' ? 'printing' : intent, // Convert 'prints' to 'printing'
    primary_audience: '',
    tagline: '',
    industry: '',
    description: ''
  })

  // Auth data for new users
  const [authData, setAuthData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await getDictionary(locale)
        setDictionary(dict)
      } catch (err) {
        console.error('Failed to load dictionary:', err)
      }
    }

    if (isOpen) {
      loadDictionary()
    }
  }, [isOpen, locale])

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('auth_')) {
      const authField = field.replace('auth_', '')
      setAuthData(prev => ({
        ...prev,
        [authField]: value
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // If no user is logged in, register first
      if (!user) {
        const registerResponse = await fetch('http://localhost:8000/api/auth/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: authData.email,
            email: authData.email,
            password: authData.password,
            first_name: authData.firstName,
            last_name: authData.lastName
          })
        })

        if (!registerResponse.ok) {
          const errorData = await registerResponse.json()
          setError(errorData.error || errorData.message || 'Failed to create account')
          setIsLoading(false)
          return
        }

        // Get JWT token after registration
        const loginResponse = await fetch('http://localhost:8000/api/jwt/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: authData.email,
            password: authData.password
          })
        })

        if (!loginResponse.ok) {
          setError('Failed to login after registration')
          setIsLoading(false)
          return
        }

        const loginResult = await loginResponse.json()
        const newAccessToken = loginResult.access

        if (!newAccessToken) {
          setError('Failed to get access token')
          setIsLoading(false)
          return
        }

        // Use the new token for the builder call
        const builderResponse = await fetch('http://localhost:8000/api/builder/step0/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newAccessToken}`
          },
          body: JSON.stringify(formData)
        })

        if (builderResponse.ok) {
          const result = await builderResponse.json()
          setSuccess(true)
          setTimeout(() => {
            onClose()
            if (onSuccess) {
              onSuccess()
            }
            // Redirect to the new site editor
            window.location.href = result.redirect_to
          }, 2000)
        } else {
          const errorData = await builderResponse.json()
          setError(errorData.error || 'Failed to create website')
        }
      } else {
        // User is already logged in, use existing token
        const response = await fetch('http://localhost:8000/api/builder/step0/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        })

        if (response.ok) {
          const result = await response.json()
          setSuccess(true)
          setTimeout(() => {
            onClose()
            if (onSuccess) {
              onSuccess()
            }
            // Redirect to the new site editor
            window.location.href = result.redirect_to
          }, 2000)
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to create website')
        }
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const getIntentLabel = () => {
    switch (intent) {
      case 'website':
        return 'Website'
      case 'prints':
        return 'Printing Services'
      case 'pos':
        return 'Point of Sale'
      default:
        return 'Website'
    }
  }

  const getIntentDescription = () => {
    switch (intent) {
      case 'website':
        return 'Create a professional website for your business'
      case 'prints':
        return 'Set up your printing services and portfolio'
      case 'pos':
        return 'Configure your point of sale system'
      default:
        return 'Get started with your project'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{getIntentLabel()} Setup</h2>
              <p className="text-blue-100 mt-1">{getIntentDescription()}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
              disabled={isLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Website Created Successfully!</h3>
              <p className="text-gray-600">Redirecting to your new website editor...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Authentication Section (only show if not logged in) */}
              {!user && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Your Account</h3>
                  <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={authData.firstName}
                          onChange={(e) => handleInputChange('auth_firstName', e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={authData.lastName}
                          onChange={(e) => handleInputChange('auth_lastName', e.target.value)}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={authData.email}
                        onChange={(e) => handleInputChange('auth_email', e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          value={authData.password}
                          onChange={(e) => handleInputChange('auth_password', e.target.value)}
                          placeholder="Choose a secure password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 0 Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{getIntentLabel()} Information</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.website_name}
                      onChange={(e) => handleInputChange('website_name', e.target.value)}
                      placeholder="Your Website/Business Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website Topic *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.website_topic}
                      onChange={(e) => handleInputChange('website_topic', e.target.value)}
                      placeholder="e.g. authentic Italian dining, modern web design, luxury retail"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Audience *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.primary_audience}
                      onChange={(e) => handleInputChange('primary_audience', e.target.value)}
                      placeholder="e.g. food lovers and families, small businesses, tech startups"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        placeholder="e.g. Restaurant, Technology, Retail"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tagline
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.tagline}
                        onChange={(e) => handleInputChange('tagline', e.target.value)}
                        placeholder="Catchy tagline or slogan"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Brief description of your business or website purpose..."
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Website...</span>
                    </div>
                  ) : (
                    `Create ${getIntentLabel()}`
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}