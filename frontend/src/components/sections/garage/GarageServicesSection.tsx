interface GarageServicesSectionProps {
  fields: Record<string, string>;
}

export default function GarageServicesSection({ fields }: GarageServicesSectionProps) {
  const title = fields["title"] || "Nossos Serviços";
  const subtitle = fields["subtitle"] || "";
  
  const services = [
    {
      title: fields["service_1_title"] || "Serviço 1",
      description: fields["service_1_description"] || "",
      icon: "🔧"
    },
    {
      title: fields["service_2_title"] || "Serviço 2",
      description: fields["service_2_description"] || "",
      icon: "⚙️"
    },
    {
      title: fields["service_3_title"] || "Serviço 3",
      description: fields["service_3_description"] || "",
      icon: "🛠️"
    },
    {
      title: fields["service_4_title"] || "Serviço 4",
      description: fields["service_4_description"] || "",
      icon: "🔍"
    }
  ].filter(service => service.title !== "" && service.title.includes("Serviço") === false);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}