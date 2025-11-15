import { getDictionary } from '@/i18n';
import HomePageClient from '@/components/HomePageClient';
import HeroNavigation from '@/components/HeroNavigation';
import HeroSection from '@/components/HeroSection';

interface HomePageProps {
  params: { locale: string };
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
  const dict = await getDictionary(locale);
  
  return (
    <>
      <HeroNavigation locale={locale} />
      <HeroSection locale={locale} />
      <HomePageClient dict={dict} />
    </>
  );
} 
