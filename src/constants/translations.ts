// Переводы для различных типов данных

// Тип занятости (Employment Type) - используем те же ключи что и в мобильном
const employmentTypeTranslations = {
  ru: {
    "full_time": "Полная занятость",
    "part_time": "Частичная занятость",
    "contract": "Работа по договору",
    "temporary": "Временная работа",
    "internship": "Стажировка",
    "project": "Проектная работа",
  },
  uz: {
    "full_time": "To'liq bandlik",
    "part_time": "Qisman bandlik",
    "contract": "Shartnoma bo'yicha ish",
    "temporary": "Vaqtinchalik ish",
    "internship": "Amaliyot",
    "project": "Loyiha ishi",
  }
};

export const getEmploymentTypeLabel = (key: string, locale: string = 'uz'): string => {
  const translations = employmentTypeTranslations[locale as 'ru' | 'uz'] || employmentTypeTranslations.uz;
  return translations[key as keyof typeof translations] || key;
};

// Для обратной совместимости
export const employmentTypeLabels: Record<string, string> = employmentTypeTranslations.uz;

// Формат работы (Work Format)
const workFormatTranslations = {
  ru: {
    "office": "В офисе",
    "remote": "Удаленно",
    "hybrid": "Гибрид",
    "on_site": "В офисе",
  },
  uz: {
    "office": "Ofisda",
    "remote": "Masofaviy",
    "hybrid": "Gibrid",
    "on_site": "Ofisda",
  }
};

export const getWorkFormatLabel = (key: string, locale: string = 'uz'): string => {
  const translations = workFormatTranslations[locale as 'ru' | 'uz'] || workFormatTranslations.uz;
  return translations[key as keyof typeof translations] || key;
};

export const workFormatLabels: Record<string, string> = workFormatTranslations.uz;

// Уровень опыта (Experience Level) - используем те же ключи что и в мобильном
const experienceLevelTranslations = {
  ru: {
    "no_experience": "Без опыта",
    "less_than_1": "До 1 года",
    "1_to_3": "1-3 года",
    "3_to_5": "3-5 лет",
    "more_than_5": "Более 5 лет",
    "from_1_year": "От 1 года",
    "from_3_years": "От 3 лет",
    "from_5_years": "От 5 лет",
    "from_10_years": "От 10 лет",
  },
  uz: {
    "no_experience": "Tajribasiz",
    "less_than_1": "1 yilgacha",
    "1_to_3": "1-3 yil",
    "3_to_5": "3-5 yil",
    "more_than_5": "5 yildan ortiq",
    "from_1_year": "1 yildan",
    "from_3_years": "3 yildan",
    "from_5_years": "5 yildan",
    "from_10_years": "10 yildan",
  }
};

export const getExperienceLevelLabel = (key: string, locale: string = 'uz'): string => {
  const translations = experienceLevelTranslations[locale as 'ru' | 'uz'] || experienceLevelTranslations.uz;
  return translations[key as keyof typeof translations] || key;
};

export const experienceLevelLabels: Record<string, string> = experienceLevelTranslations.uz;

// График работы (Work Schedule)
const workScheduleTranslations = {
  ru: {
    "full_day": "Полный день",
    "shift": "Сменный график",
    "flexible": "Гибкий график",
    "rotating": "Вахтовый метод",
    "8_to_20": "8:00 - 20:00",
  },
  uz: {
    "full_day": "To'liq kun",
    "shift": "Smenali grafik",
    "flexible": "Moslashuvchan grafik",
    "rotating": "Vaxta usuli",
    "8_to_20": "8:00 - 20:00",
  }
};

export const getWorkScheduleLabel = (key: string, locale: string = 'uz'): string => {
  const translations = workScheduleTranslations[locale as 'ru' | 'uz'] || workScheduleTranslations.uz;
  return translations[key as keyof typeof translations] || key;
};

export const workScheduleLabels: Record<string, string> = workScheduleTranslations.uz;

