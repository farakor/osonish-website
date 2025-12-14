import { HeroSection } from "@/components/landing/hero-section";
import { FeaturedSection } from "@/components/landing/featured-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { DownloadAppSection } from "@/components/landing/download-app-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
  // Add JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Osonish",
    description:
      "Платформа для поиска работы и исполнителей в Узбекистане",
    url: "https://osonish.uz",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://osonish.uz/orders?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturedSection />
      <HowItWorksSection />
      <DownloadAppSection />
      <CTASection />
    </>
  );
}
