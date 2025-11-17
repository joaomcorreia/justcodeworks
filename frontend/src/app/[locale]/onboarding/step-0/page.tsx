'use client'
// [ONBOARDING] Step 0 Multi-Intent Onboarding - Intent Selection Page
import { redirect } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'

// Redirect to the main Step 0 page with intent selection
export default function Step0MainPage() {
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    // Redirect to the intent selection version of the page
    window.location.href = `/${locale}/onboarding/step-0/website`
  }, [locale])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <p className="text-white">Redirecting to onboarding...</p>
    </div>
  )
}