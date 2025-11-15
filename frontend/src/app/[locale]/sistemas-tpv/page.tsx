import { getDictionary } from '@/i18n';
import PosSystemsPageClient from '@/components/PosSystemsPageClient';
import MainNavigation from '@/components/MainNavigation';

interface SistemasTpvPageProps {
  params: { locale: string };
}

export default async function SistemasTpvPage({ params: { locale } }: SistemasTpvPageProps) {
  const dict = await getDictionary(locale);
  
  return (
    <>
      <MainNavigation locale={locale} />
      <PosSystemsPageClient dict={dict} />
    </>
  );
}