import { getDictionary } from '@/i18n';
import HelpCenterPageClient from '@/components/HelpCenterPageClient';
import MainNavigation from '@/components/MainNavigation';

interface CentroAjudaPageProps {
  params: { locale: string };
}

export default async function CentroAjudaPage({ params: { locale } }: CentroAjudaPageProps) {
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <HelpCenterPageClient dict={dict} />
    </>
  );
}