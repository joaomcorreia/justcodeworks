"use client"

import React, { useEffect, useRef } from 'react'

interface ParticleConfig {
  density: number
  speed: number
  sizeMin: number
  sizeMax: number
  color: string
  colors?: string[] // Array of colors for multi-color mode
  multiColor?: boolean
  opacity: number
}

interface ParticleSystemProps {
  config: ParticleConfig
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string // Individual particle color
}

export default function ParticleSystem({ config, className = '' }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const configRef = useRef(config)
  
  // Update config ref when config changes (without recreating particles)
  useEffect(() => {
    configRef.current = config
  }, [config])
  
  // Initialize canvas and particles only once
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size to cover full container
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (!parent) return
      
      const parentRect = parent.getBoundingClientRect()
      const width = parentRect.width
      const height = Math.max(parentRect.height, window.innerHeight)
      
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Initialize particles only once
    const initParticles = () => {
      const particles: Particle[] = []
      const parent = canvas.parentElement
      if (!parent) return
      
      const parentRect = parent.getBoundingClientRect()
      const width = parentRect.width
      const height = Math.max(parentRect.height, window.innerHeight)
      
      for (let i = 0; i < configRef.current.density; i++) {
        // Choose color for this particle
        let particleColor = configRef.current.color
        if (configRef.current.multiColor && configRef.current.colors && configRef.current.colors.length > 0) {
          particleColor = configRef.current.colors[Math.floor(Math.random() * configRef.current.colors.length)]
        }
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * configRef.current.speed * 0.5,
          vy: (Math.random() - 0.5) * configRef.current.speed * 0.5,
          size: configRef.current.sizeMin + Math.random() * (configRef.current.sizeMax - configRef.current.sizeMin),
          opacity: configRef.current.opacity * (0.5 + Math.random() * 0.5),
          color: particleColor
        })
      }
      
      particlesRef.current = particles
    }
    
    initParticles()
    
    // Animation loop
    const animate = () => {
      const parent = canvas.parentElement
      if (!parent) return
      
      const parentRect = parent.getBoundingClientRect()
      const width = parentRect.width
      const height = Math.max(parentRect.height, window.innerHeight)
      
      ctx.clearRect(0, 0, width, height)
      
      // Update and draw particles using current config
      particlesRef.current.forEach(particle => {
        // Update position using current speed from config
        particle.x += particle.vx * (configRef.current.speed / (configRef.current.speed || 1))
        particle.y += particle.vy * (configRef.current.speed / (configRef.current.speed || 1))
        
        // Wrap around screen edges
        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0
        
        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity * (configRef.current.opacity / (configRef.current.opacity || 1))
        ctx.fillStyle = particle.color // Use individual particle color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })
      
      // Draw connections between nearby particles
      const maxDistance = 100
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.2
            ctx.save()
            ctx.globalAlpha = opacity * configRef.current.opacity
            // Use a blend of the two particle colors for connections, or default color
            ctx.strokeStyle = particle.color
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, []) // Empty dependency array - only runs once
  
  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1, minHeight: '100vh' }}
    />
  )
}