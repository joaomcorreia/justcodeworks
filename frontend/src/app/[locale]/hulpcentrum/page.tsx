import { getDictionary } from '@/i18n';
import HelpCenterPageClient from '@/components/HelpCenterPageClient';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

interface HulpcentrumPageProps {
  params: { locale: string };
}

export default async function HulpcentrumPage({ params: { locale } }: HulpcentrumPageProps) {
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <HelpCenterPageClient dict={dict} />
      <Footer dict={dict} />
    </>
  );
} 
