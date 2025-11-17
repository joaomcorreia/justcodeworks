interface SectionProps {
  section: {
    identifier: string;
    fields?: Array<{
      key: string;
      value: string;
      label?: string;
    }>;
  };
}

export default function TireTestimonialsPremium({ section }: SectionProps) {
  const getFieldValue = (key: string, fallback: string = '') => {
    return section.fields?.find(f => f.key === key)?.value || fallback;
  };

  const title = getFieldValue('title', 'What Our Customers Say');
  const subtitle = getFieldValue('subtitle', 'Don\'t just take our word for it - hear from our satisfied customers');

  const testimonials = [];
  for (let i = 1; i <= 3; i++) {
    const name = getFieldValue(`testimonial_${i}_name`);
    const review = getFieldValue(`testimonial_${i}_review`);
    const rating = getFieldValue(`testimonial_${i}_rating`, '5');
    
    if (name && review) {
      testimonials.push({
        name,
        review,
        rating: parseInt(rating)
      });
    }
  }

  // Default testimonials if none are provided
  if (testimonials.length === 0) {
    testimonials.push(
      {
        name: "Mike Rodriguez",
        review: "Outstanding service! Joe's team replaced all four tires on my truck in under an hour. The quality is top-notch and the prices are very reasonable. Highly recommend!",
        rating: 5
      },
      {
        name: "Sarah Chen", 
        review: "Best tire shop in town! They helped me choose the perfect tires for my daily commute and the difference in ride quality is amazing. Professional and friendly service.",
        rating: 5
      },
      {
        name: "David Johnson",
        review: "Been coming here for years and they never disappoint. Fast, reliable service with honest recommendations. Joe really knows his stuff when it comes to tires.",
        rating: 5
      }
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900/50 to-slate-800/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-white">
            {title}
          </h2>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <svg className="w-12 h-12 text-blue-400 opacity-60" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M10 8c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.157-.672 4.243-1.757L12 24h4l2.243-5.757C19.328 17.157 20.343 16 20.343 14c0-3.314-2.686-6-6-6H10z" />
                  <path d="M22 8c-3.314 0-6 2.686-6 6s2.686 6 6 6c1.657 0 3.157-.672 4.243-1.757L24 24h4l2.243-5.757C31.328 17.157 32.343 16 32.343 14c0-3.314-2.686-6-6-6H22z" />
                </svg>
              </div>

              {/* Review Text */}
              <blockquote className="text-gray-100 text-lg leading-relaxed mb-6">
                "{testimonial.review}"
              </blockquote>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Customer Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    Verified Customer
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-xl text-gray-100 mb-8">
            Ready to experience our premium service?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-400 hover:to-orange-400 rounded-xl shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
          >
            Schedule Your Service
            <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}