import type { Metadata } from "next";
import { AboutPageClient } from "./page-client";

export const metadata: Metadata = {
  title: "О компании",
  description:
    "Oson Ish — платформа для поиска работы и исполнителей в Узбекистане. Быстро, надежно, удобно.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}

