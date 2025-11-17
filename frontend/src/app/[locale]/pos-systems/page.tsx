import { getDictionary } from '@/i18n';
import PosSystemsPageClient from '@/components/PosSystemsPageClient';
import { redirect } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

interface PosSystemsPageProps {
  params: { locale: string };
}

export default async function PosSystemsPage({ params: { locale } }: PosSystemsPageProps) {
  // Redirect users to the proper localized URL
  if (locale === 'pt') {
    redirect('/pt/sistemas-tpv');
  }
  if (locale === 'nl') {
    redirect('/nl/kassasystemen');
  }
  
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <PosSystemsPageClient dict={dict} />
      <Footer dict={dict} />
    </>
  );
} 
