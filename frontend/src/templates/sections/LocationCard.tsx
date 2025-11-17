import React from 'react';

interface LocationCardProps {
  section: {
    identifier: string;
    fields?: Record<string, any>;
    [key: string]: any;
  };
}

export default function LocationCard({ section }: LocationCardProps) {
  const { fields } = section;
  
  if (!fields) {
    return (
      <div className="p-6 bg-gray-50 border">
        <p>No location data available</p>
      </div>
    );
  }

  const title = fields.title || fields.name || 'Location';
  const content = fields.content || fields.description || '';
  const image = fields.image || fields.image_url;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {image && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        {content && (
          <p className="text-gray-600 leading-relaxed">
            {content}
          </p>
        )}
      </div>
    </div>
  );
}