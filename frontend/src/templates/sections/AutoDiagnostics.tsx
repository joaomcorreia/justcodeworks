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

export default function AutoDiagnostics({ section }: SectionProps) {
  // Extract field values with fallbacks
  const getFieldValue = (key: string, fallback: string = '') => {
    return section.fields?.find(f => f.key === key)?.value || fallback;
  };

  const title = getFieldValue('title', 'Diagnostic Services');
  const description = getFieldValue('description', 'Professional automotive diagnostics using advanced equipment.');
  const image = getFieldValue('image', '');
  
  // Extract features dynamically
  const features = [];
  let featureIndex = 1;
  
  while (true) {
    const feature = getFieldValue(`feature_${featureIndex}`);
    if (!feature) break;
    
    features.push(feature);
    featureIndex++;
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>
            
            {features.length > 0 && (
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-all hover:bg-blue-700 hover:scale-105"
              >
                Schedule Diagnostic
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Image */}
          <div className="lg:pl-8">
            {image ? (
              <img 
                src={image} 
                alt={title}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-64 lg:h-80 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-blue-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">Diagnostic Equipment</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}