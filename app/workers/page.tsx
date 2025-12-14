import { Metadata } from "next";
import { WorkersPageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Работники - Найдите исполнителя в Узбекистане",
  description:
    "Найдите проверенных исполнителей и специалистов в Узбекистане. Профессиональные работники с рейтингом и отзывами для выполнения ваших задач.",
  openGraph: {
    title: "Работники и исполнители - Osonish",
    description: "Проверенные специалисты в Узбекистане",
  },
};

export default function WorkersPage() {
  // Add JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Работники и специалисты",
    description: "Проверенные исполнители в Узбекистане",
    url: "https://osonish.uz/workers",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkersPageClient />
    </>
  );
}


