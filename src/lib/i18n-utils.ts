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
  return localeMatch ? localeMatch[1] : 'uz';
}

/**
 * Создает URL с учетом текущей локали
 */
export function createLocalizedUrl(path: string, locale: string = 'uz'): string {
  if (locale === 'uz') {
    return path;
  }
  return `/${locale}${path}`;
}

