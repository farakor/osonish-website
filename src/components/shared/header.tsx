import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { HeaderNav } from "./header-nav";
import { HeaderActions } from "./header-actions";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { MobileMenu } from "./mobile-menu";
import { FloatingActionButton } from "./floating-action-button";
import { DynamicHeader } from "./dynamic-header";
import Image from "next/image";

// Отключаем кэширование для Header, чтобы всегда получать актуальные данные пользователя
export const dynamic = 'force-dynamic';

export async function Header() {
  const user = await getCurrentUser();

  return (
    <>
      <DynamicHeader>
        <div className="w-full max-w-[1350px] bg-white shadow-md rounded-2xl border border-gray-200/50">
          <div className="flex md:flex h-16 items-center justify-between px-4 sm:px-6 md:justify-between">
            {/* Mobile Layout: Hamburger - Logo (centered) - Login */}
            <div className="md:hidden flex items-center justify-between w-full">
              <div className="flex-shrink-0 w-10">
                <MobileMenu />
              </div>
              
              <Link href="/" className="flex items-center mt-1 flex-1 justify-center">
                <Image
                  src="/logo-osonish.svg"
                  alt="Osonish"
                  width={110}
                  height={38}
                  priority
                  className="h-8 w-auto"
                />
              </Link>
              
              <div className="flex-shrink-0">
                <HeaderActions user={user} />
              </div>
            </div>

            {/* Desktop Layout: Logo - Nav - Actions */}
            <Link href="/" className="hidden md:flex items-center mt-1">
              <Image
                src="/logo-osonish.svg"
                alt="Osonish"
                width={110}
                height={38}
                priority
                className="h-9 w-auto"
              />
            </Link>

            {/* Desktop Navigation - Center */}
            <HeaderNav />

            {/* Desktop Actions */}
            <div className="hidden md:block">
              <HeaderActions user={user} />
            </div>
          </div>
        </div>
      </DynamicHeader>
      
      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar user={user} />
      
      {/* Floating Action Button for Mobile */}
      <FloatingActionButton user={user} />
    </>
  );
}
