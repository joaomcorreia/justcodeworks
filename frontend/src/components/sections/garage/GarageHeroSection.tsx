interface GarageHeroSectionProps {
  fields: Record<string, string>;
}

export default function GarageHeroSection({ fields }: GarageHeroSectionProps) {
  const title = fields["title"] || "Oficina Auto Profissional";
  const subtitle = fields["subtitle"] || "Serviços de qualidade para o seu veículo";
  const description = fields["description"] || "";
  const cta_text = fields["cta_text"] || "Pedir Orçamento";
  const phone = fields["phone"] || "";
  const background_image = fields["background_image"] || "";

  return (
    <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
            Oficina Especializada
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent leading-tight">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        
        {description && (
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl">
            {cta_text}
          </button>
          {phone && (
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              📞 {phone}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}