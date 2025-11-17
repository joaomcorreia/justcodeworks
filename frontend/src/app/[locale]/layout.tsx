import { ReactNode } from "react";
import { Locale } from "@/i18n";
import { AuthProvider } from "@/contexts/auth-context";
import { LoginModalProvider } from "@/contexts/login-modal-context";
import { ThemeProvider } from "@/components/theme-provider";
import { EditModeProvider } from "@/components/edit-mode-provider";
import GlobalLoginModal from "@/components/GlobalLoginModal";
// Fixed import paths

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;

  return (
    <div className="min-h-screen" data-locale={locale}>
      <AuthProvider>
        <LoginModalProvider>
          <ThemeProvider>
            <EditModeProvider>
              {children}
            </EditModeProvider>
          </ThemeProvider>
          <GlobalLoginModal locale={locale} />
        </LoginModalProvider>
      </AuthProvider>
    </div>
  );
}

