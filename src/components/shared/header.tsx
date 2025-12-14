import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { HeaderNav } from "./header-nav";
import { HeaderActions } from "./header-actions";
import Image from "next/image";

// Отключаем кэширование для Header, чтобы всегда получать актуальные данные пользователя
export const dynamic = 'force-dynamic';

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="absolute top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1350px] bg-white shadow-md rounded-2xl border border-gray-200/50">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center mt-1">
            <Image
              src="/logo-osonish.svg"
              alt="Osonish"
              width={80}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <HeaderNav />

          {/* Actions (client component) */}
          <HeaderActions user={user} />
        </div>
      </div>
    </header>
  );
}
