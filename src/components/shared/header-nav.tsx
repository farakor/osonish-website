"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

export function HeaderNav() {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const navigation = [
    { name: t('orders'), href: '/orders', key: 'orders' },
    { name: t('vacancies'), href: '/vacancies', key: 'vacancies' },
    { name: t('workers'), href: '/workers', key: 'workers' },
    { name: t('about'), href: '/about', key: 'about' },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1 bg-gray-100/60 rounded-full p-1">
      {navigation.map((item) => {
        // Удаляем префикс локали из pathname для проверки
        const cleanPathname = pathname?.replace(/^\/(ru|uz)/, '') || pathname;
        const isActive = cleanPathname?.startsWith(item.href);
        
        return (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-full transition-all",
              isActive 
                ? "bg-primary text-white shadow-sm" 
                : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm"
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

