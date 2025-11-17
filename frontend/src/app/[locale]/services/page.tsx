import { getDictionary } from '@/i18n';
import ServicesPageClient from '@/components/ServicesPageClient';
import { redirect } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

interface ServicesPageProps {
  params: { locale: string };
}

export default async function ServicesPage({ params: { locale } }: ServicesPageProps) {
  // Redirect users to the proper localized URL
  if (locale === 'pt') {
    redirect('/pt/servicos');
  }
  if (locale === 'nl') {
    redirect('/nl/diensten');
  }
  
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <ServicesPageClient dict={dict} />
      <Footer dict={dict} />
    </>
  );
} 
