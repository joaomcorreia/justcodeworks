// [RMOD]
"use client";

import type { SectionJson } from "@/lib/types/sitePublic";

type Props = {
  section: SectionJson;
  mode?: "public" | "preview";
};

export function RestaurantAbout01({ section, mode = "public" }: Props) {
  const title = section.fields.find(f => f.key === "title")?.value ?? "About Us";
  const content = section.fields.find(f => f.key === "content")?.value ?? "Our story...";
  const image = section.fields.find(f => f.key === "image")?.value ?? "";

  return (
    <section id="about" className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
              {title}
            </h2>
            <div className="w-20 h-1 bg-amber-600"></div>
            <p className="text-lg text-slate-700 leading-relaxed">
              {content}
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-sm font-semibold text-amber-700">
                  M
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-200 border-2 border-white flex items-center justify-center text-sm font-semibold text-orange-700">
                  G
                </div>
              </div>
              <span className="text-sm text-slate-600">Family owned since 1985</span>
            </div>
          </div>

          {/* Image Placeholder */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center overflow-hidden">
              {image ? (
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-amber-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-600">Restaurant Photo</p>
                </div>
              )}
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-600 rounded-xl -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
}