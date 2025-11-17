'use client'
// [ONBOARDING] Step 0 Multi-Intent Onboarding Page - Simplified Version
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Note: Using basic HTML elements instead of UI components
// Note: Icons removed for simplicity
// Note: Auth will be handled differently
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
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  
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
      router.push(`/${locale}/auth/login?redirect=${encodeURIComponent(`/onboarding/step-0/${intentParam || 'website'}`)}`)
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

  const handleSubmit = async () => {
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
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-slate-300">Loading onboarding...</p>
        </div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto bg-slate-800 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">{dict.onboarding?.step0?.success?.title || "Welcome to JustCodeWorks!"}</h2>
              <p className="text-slate-300 mb-4">
                {dict.onboarding?.step0?.success?.subtitle || "Your onboarding is complete. Redirecting to your dashboard..."}
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              {dict.onboarding?.step0?.title || "Let's Get Started"}
            </h1>
            <p className="text-xl text-slate-300">
              {dict.onboarding?.step0?.subtitle || "Tell us about your business and what you'd like to create"}
            </p>
          </motion.div>
        </div>

        {/* Intent Selection */}
        <Card className="max-w-2xl mx-auto bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                {formData.entry_intent === 'website' && <Globe className="w-6 h-6 text-white" />}
                {formData.entry_intent === 'prints' && <FileText className="w-6 h-6 text-white" />}
                {formData.entry_intent === 'pos' && <CreditCard className="w-6 h-6 text-white" />}
              </div>
              <div>
                <CardTitle className="text-white">{intentTitles[formData.entry_intent]}</CardTitle>
                <CardDescription className="text-slate-300">{intentDescriptions[formData.entry_intent]}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Intent Selection */}
            <div>
              <Label className="text-white mb-2 block">Select Your Primary Intent</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['website', 'prints', 'pos'] as const).map((intent) => (
                  <div
                    key={intent}
                    onClick={() => handleInputChange('entry_intent', intent)}
                    className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      formData.entry_intent === intent
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex justify-center mb-2">
                      {intent === 'website' && <Globe className="w-6 h-6" />}
                      {intent === 'prints' && <FileText className="w-6 h-6" />}
                      {intent === 'pos' && <CreditCard className="w-6 h-6" />}
                    </div>
                    <div className="text-sm font-medium">{intentTitles[intent]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Name */}
            <div>
              <Label htmlFor="business_name" className="text-white flex items-center space-x-2 mb-2">
                <Building2 className="w-4 h-4" />
                <span>{dict.onboarding?.step0?.form?.businessName?.label || "Business Name"} *</span>
              </Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                placeholder={dict.onboarding?.step0?.form?.businessName?.placeholder || "Enter your business name"}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
              {errors.business_name && (
                <p className="text-red-400 text-sm mt-1">{errors.business_name}</p>
              )}
            </div>

            {/* Business Type */}
            <div>
              <Label htmlFor="business_type" className="text-white mb-2 block">
                {dict.onboarding?.step0?.form?.businessType?.label || "Business Type"}
              </Label>
              <Input
                id="business_type"
                value={formData.business_type}
                onChange={(e) => handleInputChange('business_type', e.target.value)}
                placeholder={dict.onboarding?.step0?.form?.businessType?.placeholder || "e.g., Restaurant, Consulting, Retail Store"}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Primary Country */}
            <div>
              <Label htmlFor="primary_country" className="text-white flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{dict.onboarding?.step0?.form?.primaryCountry?.label || "Primary Country"}</span>
              </Label>
              <Select value={formData.primary_country} onValueChange={(value) => handleInputChange('primary_country', value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder={dict.onboarding?.step0?.form?.primaryCountry?.placeholder || "Select your country"} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {(dict.onboarding?.step0?.countries || [
                    "United States", "United Kingdom", "Canada", "Australia", "Germany", 
                    "France", "Spain", "Portugal", "Brazil", "Mexico", "Other"
                  ]).map((country: string) => (
                    <SelectItem key={country} value={country} className="text-white hover:bg-slate-600">
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Primary Language */}
            <div>
              <Label htmlFor="primary_language" className="text-white flex items-center space-x-2 mb-2">
                <Languages className="w-4 h-4" />
                <span>{dict.onboarding?.step0?.form?.primaryLanguage?.label || "Primary Language"}</span>
              </Label>
              <Select value={formData.primary_language} onValueChange={(value) => handleInputChange('primary_language', value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder={dict.onboarding?.step0?.form?.primaryLanguage?.placeholder || "Select primary language"} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {Object.entries(dict.onboarding?.step0?.languages || {
                    en: 'English', pt: 'Português', es: 'Español', fr: 'Français', de: 'Deutsch'
                  }).map(([code, label]) => (
                    <SelectItem key={code} value={code} className="text-white hover:bg-slate-600">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Primary Goal (for website intent) */}
            {formData.entry_intent === 'website' && (
              <div>
                <Label htmlFor="primary_goal" className="text-white flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4" />
                  <span>{dict.onboarding?.step0?.form?.primaryGoal?.label || "Primary Goal"}</span>
                </Label>
                <Select value={formData.primary_goal} onValueChange={(value) => handleInputChange('primary_goal', value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder={dict.onboarding?.step0?.form?.primaryGoal?.placeholder || "What's your main goal?"} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {Object.entries(dict.onboarding?.step0?.goals || {
                      'get-leads': 'Get leads / requests',
                      'show-info': 'Show info / menu',
                      'sell-online': 'Sell online',
                      'take-bookings': 'Take bookings',
                      'other': 'Other'
                    }).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-white hover:bg-slate-600">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Brand Colors */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand_primary_color" className="text-white mb-2 block">
                  {dict.onboarding?.step0?.form?.brandColors?.primaryLabel || "Primary Brand Color"}
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="brand_primary_color"
                    type="color"
                    value={formData.brand_primary_color}
                    onChange={(e) => handleInputChange('brand_primary_color', e.target.value)}
                    className="w-16 h-10 p-1 bg-slate-700 border-slate-600"
                  />
                  <Input
                    value={formData.brand_primary_color}
                    onChange={(e) => handleInputChange('brand_primary_color', e.target.value)}
                    placeholder={dict.onboarding?.step0?.form?.brandColors?.primaryPlaceholder || "#1D4ED8"}
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                {errors.brand_primary_color && (
                  <p className="text-red-400 text-sm mt-1">{errors.brand_primary_color}</p>
                )}
              </div>

              <div>
                <Label htmlFor="brand_secondary_color" className="text-white mb-2 block">
                  {dict.onboarding?.step0?.form?.brandColors?.secondaryLabel || "Secondary Brand Color"}
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="brand_secondary_color"
                    type="color"
                    value={formData.brand_secondary_color}
                    onChange={(e) => handleInputChange('brand_secondary_color', e.target.value)}
                    className="w-16 h-10 p-1 bg-slate-700 border-slate-600"
                  />
                  <Input
                    value={formData.brand_secondary_color}
                    onChange={(e) => handleInputChange('brand_secondary_color', e.target.value)}
                    placeholder={dict.onboarding?.step0?.form?.brandColors?.secondaryPlaceholder || "#6366F1"}
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                {errors.brand_secondary_color && (
                  <p className="text-red-400 text-sm mt-1">{errors.brand_secondary_color}</p>
                )}
              </div>
            </div>

            {/* Theme Mode */}
            <div>
              <Label htmlFor="preferred_theme_mode" className="text-white mb-2 block">
                {dict.onboarding?.step0?.form?.themeMode?.label || "Preferred Theme"}
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: dict.onboarding?.step0?.form?.themeMode?.light || 'Light' },
                  { value: 'dark', label: dict.onboarding?.step0?.form?.themeMode?.dark || 'Dark' },
                  { value: 'auto', label: dict.onboarding?.step0?.form?.themeMode?.auto || 'Auto' }
                ].map(theme => (
                  <div
                    key={theme.value}
                    onClick={() => handleInputChange('preferred_theme_mode', theme.value)}
                    className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all ${
                      formData.preferred_theme_mode === theme.value
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {theme.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="onboarding_notes" className="text-white mb-2 block">
                {dict.onboarding?.step0?.form?.notes?.label || "Additional Notes"}
              </Label>
              <Textarea
                id="onboarding_notes"
                value={formData.onboarding_notes}
                onChange={(e) => handleInputChange('onboarding_notes', e.target.value)}
                placeholder={dict.onboarding?.step0?.form?.notes?.placeholder || "Any specific requirements or preferences..."}
                rows={3}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
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
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.business_name.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {dict.onboarding?.step0?.actions?.creating || "Creating..."}
                  </>
                ) : (
                  <>
                    {dict.onboarding?.step0?.actions?.complete || "Complete Setup"}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}