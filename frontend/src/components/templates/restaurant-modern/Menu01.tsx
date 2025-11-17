// [RMOD]
"use client";

import type { SectionJson } from "@/lib/types/sitePublic";

type Props = {
  section: SectionJson;
  mode?: "public" | "preview";
};

export function RestaurantMenu01({ section, mode = "public" }: Props) {
  // Extract menu items from fields
  const getMenuItem = (index: number) => {
    const name = section.fields.find(f => f.key === `item_${index}_name`)?.value;
    const description = section.fields.find(f => f.key === `item_${index}_description`)?.value;
    const price = section.fields.find(f => f.key === `item_${index}_price`)?.value;
    
    if (!name) return null;
    return { name, description: description ?? "", price: price ?? "" };
  };

  // Get up to 6 items
  const menuItems = [1, 2, 3, 4, 5, 6]
    .map(getMenuItem)
    .filter(Boolean);

  const categoryTitle = section.internal_name || "Menu Items";
  
  // Use different backgrounds for different menu sections
  const isAppetizers = section.identifier === "appetizers";
  const bgClass = isAppetizers ? "bg-white" : "bg-slate-50";
  
  // Add menu anchor ID for the first menu section (appetizers)
  const sectionId = isAppetizers ? "menu" : undefined;

  return (
    <section id={sectionId} className={`py-16 ${bgClass}`}>
      <div className="mx-auto max-w-4xl px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold jcw-text-primary md:text-4xl mb-4">
            {categoryTitle}
          </h2>
          <div className="w-20 h-1 jcw-bg-accent mx-auto"></div>
        </div>

        {/* Menu Items Grid */}
        <div className="space-y-6">
          {menuItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                
                {/* Item Info */}
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold jcw-text-primary mb-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                {item.price && (
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <span className="text-xl sm:text-2xl font-bold jcw-text-accent">
                      {item.price}
                    </span>
                  </div>
                )}
                
              </div>
              
              {/* Decorative line */}
              <div className="mt-4 border-b border-dotted border-slate-200"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {menuItems.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-slate-600 mb-6">
              Freshly prepared daily with authentic Italian ingredients
            </p>
            <a 
              href="/reservations" 
              className="inline-flex items-center gap-2 rounded-lg jcw-bg-accent px-6 py-3 font-semibold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 jcw-border-accent focus:ring-offset-2"
            >
              Make a Reservation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        )}

      </div>
    </section>
  );
}