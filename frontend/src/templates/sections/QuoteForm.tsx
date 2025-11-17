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

export default function QuoteForm({ section }: SectionProps) {
  // Extract field values with fallbacks
  const getFieldValue = (key: string, fallback: string = '') => {
    return section.fields?.find(f => f.key === key)?.value || fallback;
  };

  const title = getFieldValue('title', 'Request a Quote');
  const subtitle = getFieldValue('subtitle', 'Fill out the form and we will contact you soon.');
  const nameLabel = getFieldValue('form_name_label', 'Full Name');
  const emailLabel = getFieldValue('form_email_label', 'Email');
  const phoneLabel = getFieldValue('form_phone_label', 'Phone');
  const licensePlateLabel = getFieldValue('form_license_plate_label', 'License Plate');
  const vehicleLabel = getFieldValue('form_vehicle_label', 'Vehicle Make and Model');
  const serviceLabel = getFieldValue('form_service_label', 'Service Type');
  const messageLabel = getFieldValue('form_message_label', 'Description of service needed');
  const submitText = getFieldValue('form_submit_text', 'Send Request');
  const privacyText = getFieldValue('privacy_text', 'Your data will be handled confidentially.');
  
  // Parse service options if available
  const serviceOptions = getFieldValue('form_service_options', '').split('|').filter(option => option.trim());

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600">
            {subtitle}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-8">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {nameLabel}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={nameLabel}
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {emailLabel}
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={emailLabel}
                />
              </div>
              
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {phoneLabel}
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={phoneLabel}
                />
              </div>
              
              {/* License Plate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {licensePlateLabel}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={licensePlateLabel}
                />
              </div>
            </div>
            
            {/* Vehicle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {vehicleLabel}
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={vehicleLabel}
              />
            </div>
            
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {serviceLabel}
              </label>
              {serviceOptions.length > 0 ? (
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Selecione um serviço</option>
                  {serviceOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={serviceLabel}
                />
              )}
            </div>
            
            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {messageLabel}
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={messageLabel}
              />
            </div>
            
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {submitText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* Privacy Notice */}
            {privacyText && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  {privacyText}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}