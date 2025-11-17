"use client"

// [JCW] Homepage slider container that fetches data and handles loading states
import React, { useState, useEffect } from 'react'
import HomepageSlider from './HomepageSlider'

interface HomepageSliderContainerProps {
  sliderSlug: string
  projectId?: number
  className?: string
  fallbackGradient?: string
}

interface ApiSlider {
  id: number
  name: string
  slug: string
  is_active: boolean
  auto_play: boolean
  auto_play_interval: number
  show_navigation: boolean
  show_pagination: boolean
  particles_enabled: boolean
  particles_density: number
  particles_speed: number
  particles_size_min: number
  particles_size_max: number
  particles_color: string
  particles_opacity: number
  background_type: 'gradient' | 'image' | 'video'
  gradient_from: string
  gradient_to: string
  gradient_direction: string
  background_image?: string
  background_video?: string
  background_overlay_opacity: number
  slides: Array<{
    id: number
    title: string
    subtitle?: string
    content?: string
    primary_cta_text?: string
    primary_cta_url?: string
    secondary_cta_text?: string
    secondary_cta_url?: string
    text_color: string
    text_alignment: 'left' | 'center' | 'right'
    slide_image?: string
    slide_video?: string
    order: number
    is_active: boolean
    animation_type: 'fade' | 'slide' | 'zoom' | 'none'
  }>
}

export default function HomepageSliderContainer({
  sliderSlug,
  projectId,
  className = '',
  fallbackGradient = 'bg-gradient-to-br from-blue-800 to-sky-300'
}: HomepageSliderContainerProps) {
  const [slider, setSlider] = useState<ApiSlider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Build API URL with project filter if provided
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
        let url = `${baseUrl}/homepage-sliders/${sliderSlug}/`
        
        if (projectId) {
          url += `?project_id=${projectId}`
        }
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch slider: ${response.status} ${response.statusText}`)
        }
        
        const sliderData: ApiSlider = await response.json()
        
        // Validate slider has active slides
        const activeSlides = sliderData.slides?.filter(slide => slide.is_active) || []
        if (activeSlides.length === 0) {
          throw new Error('No active slides found for this slider')
        }
        
        setSlider(sliderData)
      } catch (err) {
        console.error('Error fetching homepage slider:', err)
        setError(err instanceof Error ? err.message : 'Failed to load slider')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSlider()
  }, [sliderSlug, projectId])
  
  // Loading state
  if (loading) {
    return (
      <div className={`min-h-[600px] ${fallbackGradient} ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading slider...</p>
          </div>
        </div>
      </div>
    )
  }
  
  // Error state with fallback
  if (error || !slider) {
    return (
      <div className={`min-h-[600px] ${fallbackGradient} ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Website Development
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              We build modern, fast, and beautiful websites for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
              >
                Get Started
              </a>
              <a
                href="/portfolio"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                View Portfolio
              </a>
            </div>
            
            {/* Error message for developers */}
            {process.env.NODE_ENV === 'development' && error && (
              <div className="mt-8 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-4 max-w-lg mx-auto">
                <p className="text-sm text-red-100">
                  <strong>Dev Error:</strong> {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
  
  // Render the slider component
  return <HomepageSlider slider={slider} className={className} />
}