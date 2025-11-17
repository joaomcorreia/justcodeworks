interface SectionProps {
  section: {
    identifier: string;
    fields?: Array<{
      key: string;
      value: string;
      label?: string;
    }>;
  };
}

export default function HeroBasic({ section }: SectionProps) {
  // Extract field values with fallbacks
  const getFieldValue = (key: string, fallback: string = '') => {
    return section.fields?.find(f => f.key === key)?.value || fallback;
  };

  const headline = getFieldValue('headline', getFieldValue('title', 'Welcome to Our Business'));
  const subheadline = getFieldValue('subheadline', getFieldValue('subtitle', 'Quality service you can trust.'));
  const ctaText = getFieldValue('cta_text', getFieldValue('button_text', 'Learn More'));
  const ctaLink = getFieldValue('cta_link', getFieldValue('button_link', '#services'));
  const backgroundImage = getFieldValue('background_image', '');

  return (
    <section className="relative min-h-[500px] jcw-bg-gradient flex items-center justify-center overflow-hidden">
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-6 text-4xl font-bold jcw-text-primary md:text-5xl lg:text-6xl">
          {headline}
        </h1>
        <p className="mb-8 text-lg jcw-text-secondary md:text-xl lg:max-w-2xl lg:mx-auto">
          {subheadline}
        </p>
        <a
          href={ctaLink}
          className="inline-flex items-center gap-2 rounded-lg jcw-bg-accent px-6 py-3 text-lg font-semibold text-white transition-all hover:opacity-90 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          {ctaText}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 jcw-bg-accent opacity-20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 jcw-bg-primary opacity-20 rounded-full blur-xl"></div>
    </section>
  );
}