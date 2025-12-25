"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Briefcase, Users, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

interface MobileBottomBarProps {
  user: any | null;
}

export function MobileBottomBar({ user }: MobileBottomBarProps) {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/ru' || pathname === '/uz';
    }
    const cleanPathname = pathname?.replace(/^\/(ru|uz)/, '') || pathname;
    return cleanPathname?.startsWith(href);
  };

  const navigationItems = [
    {
      name: t('home'),
      href: '/',
      icon: Home,
      key: 'home',
    },
    {
      name: t('orders'),
      href: '/orders',
      icon: Package,
      key: 'orders',
    },
    {
      name: t('vacancies'),
      href: '/vacancies',
      icon: Briefcase,
      key: 'vacancies',
    },
    {
      name: t('workers'),
      href: '/workers',
      icon: Users,
      key: 'workers',
    },
  ];

  // Добавляем последний пункт в зависимости от авторизации
  const profileItem = user
    ? {
        name: tCommon('profile'),
        href: '/dashboard',
        icon: User,
        key: 'profile',
      }
    : {
        name: tCommon('login'),
        href: '/auth/login',
        icon: LogIn,
        key: 'login',
      };

  const allItems = [...navigationItems, profileItem];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {allItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors rounded-lg",
                active
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className={cn("h-6 w-6", active && "stroke-[2.5]")} />
              <span className={cn(
                "text-[10px] leading-none",
                active && "font-semibold"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}




