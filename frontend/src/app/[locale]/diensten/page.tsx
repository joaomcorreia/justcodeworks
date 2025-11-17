import { getDictionary } from '@/i18n';
import ServicesPageClient from '@/components/ServicesPageClient';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

interface DienstenPageProps {
  params: { locale: string };
}

export default async function DienstenPage({ params: { locale } }: DienstenPageProps) {
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <ServicesPageClient dict={dict} />
      <Footer dict={dict} />
    </>
  );
} 
