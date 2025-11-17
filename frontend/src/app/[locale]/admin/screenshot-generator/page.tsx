import ScreenshotUploader from '@/components/admin/ScreenshotUploader';

interface PageProps {
  params: {
    locale: string;
  };
}

export default function ScreenshotGeneratorPage({ params }: PageProps) {
  return <ScreenshotUploader locale={params.locale} />;
}