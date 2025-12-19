import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params в Next.js 15+
  const { locale } = await params;
  
  // Валидируем локаль
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  return children;
}

