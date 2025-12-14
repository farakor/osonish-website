import { Metadata } from "next";
import { OrdersPageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Заказы - Найдите работу или наймите исполнителей",
  description:
    "Просмотрите актуальные заказы и вакансии в Узбекистане. Найдите подходящую работу или наймите профессионалов для выполнения ваших задач.",
  openGraph: {
    title: "Заказы - Osonish",
    description: "Актуальные заказы и вакансии в Узбекистане",
  },
};

export default function OrdersPage() {
  // Add JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Заказы и вакансии",
    description: "Актуальные заказы и вакансии в Узбекистане",
    url: "https://osonish.uz/orders",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OrdersPageClient />
    </>
  );
}

