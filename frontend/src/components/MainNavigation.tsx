import { getDictionary } from '@/i18n';
import MainNavigationClient from './MainNavigationClient';

interface MainNavigationProps {
  locale: string;
  transparent?: boolean;
}

export default async function MainNavigation({ locale, transparent = false }: MainNavigationProps) {
  const dict = await getDictionary(locale);
  
  return <MainNavigationClient dict={dict} locale={locale} transparent={transparent} />;
}