interface GarageTestimonialsSectionProps {
  fields: Record<string, string>;
}

export default function GarageTestimonialsSection({ fields }: GarageTestimonialsSectionProps) {
  const title = fields["title"] || "Testemunhos";
  
  const testimonials = [
    {
      text: fields["testimonial_1_text"] || "",
      author: fields["testimonial_1_author"] || "",
      service: fields["testimonial_1_service"] || ""
    },
    {
      text: fields["testimonial_2_text"] || "", 
      author: fields["testimonial_2_author"] || "",
      service: fields["testimonial_2_service"] || ""
    },
    {
      text: fields["testimonial_3_text"] || "",
      author: fields["testimonial_3_author"] || "", 
      service: fields["testimonial_3_service"] || ""
    }
  ].filter(testimonial => testimonial.text !== "");

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-400">
            O que dizem os nossos clientes satisfeitos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="mb-6">
                <div className="flex text-orange-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <h4 className="font-semibold text-white mb-1">
                  {testimonial.author}
                </h4>
                <p className="text-sm text-gray-400">
                  {testimonial.service}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}