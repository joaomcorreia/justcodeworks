import { getDictionary } from '@/i18n';
import { LoginForm } from '@/components/login-form';
import { Locale } from '@/i18n';

interface LoginPageProps {
  params: {
    locale: Locale;
  };
}

export default async function LoginPage({ params: { locale } }: LoginPageProps) {
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please sign in to access your dashboard.
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <LoginForm
            locale={locale}
            labels={{
              emailLabel: 'Email or Username',
              passwordLabel: 'Password',
              button: 'Sign In',
            }}
          />
        </div>
      </div>
    </div>
  );
}