// Период выплаты зарплаты (Salary Period)
const salaryPeriodTranslations = {
  ru: {
    "per_hour": "В час",
    "per_day": "В день",
    "per_month": "В месяц",
    "month": "в месяц",
    "hour": "в час",
    "day": "в день",
    "week": "в неделю",
  },
  uz: {
    "per_hour": "Soatiga",
    "per_day": "Kuniga",
    "per_month": "Oyiga",
    "month": "oyiga",
    "hour": "soatiga",
    "day": "kuniga",
    "week": "haftasiga",
  }
};

export const getSalaryPeriodLabel = (key: string, locale: string = 'uz'): string => {
  const translations = salaryPeriodTranslations[locale as 'ru' | 'uz'] || salaryPeriodTranslations.uz;
  return translations[key as keyof typeof translations] || key;
};

export const salaryPeriodLabels: Record<string, string> = salaryPeriodTranslations.uz;

// Частота выплат (Payment Frequency)
const paymentFrequencyTranslations = {
  ru: {
    "daily": "Ежедневно",
    "weekly": "Еженедельно",
    "biweekly": "Раз в 2 недели",
    "monthly": "Ежемесячно",
    "by_agreement": "По договоренности",
  },
  uz: {
    "daily": "Har kuni",
    "weekly": "Har hafta",
    "biweekly": "2 haftada bir marta",
    "monthly": "Har oy",
    "by_agreement": "Kelishuvga ko'ra",
  }
};

export const getPaymentFrequencyLabel = (key: string, locale: string = 'uz'): string => {
  const translations = paymentFrequencyTranslations[locale as 'ru' | 'uz'] || paymentFrequencyTranslations.uz;
  return translations[key as keyof typeof translations] || key;
};

export const paymentFrequencyLabels: Record<string, string> = paymentFrequencyTranslations.uz;

// Типы зарплаты (Salary Type) - используем те же ключи что и в мобильном
const salaryTypeTranslations = {
  ru: {
    "gross": "До вычета налогов",
    "net": "На руки",
    "before_tax": "До вычета налогов",
    "after_tax": "На руки",
  },
  uz: {
    "gross": "Soliq chiqarilgunga qadar",
    "net": "Qo'lga",
    "before_tax": "Soliq chiqarilgunga qadar",
    "after_tax": "Qo'lga",
  }
};

export const getSalaryTypeLabel = (key: string, locale: string = 'uz'): string => {
  const translations = salaryTypeTranslations[locale as 'ru' | 'uz'] || salaryTypeTranslations.uz;
  return translations[key as keyof typeof translations] || key;
};

export const salaryTypeLabels: Record<string, string> = salaryTypeTranslations.uz;

// Языки (Languages)
const languageTranslations = {
  ru: {
    "russian": "Русский",
    "uzbek": "Узбекский",
    "english": "Английский",
    "kazakh": "Казахский",
    "turkish": "Турецкий",
    "chinese": "Китайский",
    "korean": "Корейский",
    "german": "Немецкий",
    "french": "Французский",
    "spanish": "Испанский",
    "arabic": "Арабский",
    "persian": "Персидский",
    "kyrgyz": "Киргизский",
    "tajik": "Таджикский",
    "turkmen": "Туркменский",
    // Варианты на русском (как хранятся в БД)
    "Русский": "Русский",
    "Узбекский": "Узбекский",
    "Английский": "Английский",
    "Казахский": "Казахский",
    "Турецкий": "Турецкий",
    "Китайский": "Китайский",
    "Корейский": "Корейский",
    "Немецкий": "Немецкий",
    "Французский": "Французский",
    "Испанский": "Испанский",
    "Арабский": "Арабский",
    "Персидский": "Персидский",
    "Киргизский": "Киргизский",
    "Таджикский": "Таджикский",
    "Туркменский": "Туркменский",
  },
  uz: {
    "russian": "Rus tili",
    "uzbek": "O'zbek tili",
    "english": "Ingliz tili",
    "kazakh": "Qozoq tili",
    "turkish": "Turk tili",
    "chinese": "Xitoy tili",
    "korean": "Koreya tili",
    "german": "Nemis tili",
    "french": "Fransuz tili",
    "spanish": "Ispan tili",
    "arabic": "Arab tili",
    "persian": "Fors tili",
    "kyrgyz": "Qirg'iz tili",
    "tajik": "Tojik tili",
    "turkmen": "Turkman tili",
    // Варианты на русском (как хранятся в БД)
    "Русский": "Rus tili",
    "Узбекский": "O'zbek tili",
    "Английский": "Ingliz tili",
    "Казахский": "Qozoq tili",
    "Турецкий": "Turk tili",
    "Китайский": "Xitoy tili",
    "Корейский": "Koreya tili",
    "Немецкий": "Nemis tili",
    "Французский": "Fransuz tili",
    "Испанский": "Ispan tili",
    "Арабский": "Arab tili",
    "Персидский": "Fors tili",
    "Киргизский": "Qirg'iz tili",
    "Таджикский": "Tojik tili",
    "Туркменский": "Turkman tili",
  }
};

