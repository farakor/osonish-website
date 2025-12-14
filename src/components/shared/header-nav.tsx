"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'Заказы', href: '/orders' },
  { name: 'Вакансии', href: '/vacancies' },
  { name: 'Исполнители', href: '/workers' },
  { name: 'О компании', href: '/about' },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1 bg-gray-100/60 rounded-full p-1">
      {navigation.map((item) => {
        const isActive = pathname?.startsWith(item.href);
        
        return (
          <Link
            key={item.href}
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

