// Города Узбекистана
export const UZBEKISTAN_CITIES = [
  { id: 'tashkent', name: 'Ташкент' },
  { id: 'samarkand', name: 'Самарканд' },
  { id: 'bukhara', name: 'Бухара' },
  { id: 'andijan', name: 'Андижан' },
  { id: 'jizzakh', name: 'Джизак' },
  { id: 'karshi', name: 'Карши' },
  { id: 'navoi', name: 'Навои' },
  { id: 'namangan', name: 'Наманган' },
  { id: 'termez', name: 'Термез' },
  { id: 'sirdarya', name: 'Сырдарья' },
  { id: 'chirchik', name: 'Чирчик' },
  { id: 'fergana', name: 'Фергана' },
  { id: 'urgench', name: 'Ургенч' },
  { id: 'nukus', name: 'Нукус' },
] as const;

export const WORKER_TYPES = [
  {
    id: 'daily_worker',
    name: 'Работник на день',
    description: 'Подработка, разовые задачи, временные работы',
    icon: '📅'
  },
  {
    id: 'professional',
    name: 'Профессионал',
    description: 'Специалист с навыками и опытом в конкретной области',
    icon: '🔨'
  },
  {
    id: 'job_seeker',
    name: 'Соискатель',
    description: 'Ищу постоянную работу, офисную должность',
    icon: '💼'
  },
] as const;

export type CityId = typeof UZBEKISTAN_CITIES[number]['id'];
export type WorkerType = typeof WORKER_TYPES[number]['id'];

// Education Types (для Job Seeker)
export interface Education {
  institution: string;
  degree?: string;
  yearStart?: string;
  yearEnd?: string;
}

// Work Experience Types (для Job Seeker)
export interface WorkExperience {
  company: string;
  position: string;
  yearStart?: string;
  yearEnd?: string;
  description?: string;
}

// Популярные навыки для выбора
export const POPULAR_SKILLS = [
  'Microsoft Office',
  'Excel',
  'Word',
  'PowerPoint',
  '1C',
  'Английский язык',
  'Русский язык',
  'Узбекский язык',
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
] as const;

// Специализации (из мобильного приложения)
export interface SpecializationOption {
  id: string;
  name: string;
  icon: string; // emoji (для fallback)
  iconName?: string; // имя SVG файла (без расширения)
  parentIds?: string[];
  isParent?: boolean;
}

// 27 родительских категорий (с SVG иконками)
export const PARENT_CATEGORIES: SpecializationOption[] = [
  { id: 'repair_construction', name: 'Ремонт и строительство', icon: '🏗️', iconName: 'construction', isParent: true },
  { id: 'auto_business', name: 'Автомобильный бизнес', icon: '🚗', iconName: 'mini-car', isParent: true },
  { id: 'administrative_staff', name: 'Административный персонал', icon: '📋', iconName: 'administrative-assistant', isParent: true },
  { id: 'security', name: 'Безопасность', icon: '🛡️', iconName: 'shield', isParent: true },
  { id: 'senior_management', name: 'Высший и средний менеджмент', icon: '👔', iconName: 'ceo', isParent: true },
  { id: 'raw_materials_extraction', name: 'Добыча сырья', icon: '⛏️', iconName: 'drilling-process', isParent: true },
  { id: 'household_service_staff', name: 'Домашний, обслуживающий персонал', icon: '🏠', iconName: 'waitress', isParent: true },
  { id: 'procurement', name: 'Закупки', icon: '📦', iconName: 'grocery', isParent: true },
  { id: 'information_technology', name: 'Информационные технологии', icon: '💻', iconName: 'web-developer', isParent: true },
  { id: 'arts_entertainment_media', name: 'Искусство, развлечения, массмедиа', icon: '🎭', iconName: 'painting', isParent: true },
  { id: 'marketing_advertising_pr', name: 'Маркетинг, реклама, PR', icon: '📢', iconName: 'marketing', isParent: true },
  { id: 'medicine_pharma', name: 'Медицина, фармацевтика', icon: '⚕️', iconName: 'medicine', isParent: true },
  { id: 'science_education', name: 'Наука, образование', icon: '📚', iconName: 'science-book', isParent: true },
  { id: 'sales_customer_service', name: 'Продажи, обслуживание клиентов', icon: '💼', iconName: 'sales-pipeline', isParent: true },
  { id: 'production_service', name: 'Производство, сервисное обслуживание', icon: '⚙️', iconName: 'service-tools', isParent: true },
  { id: 'working_personnel', name: 'Рабочий персонал', icon: '🔧', iconName: 'delivery-man', isParent: true },
  { id: 'retail', name: 'Розничная торговля', icon: '🛍️', iconName: 'shopping-bag', isParent: true },
  { id: 'agriculture', name: 'Сельское хозяйство', icon: '🌾', iconName: 'growing-seed', isParent: true },
  { id: 'sports_fitness_beauty', name: 'Спортивные клубы, фитнес, салоны красоты', icon: '💪', iconName: 'weightlifting', isParent: true },
  { id: 'strategy_investment_consulting', name: 'Стратегия, инвестиции, консалтинг', icon: '📈', iconName: 'consulting', isParent: true },
  { id: 'insurance', name: 'Страхование', icon: '🛡️', iconName: 'insurance', isParent: true },
  { id: 'transport_logistics', name: 'Транспорт, логистика, перевозки', icon: '🚚', iconName: 'delivery-truck', isParent: true },
  { id: 'tourism_hotels_restaurants', name: 'Туризм, гостиницы, рестораны', icon: '🏨', iconName: 'hotel-rating-building-stars', isParent: true },
  { id: 'hr_training', name: 'Управление персоналом, тренинги', icon: '👥', iconName: 'hr', isParent: true },
  { id: 'finance_accounting', name: 'Финансы, бухгалтерия', icon: '💰', iconName: 'financing', isParent: true },
  { id: 'legal', name: 'Юристы', icon: '⚖️', iconName: 'justice', isParent: true },
  { id: 'other', name: 'Другое', icon: '📋', iconName: 'more', isParent: true },
];

