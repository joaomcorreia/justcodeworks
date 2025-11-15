// [RMOD]
"use client";

import type { SectionJson } from "@/lib/types/sitePublic";

type Props = {
  section: SectionJson;
  mode?: "public" | "preview";
};

export function RestaurantGallery01({ section, mode = "public" }: Props) {
  const galleryImages = [
    { alt: "Restaurant Interior", placeholder: "Interior" },
    { alt: "Signature Dish", placeholder: "Dishes" },
    { alt: "Kitchen", placeholder: "Kitchen" },
    { alt: "Outdoor Seating", placeholder: "Seating" },
    { alt: "Wine Selection", placeholder: "Wine" },
    { alt: "Fresh Ingredients", placeholder: "Ingredients" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl mb-4">Gallery</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Take a glimpse into our restaurant and atmosphere
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="aspect-square bg-gradient-to-br from-amber-100 to-orange-200 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer group"
            >
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {image.placeholder}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-sm text-slate-500 italic">
            Image gallery coming soon - experience our restaurant in person!
          </p>
        </div>
      </div>
    </section>
  );
}