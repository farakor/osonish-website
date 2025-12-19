'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useState, useTransition } from 'react';

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  
  // Получаем текущую локаль из контекста next-intl
  const currentLocale = useLocale() as 'ru' | 'uz';
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

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
          // Для русского языка не используем префикс (по умолчанию)
          router.push(newPathname || '/');
        } else {
          router.push(`/${newLocale}${newPathname || ''}`);
        }
      } else {
        // Для страниц без префикса просто перезагружаем с новой локалью
        // Middleware увидит заголовок Accept-Language и применит нужную локаль
        if (newLocale === 'uz') {
          router.push('/uz');
        } else {
          router.push('/');
        }
      }
      
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 rounded-full gap-1.5"
          disabled={isPending}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
          <span className="hidden md:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              language.code === currentLocale ? 'bg-gray-100' : ''
            }`}
          >
            <span className="mr-2">{language.flag}</span>
            <span>{language.name}</span>
            {language.code === currentLocale && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

