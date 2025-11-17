import { redirect } from 'next/navigation';
import { Locale } from '@/i18n';

interface LoginPageProps {
  params: {
    locale: Locale;
  };
}

export default async function LoginPage({ params: { locale } }: LoginPageProps) {
  // Redirect to homepage since we now use modal login
  redirect(`/${locale}`);
}