import { redirect } from "next/navigation";

interface AuthPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  
  // Перенаправляем на страницу логина с сохранением параметра redirect
  const redirectUrl = params.redirect
    ? `/auth/login?redirect=${encodeURIComponent(params.redirect)}`
    : "/auth/login";

  redirect(redirectUrl);
}