// ВСЕ специализации из мобильного приложения (с SVG иконками)
export const SPECIALIZATIONS: SpecializationOption[] = [
  { id: 'one_day_job', name: 'Работа на 1 день', icon: '📅', iconName: 'calendar-one-day' },
  { id: 'brigades', name: 'Бригады', icon: '👷', iconName: 'management', parentIds: ['repair_construction'] },
  { id: 'plumber', name: 'Сантехники', icon: '🔧', iconName: 'faucet', parentIds: ['repair_construction'] },
  { id: 'electrician', name: 'Электрики', icon: '⚡', iconName: 'electric-power', parentIds: ['repair_construction'] },
  { id: 'painter', name: 'Маляр-Штукатур', icon: '🎨', iconName: 'paint-roller', parentIds: ['repair_construction'] },
  { id: 'boiler_installation', name: 'Установка котлов', icon: '🔥', iconName: 'gas-kotel', parentIds: ['repair_construction'] },
  { id: 'gas_electric_stoves', name: 'Газовые и электроплиты', icon: '🍳', iconName: 'gas-stove', parentIds: ['repair_construction'] },
  { id: 'carpenter', name: 'Плотники', icon: '🪚', iconName: 'saw', parentIds: ['repair_construction'] },
  { id: 'gardener', name: 'Садовник', icon: '🌱', iconName: 'gardening', parentIds: ['repair_construction'] },
  { id: 'air_conditioner', name: 'Кондиционеры', icon: '❄️', iconName: 'air-conditioner', parentIds: ['repair_construction'] },
  { id: 'washing_machine', name: 'Стиральные машины', icon: '🧺', iconName: 'laundry', parentIds: ['repair_construction'] },
  { id: 'turnkey_renovation', name: 'Ремонт под ключ', icon: '🏠', iconName: 'renovation', parentIds: ['repair_construction'] },
  { id: 'lock_repair', name: 'Ремонт замков', icon: '🔐', iconName: 'padlock', parentIds: ['repair_construction'] },
  { id: 'refrigerator', name: 'Холодильники', icon: '🧊', iconName: 'smart-refrigirator', parentIds: ['repair_construction'] },
  { id: 'doors', name: 'Двери', icon: '🚪', iconName: 'door', parentIds: ['repair_construction'] },
  { id: 'plastic_windows', name: 'Пластиковые окна', icon: '🪟', iconName: 'window', parentIds: ['repair_construction'] },
  { id: 'bricklaying', name: 'Кладка кирпича', icon: '🧱', iconName: 'construction', parentIds: ['repair_construction'] },
  { id: 'custom_furniture', name: 'Мебель на заказ', icon: '🪑', iconName: 'bed', parentIds: ['repair_construction'] },
  { id: 'welder', name: 'Сварщики', icon: '🔨', iconName: 'welder', parentIds: ['repair_construction'] },
  { id: 'roofer', name: 'Кровельщики', icon: '🏗️', iconName: 'rooftile', parentIds: ['repair_construction'] },
  { id: 'tiler', name: 'Плиточники', icon: '🟦', iconName: 'tile', parentIds: ['repair_construction'] },
  { id: 'car_washer', name: 'Автомойщик', icon: '🚿', iconName: 'worker', parentIds: ['auto_business'] },
  { id: 'auto_mechanic', name: 'Автослесарь, автомеханик', icon: '🔧', iconName: 'repair-3', parentIds: ['auto_business', 'working_personnel'] },
  { id: 'service_advisor', name: 'Мастер-приемщик', icon: '📋', iconName: 'worker-master', parentIds: ['auto_business'] },
  { id: 'sales_manager', name: 'Менеджер по продажам, менеджер по работе с клиентами', icon: '💼', iconName: 'fund-manager', parentIds: ['auto_business', 'marketing_advertising_pr', 'sales_customer_service', 'sports_fitness_beauty'] },
  { id: 'administrator', name: 'Администратор', icon: '👔', iconName: 'external-salesman', parentIds: ['administrative_staff', 'household_service_staff', 'medicine_pharma', 'sports_fitness_beauty', 'tourism_hotels_restaurants'] },
  { id: 'records_clerk', name: 'Делопроизводитель, архивариус', icon: '📁', iconName: 'files', parentIds: ['administrative_staff'] },
  { id: 'courier', name: 'Курьер', icon: '📦', iconName: 'delivery-courier', parentIds: ['administrative_staff', 'household_service_staff', 'transport_logistics'] },
  { id: 'facility_manager', name: 'Менеджер/руководитель АХО', icon: '🏢', iconName: 'manager', parentIds: ['administrative_staff', 'tourism_hotels_restaurants'] },
  { id: 'data_operator', name: 'Оператор ПК, оператор базы данных', icon: '💻', iconName: 'customer-service', parentIds: ['administrative_staff'] },
  { id: 'office_manager', name: 'Офис-менеджер', icon: '🗂️', iconName: 'work', parentIds: ['administrative_staff'] },
  { id: 'translator', name: 'Переводчик', icon: '🌐', iconName: 'translator', parentIds: ['administrative_staff'] },
  { id: 'secretary', name: 'Секретарь, помощник руководителя, ассистент', icon: '📝', iconName: 'secretary', parentIds: ['administrative_staff'] },
  { id: 'security_guard', name: 'Охранник', icon: '🛡️', iconName: 'security-guard', parentIds: ['security', 'household_service_staff'] },
  { id: 'security_it_specialist', name: 'Специалист по информационной безопасности', icon: '🔒', iconName: 'personal-data', parentIds: ['security', 'information_technology'] },
  { id: 'security_service_specialist', name: 'Специалист службы безопасности', icon: '👮', iconName: 'police', parentIds: ['security'] },
  { id: 'ceo', name: 'Генеральный директор, исполнительный директор (CEO)', icon: '🎯', iconName: 'ceo', parentIds: ['senior_management'] },
  { id: 'cio', name: 'Директор по информационным технологиям (CIO)', icon: '💻', iconName: 'programmer', parentIds: ['senior_management', 'information_technology'] },
  { id: 'cmo', name: 'Директор по маркетингу и PR (CMO)', icon: '📢', iconName: 'marketing-agent', parentIds: ['senior_management', 'marketing_advertising_pr'] },
  { id: 'hrd', name: 'Директор по персоналу (HRD)', icon: '👥', iconName: 'career', parentIds: ['senior_management', 'hr_training'] },
  { id: 'clo', name: 'Директор юридического департамента (CLO)', icon: '⚖️', iconName: 'lawyer-man', parentIds: ['senior_management', 'legal'] },
  { id: 'cco', name: 'Коммерческий директор (CCO)', icon: '💰', iconName: 'finance', parentIds: ['senior_management', 'sales_customer_service'] },
  { id: 'production_manager', name: 'Начальник производства', icon: '🏭', iconName: 'production-assistant', parentIds: ['senior_management', 'production_service'] },
  { id: 'coo', name: 'Операционный директор (COO)', icon: '⚙️', iconName: 'management-consulting', parentIds: ['senior_management'] },
  { id: 'analytics_head', name: 'Руководитель отдела аналитики', icon: '📊', iconName: 'outcome', parentIds: ['senior_management', 'information_technology'] },
  { id: 'senior_logistics_head', name: 'Руководитель отдела логистики', icon: '🚚', iconName: 'logistics-assistant', parentIds: ['senior_management', 'transport_logistics'] },
  { id: 'marketing_head', name: 'Руководитель отдела маркетинга и рекламы', icon: '📈', iconName: 'sales-promoter', parentIds: ['senior_management', 'marketing_advertising_pr'] },
  { id: 'senior_hr_head', name: 'Руководитель отдела персонала', icon: '👔', iconName: 'job-interview', parentIds: ['senior_management', 'hr_training'] },
  { id: 'branch_manager', name: 'Руководитель филиала', icon: '🏢', iconName: 'enterprise', parentIds: ['senior_management', 'sales_customer_service'] },
  { id: 'cto', name: 'Технический директор (CTO)', icon: '🔧', iconName: 'strategic-consulting', parentIds: ['senior_management', 'information_technology'] },
  { id: 'senior_cfo', name: 'Финансовый директор (CFO)', icon: '💵', iconName: 'self-employed', parentIds: ['senior_management', 'finance_accounting'] },
  { id: 'geodesist', name: 'Геодезист', icon: '🗺️', iconName: 'surveyor', parentIds: ['raw_materials_extraction'] },
  { id: 'geologist', name: 'Геолог', icon: '🪨', iconName: 'geologist', parentIds: ['raw_materials_extraction'] },
  { id: 'laboratory_assistant', name: 'Лаборант', icon: '🧪', iconName: 'researcher', parentIds: ['raw_materials_extraction', 'medicine_pharma', 'science_education', 'production_service'] },
  { id: 'machinist', name: 'Машинист', icon: '🚜', iconName: 'worker-2', parentIds: ['raw_materials_extraction', 'production_service', 'working_personnel', 'agriculture', 'transport_logistics'] },
  { id: 'research_specialist', name: 'Научный специалист, исследователь', icon: '🔬', iconName: 'scientist', parentIds: ['raw_materials_extraction', 'medicine_pharma', 'science_education', 'production_service'] },
  { id: 'shift_supervisor', name: 'Начальник смены, мастер участка', icon: '👷', iconName: 'mentor', parentIds: ['raw_materials_extraction', 'production_service'] },
  { id: 'technologist', name: 'Технолог', icon: '⚗️', iconName: 'human-resources', parentIds: ['raw_materials_extraction', 'production_service', 'agriculture'] },
  { id: 'driver', name: 'Водитель', icon: '🚗', iconName: 'driver', parentIds: ['household_service_staff', 'working_personnel', 'transport_logistics'] },
  { id: 'nanny', name: 'Воспитатель, няня', icon: '👶', iconName: 'daycare', parentIds: ['household_service_staff', 'science_education'] },
  { id: 'janitor', name: 'Дворник', icon: '🧹', iconName: 'dust', parentIds: ['household_service_staff'] },
  { id: 'waiter', name: 'Официант, бармен, бариста', icon: '☕', iconName: 'bartender', parentIds: ['household_service_staff', 'tourism_hotels_restaurants'] },
  { id: 'cleaner', name: 'Уборщица, уборщик', icon: '🧽', iconName: 'cleaning-cart', parentIds: ['household_service_staff', 'tourism_hotels_restaurants'] },
  { id: 'procurement_manager', name: 'Менеджер по закупкам', icon: '🛒', iconName: 'shopping', parentIds: ['procurement'] },
  { id: 'tender_specialist', name: 'Специалист по тендерам', icon: '📋', iconName: 'task', parentIds: ['procurement'] },
  { id: 'bi_analyst', name: 'BI-аналитик, аналитик данных', icon: '📊', iconName: 'bar-chart', parentIds: ['information_technology'] },
  { id: 'devops_engineer', name: 'DevOps-инженер', icon: '🔧', iconName: 'backend', parentIds: ['information_technology'] },
  { id: 'it_analyst', name: 'Аналитик', icon: '📈', iconName: 'pie-chart', parentIds: ['information_technology', 'marketing_advertising_pr', 'sales_customer_service', 'strategy_investment_consulting'] },
  { id: 'art_director', name: 'Арт-директор, креативный директор', icon: '🎨', iconName: 'photo-gallery', parentIds: ['information_technology', 'arts_entertainment_media', 'marketing_advertising_pr'] },
  { id: 'business_analyst', name: 'Бизнес-аналитик', icon: '💼', iconName: 'document', parentIds: ['information_technology', 'strategy_investment_consulting'] },
  { id: 'game_designer', name: 'Гейм-дизайнер', icon: '🎮', iconName: 'videogame', parentIds: ['information_technology', 'arts_entertainment_media'] },
  { id: 'data_scientist', name: 'Дата-сайентист', icon: '🔬', iconName: 'virtual-lab', parentIds: ['information_technology'] },
  { id: 'designer', name: 'Дизайнер, художник', icon: '🖌️', iconName: 'design', parentIds: ['information_technology', 'arts_entertainment_media', 'marketing_advertising_pr'] },
  { id: 'product_manager', name: 'Менеджер продукта', icon: '📱', iconName: 'assortment', parentIds: ['information_technology'] },
  { id: 'methodologist', name: 'Методолог', icon: '📚', iconName: 'cheque', parentIds: ['information_technology', 'finance_accounting'] },
  { id: 'software_developer', name: 'Программист, разработчик', icon: '👨‍💻', iconName: 'programmer-2', parentIds: ['information_technology'] },
  { id: 'product_analyst', name: 'Продуктовый аналитик', icon: '📊', iconName: 'analytics', parentIds: ['information_technology'] },
  { id: 'dev_team_lead', name: 'Руководитель группы разработки', icon: '👥', iconName: 'teamwork', parentIds: ['information_technology'] },
  { id: 'project_manager', name: 'Руководитель проектов', icon: '📋', iconName: 'project', parentIds: ['information_technology', 'strategy_investment_consulting'] },
  { id: 'network_engineer', name: 'Сетевой инженер', icon: '🌐', iconName: 'network', parentIds: ['information_technology'] },
  { id: 'system_administrator', name: 'Системный администратор', icon: '🖥️', iconName: 'laptop', parentIds: ['information_technology'] },
  { id: 'system_analyst', name: 'Системный аналитик', icon: '🔍', iconName: 'performance', parentIds: ['information_technology'] },
  { id: 'system_engineer', name: 'Системный инженер', icon: '⚙️', iconName: 'gears', parentIds: ['information_technology'] },
  { id: 'tech_support', name: 'Специалист технической поддержки', icon: '🛠️', iconName: 'customer-service-2', parentIds: ['information_technology', 'sales_customer_service'] },
  { id: 'qa_tester', name: 'Тестировщик', icon: '🧪', iconName: 'tester', parentIds: ['information_technology'] },
  { id: 'technical_writer', name: 'Технический писатель', icon: '📝', iconName: 'content-creator', parentIds: ['information_technology'] },
  { id: 'artist_actor', name: 'Артист, актер, аниматор', icon: '🎭', iconName: 'actor', parentIds: ['arts_entertainment_media'] },
  { id: 'videographer', name: 'Видеооператор, видеомонтажер', icon: '🎬', iconName: 'cameraman', parentIds: ['arts_entertainment_media'] },
  { id: 'journalist', name: 'Журналист, корреспондент', icon: '📰', iconName: 'reporter', parentIds: ['arts_entertainment_media'] },
  { id: 'copywriter', name: 'Копирайтер, редактор, корректор', icon: '✍️', iconName: 'blog', parentIds: ['arts_entertainment_media', 'marketing_advertising_pr'] },
  { id: 'producer', name: 'Продюсер', icon: '🎥', iconName: 'movie', parentIds: ['arts_entertainment_media'] },
  { id: 'director', name: 'Режиссер, сценарист', icon: '🎬', iconName: 'director-chair', parentIds: ['arts_entertainment_media'] },
  { id: 'photographer', name: 'Фотограф, ретушер', icon: '📷', iconName: 'photographer', parentIds: ['arts_entertainment_media'] },
  { id: 'event_manager', name: 'Event-менеджер', icon: '🎉', iconName: 'event-management', parentIds: ['marketing_advertising_pr'] },
  { id: 'pr_manager', name: 'PR-менеджер', icon: '📣', iconName: 'advertising', parentIds: ['marketing_advertising_pr'] },
  { id: 'smm_manager', name: 'SMM-менеджер, контент-менеджер', icon: '📱', iconName: 'content-marketing', parentIds: ['marketing_advertising_pr'] },
  { id: 'marketing_analytics_specialist', name: 'Маркетолог-аналитик', icon: '📈', iconName: 'statistics', parentIds: ['marketing_advertising_pr'] },
  { id: 'marketing_manager', name: 'Менеджер по маркетингу, интернет-маркетолог', icon: '💼', iconName: 'phone-ad', parentIds: ['marketing_advertising_pr'] },
  { id: 'partner_manager', name: 'Менеджер по работе с партнерами', icon: '🤝', iconName: 'handshake', parentIds: ['marketing_advertising_pr', 'sales_customer_service'] },
  { id: 'promoter', name: 'Промоутер', icon: '📢', iconName: 'megaphone', parentIds: ['marketing_advertising_pr', 'retail'] },
  { id: 'medical_assistant', name: 'Ассистент врача', icon: '👨‍⚕️', iconName: 'file-delivery', parentIds: ['medicine_pharma'] },
  { id: 'veterinarian', name: 'Ветеринарный врач', icon: '🐾', iconName: 'veterinarian', parentIds: ['medicine_pharma', 'agriculture'] },
  { id: 'doctor', name: 'Врач', icon: '👨‍⚕️', iconName: 'doctor', parentIds: ['medicine_pharma'] },
  { id: 'chief_doctor', name: 'Главный врач, заведующий отделением', icon: '🩺', iconName: 'doctor-2', parentIds: ['medicine_pharma'] },
  { id: 'pharmacy_manager', name: 'Заведующий аптекой', icon: '💊', iconName: 'pharmacist', parentIds: ['medicine_pharma'] },
  { id: 'nurse', name: 'Медицинская сестра, медицинский брат', icon: '👩‍⚕️', iconName: 'nursing-technician', parentIds: ['medicine_pharma'] },
  { id: 'medical_rep', name: 'Медицинский представитель', icon: '💼', iconName: 'doctors-office', parentIds: ['medicine_pharma'] },
  { id: 'certification_specialist', name: 'Специалист по сертификации', icon: '📜', iconName: 'certificate-authority', parentIds: ['medicine_pharma', 'sales_customer_service', 'production_service'] },
  { id: 'pharmacist', name: 'Фармацевт-провизор', icon: '💊', iconName: 'drug-research', parentIds: ['medicine_pharma'] },
  { id: 'business_trainer', name: 'Бизнес-тренер', icon: '📊', iconName: 'presentation', parentIds: ['science_education', 'hr_training'] },
  { id: 'education_methodologist', name: 'Методист', icon: '📝', iconName: 'open-book-gear', parentIds: ['science_education'] },
  { id: 'psychologist', name: 'Психолог', icon: '🧠', iconName: 'observation', parentIds: ['science_education'] },
  { id: 'teacher', name: 'Учитель, преподаватель, педагог', icon: '👨‍🏫', iconName: 'teacher', parentIds: ['science_education'] },
  { id: 'real_estate_agent', name: 'Агент по недвижимости', icon: '🏢', iconName: 'estate-agent', parentIds: ['sales_customer_service'] },
  { id: 'broker', name: 'Брокер', icon: '💹', iconName: 'work-experience', parentIds: ['sales_customer_service', 'finance_accounting'] },
  { id: 'cashier', name: 'Кассир-операционист', icon: '💵', iconName: 'cashier', parentIds: ['sales_customer_service'] },
  { id: 'sales_coordinator', name: 'Координатор отдела продаж', icon: '📋', iconName: 'sales-pipeline-1', parentIds: ['sales_customer_service'] },
  { id: 'credit_specialist', name: 'Кредитный специалист', icon: '💳', iconName: 'credit-score', parentIds: ['sales_customer_service', 'finance_accounting'] },
  { id: 'call_center_operator', name: 'Оператор call-центра, специалист контактного центра', icon: '📞', iconName: 'support-24', parentIds: ['sales_customer_service'] },
  { id: 'sales_consultant', name: 'Продавец-консультант, продавец-кассир', icon: '🛒', iconName: 'financial-consultation', parentIds: ['sales_customer_service', 'retail'] },
  { id: 'customer_service_head', name: 'Руководитель отдела клиентского обслуживания', icon: '👔', iconName: 'info', parentIds: ['sales_customer_service'] },
  { id: 'sales_head', name: 'Руководитель отдела продаж', icon: '👔', iconName: 'collaborator', parentIds: ['sales_customer_service'] },
  { id: 'insurance_agent', name: 'Страховой агент', icon: '🛡️', iconName: 'protection', parentIds: ['sales_customer_service', 'insurance'] },
  { id: 'sales_representative', name: 'Торговый представитель', icon: '💼', iconName: 'shopping-2', parentIds: ['sales_customer_service'] },
  { id: 'commissioning_engineer', name: 'Инженер ПНР', icon: '🔧', iconName: 'business-development', parentIds: ['production_service'] },
  { id: 'quality_engineer', name: 'Инженер по качеству', icon: '✅', iconName: 'quality-control', parentIds: ['production_service'] },
  { id: 'safety_engineer', name: 'Инженер по охране труда и технике безопасности, инженер-эколог', icon: '🛡️', iconName: 'labor-safety', parentIds: ['production_service'] },
  { id: 'operation_engineer', name: 'Инженер по эксплуатации', icon: '⚙️', iconName: 'helmet', parentIds: ['production_service'] },
  { id: 'design_engineer', name: 'Инженер-конструктор, инженер-проектировщик', icon: '📐', iconName: 'hands-wrench', parentIds: ['production_service'] },
  { id: 'electronic_engineer', name: 'Инженер-электроник, инженер-электронщик', icon: '🔌', iconName: 'electric-power-2', parentIds: ['production_service'] },
  { id: 'electrical_engineer', name: 'Инженер-энергетик, инженер-электрик', icon: '⚡', iconName: 'hand-holding-lightning', parentIds: ['production_service'] },
  { id: 'quality_controller', name: 'Контролёр ОТК', icon: '🔍', iconName: 'equalizer', parentIds: ['production_service'] },
  { id: 'equipment_repair_master', name: 'Мастер по ремонту оборудования, техники', icon: '🔧', iconName: 'repair', parentIds: ['production_service'] },
  { id: 'metrologist', name: 'Метролог', icon: '📏', iconName: 'measure', parentIds: ['production_service'] },
  { id: 'production_mechanic', name: 'Механик', icon: '🔧', iconName: 'mechanic', parentIds: ['production_service', 'working_personnel'] },
  { id: 'production_line_operator', name: 'Оператор производственной линии', icon: '🏭', iconName: 'conveyor-belt', parentIds: ['production_service', 'working_personnel'] },
  { id: 'cnc_operator', name: 'Оператор станков с ЧПУ', icon: '🖥️', iconName: '3d-printing', parentIds: ['production_service', 'working_personnel'] },
  { id: 'production_welder', name: 'Сварщик', icon: '🔥', iconName: 'welder', parentIds: ['production_service', 'working_personnel'] },
  { id: 'service_engineer', name: 'Сервисный инженер, инженер-механик', icon: '🔧', iconName: 'technical-service', parentIds: ['production_service', 'working_personnel', 'agriculture'] },
  { id: 'production_locksmith', name: 'Слесарь, сантехник', icon: '🔧', iconName: 'faucet', parentIds: ['production_service', 'working_personnel'] },
  { id: 'turner_milling_machine_operator', name: 'Токарь, фрезеровщик, шлифовщик', icon: '⚙️', iconName: 'laser', parentIds: ['production_service', 'working_personnel'] },
  { id: 'seamstress', name: 'Швея, портной, закройщик', icon: '🧵', iconName: 'sewing-machine', parentIds: ['production_service'] },
  { id: 'production_electrician', name: 'Электромонтажник', icon: '⚡', iconName: 'panel', parentIds: ['production_service', 'working_personnel'] },
  { id: 'loader', name: 'Грузчик', icon: '📦', iconName: 'delivery-man', parentIds: ['working_personnel', 'transport_logistics'] },
  { id: 'storekeeper', name: 'Кладовщик', icon: '📦', iconName: 'cart', parentIds: ['working_personnel', 'transport_logistics'] },
  { id: 'worker_painter', name: 'Маляр, штукатур', icon: '🎨', iconName: 'painter', parentIds: ['working_personnel'] },
  { id: 'assembler', name: 'Монтажник', icon: '🔧', iconName: 'toolbox', parentIds: ['working_personnel'] },
  { id: 'general_worker', name: 'Разнорабочий', icon: '👷', iconName: 'multitasking', parentIds: ['working_personnel'] },
  { id: 'packer', name: 'Упаковщик, комплектовщик', icon: '📦', iconName: 'package', parentIds: ['working_personnel', 'transport_logistics'] },
  { id: 'store_administrator', name: 'Администратор магазина, администратор торгового зала', icon: '🏪', iconName: 'manager-2', parentIds: ['retail'] },
  { id: 'store_director', name: 'Директор магазина, директор сети магазинов', icon: '👔', iconName: 'boss', parentIds: ['retail'] },
  { id: 'merchandiser', name: 'Мерчандайзер', icon: '📊', iconName: 'inventory', parentIds: ['retail'] },
  { id: 'supervisor', name: 'Супервайзер', icon: '👁️', iconName: 'woman-leader', parentIds: ['retail'] },
  { id: 'merchandising_specialist', name: 'Товаровед', icon: '📋', iconName: 'box', parentIds: ['retail'] },
  { id: 'agronomist', name: 'Агроном', icon: '🌱', iconName: 'growing-plant', parentIds: ['agriculture'] },
  { id: 'zootechnician', name: 'Зоотехник', icon: '🐄', iconName: 'species', parentIds: ['agriculture'] },
  { id: 'cosmetologist', name: 'Косметолог', icon: '💆', iconName: 'cleansing', parentIds: ['sports_fitness_beauty'] },
  { id: 'massage_therapist', name: 'Массажист', icon: '💆', iconName: 'massage', parentIds: ['sports_fitness_beauty'] },
  { id: 'nail_technician', name: 'Мастер ногтевого сервиса', icon: '💅', iconName: 'nail-polish', parentIds: ['sports_fitness_beauty'] },
  { id: 'hairdresser', name: 'Парикмахер', icon: '💇', iconName: 'hair-styling', parentIds: ['sports_fitness_beauty'] },
  { id: 'fitness_trainer', name: 'Фитнес-тренер, инструктор тренажерного зала', icon: '🏋️', iconName: 'muscle', parentIds: ['sports_fitness_beauty'] },
  { id: 'strategy_consultant', name: 'Менеджер/консультант по стратегии', icon: '💼', iconName: 'strategy', parentIds: ['strategy_investment_consulting'] },
  { id: 'financial_analyst', name: 'Финансовый аналитик, инвестиционный аналитик', icon: '💹', iconName: 'analytics-2', parentIds: ['strategy_investment_consulting', 'finance_accounting'] },
  { id: 'underwriter', name: 'Андеррайтер', icon: '📝', iconName: 'project-management', parentIds: ['insurance'] },
  { id: 'appraiser', name: 'Оценщик', icon: '📊', iconName: 'search', parentIds: ['insurance'] },
  { id: 'flight_attendant', name: 'Бортпроводник', icon: '✈️', iconName: 'stewardess', parentIds: ['transport_logistics'] },
  { id: 'dispatcher', name: 'Диспетчер', icon: '📞', iconName: 'operator', parentIds: ['transport_logistics'] },
  { id: 'logistics_manager', name: 'Менеджер по логистике, менеджер по ВЭД', icon: '📋', iconName: 'container', parentIds: ['transport_logistics'] },
  { id: 'warehouse_manager', name: 'Начальник склада', icon: '🏢', iconName: 'warehouse', parentIds: ['transport_logistics'] },
  { id: 'tourism_manager', name: 'Менеджер по туризму', icon: '🗺️', iconName: 'tour-guide', parentIds: ['tourism_hotels_restaurants'] },
  { id: 'restaurant_manager', name: 'Менеджер ресторана', icon: '🍽️', iconName: 'referee', parentIds: ['tourism_hotels_restaurants'] },
  { id: 'chef', name: 'Повар, пекарь, кондитер', icon: '👨‍🍳', iconName: 'chef', parentIds: ['tourism_hotels_restaurants'] },
  { id: 'hostess', name: 'Хостес', icon: '💁', iconName: 'woman', parentIds: ['tourism_hotels_restaurants'] },
  { id: 'compensation_manager', name: 'Менеджер по компенсациям и льготам', icon: '💰', iconName: 'cashback', parentIds: ['hr_training'] },
  { id: 'hr_manager', name: 'Менеджер по персоналу', icon: '👥', iconName: 'leadership', parentIds: ['hr_training'] },
  { id: 'hr_specialist', name: 'Специалист по кадрам', icon: '📋', iconName: 'hr-2', parentIds: ['hr_training'] },
  { id: 'recruiter', name: 'Специалист по подбору персонала', icon: '🔍', iconName: 'choose', parentIds: ['hr_training'] },
  { id: 'auditor', name: 'Аудитор', icon: '🔍', iconName: 'audit-document', parentIds: ['finance_accounting'] },
  { id: 'accountant', name: 'Бухгалтер', icon: '💼', iconName: 'tax', parentIds: ['finance_accounting'] },
  { id: 'treasurer', name: 'Казначей', icon: '💰', iconName: 'money-bag', parentIds: ['finance_accounting'] },
  { id: 'compliance_manager', name: 'Комплаенс-менеджер', icon: '📋', iconName: 'planning', parentIds: ['finance_accounting', 'legal'] },
  { id: 'debt_collector', name: 'Специалист по взысканию задолженности', icon: '💸', iconName: 'bond', parentIds: ['finance_accounting'] },
  { id: 'financial_controller', name: 'Финансовый контролер', icon: '📊', iconName: 'money', parentIds: ['finance_accounting'] },
  { id: 'financial_manager', name: 'Финансовый менеджер', icon: '💼', iconName: 'financing-2', parentIds: ['finance_accounting'] },
  { id: 'economist', name: 'Экономист', icon: '📈', iconName: 'growth', parentIds: ['finance_accounting'] },
  { id: 'legal_counsel', name: 'Юрисконсульт', icon: '⚖️', iconName: 'lawyer', parentIds: ['legal'] },
  { id: 'lawyer', name: 'Юрист', icon: '⚖️', iconName: 'lawyer-day', parentIds: ['legal'] },
  { id: 'other_category', name: 'Другое', icon: '📋', iconName: 'more', parentIds: ['other'] },
];

// Получить подкатегории по родительскому ID
export const getSubcategoriesByParentId = (parentId: string): SpecializationOption[] => {
  return SPECIALIZATIONS.filter(spec => spec.parentIds?.includes(parentId));
};

// Получить специализацию по ID
export const getSpecializationById = (id: string): SpecializationOption | undefined => {
  const parentSpec = PARENT_CATEGORIES.find(spec => spec.id === id);
  if (parentSpec) return parentSpec;
  return SPECIALIZATIONS.find(spec => spec.id === id);
};
