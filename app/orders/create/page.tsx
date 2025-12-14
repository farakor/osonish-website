import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { CreateOrderClient } from "./page-client";

export const metadata: Metadata = {
  title: "Создать заказ - Osonish",
  description:
    "Создайте заказ на выполнение работ. Найдите профессионалов для решения ваших задач в Узбекистане.",
  openGraph: {
    title: "Создать заказ - Osonish",
    description: "Разместите заказ и найдите исполнителей",
  },
};

export default async function CreateOrderPage() {
  // Проверяем авторизацию
  const user = await getCurrentUser();
  
  if (!user) {
    // Если пользователь не авторизован, перенаправляем на страницу входа
    redirect("/auth?redirect=%2Forders%2Fcreate");
  }

  // Проверяем роль: только заказчики могут создавать заказы
  if (user.role !== 'customer') {
    redirect("/dashboard");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://osonish.uz",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Заказы",
        item: "https://osonish.uz/orders",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Создать заказ",
        item: "https://osonish.uz/orders/create",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CreateOrderClient />
    </>
  );
}

