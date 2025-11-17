"use client";

import { useEffect, useRef } from 'react';

interface SectionDetectorProps {
  onSectionsDetected: (sections: DetectedSection[]) => void;
  isActive: boolean;
}

interface DetectedSection {
  id: string;
  element: HTMLElement;
  rect: DOMRect;
  type: string;
  name: string;
}

export default function SectionDetector({ onSectionsDetected, isActive }: SectionDetectorProps) {
  const observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    const detectSections = () => {
      const sections: DetectedSection[] = [];
      
      // Common section selectors
      const sectionSelectors = [
        'section',
        '.section',
        '[data-section]',
        '.hero',
        '.features',
        '.testimonials',
        '.contact',
        '.about',
        '.gallery',
        '.menu',
        'header',
        'main > div',
        '.container > div',
        '[class*="section-"]',
        '[id*="section-"]'
      ];

      sectionSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
          const htmlElement = element as HTMLElement;
          const rect = htmlElement.getBoundingClientRect();
          
          // Only include visible elements with significant size
          if (rect.width > 100 && rect.height > 50 && rect.top < window.innerHeight) {
            const sectionId = 
              htmlElement.getAttribute('data-section') ||
              htmlElement.getAttribute('id') ||
              htmlElement.className.split(' ').find(cls => cls.includes('section'))?.replace(/[^a-zA-Z0-9-]/g, '') ||
              `section-${selector.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;

            const sectionType = 
              htmlElement.tagName.toLowerCase() === 'header' ? 'header' :
              htmlElement.classList.contains('hero') || htmlElement.getAttribute('data-section') === 'hero' ? 'hero' :
              htmlElement.classList.contains('features') ? 'features' :
              htmlElement.classList.contains('testimonials') ? 'testimonials' :
              htmlElement.classList.contains('contact') ? 'contact' :
              htmlElement.classList.contains('about') ? 'about' :
              htmlElement.classList.contains('gallery') ? 'gallery' :
              htmlElement.classList.contains('menu') ? 'menu' :
              'section';

            const sectionName = 
              htmlElement.getAttribute('data-section-name') ||
              htmlElement.getAttribute('aria-label') ||
              htmlElement.querySelector('h1, h2, h3')?.textContent?.slice(0, 30) ||
              `${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} Section`;

            sections.push({
              id: sectionId,
              element: htmlElement,
              rect,
              type: sectionType,
              name: sectionName
            });
          }
        });
      });

      // Remove duplicates and sort by position
      const uniqueSections = sections
        .filter((section, index, self) => 
          index === self.findIndex(s => s.id === section.id)
        )
        .sort((a, b) => a.rect.top - b.rect.top);

      onSectionsDetected(uniqueSections);
    };

    // Initial detection
    detectSections();

    // Watch for DOM changes
    observerRef.current = new MutationObserver(() => {
      setTimeout(detectSections, 100);
    });

    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-section', 'id']
    });

    // Watch for scroll and resize
    const handleScrollResize = () => {
      setTimeout(detectSections, 50);
    };

    window.addEventListener('scroll', handleScrollResize);
    window.addEventListener('resize', handleScrollResize);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('scroll', handleScrollResize);
      window.removeEventListener('resize', handleScrollResize);
    };
  }, [isActive, onSectionsDetected]);

  return null; // This component doesn't render anything
}