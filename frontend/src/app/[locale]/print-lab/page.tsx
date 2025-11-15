import { getDictionary } from '@/i18n';
import MainNavigation from '@/components/MainNavigation';
import PrintLabClient from '@/components/PrintLabClient';
import Footer from '@/components/Footer';

interface PrintLabPageProps {
  params: { locale: string };
}

export default async function PrintLabPage({ params: { locale } }: PrintLabPageProps) {
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <PrintLabClient dict={dict} locale={locale} />
      <Footer dict={dict} />
    </>
  );
} 