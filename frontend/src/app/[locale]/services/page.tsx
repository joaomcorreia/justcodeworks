import { getDictionary } from '@/i18n';
import ServicesPageClient from '@/components/ServicesPageClient';
import { redirect } from 'next/navigation';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

interface ServicesPageProps {
  params: { locale: string };
}

export default async function ServicesPage({ params: { locale } }: ServicesPageProps) {
  // Redirect Portuguese users to the proper Portuguese URL
  if (locale === 'pt') {
    redirect('/pt/servicos');
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
