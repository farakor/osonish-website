import { headers } from 'next/headers';

/**
 * Получает текущую локаль из заголовков запроса
 * Используется в серверных компонентах
 */
export async function getLocale(): Promise<string> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Извлекаем локаль из pathname
  const localeMatch = pathname.match(/^\/(ru|uz)/);
  return localeMatch ? localeMatch[1] : 'ru';
}

/**
 * Создает URL с учетом текущей локали
 */
export function createLocalizedUrl(path: string, locale: string = 'ru'): string {
  if (locale === 'ru') {
    return path;
  }
  return `/${locale}${path}`;
}

