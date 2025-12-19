"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { CreateOrderRequest, OrderType } from "@/types";
import { PARENT_CATEGORIES, SPECIALIZATIONS, UZBEKISTAN_CITIES, getSubcategoriesByParentId, getCityName } from "@/constants/registration";
import { 
  EXPERIENCE_LEVELS, 
  EMPLOYMENT_TYPES, 
  WORK_FORMATS, 
  WORK_SCHEDULES, 
  SALARY_PERIODS, 
  SALARY_TYPES, 
  PAYMENT_FREQUENCIES,
  POPULAR_SKILLS,
  LANGUAGES 
} from "@/constants/vacancy";
import { CalendarOneDayIcon } from "@/components/icons/calendar-one-day-icon";
import { DocumentIcon } from "@/components/icons/document-icon";
import { CategoryIcon } from "@/components/icons/category-icon";
import { useTranslations, useLocale } from 'next-intl';
import { getSpecializationName } from '@/lib/specialization-utils';
import { 
  getExperienceLevelLabel, 
  getEmploymentTypeLabel, 
  getWorkFormatLabel, 
  getWorkScheduleLabel,
  getSalaryPeriodLabel,
  getSalaryTypeLabel,
  getPaymentFrequencyLabel,
  getSkillLabel,
  getLanguageLabel
} from '@/constants/translations';

interface FormData {
  type: OrderType;
  title: string;
  description: string;
  specializationId?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  budget: string;
  workersNeeded: string;
  serviceDate: string;
  transportPaid: boolean;
  mealIncluded: boolean;
  mealPaid: boolean;
  // Vacancy-specific fields
  jobTitle?: string;
  experienceLevel?: string;
  employmentType?: string;
  workFormat?: string;
  workSchedule?: string;
  city?: string;
  salaryFrom?: string;
  salaryTo?: string;
  salaryPeriod?: string;
  salaryType?: string;
  paymentFrequency?: string;
  skills?: string[];
  languages?: string[];
}

