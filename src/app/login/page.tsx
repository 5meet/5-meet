import LoginForm from "@/features/auth/login/components/LoginForm";

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

const DEFAULT_REDIRECT = "/meetings";

function getSafeRedirect(redirect?: string) {
  if (!redirect) return DEFAULT_REDIRECT;

  // "/"로 시작하는 내부 경로만 허용
  // "//example.com" 같은 protocol-relative URL은 차단
  if (!redirect.startsWith("/") || redirect.startsWith("//")) {
    return DEFAULT_REDIRECT;
  }

  return redirect;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { redirect } = await searchParams;

  const safeRedirect = getSafeRedirect(redirect);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <LoginForm redirect={safeRedirect} />
    </main>
  );
}