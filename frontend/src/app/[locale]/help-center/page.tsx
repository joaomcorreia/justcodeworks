import { getDictionary } from '@/i18n';
import HelpCenterPageClient from '@/components/HelpCenterPageClient';
import { redirect } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

interface HelpCenterPageProps {
  params: { locale: string };
}

export default async function HelpCenterPage({ params: { locale } }: HelpCenterPageProps) {
  // Redirect users to the proper localized URL
  if (locale === 'pt') {
    redirect('/pt/centro-ajuda');
  }
  if (locale === 'nl') {
    redirect('/nl/hulpcentrum');
  }
  
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <HelpCenterPageClient dict={dict} />
      <Footer dict={dict} />
    </>
  );
} 
