"use client";

import { useState, useRef, useEffect } from 'react';

// [TEMPLAB] Template card preview with auto-scroll functionality
interface TemplatePreviewScrollerProps {
  previewImageUrl?: string;
  templateName: string;
  className?: string;
}

export default function TemplatePreviewScroller({ 
  previewImageUrl, 
  templateName,
  className = ""
}: TemplatePreviewScrollerProps) {
  const [isActive, setIsActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // [TEMPLAB] Auto-scroll animation logic
  const startScrollAnimation = () => {
    if (!containerRef.current || !imageRef.current || isAnimating) return;

    const container = containerRef.current;
    const image = imageRef.current;
    
    // Wait for image to load
    if (!image.complete) {
      image.onload = startScrollAnimation;
      return;
    }

    const containerHeight = container.clientHeight;
    const imageHeight = image.scrollHeight || image.naturalHeight;
    const maxScroll = Math.max(0, imageHeight - containerHeight);

    if (maxScroll <= 0) return; // No scrolling needed

    setIsAnimating(true);
    const startTime = performance.now();
    const duration = 6000; // 6 seconds for full scroll

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeInOut = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentScroll = maxScroll * easeInOut;
      container.scrollTop = currentScroll;

      if (progress < 1 && isActive) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // [TEMPLAB] Reset scroll to top
  const resetScroll = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);

    if (!containerRef.current) return;

    const container = containerRef.current;
    const startScroll = container.scrollTop;
    
    if (startScroll === 0) return;

    const startTime = performance.now();
    const duration = 500; // 0.5 seconds to return to top

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      container.scrollTop = startScroll * (1 - easeOut);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  // [TEMPLAB] Handle mouse enter/leave and focus/blur
  const handleActivate = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsActive(true);
    // Small delay to ensure state is set
    timeoutRef.current = setTimeout(startScrollAnimation, 100);
  };

  const handleDeactivate = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsActive(false);
    resetScroll();
  };

  // [TEMPLAB] Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // [TEMPLAB] Reset animation when active state changes
  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setIsAnimating(false);
    }
  }, [isActive]);

  // [TEMPLAB] Placeholder for missing screenshots
  if (!previewImageUrl) {
    return (
      <div className={`relative overflow-hidden rounded-t-2xl bg-slate-50 ${className}`}>
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-[20px] text-slate-400 mx-auto mb-2">
              🖼
            </div>
            <p className="text-xs text-slate-500">Preview coming soon</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-t-2xl bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      tabIndex={0}
      onMouseEnter={handleActivate}
      onMouseLeave={handleDeactivate}
      onFocus={handleActivate}
      onBlur={handleDeactivate}
      role="img"
      aria-label={`Preview of ${templateName} template`}
    >
      <img
        ref={imageRef}
        src={previewImageUrl}
        alt={`${templateName} template preview`}
        className="w-full h-auto block min-h-full object-top"
        style={{
          maxHeight: 'none', // Allow full height for scrolling
          objectFit: 'cover',
          objectPosition: 'top'
        }}
        onError={(e) => {
          // [TEMPLAB] Fallback if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="flex h-full w-full items-center justify-center">
                <div class="text-center">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-[20px] text-slate-400 mx-auto mb-2">
                    🖼
                  </div>
                  <p class="text-xs text-slate-500">Preview unavailable</p>
                </div>
              </div>
            `;
          }
        }}
      />
      
      {/* [TEMPLAB] Loading overlay during animation */}
      {isAnimating && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Scrolling...
        </div>
      )}
    </div>
  );
}