'use client';

// [JCW] Homepage slider management interface with particle effect controls
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  PlayIcon, 
  PauseIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface HomepageSliderManagementProps {
  params: {
    locale: string;
  };
}

interface Slider {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  auto_play: boolean;
  auto_play_interval: number;
  particles_enabled: boolean;
  particles_density: number;
  particles_speed: number;
  particles_size_min?: number;
  particles_size_max?: number;
  particles_color?: string;
  particles_colors?: string;
  particles_multi_color?: boolean;
  particles_opacity?: number;
  gradient_from: string;
  gradient_to: string;
  slides_count: number;
  created_at: string;
}

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  primary_cta_text?: string;
  order: number;
  is_active: boolean;
  animation_type: string;
}

export default function HomepageSliderManagement({ params }: HomepageSliderManagementProps) {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showParticleModal, setShowParticleModal] = useState(false);
  const [particleConfig, setParticleConfig] = useState({
    particles_enabled: true,
    particles_density: 120,
    particles_speed: 1.2,
    particles_size_min: 2,
    particles_size_max: 4,
    particles_color: '#ffffff',
    particles_colors: '[]', // JSON array of additional colors
    particles_multi_color: false,
    particles_opacity: 0.3
  });
  
  // Fetch sliders on load
  useEffect(() => {
    fetchSliders();
  }, []);
  
  // Fetch slides when slider is selected
  useEffect(() => {
    if (selectedSlider) {
      fetchSlides(selectedSlider.id);
      // Update particle config when slider changes
      setParticleConfig({
        particles_enabled: selectedSlider.particles_enabled,
        particles_density: selectedSlider.particles_density,
        particles_speed: selectedSlider.particles_speed,
        particles_size_min: selectedSlider.particles_size_min || 2,
        particles_size_max: selectedSlider.particles_size_max || 4,
        particles_color: selectedSlider.particles_color || '#ffffff',
        particles_colors: selectedSlider.particles_colors || '[]',
        particles_multi_color: selectedSlider.particles_multi_color || false,
        particles_opacity: selectedSlider.particles_opacity || 0.3
      });
    }
  }, [selectedSlider]);
  
  const fetchSliders = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${baseUrl}/homepage-sliders/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sliders');
      }
      
      const data = await response.json();
      setSliders(data);
      
      // Auto-select first slider
      if (data.length > 0 && !selectedSlider) {
        setSelectedSlider(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sliders');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchSlides = async (sliderId: number) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${baseUrl}/homepage-slides/?slider_id=${sliderId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch slides');
      }
      
      const data = await response.json();
      setSlides(data);
    } catch (err) {
      console.error('Error fetching slides:', err);
    }
  };
  
  const toggleSliderActive = async (slider: Slider) => {
    // TODO: Implement API call to toggle slider active state
    console.log('Toggle slider active:', slider.slug, !slider.is_active);
  };
  
  const toggleSlideActive = async (slide: Slide) => {
    // TODO: Implement API call to toggle slide active state  
    console.log('Toggle slide active:', slide.id, !slide.is_active);
  };

  const saveParticleSettings = async (config: typeof particleConfig) => {
    if (!selectedSlider) return;
    
    try {
      console.log('Saving particle config:', config);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
      const response = await fetch(`${baseUrl}/homepage-sliders/${selectedSlider.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to save particle settings: ${response.status} ${response.statusText}`);
      }

      const updatedSlider = await response.json();
      console.log('Updated slider received:', updatedSlider);
      
      // Update local state
      setSliders(sliders.map(s => s.id === selectedSlider.id ? { ...s, ...updatedSlider } : s));
      setSelectedSlider({ ...selectedSlider, ...updatedSlider });
      
      alert('Particle settings saved successfully!');
    } catch (err) {
      console.error('Error saving particle settings:', err);
      alert(`Failed to save particle settings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleParticleChange = (key: string, value: any) => {
    setParticleConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sliders...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href={`/${params.locale}/admin/sections`}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Sections
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2 text-indigo-600" />
                Homepage Slider Management
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href="/"
                target="_blank"
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview Live
              </Link>
              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Slider
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sliders List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Homepage Sliders</h2>
                <p className="text-sm text-gray-600">Manage your hero sliders</p>
              </div>
              
              <div className="divide-y">
                {sliders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No sliders found</p>
                    <button className="mt-2 text-indigo-600 hover:text-indigo-800">
                      Create your first slider
                    </button>
                  </div>
                ) : (
                  sliders.map((slider) => (
                    <div
                      key={slider.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedSlider?.id === slider.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''
                      }`}
                      onClick={() => setSelectedSlider(slider)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{slider.name}</h3>
                        <div className="flex items-center space-x-2">
                          {slider.particles_enabled && (
                            <SparklesIcon className="h-4 w-4 text-indigo-500" title="Particles enabled" />
                          )}
                          {slider.auto_play ? (
                            <PlayIcon className="h-4 w-4 text-green-500" title="Auto-play enabled" />
                          ) : (
                            <PauseIcon className="h-4 w-4 text-gray-400" title="Auto-play disabled" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{slider.slides_count} slides</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: slider.gradient_from }}
                            title={`Gradient: ${slider.gradient_from} → ${slider.gradient_to}`}
                          />
                          <div 
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: slider.gradient_to }}
                          />
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            slider.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {slider.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Selected Slider Details */}
          <div className="lg:col-span-2">
            {selectedSlider ? (
              <div className="space-y-6">
                {/* Slider Settings Card */}
                <div className="bg-white rounded-lg shadow border">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{selectedSlider.name}</h2>
                        <p className="text-sm text-gray-600">Slug: {selectedSlider.slug}</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => toggleSliderActive(selectedSlider)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedSlider.is_active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {selectedSlider.is_active ? 'Active' : 'Inactive'}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedSlider.slides_count}</div>
                        <div className="text-sm text-gray-600">Slides</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">
                          {selectedSlider.particles_enabled ? selectedSlider.particles_density : '0'}
                        </div>
                        <div className="text-sm text-gray-600">Particles</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedSlider.auto_play ? `${selectedSlider.auto_play_interval / 1000}s` : 'Off'}
                        </div>
                        <div className="text-sm text-gray-600">Auto Play</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-center space-x-1 mb-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: selectedSlider.gradient_from }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: selectedSlider.gradient_to }}
                          />
                        </div>
                        <div className="text-sm text-gray-600">Gradient</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <button 
                        onClick={() => setShowSettingsModal(true)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                        Configure Settings
                      </button>
                      <button 
                        onClick={() => setShowParticleModal(true)}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Particle Effects
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Slides Management */}
                <div className="bg-white rounded-lg shadow border">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Slides</h3>
                      <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Slide
                      </button>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {slides.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <div className="text-4xl mb-4">📄</div>
                        <p>No slides in this slider</p>
                        <button className="mt-2 text-indigo-600 hover:text-indigo-800">
                          Add your first slide
                        </button>
                      </div>
                    ) : (
                      slides.map((slide) => (
                        <div key={slide.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-500">#{slide.order}</span>
                                <h4 className="font-medium text-gray-900">{slide.title}</h4>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  slide.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {slide.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              
                              {slide.subtitle && (
                                <p className="text-sm text-gray-600 mt-1">{slide.subtitle}</p>
                              )}
                              
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Animation: {slide.animation_type}</span>
                                {slide.primary_cta_text && (
                                  <span>CTA: {slide.primary_cta_text}</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => toggleSlideActive(slide)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                              >
                                {slide.is_active ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border p-8 text-center text-gray-500">
                <SparklesIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Select a slider to manage</p>
                <p>Choose a slider from the list to view and edit its settings and slides.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Particle Effects Modal */}
      {showParticleModal && selectedSlider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Particle Effects Settings</h3>
                <button 
                  onClick={() => setShowParticleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* Enable/Disable Particles */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={particleConfig.particles_enabled}
                      onChange={(e) => handleParticleChange('particles_enabled', e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">Enable Particle Effects</span>
                  </label>
                </div>

                {particleConfig.particles_enabled && (
                  <>
                    {/* Particle Density */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Particle Density: {particleConfig.particles_density}
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="300"
                        value={particleConfig.particles_density}
                        onChange={(e) => handleParticleChange('particles_density', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>20 (Light)</span>
                        <span>300 (Dense)</span>
                      </div>
                    </div>

                    {/* Particle Speed */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Particle Speed: {particleConfig.particles_speed}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="3.0"
                        step="0.1"
                        value={particleConfig.particles_speed}
                        onChange={(e) => handleParticleChange('particles_speed', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.1 (Slow)</span>
                        <span>3.0 (Fast)</span>
                      </div>
                    </div>

                    {/* Particle Size Min */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Particle Size: {particleConfig.particles_size_min}px
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={particleConfig.particles_size_min}
                        onChange={(e) => handleParticleChange('particles_size_min', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Particle Size Max */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Particle Size: {particleConfig.particles_size_max}px
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="20"
                        value={particleConfig.particles_size_max}
                        onChange={(e) => handleParticleChange('particles_size_max', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* Multi-Color Toggle */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={particleConfig.particles_multi_color}
                          onChange={(e) => handleParticleChange('particles_multi_color', e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">Multi-Color Particles</span>
                      </label>
                    </div>

                    {/* Particle Colors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {particleConfig.particles_multi_color ? 'Particle Colors' : 'Particle Color'}
                      </label>
                      
                      {!particleConfig.particles_multi_color ? (
                        /* Single Color Mode */
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={particleConfig.particles_color}
                            onChange={(e) => handleParticleChange('particles_color', e.target.value)}
                            className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={particleConfig.particles_color}
                            onChange={(e) => handleParticleChange('particles_color', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      ) : (
                        /* Multi-Color Mode */
                        <div className="space-y-3">
                          {(() => {
                            const colors = particleConfig.particles_colors ? 
                              JSON.parse(particleConfig.particles_colors) : ['#3b82f6'];
                            return colors.map((color: string, index: number) => (
                              <div key={index} className="flex items-center space-x-3">
                                <input
                                  type="color"
                                  value={color}
                                  onChange={(e) => {
                                    const newColors = [...colors];
                                    newColors[index] = e.target.value;
                                    handleParticleChange('particles_colors', JSON.stringify(newColors));
                                  }}
                                  className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={color}
                                  onChange={(e) => {
                                    const newColors = [...colors];
                                    newColors[index] = e.target.value;
                                    handleParticleChange('particles_colors', JSON.stringify(newColors));
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {colors.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newColors = colors.filter((_: string, i: number) => i !== index);
                                      handleParticleChange('particles_colors', JSON.stringify(newColors));
                                    }}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Remove color"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ));
                          })()}
                          
                          <button
                            type="button"
                            onClick={() => {
                              const colors = particleConfig.particles_colors ? 
                                JSON.parse(particleConfig.particles_colors) : ['#3b82f6'];
                              const newColors = [...colors, '#ff0000'];
                              handleParticleChange('particles_colors', JSON.stringify(newColors));
                            }}
                            className="flex items-center justify-center space-x-2 w-full py-2 px-3 text-sm text-indigo-600 hover:text-indigo-800 rounded-lg border border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                          >
                            <PlusIcon className="h-4 w-4" />
                            <span>Add Color</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Particle Opacity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Particle Opacity: {Math.round(particleConfig.particles_opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={particleConfig.particles_opacity}
                        onChange={(e) => handleParticleChange('particles_opacity', parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10% (Subtle)</span>
                        <span>100% (Opaque)</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowParticleModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveParticleSettings(particleConfig);
                  setShowParticleModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal (Placeholder) */}
      {showSettingsModal && selectedSlider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Slider Settings</h3>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slider Name
                  </label>
                  <input
                    type="text"
                    value={selectedSlider.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSlider.auto_play}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      readOnly
                    />
                    <span className="ml-2 text-sm font-medium text-gray-900">Auto Play</span>
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Full slider configuration coming soon. For now, use the Particle Effects button to customize animations.
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}