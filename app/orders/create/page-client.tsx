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
import { PARENT_CATEGORIES, SPECIALIZATIONS, UZBEKISTAN_CITIES, getSubcategoriesByParentId } from "@/constants/registration";
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
    salaryType: "before_tax",
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
        title: "Ошибка",
        description: "Максимум 10 файлов",
        variant: "destructive",
      });
      return;
    }

    // Проверка размера каждого файла (макс 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const invalidFiles = newFiles.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Ошибка",
        description: "Размер файла не должен превышать 10 МБ",
        variant: "destructive",
      });
      return;
    }

    // Проверка типа файлов
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    const invalidTypes = newFiles.filter(file => !validTypes.includes(file.type));
    
    if (invalidTypes.length > 0) {
      toast({
        title: "Ошибка",
        description: "Поддерживаются только изображения (JPG, PNG, GIF, WebP) и видео (MP4, WebM)",
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
              title: "Ошибка",
              description: "Введите название вакансии",
              variant: "destructive",
            });
            return false;
          }
          if (formData.jobTitle.length > 100) {
            toast({
              title: "Ошибка",
              description: "Название не должно превышать 100 символов",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 2: // Специализация
          if (!formData.specializationId) {
            toast({
              title: "Ошибка",
              description: "Выберите специализацию",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 3: // Опыт работы
          if (!formData.experienceLevel) {
            toast({
              title: "Ошибка",
              description: "Выберите уровень опыта",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 4: // Тип занятости
          if (!formData.employmentType) {
            toast({
              title: "Ошибка",
              description: "Выберите тип занятости",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 5: // Формат работы
          if (!formData.workFormat) {
            toast({
              title: "Ошибка",
              description: "Выберите формат работы",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 6: // График работы
          if (!formData.workSchedule) {
            toast({
              title: "Ошибка",
              description: "Выберите график работы",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 7: // Местоположение
          if (!formData.location.trim()) {
            toast({
              title: "Ошибка",
              description: "Выберите местоположение",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 8: // Город
          if (!formData.city) {
            toast({
              title: "Ошибка",
              description: "Выберите город",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 9: // Оплата работы
          if (!formData.salaryFrom && !formData.salaryTo) {
            toast({
              title: "Ошибка",
              description: "Укажите зарплату",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 10: // Частота выплат
          if (!formData.paymentFrequency) {
            toast({
              title: "Ошибка",
              description: "Выберите частоту выплат",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 11: // Описание
          if (!formData.description.trim()) {
            toast({
              title: "Ошибка",
              description: "Введите описание вакансии",
              variant: "destructive",
            });
            return false;
          }
          if (formData.description.length > 2000) {
            toast({
              title: "Ошибка",
              description: "Описание не должно превышать 2000 символов",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 12: // Навыки
          if (!formData.skills || formData.skills.length === 0) {
            toast({
              title: "Ошибка",
              description: "Выберите хотя бы один навык",
              variant: "destructive",
            });
            return false;
          }
          return true;

        case 13: // Языки
          if (!formData.languages || formData.languages.length === 0) {
            toast({
              title: "Ошибка",
              description: "Выберите хотя бы один язык",
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
            title: "Ошибка",
            description: "Введите название заказа",
            variant: "destructive",
          });
          return false;
        }
        if (formData.title.length > 70) {
          toast({
            title: "Ошибка",
            description: "Название не должно превышать 70 символов",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 2: // Специализация
        if (!formData.specializationId) {
          toast({
            title: "Ошибка",
            description: "Выберите специализацию",
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
            title: "Ошибка",
            description: "Укажите адрес выполнения работ",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 5: // Количество работников
        const workers = parseInt(formData.workersNeeded);
        if (!formData.workersNeeded || isNaN(workers) || workers <= 0) {
          toast({
            title: "Ошибка",
            description: "Укажите количество исполнителей",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 6: // Бюджет
        const budget = parseFloat(formData.budget);
        if (!formData.budget || isNaN(budget) || budget <= 0) {
          toast({
            title: "Ошибка",
            description: "Укажите корректный бюджет",
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
            title: "Ошибка",
            description: "Выберите дату выполнения работ",
            variant: "destructive",
          });
          return false;
        }
        const selectedDate = new Date(formData.serviceDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          toast({
            title: "Ошибка",
            description: "Дата не может быть в прошлом",
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
          title: "Успешно!",
          description: formData.type === "vacancy" ? "Вакансия успешно создана" : "Заказ успешно создан",
        });
        
        // Редирект в зависимости от типа
        if (formData.type === "vacancy") {
          router.push(`/vacancies/${result.data.id}`);
        } else {
          router.push(`/orders/${result.data.id}`);
        }
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Не удалось создать " + (formData.type === "vacancy" ? "вакансию" : "заказ"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при создании " + (formData.type === "vacancy" ? "вакансии" : "заказа"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    if (formData.type === "vacancy") {
      switch (currentStep) {
        case 1: return "Название вакансии";
        case 2: return "Специализация";
        case 3: return "Опыт работы";
        case 4: return "Тип занятости";
        case 5: return "Формат работы";
        case 6: return "График работы";
        case 7: return "Местоположение";
        case 8: return "Город";
        case 9: return "Оплата работы";
        case 10: return "Частота выплат";
        case 11: return "Описание вакансии";
        case 12: return "Навыки";
        case 13: return "Языки";
        default: return "";
      }
    } else {
      switch (currentStep) {
        case 1: return "Название";
        case 2: return "Специализация";
        case 3: return "Описание";
        case 4: return "Местоположение";
        case 5: return "Количество работников";
        case 6: return "Бюджет";
        case 7: return "Дополнительные удобства";
        case 8: return "Дата выполнения";
        case 9: return "Фото и видео";
        case 10: return "Подтверждение";
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
              <Label htmlFor="jobTitle">Название вакансии *</Label>
              <Input
                id="jobTitle"
                name="jobTitle"
                type="text"
                value={formData.jobTitle || ""}
                onChange={handleInputChange}
                placeholder="Например: Программист на React Native"
                maxLength={100}
                className="mt-1"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-1">
                {(formData.jobTitle || "").length}/100 символов
              </p>
            </div>
          </div>
        );

      case 2: // Специализация
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Поиск специализации</Label>
              <Input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
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
                          <span className="font-medium">{category.name}</span>
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
                              <span>{sub.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Специализации не найдены
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
                <span className="font-medium">{level.label}</span>
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
                <span className="font-medium">{type.label}</span>
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
                <span className="font-medium">{format.label}</span>
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
                <span className="font-medium">{schedule.label}</span>
              </button>
            ))}
          </div>
        );

      case 7: // Местоположение
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Адрес *</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Например: Ташкент, улица Амира Темура 1"
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
                <span className="font-medium">{city.name}</span>
              </button>
            ))}
          </div>
        );

      case 9: // Оплата работы
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaryFrom">От (сум)</Label>
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
                <Label htmlFor="salaryTo">До (сум)</Label>
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
              <Label className="mb-2 block">Период оплаты</Label>
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
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Тип зарплаты</Label>
              <div className="grid grid-cols-2 gap-2">
                {SALARY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, salaryType: type.value }))}
                    className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      (formData.salaryType || "before_tax") === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {type.label}
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
                <span className="font-medium">{freq.label}</span>
              </button>
            ))}
          </div>
        );

      case 11: // Описание
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Описание вакансии *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Опишите обязанности, требования и условия работы..."
                maxLength={2000}
                rows={8}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/2000 символов
              </p>
            </div>
          </div>
        );

      case 12: // Навыки
        return (
          <div className="space-y-4">
            <div>
              <Label>Выберите навыки</Label>
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
                    {skill}
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
              <Label htmlFor="customSkill">Добавить свой навык</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="customSkill"
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  placeholder="Введите навык..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                />
                <Button type="button" onClick={addCustomSkill} variant="outline">
                  Добавить
                </Button>
              </div>
            </div>

            {formData.skills && formData.skills.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-sm font-medium">
                  Выбрано навыков: {formData.skills.length}
                </p>
              </div>
            )}
          </div>
        );

      case 13: // Языки
        return (
          <div className="space-y-4">
            <div>
              <Label>Выберите языки</Label>
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
                    {language}
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
              <Label htmlFor="customLanguage">Добавить свой язык</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="customLanguage"
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  placeholder="Введите язык..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomLanguage();
                    }
                  }}
                />
                <Button type="button" onClick={addCustomLanguage} variant="outline">
                  Добавить
                </Button>
              </div>
            </div>

            {formData.languages && formData.languages.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-sm font-medium">
                  Выбрано языков: {formData.languages.length}
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
              <Label htmlFor="title">Название заказа *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Например: Требуется сантехник"
                maxLength={70}
                className="mt-1"
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/70 символов
              </p>
            </div>
          </div>
        );

      case 2: // Специализация
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="search">Поиск специализации</Label>
              <Input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск..."
                className="mt-1"
              />
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {/* Специальная категория "Работа на 1 день" */}
              {(!searchQuery || 'работа на 1 день'.includes(searchQuery.toLowerCase())) && (
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
                  <span className="font-medium">Работа на 1 день</span>
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
                        <span className="font-medium">{category.name}</span>
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
                            <span>{sub.name}</span>
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
              <Label htmlFor="description">Описание работ (необязательно)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Опишите, что нужно сделать..."
                maxLength={500}
                rows={6}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 символов
              </p>
            </div>
            <p className="text-sm text-gray-400">
              💡 Вы можете пропустить этот шаг
            </p>
          </div>
        );

      case 4: // Местоположение
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Адрес выполнения работ *</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Например: Ташкент, улица Амира Темура 1"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 5: // Количество работников
        return (
          <div className="space-y-4">
            <div>
              <Label>Количество исполнителей *</Label>
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
              <Label htmlFor="budget">Бюджет за одного работника (сум) *</Label>
              <div className="relative">
                <Input
                  id="budget"
                  name="budget"
                  type="text"
                  inputMode="numeric"
                  value={formatNumber(formData.budget)}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder="100 000"
                  className="mt-1 pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  UZS
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                💡 Укажите оплату за каждого работника
              </p>
            </div>
          </div>
        );

      case 7: // Дополнительные удобства
        return (
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Дополнительные условия (необязательно)</Label>
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
                    🚗 Проезд оплачивается
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
                    🍽️ Питание включено
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
                    💰 Питание оплачивается
                  </span>
                  {formData.mealPaid && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              💡 Вы можете пропустить этот шаг
            </p>
          </div>
        );

      case 8: // Дата
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="serviceDate">Дата выполнения работ *</Label>
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
              <Label>Фото и видео (необязательно)</Label>
              <p className="text-sm text-gray-500 mt-1 mb-3">
                Добавьте до 10 фотографий или видео для лучшего понимания задачи
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
                        {mediaFiles[index]?.type.startsWith('video/') ? '🎥 Видео' : '📷 Фото'}
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
                    Нажмите для загрузки или перетащите файлы
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, GIF, WebP, MP4, WebM (макс. 10 МБ)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {mediaFiles.length}/10 файлов
                  </p>
                </label>
              )}
              
              {mediaFiles.length >= 10 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <p className="text-sm text-blue-700">
                    ✓ Загружено максимальное количество файлов (10)
                  </p>
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-400">
              💡 Вы можете пропустить этот шаг
            </p>
          </div>
        );

      case 10: // Подтверждение
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-lg">Проверьте данные заказа</Label>
              <div className="mt-4 space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Название</p>
                  <p className="font-medium">{formData.title}</p>
                </div>
                
                {formData.specializationId && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Специализация</p>
                    <p className="font-medium">
                      {SPECIALIZATIONS.find(s => s.id === formData.specializationId)?.name || 'Не указано'}
                    </p>
                  </div>
                )}
                
                {formData.description && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Описание</p>
                    <p className="font-medium">{formData.description}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Адрес</p>
                  <p className="font-medium">{formData.location}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Количество работников</p>
                  <p className="font-medium">{formData.workersNeeded} чел.</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Бюджет</p>
                  <p className="font-medium">{formatNumber(formData.budget)} UZS за человека</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Всего: {formatNumber((parseFloat(formData.budget.replace(/\s/g, '')) * parseInt(formData.workersNeeded)).toString())} UZS
                  </p>
                </div>
                
                {(formData.transportPaid || formData.mealIncluded || formData.mealPaid) && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Дополнительные условия</p>
                    {formData.transportPaid && <p className="text-sm">✓ Проезд оплачивается</p>}
                    {formData.mealIncluded && <p className="text-sm">✓ Питание включено</p>}
                    {formData.mealPaid && <p className="text-sm">✓ Питание оплачивается</p>}
                  </div>
                )}
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Дата выполнения</p>
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
                    <p className="text-sm text-gray-600 mb-2">Медиа файлы</p>
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
                        +{mediaFiles.length - 4} еще
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
        {formData.type === "vacancy" ? "Создать вакансию" : "Создать заказ"}
      </h1>

      {/* Type Selector - только на первом шаге */}
      {currentStep === 1 && (
        <Card className="p-4 mb-6">
          <Label className="mb-2 block">Тип</Label>
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
              <span>Дневная работа</span>
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
              <span>Вакансия</span>
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
          Шаг {currentStep} из {totalSteps}
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
              Назад
            </Button>
          )}

          <div className="ml-auto">
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={loading} className="text-white">
                Далее
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Создание..." : formData.type === "vacancy" ? "Создать вакансию" : "Создать заказ"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
