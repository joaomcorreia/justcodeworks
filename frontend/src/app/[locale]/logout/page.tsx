'use client';

// [AUTH] Logout page that handles user logout and redirects to homepage
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

interface LogoutPageProps {
  params: {
    locale: string;
  };
}

export default function LogoutPage({ params }: LogoutPageProps) {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        // Force a full page reload to ensure clean state
        window.location.href = `/${params.locale}`;
      } catch (error) {
        console.error('Logout error:', error);
        // Force reload even if logout fails
        window.location.href = `/${params.locale}`;
      }
    };

    handleLogout();
  }, [logout, params.locale]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}