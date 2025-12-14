'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { UserMenu } from "./user-menu";
import { CitySelector } from "./city-selector";

type HeaderActionsProps = {
  user: any | null; // Используем any для совместимости с типом из getCurrentUser
};

export function HeaderActions({ user }: HeaderActionsProps) {
  return (
    <>
      {/* Desktop Actions */}
      <div className="hidden md:flex items-center space-x-2">
        {/* City Selector */}
        <CitySelector />

        {/* Help Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="text-gray-600 hover:text-gray-900 rounded-full"
        >
          <HelpCircle className="h-4 w-4 mr-1" />
          Помощь
        </Button>

        {user ? (
          // Показываем меню пользователя если авторизован
          <div className="flex items-center gap-2">
            {/* Кнопка "Создать заказ" только для заказчиков */}
            {user.role === 'customer' && (
              <Link href="/orders/create">
                <Button 
                  variant="outline"
                  className="rounded-full border border-gray-900 text-gray-900 hover:bg-gray-50 font-medium text-sm"
                >
                  Создать заказ
                </Button>
              </Link>
            )}
            <UserMenu user={user} />
          </div>
        ) : (
          // Показываем кнопки входа если не авторизован
          <Link href="/auth/login">
            <Button 
              className="rounded-full bg-primary hover:bg-primary/90 text-white font-medium px-5 text-sm"
            >
              Войти
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-2">
        {user ? (
          <UserMenu user={user} />
        ) : (
          <Link href="/auth/login">
            <Button 
              size="sm"
              className="rounded-full bg-primary hover:bg-primary/90 text-white"
            >
              Войти
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}






