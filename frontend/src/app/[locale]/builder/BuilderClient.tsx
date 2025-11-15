'use client';

import React from 'react';
import { Locale } from '@/i18n';

interface BuilderClientProps {
  dict: any;
  locale: Locale;
  user?: any;
  initialTemplateId?: string;
}

export const BuilderClient: React.FC<BuilderClientProps> = ({
  dict,
  locale,
  user,
  initialTemplateId,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            {dict.builder?.title || 'Website Builder'}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {dict.builder?.description || 'Create beautiful websites with our drag-and-drop builder.'}
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-500">
              Builder interface coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};