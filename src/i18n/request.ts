import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { headers, cookies } from 'next/headers';

export default getRequestConfig(async ({ requestLocale }) => {
  // Пытаемся получить локаль из requestLocale
  let locale = await requestLocale;
  
  // Если не получилось, пробуем определить из URL через headers
  if (!locale) {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';
    const localeMatch = pathname.match(/^\/(uz|ru)/);
    
    if (localeMatch) {
      locale = localeMatch[1];
    } else {
      // Для страниц без префикса локали пробуем получить из заголовка x-locale
      const headerLocale = headersList.get('x-locale');
      if (headerLocale && routing.locales.includes(headerLocale as any)) {
        locale = headerLocale;
      } else {
        // Если нет в заголовках, берем дефолтную локаль
        locale = routing.defaultLocale;
      }
    }
  }
  
  // Проверяем, что локаль валидная
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

