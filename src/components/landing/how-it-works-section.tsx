"use client";

import { CheckCircle, FileText, Users, Star } from "lucide-react";
import { Container } from "../shared/container";
import { useTranslations } from 'next-intl';

export function HowItWorksSection() {
  const t = useTranslations('landing.howItWorks');
  
  const steps = [
    {
      icon: FileText,
      title: t('step1Title'),
      description: t('step1Description'),
    },
    {
      icon: Users,
      title: t('step2Title'),
      description: t('step2Description'),
    },
    {
      icon: CheckCircle,
      title: t('step3Title'),
      description: t('step3Description'),
    },
    {
      icon: Star,
      title: t('step4Title'),
      description: t('step4Description'),
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-24 bg-white border-t border-gray-200 scroll-mt-20">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
                {/* Connecting line (hidden on mobile, shown on lg+ desktop between cards) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-10 w-10 h-[2px] bg-gray-200 -z-10" />
                )}

                {/* Step Number Badge */}
                <div className="mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg sm:text-xl">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

