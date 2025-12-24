"use client";

import { useEffect, useState } from 'react';

interface DynamicHeaderProps {
  children: React.ReactNode;
}

export function DynamicHeader({ children }: DynamicHeaderProps) {
  const [isBannerClosed, setIsBannerClosed] = useState(false);

  useEffect(() => {
    // Проверяем состояние баннера
    const checkBannerState = () => {
      const bannerClosed = localStorage.getItem('betaBannerClosed');
      setIsBannerClosed(bannerClosed === 'true');
    };

    // Проверяем при монтировании
    checkBannerState();

    // Слушаем изменения в localStorage (когда баннер закрывается)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'betaBannerClosed') {
        setIsBannerClosed(e.newValue === 'true');
      }
    };

    // Добавляем кастомный слушатель для изменений внутри того же окна
    const handleBannerClose = () => {
      checkBannerState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bannerClosed', handleBannerClose);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bannerClosed', handleBannerClose);
    };
  }, []);

  return (
    <header className={`absolute ${isBannerClosed ? 'top-4' : 'top-8'} left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8 transition-all duration-300`}>
      {children}
    </header>
  );
}

