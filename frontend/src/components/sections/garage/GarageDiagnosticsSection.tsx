interface GarageDiagnosticsSectionProps {
  fields: Record<string, string>;
}

export default function GarageDiagnosticsSection({ fields }: GarageDiagnosticsSectionProps) {
  const title = fields["title"] || "Diagnóstico Eletrónico";
  const description = fields["description"] || "";
  const image = fields["image"] || "";
  
  const features = [
    fields["feature_1"] || "",
    fields["feature_2"] || "", 
    fields["feature_3"] || ""
  ].filter(feature => feature !== "");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Tecnologia Avançada
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {title}
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {description}
            </p>
            
            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-orange-600 text-sm font-bold">✓</span>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            {image ? (
              <img 
                src={image} 
                alt={title}
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl w-full h-80 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-semibold">Diagnóstico Preciso</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}