export const getLanguageLabel = (key: string, locale: string = 'uz'): string => {
  const translations = languageTranslations[locale as 'ru' | 'uz'] || languageTranslations.uz;
  return translations[key as keyof typeof translations] || key;
};

export const languageLabels: Record<string, string> = languageTranslations.uz;

// Навыки (Skills) - для перевода навыков из базы данных
const skillsTranslations = {
  ru: {
    // Популярные навыки из POPULAR_SKILLS
    "Microsoft Office": "Microsoft Office",
    "Excel": "Excel",
    "Word": "Word",
    "PowerPoint": "PowerPoint",
    "1C": "1C",
    "Водительские права": "Водительские права",
    "Работа с клиентами": "Работа с клиентами",
    "Продажи": "Продажи",
    "Коммуникабельность": "Коммуникабельность",
    "Ответственность": "Ответственность",
    "Пунктуальность": "Пунктуальность",
    "Командная работа": "Командная работа",
    "Лидерство": "Лидерство",
    "Организаторские способности": "Организаторские способности",
    "Аналитическое мышление": "Аналитическое мышление",
    "Креативность": "Креативность",
    "Быстрая обучаемость": "Быстрая обучаемость",
    "Управление проектами": "Управление проектами",
    "Презентация": "Презентация",
    "Переговоры": "Переговоры",
    // Дополнительные навыки
    "Водительские права категории B": "Водительские права категории B",
    "Знание английского языка": "Знание английского языка",
    "Знание русского языка": "Знание русского языка",
    "Опыт продаж": "Опыт продаж",
  },
  uz: {
    // Популярные навыки из POPULAR_SKILLS
    "Microsoft Office": "Microsoft Office",
    "Excel": "Excel",
    "Word": "Word",
    "PowerPoint": "PowerPoint",
    "1C": "1C",
    "Водительские права": "Haydovchilik guvohnomasi",
    "Работа с клиентами": "Mijozlar bilan ishlash",
    "Продажи": "Savdo",
    "Коммуникабельность": "Muloqotchanlik",
    "Ответственность": "Mas'uliyat",
    "Пунктуальность": "Punktuallik",
    "Командная работа": "Jamoaviy ish",
    "Лидерство": "Yetakchilik",
    "Организаторские способности": "Tashkiliy qobiliyat",
    "Аналитическое мышление": "Analitik fikrlash",
    "Креативность": "Kreativlik",
    "Быстрая обучаемость": "Tez o'rganish qobiliyati",
    "Управление проектами": "Loyihalarni boshqarish",
    "Презентация": "Taqdimot",
    "Переговоры": "Muzokaralar",
    // Дополнительные навыки
    "Водительские права категории B": "B toifali haydovchilik guvohnomasi",
    "Знание английского языка": "Ingliz tilini bilish",
    "Знание русского языка": "Rus tilini bilish",
    "Опыт продаж": "Savdo tajribasi",
  }
};

export const getSkillLabel = (key: string, locale: string = 'uz'): string => {
  const translations = skillsTranslations[locale as 'ru' | 'uz'] || skillsTranslations.uz;
  return translations[key as keyof typeof translations] || key;
};


