import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['ru', 'uz'],

  // Used when no locale matches
  defaultLocale: 'ru',
  
  // Always use prefix (e.g. /ru, /uz)
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ru|uz)/:path*']
};

