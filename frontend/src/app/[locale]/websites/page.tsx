import { getDictionary } from '@/i18n';
import WebsitesPageClient from '@/components/WebsitesPageClient';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

interface WebsitesPageProps {
  params: { locale: string };
}

export default async function WebsitesPage({ params: { locale } }: WebsitesPageProps) {
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <WebsitesPageClient dict={dict} />
      <Footer dict={dict} />
    </>
  );
} 
