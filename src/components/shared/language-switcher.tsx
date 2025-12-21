'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState, useEffect, useRef, useTransition } from 'react';

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Получаем текущую локаль из контекста next-intl
  const currentLocale = useLocale() as 'ru' | 'uz';
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  // Закрытие при клике вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    startTransition(() => {
      // Определяем, есть ли префикс локали в текущем URL
      const hasLocalePrefix = pathname.startsWith('/uz') || pathname.startsWith('/ru');
      
      if (hasLocalePrefix) {
        // Удаляем текущую локаль из пути
        let newPathname = pathname;
        if (pathname.startsWith('/ru')) {
          newPathname = pathname.replace(/^\/ru/, '');
        } else if (pathname.startsWith('/uz')) {
          newPathname = pathname.replace(/^\/uz/, '');
        }
        
        // Добавляем новую локаль
        if (newLocale === 'ru') {
          // Для русского языка используем префикс /ru
          router.push(`/ru${newPathname || ''}`);
        } else {
          router.push(`/${newLocale}${newPathname || ''}`);
        }
      } else {
        // Для страниц без префикса просто перезагружаем с новой локалью
        if (newLocale === 'uz') {
          router.push('/uz');
        } else {
          router.push('/ru');
        }
      }
      
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="w-full inline-flex items-center justify-between whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#679B00] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 hover:text-gray-900 h-10 rounded-lg px-3 text-gray-700 gap-2 border border-gray-200"
      >
        <span className="flex items-center gap-2">
          <span>{currentLanguage.flag}</span>
          <span>{currentLanguage.name}</span>
        </span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isPending}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                  language.code === currentLocale ? 'bg-gray-50' : ''
                }`}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                </div>
                {language.code === currentLocale && (
                  <span className="text-green-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


