import LoginForm from "@/features/auth/login/components/LoginForm";
import { getSafeRedirect } from "@/lib/utils/getSafeRedirect";

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  const safeRedirect = getSafeRedirect(redirect, "/meetings");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <LoginForm redirect={safeRedirect} />
    </main>
  );
}
