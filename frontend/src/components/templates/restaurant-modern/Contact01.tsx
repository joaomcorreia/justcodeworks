// [RMOD]
"use client";

import type { SectionJson } from "@/lib/types/sitePublic";

type Props = {
  section: SectionJson;
  mode?: "public" | "preview";
};

export function RestaurantContact01({ section, mode = "public" }: Props) {
  const address = section.fields.find(f => f.key === "address")?.value ?? "123 Restaurant Street";
  const phone = section.fields.find(f => f.key === "phone")?.value ?? "(555) 123-4567";
  const email = section.fields.find(f => f.key === "email")?.value ?? "info@restaurant.com";
  const hoursMF = section.fields.find(f => f.key === "hours_mon_fri")?.value ?? "Mon-Fri: 11AM-9PM";
  const hoursWeekend = section.fields.find(f => f.key === "hours_weekend")?.value ?? "Sat-Sun: 10AM-10PM";

  return (
    <section id="contact" className="py-16 bg-slate-50">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Contact & Hours</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
            <p className="text-slate-600 mb-2">{address}</p>
            <p className="text-slate-600 mb-2">{phone}</p>
            <p className="text-slate-600">{email}</p>
          </div>
          <div className="bg-white rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-4">Hours</h3>
            <p className="text-slate-600 mb-2">{hoursMF}</p>
            <p className="text-slate-600">{hoursWeekend}</p>
          </div>
        </div>
      </div>
    </section>
  );
}