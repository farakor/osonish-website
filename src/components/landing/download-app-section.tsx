"use client";

import { Container } from "../shared/container";
import { Smartphone, CheckCircle, Star, Shield, Zap } from "lucide-react";
import Image from "next/image";
import PixelMockup from "../assets/Google Pixel 10 Pro Mockup.png";
import IPhoneMockup from "../assets/iPhone 17 Pro Cosmic Orange Mockup.png";
import BackgroundImage from "../assets/bg-1.jpg";
import { useTranslations } from 'next-intl';

export function DownloadAppSection() {
  const t = useTranslations('landing.downloadApp');
  
  return (
    <section className="relative py-16 sm:py-20 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={BackgroundImage}
          alt="Background"
          fill
          className="object-cover"
          quality={90}
          priority
        />
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center relative z-10">
          {/* Left side - Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Liquid Glass morphism container */}
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-white/40 overflow-hidden">
              {/* Liquid glass animated gradients */}
              <div className="absolute inset-0 opacity-50">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-blue-500/10 animate-liquid-1" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-green-400/20 via-transparent to-primary/10 animate-liquid-2" />
              </div>
              
              {/* Glass shine effect */}
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/50 via-transparent to-transparent blur-3xl opacity-40 pointer-events-none rotate-12" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md text-gray-900 px-4 py-2 rounded-full text-sm font-semibold mb-4 sm:mb-6 border border-white/40">
                  <Smartphone className="w-4 h-4" />
                  {t('badge')}
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight drop-shadow-sm">
                  {t('title')}
                </h2>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-800 mb-6 sm:mb-8 leading-relaxed drop-shadow-sm">
                  {t('description')}
                </p>

                {/* Features list */}
                <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  <div className="flex items-center gap-3 text-left backdrop-blur-sm bg-white/20 rounded-xl sm:rounded-2xl p-3 border border-white/30">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-white/40 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/40">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base text-gray-900">{t('feature1')}</div>
                      <div className="text-xs sm:text-sm text-gray-800">{t('feature1Description')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left backdrop-blur-sm bg-white/20 rounded-xl sm:rounded-2xl p-3 border border-white/30">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-white/40 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/40">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base text-gray-900">{t('feature2')}</div>
                      <div className="text-xs sm:text-sm text-gray-800">{t('feature2Description')}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left backdrop-blur-sm bg-white/20 rounded-xl sm:rounded-2xl p-3 border border-white/30">
                    <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 bg-white/40 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/40">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base text-gray-900">{t('feature3')}</div>
                      <div className="text-xs sm:text-sm text-gray-800">{t('feature3Description')}</div>
                    </div>
                  </div>
                </div>

                {/* Download buttons */}
                <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 sm:gap-4">
                  <a
                    href="https://onelink.to/5gaph5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-br from-gray-900 to-black hover:from-black hover:to-gray-900 text-white px-7 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl border border-white/20"
                  >
                    <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-80 leading-tight">{t('availableIn')}</div>
                      <div className="text-lg font-bold leading-tight">{t('googlePlay')}</div>
                    </div>
                  </a>

                  <a
                    href="https://onelink.to/5gaph5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-br from-gray-900 to-black hover:from-black hover:to-gray-900 text-white px-7 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl border border-white/20"
                  >
                    <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs opacity-80 leading-tight">{t('downloadFrom')}</div>
                      <div className="text-lg font-bold leading-tight">{t('appStore')}</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Phone mockups */}
          <div className="relative order-1 lg:order-2">
            {/* Floating elements - hidden on mobile, shown on md+ */}
            <div className="absolute top-10 -left-10 bg-white rounded-2xl shadow-xl p-4 animate-float hidden md:block z-30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">+15 новых</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">заказов сегодня</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 -right-10 bg-white rounded-2xl shadow-xl p-4 animate-float-delayed hidden md:block z-30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-900">Рейтинг 4.8</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">из 500+ отзывов</div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center gap-3 sm:gap-4">
              {/* iPhone mockup */}
              <div className="relative z-20 transform hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <Image
                    src={IPhoneMockup}
                    alt="Oson Ish на iPhone - вакансии"
                    width={280}
                    height={570}
                    className="w-[200px] sm:w-[240px] md:w-[280px] h-auto drop-shadow-2xl"
                    priority
                  />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-[2.5rem] sm:rounded-[3rem] blur-2xl -z-10 opacity-60" />
                </div>
              </div>

              {/* Pixel mockup */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-300 -ml-6 sm:-ml-8 mt-8 sm:mt-12">
                <div className="relative">
                  <Image
                    src={PixelMockup}
                    alt="Oson Ish на Android - категории"
                    width={260}
                    height={530}
                    className="w-[180px] sm:w-[220px] md:w-[260px] h-auto drop-shadow-2xl"
                    priority
                  />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-[2rem] sm:rounded-[2.5rem] blur-2xl -z-10 opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes liquid-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          33% { 
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.8;
          }
          66% { 
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.4;
          }
        }
        @keyframes liquid-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.5;
          }
          33% { 
            transform: translate(-30px, 30px) scale(1.2) rotate(120deg);
            opacity: 0.7;
          }
          66% { 
            transform: translate(20px, -20px) scale(0.8) rotate(240deg);
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite 3s;
        }
        .animate-liquid-1 {
          animation: liquid-1 15s ease-in-out infinite;
        }
        .animate-liquid-2 {
          animation: liquid-2 20s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
}

