import { ReactNode } from "react";
import { Locale } from "@/i18n";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { EditModeProvider } from "@/components/edit-mode-provider";
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
        <ThemeProvider>
          <EditModeProvider>
            {children}
          </EditModeProvider>
        </ThemeProvider>
      </AuthProvider>
    </div>
  );
}

