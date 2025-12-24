"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Info, HelpCircle, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';
import { CitySelector } from "./city-selector";
import { LanguageSwitcher } from "./language-switcher";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const isActive = (href: string) => {
    const cleanPathname = pathname?.replace(/^\/(ru|uz)/, '') || pathname;
    return cleanPathname?.startsWith(href);
  };

  const menuItems = [
    { name: t('about'), href: '/about', icon: Info, key: 'about' },
    { name: t('contact'), href: '/contact', icon: HelpCircle, key: 'contact' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10 rounded-full"
          aria-label="Меню"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">Меню</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-6 mt-8">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-base font-medium",
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Settings Section */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">
              Настройки
            </p>
            
            {/* City Selector */}
            <div className="px-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Город</span>
              </div>
              <CitySelector />
            </div>
            
            {/* Language Switcher */}
            <div className="px-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Язык</span>
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

