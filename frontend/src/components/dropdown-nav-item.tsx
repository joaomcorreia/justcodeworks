"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { NavItem } from "@/config/navigation";

type DropdownNavItemProps = {
  item: NavItem;
  withLocale: (href: string) => string;
};

export function DropdownNavItem({ item, withLocale }: DropdownNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Small delay to allow moving to dropdown
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (!hasChildren) {
    // Simple link
    return (
      <Link
        href={withLocale(item.href)}
        className="hover:text-yellow-400"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main item */}
      <button
        className="flex items-center gap-1 hover:text-yellow-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        {item.label}
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 pt-1 min-w-[200px]">
          <div className="rounded-lg border border-slate-700 bg-slate-900/95 backdrop-blur-sm shadow-xl">
            <div className="p-2">
              {item.children?.map((child) => (
                <Link
                  key={child.id}
                  href={withLocale(child.href)}
                  className="block rounded px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 hover:text-yellow-400"
                  onClick={() => setIsOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}