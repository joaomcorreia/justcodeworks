import { sectionRegistry } from "./sections/registry";

// Force recompile to pick up RestaurantFooterSection
interface SectionRendererProps {
  section: {
    identifier: string;
    fields?: Record<string, any>;
    [key: string]: any;
  };
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const Component = sectionRegistry[section.identifier];
  
  // Debug logging
  console.log('SectionRenderer:', section.identifier, 'Component found:', !!Component);
  console.log('Available registry keys:', Object.keys(sectionRegistry));

  if (!Component) {
    return (
      <div className="p-6 border bg-red-50 text-red-700">
        Missing component for section: <strong>{section.identifier}</strong>
        <br />
        <small>Available components: {Object.keys(sectionRegistry).join(', ')}</small>
      </div>
    );
  }

  return <Component section={section} />;
}