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

export default function RestaurantFooterSection({ section }: SectionProps) {
  // Extract field values with fallbacks
  const getFieldValue = (key: string, fallback: string = '') => {
    return section.fields?.find(f => f.key === key)?.value || fallback;
  };

  const restaurantName = getFieldValue('restaurant_name', 'Restaurant');
  const address = getFieldValue('address', '');
  const phone = getFieldValue('phone', '');
  const email = getFieldValue('email', '');
  const hoursWeekdays = getFieldValue('hours_weekdays', '');
  const hoursWeekend = getFieldValue('hours_weekend', '');
  const socialFacebook = getFieldValue('social_facebook', '');
  const socialInstagram = getFieldValue('social_instagram', '');
  const menuLink = getFieldValue('menu_link', '#menu');
  const reservationsLink = getFieldValue('reservations_link', '#reservations');
  const aboutLink = getFieldValue('about_link', '#about');
  const copyrightText = getFieldValue('copyright_text', '');

  return (
    <footer className="jcw-bg-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Restaurant Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{restaurantName}</h3>
            {address && (
              <div className="mb-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 jcw-text-accent mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-300 text-sm leading-relaxed">{address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            {phone && (
              <div className="mb-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 jcw-text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${phone}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {phone}
                  </a>
                </div>
              </div>
            )}
            {email && (
              <div className="mb-3">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 jcw-text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${email}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {email}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <div className="space-y-1">
              {hoursWeekdays && (
                <p className="text-gray-300 text-sm">{hoursWeekdays}</p>
              )}
              {hoursWeekend && (
                <p className="text-gray-300 text-sm">{hoursWeekend}</p>
              )}
            </div>
          </div>

          {/* Quick Links & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 mb-6">
              <a href={menuLink} className="block text-gray-300 hover:text-white transition-colors text-sm">
                Menu
              </a>
              <a href={aboutLink} className="block text-gray-300 hover:text-white transition-colors text-sm">
                About Us
              </a>
              <a href={reservationsLink} className="block text-gray-300 hover:text-white transition-colors text-sm">
                Reservations
              </a>
            </div>

            {/* Social Media */}
            {(socialFacebook || socialInstagram) && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-3">
                  {socialFacebook && (
                    <a
                      href={socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jcw-text-accent hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  )}
                  {socialInstagram && (
                    <a
                      href={socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jcw-text-accent hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM15.629 18.036c-.76.76-1.724 1.181-2.77 1.181s-2.01-.421-2.77-1.181c-.76-.76-1.181-1.724-1.181-2.77s.421-2.01 1.181-2.77c.76-.76 1.724-1.181 2.77-1.181s2.01.421 2.77 1.181c.76.76 1.181 1.724 1.181 2.77s-.421 2.01-1.181 2.77zm3.473-4.423c-.096-.633-.264-1.195-.504-1.686-.313-.641-.754-1.172-1.314-1.583-.631-.519-1.365-.851-2.188-1.015-.633-.126-1.195-.126-1.686-.126s-1.053 0-1.686.126c-.823.164-1.557.496-2.188 1.015-.560.411-1.001.942-1.314 1.583-.240.491-.408 1.053-.504 1.686-.096.633-.096 1.195-.096 1.686s0 1.053.096 1.686c.096.633.264 1.195.504 1.686.313.641.754 1.172 1.314 1.583.631.519 1.365.851 2.188 1.015.633.126 1.195.126 1.686.126s1.053 0 1.686-.126c.823-.164 1.557-.496 2.188-1.015.560-.411 1.001-.942 1.314-1.583.240-.491.408-1.053.504-1.686.096-.633.096-1.195.096-1.686s0-1.053-.096-1.686zm-3.473 0c0 1.297-.49 2.448-1.293 3.323C13.619 17.653 12.717 18 11.69 18s-1.929-.347-2.646-1.064C8.241 16.119 7.751 14.968 7.751 13.671s.49-2.448 1.293-3.323C9.761 9.631 10.663 9.284 11.69 9.284s1.929.347 2.646 1.064c.803.875 1.293 2.026 1.293 3.323z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        {copyrightText && (
          <div className="border-t border-gray-600 mt-8 pt-6">
            <p className="text-center text-gray-400 text-sm">{copyrightText}</p>
          </div>
        )}
      </div>
    </footer>
  );
}