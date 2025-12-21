'use client';

import { 
  Mail, 
  Phone, 
  Clock,
  MessageSquare,
  Globe,
  Headphones
} from "lucide-react";
import { ContactForm } from "./contact-form";
import { useTranslations } from 'next-intl';

function Briefcase({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export function ContactPageClient() {
  const t = useTranslations('contact');

  const contactInfo = [
    {
      icon: Phone,
      title: t('phone'),
      value: t('phoneValue'),
      link: "tel:+998916480070",
      description: t('phoneDescription'),
    },
    {
      icon: Mail,
      title: t('email'),
      value: t('emailValue'),
      link: "mailto:info@oson-ish.uz",
      description: t('emailDescription'),
    },
    {
      icon: Globe,
      title: t('website'),
      value: t('websiteValue'),
      link: "https://oson-ish.uz",
      description: t('websiteDescription'),
    },
  ];

  const workingHours = [
    { day: t('mondayFriday'), hours: t('mondayFridayHours') },
    { day: t('saturday'), hours: t('saturdayHours') },
    { day: t('sunday'), hours: t('sundayHours') },
  ];

  const supportTopics = [
    {
      icon: MessageSquare,
      title: t('generalQuestions'),
      description: t('generalQuestionsDesc'),
    },
    {
      icon: Headphones,
      title: t('technicalSupport'),
      description: t('technicalSupportDesc'),
    },
    {
      icon: Briefcase,
      title: t('forBusiness'),
      description: t('forBusinessDesc'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 pt-32 pb-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">{t('title')}</h1>
            <p className="text-lg leading-relaxed text-blue-50 md:text-xl">
              {t('description')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contactInfo.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl bg-white p-6 border border-[#DAE3EC] transition-all hover:border-blue-300 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-center">
                    <div className="rounded-full bg-blue-50 p-3 group-hover:bg-blue-100">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">
                      {contact.title}
                    </h3>
                    {contact.link ? (
                      <a
                        href={contact.link}
                        className="mb-2 block text-lg font-bold text-gray-900 hover:text-blue-600 break-words"
                      >
                        {contact.value}
                      </a>
                    ) : (
                      <div className="mb-2 text-lg font-bold text-gray-900">
                        {contact.value}
                      </div>
                    )}
                    <p className="text-sm text-gray-600">{contact.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <ContactForm />

              {/* Additional Info */}
              <div>
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  {t('workingHours')}
                </h2>
                <div className="mb-8 rounded-lg bg-gray-50 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {t('supportService')}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {workingHours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                      >
                        <span className="text-gray-700">{schedule.day}</span>
                        <span className="font-semibold text-gray-900">
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('howCanWeHelp')}
                </h3>
                <div className="space-y-4">
                  {supportTopics.map((topic, index) => {
                    const Icon = topic.icon;
                    return (
                      <div
                        key={index}
                        className="flex gap-4 rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-all"
                      >
                        <div className="flex-shrink-0">
                          <div className="rounded-lg bg-blue-50 p-2">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="mb-1 font-semibold text-gray-900">
                            {topic.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {topic.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              {t('faqTitle')}
            </h2>
            <p className="mb-8 text-gray-600">
              {t('faqDescription')}
            </p>
            <div className="grid gap-6 text-left md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t('faqQ1')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('faqA1')}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t('faqQ2')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('faqA2')}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t('faqQ3')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('faqA3')}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t('faqQ4')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('faqA4')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            {t('ctaTitle')}
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            {t('ctaDescription')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/auth/register"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-50"
            >
              {t('registerButton')}
            </a>
            <a
              href="/about"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-blue-600"
            >
              {t('learnMore')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

