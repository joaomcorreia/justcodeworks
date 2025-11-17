"use client"

// [JCW] Homepage slider with particle effects and customizable backgrounds
import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import ParticleSystem from './ParticleSystem'

interface HomepageSlide {
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
}

interface HomepageSlider {
  id: number
  name: string
  slug: string
  is_active: boolean
  auto_play: boolean
  auto_play_interval: number
  show_navigation: boolean
  show_pagination: boolean
  
  // Particle Effects
  particles_enabled: boolean
  particles_density: number
  particles_speed: number
  particles_size_min: number
  particles_size_max: number
  particles_color: string
  particles_colors?: string
  particles_multi_color?: boolean
  particles_opacity: number
  
  // Background
  background_type: 'gradient' | 'image' | 'video'
  gradient_from: string
  gradient_to: string
  gradient_direction: string
  background_image?: string
  background_video?: string
  background_overlay_opacity: number
  
  slides: HomepageSlide[]
}

interface HomepageSliderComponentProps {
  slider: HomepageSlider
  className?: string
}

export default function HomepageSliderComponent({ slider, className = '' }: HomepageSliderComponentProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(slider.auto_play)
  const intervalRef = useRef<NodeJS.Timeout>()
  
  const activeSlides = slider.slides.filter(slide => slide.is_active).sort((a, b) => a.order - b.order)
  
  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && activeSlides.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % activeSlides.length)
      }, slider.auto_play_interval)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, activeSlides.length, slider.auto_play_interval])
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsPlaying(false) // Pause auto-play when user manually navigates
  }
  
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % activeSlides.length)
    setIsPlaying(false)
  }
  
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + activeSlides.length) % activeSlides.length)  
    setIsPlaying(false)
  }
  
  if (activeSlides.length === 0) {
    return (
      <div className="min-h-[600px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No active slides available</p>
      </div>
    )
  }
  
  const currentSlideData = activeSlides[currentSlide]
  
  // Generate background style based on slider settings
  const getBackgroundStyle = () => {
    switch (slider.background_type) {
      case 'gradient':
        return {
          background: `linear-gradient(${slider.gradient_direction}, ${slider.gradient_from}, ${slider.gradient_to})`
        }
      case 'image':
        return {
          backgroundImage: slider.background_image ? `url(${slider.background_image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      case 'video':
        return {} // Video handled separately
      default:
        return {
          background: `linear-gradient(${slider.gradient_direction}, ${slider.gradient_from}, ${slider.gradient_to})`
        }
    }
  }
  
  // Text alignment classes
  const getTextAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case 'left': return 'text-left'
      case 'right': return 'text-right'
      default: return 'text-center'
    }
  }
  
  // Animation classes for slide transitions
  const getSlideAnimationClasses = (slideIndex: number) => {
    const isActive = slideIndex === currentSlide
    const animationType = currentSlideData.animation_type
    
    let baseClasses = 'absolute inset-0 transition-all duration-1000 ease-in-out'
    
    if (animationType === 'fade') {
      baseClasses += isActive ? ' opacity-100' : ' opacity-0'
    } else if (animationType === 'slide') {
      baseClasses += isActive ? ' transform translate-x-0' : ' transform translate-x-full'
    } else if (animationType === 'zoom') {
      baseClasses += isActive ? ' transform scale-100 opacity-100' : ' transform scale-110 opacity-0'
    }
    
    return baseClasses
  }
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ minHeight: className.includes('h-screen') ? '100vh' : '600px' }}>
      {/* Background Layer */}
      <div
        className="absolute inset-0"
        style={getBackgroundStyle()}
      >
        {/* Background Video (if applicable) */}
        {slider.background_type === 'video' && slider.background_video && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={slider.background_video}
            autoPlay
            loop
            muted
            playsInline
          />
        )}
        
        {/* Background Overlay */}
        {(slider.background_type === 'image' || slider.background_type === 'video') && (
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: slider.background_overlay_opacity }}
          />
        )}
      </div>
      
      {/* Particle Effects Layer */}
      {slider.particles_enabled && (
        <ParticleSystem
          config={{
            density: slider.particles_density,
            speed: slider.particles_speed,
            sizeMin: slider.particles_size_min,
            sizeMax: slider.particles_size_max,
            color: slider.particles_color,
            colors: slider.particles_colors ? JSON.parse(slider.particles_colors) : undefined,
            multiColor: slider.particles_multi_color || false,
            opacity: slider.particles_opacity
          }}
          className="z-10"
        />
      )}
      
      {/* Slides Container */}
      <div className="relative z-20 h-full">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={getSlideAnimationClasses(index)}
          >
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className={`w-full ${getTextAlignmentClasses(slide.text_alignment)}`}>
                {/* Slide Image */}
                {slide.slide_image && (
                  <div className="mb-8 flex justify-center">
                    <img
                      src={slide.slide_image}
                      alt={slide.title}
                      className="max-w-md h-auto rounded-lg shadow-lg"
                    />
                  </div>
                )}
                
                {/* Slide Content */}
                <div className="max-w-4xl mx-auto">
                  {/* Subtitle */}
                  {slide.subtitle && (
                    <p 
                      className="text-lg md:text-xl mb-4 opacity-90"
                      style={{ color: slide.text_color }}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  
                  {/* Title */}
                  <h1 
                    className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                    style={{ color: slide.text_color }}
                  >
                    {slide.title}
                  </h1>
                  
                  {/* Content */}
                  {slide.content && (
                    <p 
                      className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto"
                      style={{ color: slide.text_color }}
                    >
                      {slide.content}
                    </p>
                  )}
                  
                  {/* CTA Buttons */}
                  {(slide.primary_cta_text || slide.secondary_cta_text) && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      {slide.primary_cta_text && slide.primary_cta_url && (
                        <a
                          href={slide.primary_cta_url}
                          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                        >
                          {slide.primary_cta_text}
                        </a>
                      )}
                      
                      {slide.secondary_cta_text && slide.secondary_cta_url && (
                        <a
                          href={slide.secondary_cta_url}
                          className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
                        >
                          {slide.secondary_cta_text}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Arrows */}
      {slider.show_navigation && activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}
      
      {/* Pagination Dots */}
      {slider.show_pagination && activeSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}