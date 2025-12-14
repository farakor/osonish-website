import { Metadata } from "next";
import { VacanciesPageClient } from "./page-client";

export const metadata: Metadata = {
  title: "Вакансии - Найдите работу мечты в Узбекистане",
  description:
    "Просмотрите актуальные вакансии в Узбекистане. Найдите работу по специальности с достойной зарплатой. Откликайтесь на вакансии онлайн.",
  openGraph: {
    title: "Вакансии - Osonish",
    description: "Актуальные вакансии в Узбекистане",
  },
};

export default function VacanciesPage() {
  // Add JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    name: "Вакансии",
    description: "Актуальные вакансии в Узбекистане",
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
      <VacanciesPageClient />
    </>
  );
}

