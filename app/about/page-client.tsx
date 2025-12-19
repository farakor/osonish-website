"use client";

import { useTranslations } from 'next-intl';
import { 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Zap,
  CheckCircle,
  Mail,
  Globe
} from "lucide-react";

export function AboutPageClient() {
  const t = useTranslations('about');

  const stats = [
    {
      icon: Briefcase,
      value: "300+",
      label: t('stats.activeOrders'),
    },
    {
      icon: Building2,
      value: "5600+",
      label: t('stats.verifiedWorkers'),
    },
    {
      icon: Users,
      value: "15 тыс+",
      label: t('stats.registeredUsers'),
    },
    {
      icon: CheckCircle,
      value: "8 тыс+",
      label: t('stats.completedOrders'),
    },
    {
      icon: TrendingUp,
      value: "10 тыс+",
      label: t('stats.monthlyVisitors'),
    },
    {
      icon: Zap,
      value: "50+",
      label: t('stats.serviceCategories'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 pt-32 pb-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">{t('hero.title')}</h1>
            <p className="text-lg leading-relaxed text-blue-50 md:text-xl">
              <strong>{t('hero.brandName')}</strong> — {t('hero.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              {t('stats.title')}
            </h2>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group rounded-2xl bg-white p-8 border border-[#DAE3EC] transition-all hover:border-blue-300"
                >
                  <div className="mb-4 flex items-center justify-center">
                    <div className="rounded-full bg-blue-50 p-4 group-hover:bg-blue-100">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
              {t('mission.title')}
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-gray-700">
              <p>{t('mission.paragraph1')}</p>
              <p>{t('mission.paragraph2')}</p>
              <div className="grid gap-6 pt-8 md:grid-cols-2">
                <div className="rounded-lg bg-blue-50 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-blue-900">
                    {t('mission.forCustomers')}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{t('mission.forCustomersBenefit1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{t('mission.forCustomersBenefit2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{t('mission.forCustomersBenefit3')}</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-green-50 p-6">
                  <h3 className="mb-3 text-xl font-semibold text-green-900">
                    {t('mission.forWorkers')}
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{t('mission.forWorkersBenefit1')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{t('mission.forWorkersBenefit2')}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">✓</span>
                      <span>{t('mission.forWorkersBenefit3')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
              <h3 className="mb-4 text-2xl font-bold">
                {t('contact.title')}
              </h3>
              <a
                href={`tel:${t('contact.phone').replace(/\s/g, '')}`}
                className="mb-6 inline-block text-4xl font-bold hover:text-blue-100"
              >
                {t('contact.phone')}
              </a>
              <div className="flex items-center justify-center gap-6">
                <a
                  href={`mailto:${t('contact.email')}`}
                  className="flex items-center hover:text-blue-100"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  {t('contact.email')}
                </a>
                <a
                  href={`https://${t('contact.website')}`}
                  className="flex items-center hover:text-blue-100"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  {t('contact.website')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              {t('partners.title')}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-6">
                <Building2 className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t('partners.partner1')}
                </h3>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <Users className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t('partners.partner2')}
                </h3>
              </div>
              <div className="rounded-lg bg-gray-50 p-6">
                <Globe className="mx-auto mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  {t('partners.partner3')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              {t('values.title')}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {t('values.speed')}
                </h3>
                <p className="text-gray-600">
                  {t('values.speedDescription')}
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {t('values.reliability')}
                </h3>
                <p className="text-gray-600">
                  {t('values.reliabilityDescription')}
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {t('values.growth')}
                </h3>
                <p className="text-gray-600">
                  {t('values.growthDescription')}
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
            {t('cta.title')}
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/auth/register"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-50"
            >
              {t('cta.startWorking')}
            </a>
            <a
              href="/orders"
              className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-blue-600"
            >
              {t('cta.viewOrders')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

