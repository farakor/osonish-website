import { Metadata } from "next";
import { OrderDetailClient } from "./page-client";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Детали заказа - Osonish",
  description: "Подробная информация о заказе",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Проверяем авторизацию пользователя
  const user = await getCurrentUser();
  const isAuthenticated = !!user;
  const userRole = user?.role;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    identifier: id,
    provider: {
      "@type": "Organization",
      name: "Osonish",
    },
    areaServed: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "UZ",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OrderDetailClient id={id} isAuthenticated={isAuthenticated} userRole={userRole} />
    </>
  );
}

