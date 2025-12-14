// Популярные специализации для главной страницы
export interface FeaturedSpecialization {
  id: string;
  name: string;
  icon: string; // путь к SVG иконке
  count?: string; // количество вакансий (опционально)
  salary?: string; // диапазон зарплат (опционально)
  href: string;
}

export const FEATURED_SPECIALIZATIONS: FeaturedSpecialization[] = [
  {
    id: 'vacancies_daily',
    name: 'Вакансии дня',
    icon: '/icons/specializations/calendar-one-day.svg',
    salary: '25 000 – 250 000 сум',
    count: '14 вакансий',
    href: '/vacancies?featured=daily',
  },
  {
    id: 'companies_daily',
    name: 'Компании дня',
    icon: '/icons/specializations/enterprise.svg',
    count: '8773 вакансий',
    href: '/vacancies?featured=companies',
  },
  {
    id: 'remote_work',
    name: 'Работа из дома',
    icon: '/icons/specializations/laptop.svg',
    count: '53588 вакансий',
    href: '/vacancies?remote=true',
  },
  {
    id: 'part_time',
    name: 'Подработка',
    icon: '/icons/specializations/work.svg',
    salary: 'до 21 490 000 сум',
    count: '54 вакансий',
    href: '/vacancies?type=part-time',
  },
  {
    id: 'courier',
    name: 'Курьер',
    icon: '/icons/specializations/delivery-courier.svg',
    salary: '995 000 – 22 325 000 сум',
    count: '12 вакансий',
    href: '/vacancies?specialization=courier',
  },
  {
    id: 'driver',
    name: 'Водитель',
    icon: '/icons/specializations/driver.svg',
    salary: '2 495 000 – 17 325 000 сум',
    count: '16 вакансий',
    href: '/vacancies?specialization=driver',
  },
  {
    id: 'seller',
    name: 'Продавец',
    icon: '/icons/specializations/shopping.svg',
    salary: '1 995 000 – 17 130 000 сум',
    count: '34 вакансий',
    href: '/vacancies?specialization=seller',
  },
  {
    id: 'cashier',
    name: 'Кассир',
    icon: '/icons/specializations/cashier.svg',
    salary: '1 995 000 – 7 130 000 сум',
    count: '23 вакансий',
    href: '/vacancies?specialization=cashier',
  },
  {
    id: 'administrator',
    name: 'Администратор',
    icon: '/icons/specializations/administrative-assistant.svg',
    salary: '1 995 000 – 7 965 000 сум',
    count: '26 вакансий',
    href: '/vacancies?specialization=administrator',
  },
  {
    id: 'operator',
    name: 'Оператор',
    icon: '/icons/specializations/operator.svg',
    salary: '1 995 000 – 12 995 000 сум',
    count: '41 вакансия',
    href: '/vacancies?specialization=operator',
  },
  {
    id: 'programmer',
    name: 'Программист',
    icon: '/icons/specializations/programmer.svg',
    salary: '3 580 000 сум',
    count: '17 вакансий',
    href: '/vacancies?specialization=programmer',
  },
  {
    id: 'manager',
    name: 'Менеджер',
    icon: '/icons/specializations/manager.svg',
    salary: '1 745 000 – 21 330 000 сум',
    count: '135 вакансий',
    href: '/vacancies?specialization=manager',
  },
];

// Дополнительные специализации для кнопки "Развернуть"
export const MORE_SPECIALIZATIONS: FeaturedSpecialization[] = [
  {
    id: 'security_guard',
    name: 'Охранник',
    icon: '/icons/specializations/security-guard.svg',
    salary: '1 500 000 – 5 000 000 сум',
    count: '45 вакансий',
    href: '/vacancies?specialization=security_guard',
  },
  {
    id: 'waiter',
    name: 'Официант',
    icon: '/icons/specializations/waitress.svg',
    salary: '1 200 000 – 3 500 000 сум',
    count: '32 вакансий',
    href: '/vacancies?specialization=waiter',
  },
  {
    id: 'cook',
    name: 'Повар',
    icon: '/icons/specializations/chef.svg',
    salary: '2 000 000 – 8 000 000 сум',
    count: '28 вакансий',
    href: '/vacancies?specialization=cook',
  },
  {
    id: 'cleaner',
    name: 'Уборщик',
    icon: '/icons/specializations/cleaning-cart.svg',
    salary: '800 000 – 2 500 000 сум',
    count: '52 вакансий',
    href: '/vacancies?specialization=cleaner',
  },
];
