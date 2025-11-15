import { getDictionary, type Locale } from "@/i18n";
import { BuilderClient } from "./BuilderClient";
import { getCurrentUser } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function BuilderPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { locale } = params;
  
  // [JCW] auth guard added
  // Require authentication for builder access
  const user = await getCurrentUser();
  if (!user) {
    // [AUTH] Redirect to login with locale
    redirect(`/${locale}/login`);
  }
  const dict = await getDictionary(locale);

  const templateParam = searchParams?.template;
  const templateId =
    typeof templateParam === "string" ? templateParam : undefined;

  return (
    <BuilderClient
      locale={locale}
      dict={dict}
      initialTemplateId={templateId}
    />
  );
}
