import { getDictionary } from '@/i18n';
import PosSystemsPageClient from '@/components/PosSystemsPageClient';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/Footer';

interface KassasystermenPageProps {
  params: { locale: string };
}

export default async function KassasystermenPage({ params: { locale } }: KassasystermenPageProps) {
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <PosSystemsPageClient dict={dict} />
      <Footer dict={dict} />
    </>
  );
} 
