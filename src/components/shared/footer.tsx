"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Smartphone, Instagram, Send } from "lucide-react";
import { useTranslations } from 'next-intl';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* About */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <Image 
                src="/logo-osonish.svg" 
                alt="Osonish" 
                width={150} 
                height={32}
                className="h-7 sm:h-8 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="http://bit.ly/4pIXrCI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={t('downloadApp')}
              >
                <Smartphone className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/osonish_uzb?igsh=MXNpMTMzeDdzOWs0ag=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={t('instagram')}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="http://t.me/osonish_sam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={t('telegram')}
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('forEmployers')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/orders/create"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('postJob')}
                </Link>
              </li>
              <li>
                <Link
                  href="/workers"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('findWorker')}
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('howItWorks')}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Workers */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('forWorkers')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/orders"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('findWork')}
                </Link>
              </li>
              <li>
                <Link
                  href="/vacancies"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('vacancies')}
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('createResume')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('support')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {t('termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground">
          <p>{t('copyright', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}

