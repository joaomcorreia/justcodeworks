interface GarageContactSectionProps {
  fields: Record<string, string>;
}

export default function GarageContactSection({ fields }: GarageContactSectionProps) {
  const title = fields["title"] || "Contactos";
  const address = fields["address"] || "";
  const phone = fields["phone"] || "";
  const email = fields["email"] || "";
  const hours = fields["hours"] || "";
  const map_embed = fields["map_embed"] || "";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600">
            Entre em contacto connosco
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {address && (
              <div className="flex items-start">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-orange-600 text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Morada</h3>
                  <p className="text-gray-600">{address}</p>
                </div>
              </div>
            )}
            
            {phone && (
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-blue-600 text-xl">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Telefone</h3>
                  <p className="text-gray-600">{phone}</p>
                </div>
              </div>
            )}
            
            {email && (
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-green-600 text-xl">✉️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-600">{email}</p>
                </div>
              </div>
            )}
            
            {hours && (
              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <span className="text-purple-600 text-xl">🕒</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Horário</h3>
                  <div className="text-gray-600 whitespace-pre-line">{hours}</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
            {map_embed ? (
              <div dangerouslySetInnerHTML={{ __html: map_embed }} className="w-full h-full rounded-2xl" />
            ) : (
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">🗺️</div>
                <p>Mapa em breve</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}