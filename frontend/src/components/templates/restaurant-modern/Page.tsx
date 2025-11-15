// [RMOD]
import { useState } from "react";
import type { SiteProjectPublic } from "@/lib/types/sitePublic";
import { renderRestaurantModernSection } from "./registry";

// [CONTENT]
type Props = {
  project: SiteProjectPublic;
  mode?: "public" | "preview" | "dashboard";
  currentPageSlug?: string;
  onNavigatePage?: (slug: string) => void;
};

export function RestaurantModernPage({ project, mode = "public", currentPageSlug, onNavigatePage }: Props) {
  // [RESPONSIVE] Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // [RMOD] Get sections based on mode and current page
  const pages = project.pages || [];
  const homePage = pages.find((p) => p.slug === "home");
  const menuPage = pages.find((p) => p.slug === "menu");
  const contactPage = pages.find((p) => p.slug === "contact");

  // Both public and dashboard modes now render ALL sections like the live site
  // This ensures the dashboard preview matches exactly what users see on /sites/[slug]
  const allSections = [
    ...(homePage?.sections || []),
    ...(menuPage?.sections || []),
    ...(contactPage?.sections || []),
  ];
  // Sort sections within each page by order
  const sortedSections = allSections.sort((a, b) => a.order - b.order);

  // Render navigation based on mode
  const renderNavigation = () => {
    if (mode === "public") {
      // Public mode: anchor links for smooth scrolling
      return (
        <>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:gap-6 text-sm text-slate-600">
            <a href="#hero" className="hover:text-slate-900 transition-colors">Home</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
            <a href="#menu" className="hover:text-slate-900 transition-colors">Menu</a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-6 h-6 space-y-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`w-4 h-0.5 bg-slate-600 transition-transform ${
              isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}></span>
            <span className={`w-4 h-0.5 bg-slate-600 transition-opacity ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}></span>
            <span className={`w-4 h-0.5 bg-slate-600 transition-transform ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}></span>
          </button>
        </>
      );
    } else {
      // Dashboard mode: clickable buttons for page selection
      return (
        <>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:gap-6 text-sm text-slate-600">
            <button 
              onClick={() => onNavigatePage?.("home")}
              className={`hover:text-slate-900 transition-colors ${currentPageSlug === "home" ? "text-slate-900 font-semibold" : ""}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigatePage?.("menu")}
              className={`hover:text-slate-900 transition-colors ${currentPageSlug === "menu" ? "text-slate-900 font-semibold" : ""}`}
            >
              Menu
            </button>
            <button 
              onClick={() => onNavigatePage?.("contact")}
              className={`hover:text-slate-900 transition-colors ${currentPageSlug === "contact" ? "text-slate-900 font-semibold" : ""}`}
            >
              Contact
            </button>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-6 h-6 space-y-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`w-4 h-0.5 bg-slate-600 transition-transform ${
              isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}></span>
            <span className={`w-4 h-0.5 bg-slate-600 transition-opacity ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}></span>
            <span className={`w-4 h-0.5 bg-slate-600 transition-transform ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}></span>
          </button>
        </>
      );
    }
  };

  const renderMobileNavigation = () => {
    if (mode === "public") {
      // Public mode: anchor links
      return (
        <nav className="flex flex-col px-4 sm:px-6 py-4 space-y-3">
          <a 
            href="#hero" 
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </a>
          <a 
            href="#about" 
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>
          <a 
            href="#menu" 
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Menu
          </a>
          <a 
            href="#contact" 
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>
        </nav>
      );
    } else {
      // Dashboard mode: clickable buttons
      return (
        <nav className="flex flex-col px-4 sm:px-6 py-4 space-y-3">
          <button 
            onClick={() => {
              onNavigatePage?.("home");
              setIsMobileMenuOpen(false);
            }}
            className={`text-sm text-slate-600 hover:text-slate-900 transition-colors py-2 text-left ${currentPageSlug === "home" ? "text-slate-900 font-semibold" : ""}`}
          >
            Home
          </button>
          <button 
            onClick={() => {
              onNavigatePage?.("menu");
              setIsMobileMenuOpen(false);
            }}
            className={`text-sm text-slate-600 hover:text-slate-900 transition-colors py-2 text-left ${currentPageSlug === "menu" ? "text-slate-900 font-semibold" : ""}`}
          >
            Menu
          </button>
          <button 
            onClick={() => {
              onNavigatePage?.("contact");
              setIsMobileMenuOpen(false);
            }}
            className={`text-sm text-slate-600 hover:text-slate-900 transition-colors py-2 text-left ${currentPageSlug === "contact" ? "text-slate-900 font-semibold" : ""}`}
          >
            Contact
          </button>
        </nav>
      );
    }
  };

  // Both public and dashboard modes now render ALL sections (same as live site)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* [RESPONSIVE] Mobile-friendly header with hamburger menu */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-4">
          <span className="text-lg font-semibold text-slate-900">{project.name}</span>
          
          {renderNavigation()}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            {renderMobileNavigation()}
          </div>
        )}
      </header>

      <main>
        {sortedSections.map((section, idx) => (
          <div key={`${section.identifier}-${idx}`}>
            {renderRestaurantModernSection(section, mode === "dashboard" ? "preview" : mode)}
          </div>
        ))}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center">
          <p className="text-sm text-slate-500">
            © 2025 {project.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}