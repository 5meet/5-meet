
import LoginForm from "@/features/auth/login/components/LoginForm";
import OAuthErrorAlert from "@/features/auth/login/components/0AuthErrorAlert";
import { getSafeRedirect } from "@/lib/utils/getSafeRedirect";

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect, error } = await searchParams;

  const safeRedirect = getSafeRedirect(redirect, "/meetings");

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-4">
      <OAuthErrorAlert error={error} />
      <LoginForm redirect={safeRedirect} />
    </main>
  );
}
