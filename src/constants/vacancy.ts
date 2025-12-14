// Константы для полей вакансии

// Уровни опыта
export const EXPERIENCE_LEVELS = [
  { value: 'no_experience', label: 'Без опыта' },
  { value: 'from_1_year', label: 'От 1 года' },
  { value: 'from_3_years', label: 'От 3 лет' },
  { value: 'from_5_years', label: 'От 5 лет' },
  { value: 'from_10_years', label: 'От 10 лет' },
] as const;

// Типы занятости
export const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Полная занятость' },
  { value: 'part_time', label: 'Частичная занятость' },
  { value: 'project', label: 'Проектная работа' },
  { value: 'internship', label: 'Стажировка' },
  { value: 'temporary', label: 'Временная работа' },
] as const;

// Форматы работы
export const WORK_FORMATS = [
  { value: 'office', label: 'В офисе' },
  { value: 'remote', label: 'Удаленно' },
  { value: 'hybrid', label: 'Гибрид' },
] as const;

// Графики работы
export const WORK_SCHEDULES = [
  { value: 'full_day', label: 'Полный день' },
  { value: 'shift', label: 'Сменный график' },
  { value: 'flexible', label: 'Гибкий график' },
  { value: 'rotating', label: 'Вахтовый метод' },
] as const;

// Периоды зарплаты
export const SALARY_PERIODS = [
  { value: 'per_hour', label: 'В час' },
  { value: 'per_day', label: 'В день' },
  { value: 'per_month', label: 'В месяц' },
] as const;

// Типы зарплаты
export const SALARY_TYPES = [
  { value: 'before_tax', label: 'До вычета налогов' },
  { value: 'after_tax', label: 'На руки' },
] as const;

// Частота выплат
export const PAYMENT_FREQUENCIES = [
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'biweekly', label: 'Раз в 2 недели' },
  { value: 'monthly', label: 'Ежемесячно' },
  { value: 'by_agreement', label: 'По договоренности' },
] as const;

// Популярные навыки
export const POPULAR_SKILLS = [
  'Microsoft Office',
  'Excel',
  'Word',
  'PowerPoint',
  '1C',
  'Водительские права',
  'Работа с клиентами',
  'Продажи',
  'Коммуникабельность',
  'Ответственность',
  'Пунктуальность',
  'Командная работа',
  'Лидерство',
  'Организаторские способности',
  'Аналитическое мышление',
  'Креативность',
  'Быстрая обучаемость',
  'Управление проектами',
  'Презентация',
  'Переговоры',
  'Маркетинг',
  'SEO',
  'Программирование',
  'Дизайн',
  'Фотошоп',
  'Видеомонтаж',
  'Социальные сети',
  'Работа с документами',
  'Тайм-менеджмент',
] as const;

// Языки
export const LANGUAGES = [
  'Узбекский',
  'Русский',
  'Английский',
  'Турецкий',
  'Китайский',
  'Корейский',
  'Немецкий',
  'Французский',
  'Испанский',
  'Арабский',
  'Персидский',
  'Казахский',
  'Киргизский',
  'Таджикский',
  'Туркменский',
] as const;

// Типы для TypeScript
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number]['value'];
export type EmploymentType = typeof EMPLOYMENT_TYPES[number]['value'];
export type WorkFormat = typeof WORK_FORMATS[number]['value'];
export type WorkSchedule = typeof WORK_SCHEDULES[number]['value'];
export type SalaryPeriod = typeof SALARY_PERIODS[number]['value'];
export type SalaryType = typeof SALARY_TYPES[number]['value'];
export type PaymentFrequency = typeof PAYMENT_FREQUENCIES[number]['value'];
