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

export default function ServicesGrid({ section }: SectionProps) {
  // Extract field values with fallbacks
  const getFieldValue = (key: string, fallback: string = '') => {
    return section.fields?.find(f => f.key === key)?.value || fallback;
  };

  const title = getFieldValue('title', 'Our Services');
  const subtitle = getFieldValue('subtitle', 'Quality services you can trust');
  
  // Extract service items dynamically
  const services = [];
  let serviceIndex = 1;
  
  while (true) {
    const serviceTitle = getFieldValue(`service_${serviceIndex}_title`);
    if (!serviceTitle) break;
    
    const description = getFieldValue(`service_${serviceIndex}_description`);
    
    services.push({ title: serviceTitle, description });
    serviceIndex++;
  }

  return (
    <section className="py-16 jcw-bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold jcw-text-primary mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl jcw-text-secondary max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 jcw-border-secondary border hover:jcw-border-primary">
                <div className="flex items-center justify-center w-12 h-12 jcw-bg-accent bg-opacity-20 rounded-lg mb-4">
                  <svg className="w-6 h-6 jcw-text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold jcw-text-primary mb-3">
                  {service.title}
                </h3>
                <p className="jcw-text-secondary text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-9a1 1 0 011-1h2a1 1 0 011 1v9m-4 0V8a1 1 0 011-1h2a1 1 0 011 1v13m-4 0H7" />
              </svg>
            </div>
            <p className="jcw-text-secondary">No services available</p>
          </div>
        )}
      </div>
    </section>
  );
}