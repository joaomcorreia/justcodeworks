interface SectionProps {
  section: {
    identifier: string;
    internal_name?: string;
    fields?: Array<{
      key: string;
      value: string;
      label?: string;
    }>;
  };
}

export default function MenuList({ section }: SectionProps) {
  // Extract field values with fallbacks
  const getFieldValue = (key: string, fallback: string = '') => {
    return section.fields?.find(f => f.key === key)?.value || fallback;
  };

  const sectionTitle = section.internal_name || 'Menu Items';
  
  // Extract menu items dynamically
  const menuItems = [];
  let itemIndex = 1;
  
  while (true) {
    const name = getFieldValue(`item_${itemIndex}_name`);
    if (!name) break;
    
    const description = getFieldValue(`item_${itemIndex}_description`);
    const price = getFieldValue(`item_${itemIndex}_price`);
    
    menuItems.push({ name, description, price });
    itemIndex++;
  }

  return (
    <section className="py-16 bg-amber-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
        </div>
        
        {menuItems.length > 0 ? (
          <div className="space-y-6">
            {menuItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-amber-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.price && (
                    <div className="ml-4 flex-shrink-0">
                      <span className="text-2xl font-bold text-amber-600">
                        {item.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No menu items available</p>
          </div>
        )}
      </div>
    </section>
  );
}