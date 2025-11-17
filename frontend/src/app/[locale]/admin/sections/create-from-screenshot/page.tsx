// [ADMIN] Create Section from Screenshot - Screenshot-to-Section Generator Step 1
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ScreenshotUploader from "@/components/admin/ScreenshotUploader";

// Server-side authentication check and user data fetch
async function getAuthUser() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('sessionid') || cookieStore.get('jcw_access_token');
  
  if (!authCookie) {
    return null;
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/me/", {
      headers: {
        Cookie: `sessionid=${authCookie.value}`,
      },
      cache: 'no-store',
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Auth check failed:", error);
  }
  
  return null;
}

export default async function CreateFromScreenshotPage({
  params,
}: {
  params: { locale: string };
}) {
  const user = await getAuthUser();

  if (!user) {
    notFound();
  }

  return <ScreenshotUploader locale={params.locale} />;
}