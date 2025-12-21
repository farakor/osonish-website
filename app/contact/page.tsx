import type { Metadata } from "next";
import { ContactPageClient } from "@/components/contact/contact-page-client";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь с нами — мы всегда рады помочь. Служба поддержки Oson Ish работает для вас.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
