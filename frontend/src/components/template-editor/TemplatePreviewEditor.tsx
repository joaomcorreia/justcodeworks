"use client";

import { useState, useRef, useEffect } from "react";
import { PencilIcon, EyeIcon } from "@heroicons/react/24/outline";

// [TYPES] Component interfaces
interface TemplatePreviewEditorProps {
  template: AdminSiteTemplateDetail;
  previewContent: any;
  templateKey: string;
}

interface AdminSiteTemplateDetail {
  id: string;
  key: string;
  name: string;
  description?: string;
  sections: AdminTemplateSection[];
}

interface AdminTemplateSection {
  id: string;
  name: string;
  type: string;
  internal_name: string;
  code: string;
  section_type?: string;
  default_order: number;
  is_active: boolean;
}

interface SectionOverlay {
  id: string;
  rect: DOMRect;
  section: AdminTemplateSection;
}

// [MAIN] Template Preview Editor Component
export default function TemplatePreviewEditor({
  template,
  previewContent,
  templateKey
}: TemplatePreviewEditorProps) {
  const [isEditMode, setIsEditMode] = useState(true);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<AdminTemplateSection | null>(null);
  const [sectionOverlays, setSectionOverlays] = useState<SectionOverlay[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const previewFrameRef = useRef<HTMLIFrameElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  // [PREVIEW] Generate preview URL based on template
  const getPreviewUrl = (key: string): string => {
  const previewMapping: Record<string, string> = {
    "restaurant-modern": "/sites/marys-restaurant",
    "auto-garage-modern": "/sites/oficina-paulo-calibra", 
    // jcw-main has no sample site - it's the platform template
  };    return previewMapping[key] || "/";
  };

  // [OVERLAY] Detect sections in preview frame
  const detectSections = () => {
    if (!previewFrameRef.current?.contentDocument || !isEditMode) return;

    const frameDoc = previewFrameRef.current.contentDocument;
    const frameRect = previewFrameRef.current.getBoundingClientRect();
    
    // Find all elements that might be sections
    const sectionElements = frameDoc.querySelectorAll('[data-section], section, .section, [class*="section-"]');
    const overlays: SectionOverlay[] = [];

    sectionElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      
      // Adjust coordinates relative to the iframe container
      const adjustedRect = new DOMRect(
        rect.left + frameRect.left,
        rect.top + frameRect.top,
        rect.width,
        rect.height
      );

      // Try to match with template sections
      const sectionId = element.getAttribute('data-section') || 
                       element.getAttribute('id') || 
                       `section-${index}`;
      
      // Find matching template section or create a generic one
      const matchingSection = template.sections.find(s => 
        s.internal_name === sectionId || 
        s.type.toLowerCase() === element.className.toLowerCase() ||
        s.name.toLowerCase().includes(element.tagName.toLowerCase())
      ) || {
        id: sectionId,
        name: `Section ${index + 1}`,
        type: element.tagName.toLowerCase(),
        internal_name: sectionId,
        code: '',
        default_order: index,
        is_active: true
      };

      overlays.push({
        id: sectionId,
        rect: adjustedRect,
        section: matchingSection
      });
    });

    setSectionOverlays(overlays);
  };

  // [EVENTS] Handle iframe load and resize
  useEffect(() => {
    const handleIframeLoad = () => {
      setTimeout(detectSections, 1000); // Wait for content to fully render
    };

    const handleResize = () => {
      if (isEditMode) {
        setTimeout(detectSections, 100);
      }
    };

    const iframe = previewFrameRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isEditMode, template.sections]);

  // [INTERACTION] Handle section hover and click
  const handleSectionHover = (sectionId: string | null) => {
    setHoveredSection(sectionId);
  };

  const handleSectionClick = (section: AdminTemplateSection) => {
    setSelectedSection(section);
    setIsEditModalOpen(true);
  };

  // [RENDER] Section overlays with hover effects and edit buttons
  const renderSectionOverlays = () => {
    if (!isEditMode) return null;

    return sectionOverlays.map((overlay) => {
      const isHovered = hoveredSection === overlay.id;
      const isSelected = selectedSection?.id === overlay.section.id;
      
      return (
        <div
          key={overlay.id}
          className={`absolute border-2 transition-all duration-200 pointer-events-auto ${
            isHovered || isSelected
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-transparent hover:border-blue-300'
          }`}
          style={{
            left: overlay.rect.left,
            top: overlay.rect.top,
            width: overlay.rect.width,
            height: overlay.rect.height,
            zIndex: 1000,
          }}
          onMouseEnter={() => handleSectionHover(overlay.id)}
          onMouseLeave={() => handleSectionHover(null)}
          onClick={() => handleSectionClick(overlay.section)}
        >
          {/* [UI] Section label and edit button */}
          {(isHovered || isSelected) && (
            <div className="absolute -top-8 left-0 flex items-center space-x-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
              <span>{overlay.section.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSectionClick(overlay.section);
                }}
                className="p-1 hover:bg-blue-700 rounded"
              >
                <PencilIcon className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="relative h-screen flex flex-col">
      {/* [UI] Preview container */}
      <div className="flex-1 relative overflow-hidden">
        {/* [IFRAME] Website preview */}
        <iframe
          ref={previewFrameRef}
          src={getPreviewUrl(templateKey)}
          className="w-full h-full border-0"
          title={`Preview of ${template.name}`}
        />
        
        {/* [OVERLAY] Section editing overlays */}
        {isEditMode && (
          <div
            ref={overlayContainerRef}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 999 }}
          >
            {renderSectionOverlays()}
          </div>
        )}
      </div>

      {/* [MODAL] Section Edit Modal */}
      {isEditModalOpen && selectedSection && (
        <SectionEditModal
          section={selectedSection}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedSection(null);
          }}
          onSave={(updatedSection) => {
            // TODO: Implement save functionality
            console.log('Saving section:', updatedSection);
            setIsEditModalOpen(false);
            setSelectedSection(null);
          }}
        />
      )}

      {/* [UI] Edit mode indicator */}
      {isEditMode && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 z-50">
          <EyeIcon className="w-4 h-4" />
          <span>Edit Mode Active</span>
        </div>
      )}
    </div>
  );
}

// [COMPONENT] Section Edit Modal
interface SectionEditModalProps {
  section: AdminTemplateSection;
  onClose: () => void;
  onSave: (section: AdminTemplateSection) => void;
}

function SectionEditModal({ section, onClose, onSave }: SectionEditModalProps) {
  const [editedSection, setEditedSection] = useState(section);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Edit Section: {section.name}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Name
            </label>
            <input
              type="text"
              value={editedSection.name}
              onChange={(e) => setEditedSection({...editedSection, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Type
            </label>
            <select
              value={editedSection.type}
              onChange={(e) => setEditedSection({...editedSection, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hero">Hero</option>
              <option value="features">Features</option>
              <option value="testimonials">Testimonials</option>
              <option value="contact">Contact</option>
              <option value="about">About</option>
              <option value="gallery">Gallery</option>
              <option value="menu">Menu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Active
            </label>
            <input
              type="checkbox"
              checked={editedSection.is_active}
              onChange={(e) => setEditedSection({...editedSection, is_active: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedSection)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}