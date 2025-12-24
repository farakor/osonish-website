"use client";

import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('betaBanner');

  useEffect(() => {
    // Проверяем, был ли баннер закрыт ранее
    const isBannerClosed = localStorage.getItem('betaBannerClosed');
    if (!isBannerClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Сохраняем в localStorage, что баннер был закрыт
    localStorage.setItem('betaBannerClosed', 'true');
    // Отправляем кастомное событие для уведомления других компонентов
    window.dispatchEvent(new Event('bannerClosed'));
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white shadow-sm relative z-[60]">
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <AlertTriangle className="h-3 w-3 flex-shrink-0 animate-pulse" />
            <p className="text-[11px] leading-tight font-medium truncate">
              <span className="font-bold">{t('title')}</span> {t('message')}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
            aria-label={t('close')}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

