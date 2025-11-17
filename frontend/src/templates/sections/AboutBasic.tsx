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

export default function AboutBasic({ section }: SectionProps) {
  // Extract field values with fallbacks
  const getFieldValue = (key: string, fallback: string = '') => {
    return section.fields?.find(f => f.key === key)?.value || fallback;
  };

  const heading = getFieldValue('title', 'About Us');
  const description = getFieldValue('content', 'Learn more about our story, values, and commitment to excellence.');
  const image = getFieldValue('image', '');
  const features = getFieldValue('features', '').split('\n').filter(f => f.trim());

  return (
    <section className="py-16 jcw-bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold jcw-text-primary mb-6">
              {heading}
            </h2>
            <p className="text-lg jcw-text-secondary mb-6 leading-relaxed">
              {description}
            </p>
            
            {features.length > 0 && (
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center jcw-text-secondary">
                    <svg className="w-5 h-5 jcw-text-accent mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature.trim()}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Image */}
          <div className="lg:pl-8">
            {image ? (
              <img 
                src={image} 
                alt={heading}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-64 lg:h-80 jcw-bg-secondary bg-opacity-20 rounded-lg flex items-center justify-center">
                <div className="text-center jcw-text-secondary">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">About Image</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}