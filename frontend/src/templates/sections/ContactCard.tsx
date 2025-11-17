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

export default function ContactCard({ section }: SectionProps) {
  // Extract field values with fallbacks
  const getFieldValue = (key: string, fallback: string = '') => {
    return section.fields?.find(f => f.key === key)?.value || fallback;
  };

  const heading = getFieldValue('heading', getFieldValue('title', getFieldValue('restaurant_name', 'Contact Us')));
  const phone = getFieldValue('phone', getFieldValue('phone_number', ''));
  const email = getFieldValue('email', getFieldValue('email_address', ''));
  const address = getFieldValue('address', '');
  
  // Handle garage-specific detailed hours format
  const hoursWeekdays = getFieldValue('hours_weekdays', '');
  const hoursWeekend = getFieldValue('hours_weekend', '');
  const hoursSaturday = getFieldValue('hours_saturday', '');
  const hoursSunday = getFieldValue('hours_sunday', '');
  
  let hours = '';
  if (hoursWeekdays) {
    hours = hoursWeekdays;
    if (hoursSaturday) hours += `\n${hoursSaturday}`;
    if (hoursSunday) hours += `\n${hoursSunday}`;
  } else if (hoursWeekend) {
    hours = `${hoursWeekdays}\n${hoursWeekend}`;
  } else {
    hours = getFieldValue('hours', getFieldValue('opening_hours', ''));
  }
    
  const description = getFieldValue('description', 'Get in touch with us for any questions or to schedule an appointment.');
  
  // Garage-specific fields
  const addressTitle = getFieldValue('address_title', 'Address');
  const phoneTitle = getFieldValue('phone_title', 'Phone');
  const emailTitle = getFieldValue('email_title', 'Email');
  const hoursTitle = getFieldValue('hours_title', 'Hours');

  return (
    <section className="py-16 jcw-bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {heading}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {phone && (
            <div className="text-center">
              <div className="jcw-bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{phoneTitle}</h3>
              <a href={`tel:${phone}`} className="text-white hover:opacity-80 transition-colors">
                {phone}
              </a>
            </div>
          )}

          {email && (
            <div className="text-center">
              <div className="jcw-bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{emailTitle}</h3>
              <a href={`mailto:${email}`} className="text-white hover:opacity-80 transition-colors">
                {email}
              </a>
            </div>
          )}

          {address && (
            <div className="text-center">
              <div className="jcw-bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{addressTitle}</h3>
              <p className="text-gray-300">
                {address}
              </p>
            </div>
          )}

          {hours && (
            <div className="text-center">
              <div className="jcw-bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{hoursTitle}</h3>
              <div className="text-gray-300 text-sm">
                {hours.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}