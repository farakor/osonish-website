"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  user: any | null;
}

export function FloatingActionButton({ user }: FloatingActionButtonProps) {
  const t = useTranslations('common');
  const pathname = usePathname();

  // Показываем кнопку только для авторизованных пользователей с ролью customer
  if (!user || user.role !== 'customer') {
    return null;
  }

  // Скрываем кнопку на странице создания заказа
  const isCreateOrderPage = pathname?.includes('/orders/create');
  if (isCreateOrderPage) {
    return null;
  }

  return (
    <Link href="/orders/create" className="md:hidden">
      <Button
        size="icon"
        className={cn(
          "fixed bottom-20 right-6 z-40",
          "h-14 w-14 rounded-full shadow-2xl",
          "bg-primary hover:bg-primary/90 text-white",
          "transition-all duration-200 hover:scale-110 active:scale-95",
          "border-2 border-white"
        )}
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">{t('createOrder')}</span>
      </Button>
    </Link>
  );
}

