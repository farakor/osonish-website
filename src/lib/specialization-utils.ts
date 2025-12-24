import { SPECIALIZATIONS, PARENT_CATEGORIES, type SpecializationOption } from '@/constants/registration';
import { translateCategory } from './category-translations';

/**
 * Получает информацию о специализации по ID
 */
export function getSpecializationInfo(specializationId: string | undefined | null): SpecializationOption | null {
  if (!specializationId) {
    return null;
  }
  
  // Ищем в специализациях
  const specialization = SPECIALIZATIONS.find(s => s.id === specializationId);
  if (specialization) {
    return specialization;
  }
  
  // Ищем в родительских категориях
  const parentCategory = PARENT_CATEGORIES.find(c => c.id === specializationId);
  if (parentCategory) {
    return parentCategory;
  }
  
  return null;
}

/**
 * Получает имя специализации по ID с поддержкой локализации
 */
export function getSpecializationName(specializationId: string | undefined | null, locale: string = 'uz'): string {
  const info = getSpecializationInfo(specializationId);
  if (!info) {
    return locale === 'uz' ? 'Ko\'rsatilmagan' : 'Не указано';
  }
  
  // Используем translateCategory для перевода названия
  return translateCategory(info.name, locale);
}

/**
 * Получает имя иконки специализации по ID
 */
export function getSpecializationIconName(specializationId: string | undefined | null): string | undefined {
  const info = getSpecializationInfo(specializationId);
  return info?.iconName;
}

/**
 * Получает emoji иконку специализации по ID (fallback)
 */
export function getSpecializationIcon(specializationId: string | undefined | null): string {
  const info = getSpecializationInfo(specializationId);
  return info?.icon || '📋';
}

