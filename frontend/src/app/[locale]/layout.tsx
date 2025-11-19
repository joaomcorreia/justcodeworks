import { ReactNode } from "react";
import { Locale } from "@/i18n";
import { getDirection, isRTL } from "@/i18n/utils";
import { AuthProvider } from "@/contexts/auth-context";
import { LoginModalProvider } from "@/contexts/login-modal-context";
import { ThemeProvider } from "@/components/theme-provider";
import { EditModeProvider } from "@/components/edit-mode-provider";
import GlobalLoginModal from "@/components/GlobalLoginModal";

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;
  const direction = getDirection(locale);
  const isRtl = isRTL(locale);

  return (
    <html lang={locale} dir={direction}>
      <body>
        <div className={`min-h-screen ${isRtl ? 'rtl' : 'ltr'}`} data-locale={locale}>
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
      </body>
    </html>
  );
}

