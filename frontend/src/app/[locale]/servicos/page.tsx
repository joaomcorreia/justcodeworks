import { getDictionary } from '@/i18n';
import ServicesPageClient from '@/components/ServicesPageClient';
import MainNavigation from '@/components/MainNavigation';

interface ServicosPageProps {
  params: { locale: string };
}

export default async function ServicosPage({ params: { locale } }: ServicosPageProps) {
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <ServicesPageClient dict={dict} />
    </>
  );
}