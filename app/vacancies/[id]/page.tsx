import { Metadata } from "next";
import { VacancyDetailClient } from "./page-client";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Детали вакансии - Osonish",
  description: "Подробная информация о вакансии",
};

export default async function VacancyDetailPage({
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
    "@type": "JobPosting",
    identifier: id,
    hiringOrganization: {
      "@type": "Organization",
      name: "Osonish",
    },
    jobLocation: {
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
      <VacancyDetailClient id={id} isAuthenticated={isAuthenticated} userRole={userRole} />
    </>
  );
}