export function CreateOrderClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const t = useTranslations('createOrder');
  const locale = useLocale();
  const [formData, setFormData] = useState<FormData>({
    type: "daily",
    title: "",
    description: "",
    location: "",
    budget: "",
    workersNeeded: "1",
    serviceDate: "",
    transportPaid: false,
    mealIncluded: false,
    mealPaid: false,
    // Vacancy fields
    salaryPeriod: "per_month",
    salaryType: "gross",
    skills: [],
    languages: [],
  });

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  // Определяем категории для вакансий (исключаем "Работа на 1 день")
  const vacancyParentCategories = PARENT_CATEGORIES.filter(
    (cat) => cat.id !== 'one_day_job'
  );

  // Определяем общее количество шагов в зависимости от типа
  const totalSteps = formData.type === "vacancy" ? 13 : 10;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Фильтруем категории по поисковому запросу
  const getFilteredCategories = () => {
    if (!searchQuery.trim()) {
      return vacancyParentCategories.map(category => ({
        category,
        subcategories: SPECIALIZATIONS.filter(spec => spec.parentIds?.includes(category.id)),
        shouldExpand: false
      }));
    }

    const query = searchQuery.toLowerCase();
    const results: Array<{
      category: typeof vacancyParentCategories[0];
      subcategories: typeof SPECIALIZATIONS;
      shouldExpand: boolean;
    }> = [];

    vacancyParentCategories.forEach(category => {
      const subcategories = SPECIALIZATIONS.filter(spec => spec.parentIds?.includes(category.id));
      const categoryNameMatches = category.name.toLowerCase().includes(query);
      
      const filteredSubcategories = subcategories.filter(sub =>
        sub.name.toLowerCase().includes(query)
      );

      if (categoryNameMatches || filteredSubcategories.length > 0) {
        results.push({
          category,
          subcategories: filteredSubcategories,
          shouldExpand: filteredSubcategories.length > 0
        });
      }
    });

    return results;
  };

  const filteredCategories = getFilteredCategories();

  // Автоматически раскрываем категории при поиске
  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredResults = getFilteredCategories();
      const categoriesToExpand = new Set<string>();
      filteredResults.forEach(item => {
        if (item.shouldExpand) {
          categoriesToExpand.add(item.category.id);
        }
      });
      setExpandedCategories(categoriesToExpand);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...(prev.skills || []), skill]
    }));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills?.includes(customSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), customSkill.trim()]
      }));
      setCustomSkill("");
    }
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages?.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...(prev.languages || []), language]
    }));
  };

  const addCustomLanguage = () => {
    if (customLanguage.trim() && !formData.languages?.includes(customLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...(prev.languages || []), customLanguage.trim()]
      }));
      setCustomLanguage("");
    }
  };

  // Функция для форматирования числа с пробелами
  const formatNumber = (value: string): string => {
    // Удаляем все нечисловые символы
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return '';
    
    // Форматируем с пробелами
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Обработчик для зарплаты с форматированием
  const handleSalaryChange = (field: 'salaryFrom' | 'salaryTo', value: string) => {
    // Удаляем все нечисловые символы для сохранения в state
    const cleanValue = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      [field]: cleanValue
    }));
  };

  // Обработчик для бюджета с форматированием
  const handleBudgetChange = (value: string) => {
    // Удаляем все нечисловые символы для сохранения в state
    const cleanValue = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      budget: cleanValue
    }));
  };

  // Функции для работы с медиа файлами
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = mediaFiles.length + newFiles.length;

    // Проверка на максимальное количество файлов (10)
    if (totalFiles > 10) {
      toast({
        title: t('errors.maxFiles'),
        variant: "destructive",
      });
      return;
    }

    // Проверка размера каждого файла (макс 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const invalidFiles = newFiles.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      toast({
        title: t('errors.maxFileSize'),
        variant: "destructive",
      });
      return;
    }

    // Проверка типа файлов
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    const invalidTypes = newFiles.filter(file => !validTypes.includes(file.type));
    
    if (invalidTypes.length > 0) {
      toast({
        title: t('errors.invalidFileType'),
        variant: "destructive",
      });
      return;
    }

    // Добавляем файлы
    setMediaFiles(prev => [...prev, ...newFiles]);

    // Создаем превью
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step: number): boolean => {
    // Валидация для вакансий
    if (formData.type === "vacancy") {
      switch (step) {
        case 1: // Название вакансии
          if (!formData.jobTitle?.trim()) {
            toast({
              title: t('errors.jobTitleRequired'),
              variant: "destructive",
            });
            return false;
          }
          if (formData.jobTitle.length > 100) {
            toast({
              title: t('errors.jobTitleTooLong'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 2: // Специализация
          if (!formData.specializationId) {
            toast({
              title: t('errors.specializationRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 3: // Опыт работы
          if (!formData.experienceLevel) {
            toast({
              title: t('errors.experienceRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 4: // Тип занятости
          if (!formData.employmentType) {
            toast({
              title: t('errors.employmentRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 5: // Формат работы
          if (!formData.workFormat) {
            toast({
              title: t('errors.workFormatRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 6: // График работы
          if (!formData.workSchedule) {
            toast({
              title: t('errors.workScheduleRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 7: // Местоположение
          if (!formData.location.trim()) {
            toast({
              title: t('errors.locationRequiredVacancy'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 8: // Город
          if (!formData.city) {
            toast({
              title: t('errors.cityRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 9: // Оплата работы
          if (!formData.salaryFrom && !formData.salaryTo) {
            toast({
              title: t('errors.salaryRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 10: // Частота выплат
          if (!formData.paymentFrequency) {
            toast({
              title: t('errors.paymentFrequencyRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 11: // Описание
          if (!formData.description.trim()) {
            toast({
              title: t('errors.descriptionRequired'),
              variant: "destructive",
            });
            return false;
          }
          if (formData.description.length > 2000) {
            toast({
              title: t('errors.descriptionTooLong'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 12: // Навыки
          if (!formData.skills || formData.skills.length === 0) {
            toast({
              title: t('errors.skillsRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 13: // Языки
          if (!formData.languages || formData.languages.length === 0) {
            toast({
              title: t('errors.languagesRequired'),
              variant: "destructive",
            });
            return false;
          }
          return true;

        default:
          return true;
      }
    }

    // Валидация для дневной работы (9 шагов)
    switch (step) {
      case 1: // Название
        if (!formData.title.trim()) {
          toast({
            title: t('errors.titleRequired'),
            variant: "destructive",
          });
          return false;
        }
        if (formData.title.length > 70) {
          toast({
            title: t('errors.titleTooLong'),
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 2: // Специализация
        if (!formData.specializationId) {
          toast({
            title: t('errors.specializationRequired'),
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 3: // Описание (опционально)
        return true;

      case 4: // Местоположение
        if (!formData.location.trim()) {
          toast({
            title: t('errors.locationRequired'),
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 5: // Количество работников
        const workers = parseInt(formData.workersNeeded);
        if (!formData.workersNeeded || isNaN(workers) || workers <= 0) {
          toast({
            title: t('errors.workersRequired'),
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 6: // Бюджет
        const budget = parseFloat(formData.budget);
        if (!formData.budget || isNaN(budget) || budget <= 0) {
          toast({
            title: t('errors.budgetRequired'),
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 7: // Дополнительные удобства (опционально)
        return true;

      case 8: // Дата
        if (!formData.serviceDate) {
          toast({
            title: t('errors.dateRequired'),
            variant: "destructive",
          });
          return false;
        }
        const selectedDate = new Date(formData.serviceDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          toast({
            title: t('errors.datePast'),
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 9: // Медиа (опционально)
        return true;

      case 10: // Подтверждение
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      let orderData: CreateOrderRequest;

      if (formData.type === "vacancy") {
        // Данные для вакансии
        orderData = {
          type: "vacancy",
          title: formData.jobTitle || "",
          description: formData.description,
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          budget: 0, // Для вакансий бюджет не используется
          workersNeeded: 1,
          serviceDate: new Date().toISOString(), // Для вакансий дата не обязательна
          specializationId: formData.specializationId,
          category: "other",
          photos: [],
          // Поля вакансии
          jobTitle: formData.jobTitle,
          experienceLevel: formData.experienceLevel,
          employmentType: formData.employmentType,
          workFormat: formData.workFormat,
          workSchedule: formData.workSchedule,
          city: formData.city,
          salaryFrom: formData.salaryFrom ? parseFloat(formData.salaryFrom) : undefined,
          salaryTo: formData.salaryTo ? parseFloat(formData.salaryTo) : undefined,
          salaryPeriod: formData.salaryPeriod,
          salaryType: formData.salaryType,
          paymentFrequency: formData.paymentFrequency,
          skills: formData.skills,
          languages: formData.languages,
        };
      } else {
        // Данные для дневной работы
        orderData = {
          type: "daily",
          title: formData.title,
          description: formData.description,
          location: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          budget: parseFloat(formData.budget),
          workersNeeded: parseInt(formData.workersNeeded),
          serviceDate: new Date(formData.serviceDate).toISOString(),
          transportPaid: formData.transportPaid,
          mealIncluded: formData.mealIncluded,
          mealPaid: formData.mealPaid,
          specializationId: formData.specializationId,
          category: "other",
          photos: [],
        };
      }

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success && result.data) {
        toast({
          title: t('success.title'),
          description: formData.type === "vacancy" ? t('success.vacancyCreated') : t('success.orderCreated'),
        });
        
        // Редирект в зависимости от типа
        if (formData.type === "vacancy") {
          router.push(`/vacancies/${result.data.id}`);
        } else {
          router.push(`/orders/${result.data.id}`);
        }
      } else {
        toast({
          title: t('errors.createFailed') + " " + (formData.type === "vacancy" ? t('titleVacancy').toLowerCase() : t('title').toLowerCase()),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: t('errors.createError') + " " + (formData.type === "vacancy" ? t('titleVacancy').toLowerCase() : t('title').toLowerCase()),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    if (formData.type === "vacancy") {
      switch (currentStep) {
        case 1: return t('vacancy.step1.title');
        case 2: return t('vacancy.step2.title');
        case 3: return t('vacancy.step3.title');
        case 4: return t('vacancy.step4.title');
        case 5: return t('vacancy.step5.title');
        case 6: return t('vacancy.step6.title');
        case 7: return t('vacancy.step7.title');
        case 8: return t('vacancy.step8.title');
        case 9: return t('vacancy.step9.title');
        case 10: return t('vacancy.step10.title');
        case 11: return t('vacancy.step11.title');
        case 12: return t('vacancy.step12.title');
        case 13: return t('vacancy.step13.title');
        default: return "";
      }
    } else {
      switch (currentStep) {
        case 1: return t('daily.step1.title');
        case 2: return t('daily.step2.title');
        case 3: return t('daily.step3.title');
        case 4: return t('daily.step4.title');
        case 5: return t('daily.step5.title');
        case 6: return t('daily.step6.title');
        case 7: return t('daily.step7.title');
        case 8: return t('daily.step8.title');
        case 9: return t('daily.step9.title');
        case 10: return t('daily.step10.title');
        default: return "";
      }
    }
  };

  const renderVacancySteps = () => {
    switch (currentStep) {
      case 1: // Название вакансии
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="jobTitle">{t('vacancy.step1.label')}</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                type="text"
                value={formData.jobTitle || ""}
                onChange={handleInputChange}
                placeholder={t('vacancy.step1.placeholder')}
                maxLength={100}
                className="mt-1"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-1">
                {(formData.jobTitle || "").length}/100 {t('vacancy.step1.characters')}
              </p>
            </div>
          </div>
        );

      case 2: // Специализация
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">{t('vacancy.step2.searchLabel')}</Label>
              <Input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('vacancy.step2.searchPlaceholder')}
                className="mt-1"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {filteredCategories.length > 0 ? (
                filteredCategories.map(({ category, subcategories }) => {
                  const isExpanded = expandedCategories.has(category.id);
                  return (
                    <div key={category.id} className="border rounded-lg">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon iconName={category.iconName} fallbackIcon={category.icon} className="w-6 h-6" />
                          <span className="font-medium">{getSpecializationName(category.id, locale)}</span>
                        </div>
                        <span>{isExpanded ? "▲" : "▼"}</span>
                      </button>
                      
                      {isExpanded && subcategories.length > 0 && (
                        <div className="p-2 space-y-1 border-t">
                          {subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, specializationId: sub.id }))}
                              className={`w-full text-left p-2 rounded flex items-center gap-2 ${
                                formData.specializationId === sub.id
                                  ? "bg-blue-100 border-2 border-blue-500"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <CategoryIcon iconName={sub.iconName} fallbackIcon={sub.icon} className="w-5 h-5" />
                              <span>{getSpecializationName(sub.id, locale)}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">
                  {t('vacancy.step2.noResults')}
                </p>
              )}
            </div>
          </div>
        );

      case 3: // Опыт работы
        return (
          <div className="space-y-3">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level.value }))}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  formData.experienceLevel === level.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{getExperienceLevelLabel(level.value, locale)}</span>
              </button>
            ))}
          </div>
        );

      case 4: // Тип занятости
        return (
          <div className="space-y-3">
            {EMPLOYMENT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, employmentType: type.value }))}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  formData.employmentType === type.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{getEmploymentTypeLabel(type.value, locale)}</span>
              </button>
            ))}
          </div>
        );

      case 5: // Формат работы
        return (
          <div className="space-y-3">
            {WORK_FORMATS.map((format) => (
              <button
                key={format.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, workFormat: format.value }))}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  formData.workFormat === format.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{getWorkFormatLabel(format.value, locale)}</span>
              </button>
            ))}
          </div>
        );

      case 6: // График работы
        return (
          <div className="space-y-3">
            {WORK_SCHEDULES.map((schedule) => (
              <button
                key={schedule.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, workSchedule: schedule.value }))}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  formData.workSchedule === schedule.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{getWorkScheduleLabel(schedule.value, locale)}</span>
              </button>
            ))}
          </div>
        );

      case 7: // Местоположение
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">{t('vacancy.step7.label')}</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder={t('vacancy.step7.placeholder')}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 8: // Город
        return (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {UZBEKISTAN_CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, city: city.id }))}
                className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                  formData.city === city.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{getCityName(city.id, locale)}</span>
              </button>
            ))}
          </div>
        );

      case 9: // Оплата работы
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryFrom">{t('vacancy.step9.salaryFrom')}</Label>
                <Input
                  id="salaryFrom"
                  name="salaryFrom"
                  type="text"
                  inputMode="numeric"
                  value={formatNumber(formData.salaryFrom || "")}
                  onChange={(e) => handleSalaryChange('salaryFrom', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="salaryTo">{t('vacancy.step9.salaryTo')}</Label>
                <Input
                  id="salaryTo"
                  name="salaryTo"
                  type="text"
                  inputMode="numeric"
                  value={formatNumber(formData.salaryTo || "")}
                  onChange={(e) => handleSalaryChange('salaryTo', e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">{t('vacancy.step9.periodLabel')}</Label>
              <div className="grid grid-cols-3 gap-2">
                {SALARY_PERIODS.map((period) => (
                  <button
                    key={period.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, salaryPeriod: period.value }))}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      (formData.salaryPeriod || "per_month") === period.value
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {getSalaryPeriodLabel(period.value, locale)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">{t('vacancy.step9.typeLabel')}</Label>
              <div className="grid grid-cols-2 gap-2">
                {SALARY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, salaryType: type.value }))}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      (formData.salaryType || "gross") === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {getSalaryTypeLabel(type.value, locale)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 10: // Частота выплат
        return (
          <div className="space-y-3">
            {PAYMENT_FREQUENCIES.map((freq) => (
              <button
                key={freq.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, paymentFrequency: freq.value }))}
                className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                  formData.paymentFrequency === freq.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{getPaymentFrequencyLabel(freq.value, locale)}</span>
              </button>
            ))}
          </div>
        );

      case 11: // Описание
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">{t('vacancy.step11.label')}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('vacancy.step11.placeholder')}
                maxLength={2000}
                rows={8}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/2000 {t('vacancy.step11.characters')}
              </p>
            </div>
          </div>
        );

      case 12: // Навыки
        return (
          <div className="space-y-4">
            <div>
              <Label>{t('vacancy.step12.selectLabel')}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {/* Популярные навыки */}
                {POPULAR_SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm border-2 transition-colors ${
                      formData.skills?.includes(skill)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {getSkillLabel(skill, locale)}
                  </button>
                ))}
                {/* Пользовательские навыки */}
                {formData.skills?.filter(skill => !POPULAR_SKILLS.includes(skill)).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className="px-3 py-1.5 rounded-full text-sm border-2 transition-colors bg-blue-500 text-white border-blue-500 flex items-center gap-1"
                  >
                    <span>{skill}</span>
                    <span className="hover:text-red-200">×</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="customSkill">{t('vacancy.step12.customLabel')}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="customSkill"
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder={t('vacancy.step12.customPlaceholder')}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                />
                <Button type="button" onClick={addCustomSkill} variant="outline">
                  {t('buttons.add')}
                </Button>
              </div>
            </div>

            {formData.skills && formData.skills.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-sm font-medium">
                  {t('vacancy.step12.selected')}: {formData.skills.length}
                </p>
              </div>
            )}
          </div>
        );

      case 13: // Языки
        return (
          <div className="space-y-4">
            <div>
              <Label>{t('vacancy.step13.selectLabel')}</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {/* Популярные языки */}
                {LANGUAGES.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleLanguage(language)}
                    className={`px-3 py-1.5 rounded-full text-sm border-2 transition-colors ${
                      formData.languages?.includes(language)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {getLanguageLabel(language, locale)}
                  </button>
                ))}
                {/* Пользовательские языки */}
                {formData.languages?.filter(language => !LANGUAGES.includes(language)).map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleLanguage(language)}
                    className="px-3 py-1.5 rounded-full text-sm border-2 transition-colors bg-blue-500 text-white border-blue-500 flex items-center gap-1"
                  >
                    <span>{language}</span>
                    <span className="hover:text-red-200">×</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="customLanguage">{t('vacancy.step13.customLabel')}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="customLanguage"
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  placeholder={t('vacancy.step13.customPlaceholder')}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomLanguage();
                    }
                  }}
                />
                <Button type="button" onClick={addCustomLanguage} variant="outline">
                  {t('buttons.add')}
                </Button>
              </div>
            </div>

            {formData.languages && formData.languages.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-sm font-medium">
                  {t('vacancy.step13.selected')}: {formData.languages.length}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderDailyWorkSteps = () => {
    switch (currentStep) {
      case 1: // Название
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">{t('daily.step1.label')}</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={t('daily.step1.placeholder')}
                maxLength={70}
                className="mt-1"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/70 {t('daily.step1.characters')}
              </p>
            </div>
          </div>
        );

      case 2: // Специализация
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">{t('daily.step2.searchLabel')}</Label>
              <Input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('daily.step2.searchPlaceholder')}
                className="mt-1"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {/* Специальная категория "Работа на 1 день" */}
              {(!searchQuery || 'работа на 1 день'.includes(searchQuery.toLowerCase()) || '1 kunlik ish'.includes(searchQuery.toLowerCase())) && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, specializationId: 'one_day_job' }))}
                  className={`w-full text-left p-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                    formData.specializationId === 'one_day_job'
                      ? "bg-blue-100 border-blue-500"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <CalendarOneDayIcon className="w-6 h-6" />
                  <span className="font-medium">{t('daily.step2.oneDayJob')}</span>
                  {formData.specializationId === 'one_day_job' && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              )}

              {/* Родительские категории с подкатегориями */}
              {PARENT_CATEGORIES.filter(cat => cat.id === 'repair_construction').map((category) => {
                const subcategories = getSubcategoriesByParentId(category.id);
                const isExpanded = expandedCategories.has(category.id);
                
                // Фильтрация по поисковому запросу
                const query = searchQuery.toLowerCase();
                const categoryMatches = !query || category.name.toLowerCase().includes(query);
                const matchingSubcategories = !query 
                  ? subcategories 
                  : subcategories.filter(sub => sub.name.toLowerCase().includes(query));
                
                if (!categoryMatches && matchingSubcategories.length === 0) {
                  return null;
                }
                
                return (
                  <div key={category.id} className="border rounded-lg">
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon iconName={category.iconName} fallbackIcon={category.icon} className="w-6 h-6" />
                        <span className="font-medium">{getSpecializationName(category.id, locale)}</span>
                      </div>
                      <span className="text-gray-400">{isExpanded ? "▲" : "▼"}</span>
                    </button>
                    
                    {isExpanded && matchingSubcategories.length > 0 && (
                      <div className="p-2 space-y-1 border-t">
                        {matchingSubcategories.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, specializationId: sub.id }))}
                            className={`w-full text-left p-2 rounded flex items-center gap-2 transition-colors ${
                              formData.specializationId === sub.id
                                ? "bg-blue-100 border-2 border-blue-500"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <CategoryIcon iconName={sub.iconName} fallbackIcon={sub.icon} className="w-5 h-5" />
                            <span>{getSpecializationName(sub.id, locale)}</span>
                            {formData.specializationId === sub.id && (
                              <span className="ml-auto text-blue-600">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3: // Описание (опционально)
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">{t('daily.step3.label')}</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t('daily.step3.placeholder')}
                maxLength={500}
                rows={6}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 {t('daily.step3.characters')}
              </p>
            </div>
            <p className="text-sm text-gray-400">
              {t('daily.step3.hint')}
            </p>
          </div>
        );

      case 4: // Местоположение
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">{t('daily.step4.label')}</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder={t('daily.step4.placeholder')}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 5: // Количество работников
        return (
          <div className="space-y-4">
            <div>
              <Label>{t('daily.step5.label')}</Label>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const count = Math.max(1, parseInt(formData.workersNeeded) - 1);
                    setFormData(prev => ({ ...prev, workersNeeded: count.toString() }));
                  }}
                  className="h-12 w-12"
                >
                  −
                </Button>
                <div className="text-3xl font-bold min-w-[60px] text-center">
                  {formData.workersNeeded}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const count = Math.min(20, parseInt(formData.workersNeeded) + 1);
                    setFormData(prev => ({ ...prev, workersNeeded: count.toString() }));
                  }}
                  className="h-12 w-12"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        );

      case 6: // Бюджет
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="budget">{t('daily.step6.label')}</Label>
              <div className="relative">
                <Input
                  id="budget"
                  name="budget"
                  type="text"
                  inputMode="numeric"
                  value={formatNumber(formData.budget)}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder={t('daily.step6.placeholder')}
                  className="mt-1 pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  UZS
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {t('daily.step6.hint')}
              </p>
            </div>
          </div>
        );

      case 7: // Дополнительные удобства
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">{t('daily.step7.label')}</Label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, transportPaid: !prev.transportPaid }))}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-colors flex items-center gap-3 ${
                    formData.transportPaid
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className={formData.transportPaid ? "font-medium" : ""}>
                    {t('daily.step7.transportPaid')}
                  </span>
                  {formData.transportPaid && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    mealIncluded: !prev.mealIncluded,
                    mealPaid: prev.mealIncluded ? prev.mealPaid : false
                  }))}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-colors flex items-center gap-3 ${
                    formData.mealIncluded
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className={formData.mealIncluded ? "font-medium" : ""}>
                    {t('daily.step7.mealIncluded')}
                  </span>
                  {formData.mealIncluded && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    mealPaid: !prev.mealPaid,
                    mealIncluded: prev.mealPaid ? prev.mealIncluded : false
                  }))}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-colors flex items-center gap-3 ${
                    formData.mealPaid
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className={formData.mealPaid ? "font-medium" : ""}>
                    {t('daily.step7.mealPaid')}
                  </span>
                  {formData.mealPaid && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {t('daily.step7.hint')}
            </p>
          </div>
        );

      case 8: // Дата
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceDate">{t('daily.step8.label')}</Label>
              <Input
                id="serviceDate"
                name="serviceDate"
                type="date"
                value={formData.serviceDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 9: // Медиа (опционально)
        return (
          <div className="space-y-4">
            <div>
              <Label>{t('daily.step9.label')}</Label>
              <p className="text-sm text-gray-500 mt-1 mb-3">
                {t('daily.step9.description')}
              </p>
              
              {/* Превью загруженных файлов */}
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        {mediaFiles[index]?.type.startsWith('video/') ? (
                          <video 
                            src={preview} 
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {mediaFiles[index]?.type.startsWith('video/') ? t('daily.step9.video') : t('daily.step9.photo')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Кнопка загрузки */}
              {mediaFiles.length < 10 && (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    {t('daily.step9.uploadText')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t('daily.step9.fileTypes')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {mediaFiles.length}/10 {t('daily.step9.filesCount')}
                  </p>
                </label>
              )}
              
              {mediaFiles.length >= 10 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-700">
                    {t('daily.step9.maxFiles')}
                  </p>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-400">
              {t('daily.step9.hint')}
            </p>
          </div>
        );

      case 10: // Подтверждение
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg">{t('daily.step10.checkData')}</Label>
              <div className="mt-4 space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">{t('daily.step10.titleField')}</p>
                  <p className="font-medium">{formData.title}</p>
                </div>
                
                {formData.specializationId && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{t('daily.step10.specializationField')}</p>
                    <p className="font-medium">
                      {getSpecializationName(formData.specializationId, locale) || t('daily.step10.notSpecified')}
                    </p>
                  </div>
                )}
                
                {formData.description && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">{t('daily.step10.descriptionField')}</p>
                    <p className="font-medium">{formData.description}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">{t('daily.step10.addressField')}</p>
                  <p className="font-medium">{formData.location}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">{t('daily.step10.workersField')}</p>
                  <p className="font-medium">{formData.workersNeeded} {t('daily.step10.workersPerson')}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">{t('daily.step10.budgetField')}</p>
                  <p className="font-medium">{formatNumber(formData.budget)} UZS {t('daily.step10.perPerson')}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('daily.step10.total')}: {formatNumber((parseFloat(formData.budget.replace(/\s/g, '')) * parseInt(formData.workersNeeded)).toString())} UZS
                  </p>
                </div>
                
                {(formData.transportPaid || formData.mealIncluded || formData.mealPaid) && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">{t('daily.step10.additionalField')}</p>
                    {formData.transportPaid && <p className="text-sm">{t('daily.step10.transportCheck')}</p>}
                    {formData.mealIncluded && <p className="text-sm">{t('daily.step10.mealIncludedCheck')}</p>}
                    {formData.mealPaid && <p className="text-sm">{t('daily.step10.mealPaidCheck')}</p>}
                  </div>
                )}
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">{t('daily.step10.dateField')}</p>
                  <p className="font-medium">
                    {new Date(formData.serviceDate).toLocaleDateString('ru-RU', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                {mediaFiles.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">{t('daily.step10.mediaField')}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {mediaPreviews.slice(0, 4).map((preview, index) => (
                        <div key={index} className="aspect-square rounded overflow-hidden border border-gray-300">
                          {mediaFiles[index]?.type.startsWith('video/') ? (
                            <video src={preview} className="w-full h-full object-cover" />
                          ) : (
                            <img src={preview} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                    {mediaFiles.length > 4 && (
                      <p className="text-xs text-gray-500 mt-2">
                        +{mediaFiles.length - 4} {t('daily.step10.moreFiles')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        {formData.type === "vacancy" ? t('titleVacancy') : t('title')}
      </h1>

      {/* Type Selector - только на первом шаге */}
      {currentStep === 1 && (
        <Card className="p-4 mb-6">
          <Label className="mb-2 block">{t('typeSelector.label')}</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  type: "daily",
                }));
                setCurrentStep(1);
              }}
              className={`p-3 rounded-lg border-2 text-center transition-colors flex flex-col items-center gap-2 ${
                formData.type === "daily"
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <CalendarOneDayIcon className="w-8 h-8" />
              <span>{t('typeSelector.daily')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  type: "vacancy",
                }));
                setCurrentStep(1);
              }}
              className={`p-3 rounded-lg border-2 text-center transition-colors flex flex-col items-center gap-2 ${
                formData.type === "vacancy"
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <DocumentIcon className="w-8 h-8" />
              <span>{t('typeSelector.vacancy')}</span>
            </button>
          </div>
        </Card>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full mx-1 ${
                index + 1 <= currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          {t('progress.step')} {currentStep} {t('progress.of')} {totalSteps}
        </p>
        <p className="text-sm text-gray-500 text-center mt-1">
          {getStepTitle()}
        </p>
      </div>

      <Card className="p-6">
        {formData.type === "vacancy" ? renderVacancySteps() : renderDailyWorkSteps()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-6 border-t">
          {currentStep > 1 && (
            <Button onClick={handleBack} variant="outline" disabled={loading}>
              {t('buttons.back')}
            </Button>
          )}

          <div className="ml-auto">
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={loading} className="text-white">
                {t('buttons.next')}
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? t('buttons.creating') : formData.type === "vacancy" ? t('buttons.createVacancy') : t('buttons.create')}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
