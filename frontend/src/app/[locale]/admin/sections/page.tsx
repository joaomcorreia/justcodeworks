'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDictionary } from '@/i18n/index';

// UI Components
import { 
  DocumentTextIcon, 
  PhotoIcon, 
  PlusIcon, 
  Cog6ToothIcon,
  RectangleGroupIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

interface SectionsPageProps {
  params: {
    locale: string;
  };
}

type TabType = 'sections' | 'sliders';

export default function SectionsPage({ params }: SectionsPageProps) {
  const [dictionary, setDictionary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('sections');

  useEffect(() => {
    getDictionary(params.locale).then(setDictionary);
  }, [params.locale]);

  if (!dictionary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const sectionTools = [
    {
      name: 'Create from Screenshot',
      description: 'Upload a screenshot and use AI to automatically generate website sections',
      href: `/${params.locale}/admin/sections/create-from-screenshot`,
      icon: PhotoIcon,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      badge: 'AI Powered',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Section Library',
      description: 'Browse and manage existing section templates and components',
      href: `/${params.locale}/admin/sections/library`,
      icon: DocumentTextIcon,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      badge: 'Coming Soon',
      badgeColor: 'bg-gray-100 text-gray-600'
    },
    {
      name: 'Create Manual Section',
      description: 'Manually create a new section with custom fields and content',
      href: `/${params.locale}/admin/sections/create-manual`,
      icon: PlusIcon,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      badge: 'Coming Soon',
      badgeColor: 'bg-gray-100 text-gray-600'
    },
    {
      name: 'Section Settings',
      description: 'Configure section rendering, templates, and global settings',
      href: `/${params.locale}/admin/sections/settings`,
      icon: Cog6ToothIcon,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      badge: 'Coming Soon',
      badgeColor: 'bg-gray-100 text-gray-600'
    }
  ];

  const sliderTools = [
    {
      name: 'Manage Hero Sliders',
      description: 'Configure homepage hero sliders with particle effects and custom gradients',
      href: `/${params.locale}/admin/sliders/homepage`,
      icon: RectangleGroupIcon,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      badge: 'New!',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      name: 'Testimonial Carousel',
      description: 'Create rotating testimonials and customer review carousels',
      href: `/${params.locale}/admin/sliders/create-testimonial`,
      icon: PlayIcon,
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600',
      badge: 'Coming Soon',
      badgeColor: 'bg-gray-100 text-gray-600'
    },
    {
      name: 'Product Gallery',
      description: 'Showcase products with interactive image galleries and sliders',
      href: `/${params.locale}/admin/sliders/create-gallery`,
      icon: PhotoIcon,
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-600',
      badge: 'Coming Soon',
      badgeColor: 'bg-gray-100 text-gray-600'
    },
    {
      name: 'Slider Settings',
      description: 'Configure slider animations, timing, and global behavior',
      href: `/${params.locale}/admin/sliders/settings`,
      icon: Cog6ToothIcon,
      color: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600',
      badge: 'Coming Soon',
      badgeColor: 'bg-gray-100 text-gray-600'
    }
  ];

  const tabs = [
    { id: 'sections' as TabType, name: 'Sections', icon: DocumentTextIcon },
    { id: 'sliders' as TabType, name: 'Sliders', icon: RectangleGroupIcon }
  ];

  const renderSectionsTab = () => (
    <>
      {/* Section Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {sectionTools.map((tool) => (
          <div key={tool.name} className="relative">
            <Link
              href={tool.href}
              className={`block p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                tool.href.includes('create-from-screenshot')
                  ? tool.color + ' hover:border-blue-300'
                  : tool.color + ' opacity-60 cursor-not-allowed'
              }`}
              onClick={!tool.href.includes('create-from-screenshot') ? (e) => e.preventDefault() : undefined}
            >
              {/* Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tool.badgeColor}`}>
                  {tool.badge}
                </div>
                <tool.icon className={`h-8 w-8 ${tool.iconColor}`} />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {tool.description}
                </p>
              </div>

              {/* Action indicator */}
              {tool.href.includes('create-from-screenshot') && (
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                  Get Started
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Section Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1</div>
            <div className="text-sm text-gray-600">Available Tools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">Sections Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-600">Templates Used</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600">Tools Coming Soon</div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Getting Started with Sections</h3>
        <p className="text-blue-700 mb-4">
          Sections are the building blocks of your website pages. Use our AI-powered screenshot uploader to quickly generate sections from existing designs.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/${params.locale}/admin/sections/create-from-screenshot`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PhotoIcon className="h-4 w-4 mr-2" />
            Try Screenshot Uploader
          </Link>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            📖 View Documentation
          </a>
        </div>
      </div>
    </>
  );

  const renderSlidersTab = () => (
    <>
      {/* Slider Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {sliderTools.map((tool) => (
          <div key={tool.name} className="relative">
            <Link
              href={tool.href}
              className={`block p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                tool.href.includes('homepage')
                  ? tool.color + ' hover:border-indigo-300'
                  : tool.color + ' opacity-60 cursor-not-allowed'
              }`}
              onClick={!tool.href.includes('homepage') ? (e) => e.preventDefault() : undefined}
            >
              {/* Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tool.badgeColor}`}>
                  {tool.badge}
                </div>
                <tool.icon className={`h-8 w-8 ${tool.iconColor}`} />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {tool.description}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Slider Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">0</div>
            <div className="text-sm text-gray-600">Hero Sliders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">0</div>
            <div className="text-sm text-gray-600">Testimonial Carousels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">0</div>
            <div className="text-sm text-gray-600">Product Galleries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">4</div>
            <div className="text-sm text-gray-600">Tools Coming Soon</div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-900 mb-2">🎬 Getting Started with Sliders</h3>
        <p className="text-indigo-700 mb-4">
          Sliders and carousels add dynamic, interactive elements to your websites. Create engaging hero sections, testimonial rotations, and product showcases.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            disabled
            className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
          >
            <RectangleGroupIcon className="h-4 w-4 mr-2" />
            Coming Soon
          </button>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            📖 View Slider Examples
          </a>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-2 text-gray-600">
            Create, manage, and organize website sections and sliders across all your projects.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sections' && renderSectionsTab()}
        {activeTab === 'sliders' && renderSlidersTab()}
      </div>
    </div>
  );
}