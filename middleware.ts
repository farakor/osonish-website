import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

// Создаем middleware для интернационализации
const intlMiddleware = createIntlMiddleware(routing);

// Пути, которые не требуют интернационализации (без префикса локали)
const nonLocalizedPaths = [
  '/orders',
  '/vacancies', 
  '/workers',
  '/about',
  '/contact',
  '/auth',
  '/dashboard',
  '/profiles'
];

export async function middleware(request: NextRequest) {
  // Определяем, есть ли локаль в URL
  const pathname = request.nextUrl.pathname;
  
  // Проверяем, является ли путь нелокализованным
  const isNonLocalizedPath = nonLocalizedPaths.some(path => 
    pathname.startsWith(path) || pathname === path
  );
  
  // Извлекаем локаль из URL если есть
  const localeMatch = pathname.match(/^\/(ru|uz)/);
  let locale = localeMatch ? localeMatch[1] : 'uz'; // По умолчанию узбекский
  
  const pathnameHasLocale = routing.locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  // Обрабатываем интернационализацию только для страниц в структуре [locale]
  let intlResponse;
  if (!isNonLocalizedPath) {
    intlResponse = intlMiddleware(request);
  }
  
  // Сохраняем локаль в cookies на основе URL
  if (intlResponse) {
    // Если путь содержит локаль, сохраняем её
    if (pathnameHasLocale) {
      const pageLocale = pathname.match(/^\/(ru|uz)/)?.[1];
      if (pageLocale) {
        intlResponse.cookies.set('NEXT_LOCALE', pageLocale, {
          path: '/',
          maxAge: 31536000, // 1 год
        });
      }
    } else if (pathname === '/') {
      // Для главной страницы без префикса устанавливаем узбекский
      intlResponse.cookies.set('NEXT_LOCALE', 'uz', {
        path: '/',
        maxAge: 31536000,
      });
    }
  }
  
  // Проверяем защищенные роуты
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route) || 
    pathname.match(/^\/(ru|uz)\/dashboard/)
  );

  if (isProtectedRoute) {
    // Check if user is authenticated (проверяем оба типа cookies)
    const userIdCookie = request.cookies.get("user_id");
    const sessionCookie = request.cookies.get("session_token");

    if (!userIdCookie && !sessionCookie) {
      // Определяем текущую локаль для редиректа
      const protectedLocale = pathname.match(/^\/(ru|uz)/)?.[1] || locale;
      const loginUrl = protectedLocale === 'uz' ? '/auth/login' : `/${protectedLocale}/auth/login`;
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
  }

  // Update session
  const response = await updateSession(request);
  
  // Устанавливаем заголовки для определения локали
  response.headers.set('x-pathname', pathname);
  response.headers.set('x-locale', locale);
  
  // Если intl вернул response (редирект), используем его
  if (intlResponse && intlResponse.status !== 200) {
    // Копируем куки из intl response
    const cookies = intlResponse.cookies.getAll();
    cookies.forEach(cookie => {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return intlResponse;
  }
  
  // Копируем важные заголовки из intl middleware
  if (intlResponse) {
    const intlLocale = intlResponse.headers.get('x-next-intl-locale');
    if (intlLocale) {
      response.headers.set('x-next-intl-locale', intlLocale);
    }
    
    // Копируем куки
    const cookies = intlResponse.cookies.getAll();
    cookies.forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value, cookie);
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Match all pathnames except for API routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

