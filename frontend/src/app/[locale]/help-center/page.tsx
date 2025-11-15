import { getDictionary } from '@/i18n';
import HelpCenterPageClient from '@/components/HelpCenterPageClient';
import { redirect } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

interface HelpCenterPageProps {
  params: { locale: string };
}

export default async function HelpCenterPage({ params: { locale } }: HelpCenterPageProps) {
  // Redirect Portuguese users to the proper Portuguese URL
  if (locale === 'pt') {
    redirect('/pt/centro-ajuda');
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
