import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ClientProviders } from "@/components/providers/client-providers";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Osonish - Платформа для поиска работы и исполнителей в Узбекистане",
    template: "%s | Osonish",
  },
  description:
    "Osonish - это быстрый и удобный способ найти работу или нанять профессионалов в вашем городе. Создавайте заказы, находите исполнителей, откликайтесь на вакансии.",
  keywords: [
    "работа",
    "вакансии",
    "исполнители",
    "заказы",
    "услуги",
    "Узбекистан",
    "Ташкент",
    "найм",
    "фриланс",
  ],
  authors: [{ name: "Osonish" }],
  creator: "Osonish",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://osonish.uz",
    title: "Osonish - Платформа для поиска работы и исполнителей",
    description:
      "Найдите работу или наймите профессионалов в Узбекистане за минуты",
    siteName: "Osonish",
  },
  twitter: {
    card: "summary_large_image",
    title: "Osonish - Платформа для поиска работы и исполнителей",
    description:
      "Найдите работу или наймите профессионалов в Узбекистане за минуты",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Получаем текущую локаль из next-intl
  const locale = await getLocale();
  
  // Загружаем сообщения для текущей локали
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientProviders>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
