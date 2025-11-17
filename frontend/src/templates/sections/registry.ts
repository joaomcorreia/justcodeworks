import HeroBasic from "./HeroBasic";
import AboutBasic from "./AboutBasic";
import ServicesGrid from "./ServicesGrid";
import ContactCard from "./ContactCard";
import TestimonialsBasic from "./TestimonialsBasic";
import MenuList from "./MenuList";
import QuoteForm from "./QuoteForm";
import AutoDiagnostics from "./AutoDiagnostics";
import WhyChooseUs from "./WhyChooseUs";
import TireHeroPremium from "./TireHeroPremium";
import TireServicesPremium from "./TireServicesPremium";
import TireContactPremium from "./TireContactPremium";
import TireTestimonialsPremium from "./TireTestimonialsPremium";
import RestaurantFooterSection from "./RestaurantFooterSection";
import LocationCard from "./LocationCard";

export const sectionRegistry: Record<string, React.ComponentType<any>> = {
  // Primary identifiers (new system)
  "hero-basic": HeroBasic,
  "about-basic": AboutBasic,
  "services-grid": ServicesGrid,
  "contact-card": ContactCard,
  "testimonials-basic": TestimonialsBasic,
  "menu-list": MenuList,
  "garage-quote-form": QuoteForm,
  "auto-diagnostics": AutoDiagnostics,
  
  // Legacy identifiers (existing Django data)
  // Restaurant template identifiers
  "hero-banner": HeroBasic,
  "about-us": AboutBasic,
  "restaurant-footer": ContactCard,
  "appetizers": MenuList,
  "main-courses": MenuList,
  "contact-info": ContactCard,
  
  // Just Code Works site identifiers
  "hero-section": HeroBasic,
  "services-section": ServicesGrid,
  "about-section": AboutBasic,
  "contact-section": ContactCard,
  
  // Auto garage template identifiers  
  "jcw-auto-garage-modern-01-hero-01": HeroBasic,
  "jcw-auto-garage-modern-01-services-01": ServicesGrid,
  "jcw-auto-garage-modern-01-diagnostics-01": AutoDiagnostics,
  "jcw-auto-garage-modern-01-testimonials-01": TestimonialsBasic,
  "jcw-auto-garage-modern-01-form-quote-01": QuoteForm,
  "jcw-auto-garage-modern-01-contact-01": ContactCard,
  "jcw-auto-garage-modern-01-why-choose-01": WhyChooseUs,
  
  // Tire Center Premium template mappings
  "jcw-tire-center-premium-01-hero-01": TireHeroPremium,
  "jcw-tire-center-premium-01-services-01": TireServicesPremium,
  "jcw-tire-center-premium-01-testimonials-01": TireTestimonialsPremium,
  "jcw-tire-center-premium-01-contact-01": TireContactPremium,
  
  // AI-Generated section identifiers (dynamic patterns)
  "ai-metadata": () => null, // Metadata section (invisible)
  "ai-hero-1": HeroBasic,
  "ai-hero-2": HeroBasic,
  "ai-services-2": ServicesGrid,
  "ai-services-3": ServicesGrid,
  "ai-services-4": ServicesGrid,
  "ai-services-5": ServicesGrid,
  "ai-services-6": ServicesGrid,
  "ai-services-7": ServicesGrid,
  "ai-header-1": HeroBasic, // Use hero for header sections
  "ai-location_card-3": LocationCard, // Use location card for location sections
  "ai-location_card-4": LocationCard,
  "ai-location_card-5": LocationCard,
  "ai-location_card-6": LocationCard,
};