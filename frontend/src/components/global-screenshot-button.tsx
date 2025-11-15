'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ScreenshotCaptureButton } from '@/components/screenshot-capture-button';

export function GlobalScreenshotButton() {
  const pathname = usePathname();

  // Don't show on builder/templates-lab routes or certain admin pages
  const shouldHide = 
    pathname.includes('/builder') || 
    pathname.includes('/templates-lab') ||
    pathname.includes('/admin');

  if (shouldHide) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden md:block">
      <div className="group relative">
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="whitespace-nowrap rounded-2xl bg-slate-800 dark:bg-slate-200 px-3 py-2 text-xs text-white dark:text-slate-800 shadow-lg">
            Something off on this page?
            <div className="absolute top-full right-2 h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800 dark:border-t-slate-200"></div>
          </div>
        </div>

        {/* Screenshot Button */}
        <ScreenshotCaptureButton
          text="Report"
          size="sm"
          className="shadow-lg hover:shadow-xl transition-shadow duration-200"
        />
      </div>
    </div>
  );
}