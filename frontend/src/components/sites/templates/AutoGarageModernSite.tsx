// [TEMPLAB] Auto Garage Modern Site Template Component
"use client";

import { useState } from "react";
import type { SiteProjectPublic } from "@/lib/types/sitePublic";

// Import garage section components
import GarageHeroSection from "@/components/sections/garage/GarageHeroSection";
import GarageServicesSection from "@/components/sections/garage/GarageServicesSection";
import GarageDiagnosticsSection from "@/components/sections/garage/GarageDiagnosticsSection";
import GarageTestimonialsSection from "@/components/sections/garage/GarageTestimonialsSection";
import GarageContactSection from "@/components/sections/garage/GarageContactSection";
import GarageQuoteFormSection from "@/components/sections/garage/GarageQuoteFormSection";

type Props = {
  project: SiteProjectPublic;
};

export default function AutoGarageModernSite({ project }: Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const siteName = project.name ?? "Oficina Automóvel";
  
  // Get all sections from all pages and sort by order
  const pages = project.pages || [];
  const homePage = pages.find((p) => p.slug === "home");
  const orcamentoPage = pages.find((p) => p.slug === "orcamento");
  const contactoPage = pages.find((p) => p.slug === "contacto");
  
  const allSections = [
    ...(homePage?.sections || []),
    ...(orcamentoPage?.sections || []),
    ...(contactoPage?.sections || []),
  ];
  
  const sortedSections = allSections.sort((a, b) => a.order - b.order);
  
  // Helper to get field value from section
  const getField = (section: any, fieldName: string): string => {
    const field = section.fields?.find((f: any) => f.name === fieldName);
    return field?.value || "";
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔧</span>
              </div>
              <span className="font-bold text-xl text-slate-900">{siteName}</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#hero" className="text-slate-700 hover:text-orange-600 transition-colors">Início</a>
              <a href="#servicos" className="text-slate-700 hover:text-orange-600 transition-colors">Serviços</a>
              <a href="#diagnostico" className="text-slate-700 hover:text-orange-600 transition-colors">Diagnóstico</a>
              <a href="#testemunhos" className="text-slate-700 hover:text-orange-600 transition-colors">Testemunhos</a>
              <a href="#contacto" className="text-slate-700 hover:text-orange-600 transition-colors">Contacto</a>
              <a 
                href="#orcamento" 
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Pedir Orçamento
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center">
                <span className={`block h-0.5 bg-slate-700 transform transition ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`} />
                <span className={`block h-0.5 bg-slate-700 transition ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`block h-0.5 bg-slate-700 transform transition ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`} />
              </div>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-slate-200">
              <div className="flex flex-col gap-4 text-sm font-medium">
                <a href="#hero" className="text-slate-700 hover:text-orange-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Início</a>
                <a href="#servicos" className="text-slate-700 hover:text-orange-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Serviços</a>
                <a href="#diagnostico" className="text-slate-700 hover:text-orange-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Diagnóstico</a>
                <a href="#testemunhos" className="text-slate-700 hover:text-orange-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Testemunhos</a>
                <a href="#contacto" className="text-slate-700 hover:text-orange-600 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contacto</a>
                <a 
                  href="#orcamento" 
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pedir Orçamento
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {sortedSections.map((section, index) => {
          // Convert section fields to a simple key-value object for components
          const fields: Record<string, string> = {};
          section.fields?.forEach((field: any) => {
            fields[field.name || field.key] = field.value || field.content || "";
          });
          
          // Map template section codes to components
          switch (section.identifier) {
            case "jcw-auto-garage-modern-01-hero-01":
              return (
                <div key={index} id="hero">
                  <GarageHeroSection fields={fields} />
                </div>
              );

            case "jcw-auto-garage-modern-01-services-01":
              return (
                <div key={index} id="servicos">
                  <GarageServicesSection fields={fields} />
                </div>
              );

            case "jcw-auto-garage-modern-01-diagnostics-01":
              return (
                <div key={index} id="diagnostico">
                  <GarageDiagnosticsSection fields={fields} />
                </div>
              );

            case "jcw-auto-garage-modern-01-testimonials-01":
              return (
                <div key={index} id="testemunhos">
                  <GarageTestimonialsSection fields={fields} />
                </div>
              );

            case "jcw-auto-garage-modern-01-form-quote-01":
              return (
                <div key={index} id="orcamento">
                  <GarageQuoteFormSection fields={fields} siteSlug={project.slug} />
                </div>
              );

            case "jcw-auto-garage-modern-01-contact-01":
              return (
                <div key={index} id="contacto">
                  <GarageContactSection fields={fields} />
                </div>
              );

            default:
              return null;
          }
        })}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <span className="text-white font-bold">🔧</span>
              </div>
              <span className="font-bold text-lg">{siteName}</span>
            </div>
            <p className="text-slate-400 text-sm">
              © 2024 {siteName}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper function to generate section IDs
function getSectionId(templateSectionCode: string): string {
  const codeMap: Record<string, string> = {
    "jcw-auto-garage-modern-01-hero-01": "hero",
    "jcw-auto-garage-modern-01-services-01": "servicos",
    "jcw-auto-garage-modern-01-diagnostics-01": "diagnostico",
    "jcw-auto-garage-modern-01-testimonials-01": "testemunhos", 
    "jcw-auto-garage-modern-01-form-quote-01": "orcamento",
    "jcw-auto-garage-modern-01-contact-01": "contacto",
  };
  
  return codeMap[templateSectionCode] || "section";
}