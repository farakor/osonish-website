"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslations, useLocale } from 'next-intl';
import { UZBEKISTAN_CITIES, SPECIALIZATIONS, getCityName } from "@/constants/registration";
import { getSpecializationName } from '@/lib/specialization-utils';

export interface VacancyFilterValues {
  search?: string;
  city?: string;
  category?: string;
  employmentType?: string;
  experienceLevel?: string;
  workFormat?: string;
  salaryFrom?: number;
  salaryTo?: number;
}

interface VacancyFiltersProps {
  onFilterChange: (filters: VacancyFilterValues) => void;
  initialFilters?: VacancyFilterValues;
}

export function VacancyFilters({
  onFilterChange,
  initialFilters = {},
}: VacancyFiltersProps) {
  const t = useTranslations('vacancies.filters');
  const tEmployment = useTranslations('employmentTypes');
  const tWorkFormat = useTranslations('workFormats');
  const tExperience = useTranslations('experienceLevels');
  const locale = useLocale();
  const [filters, setFilters] = useState<VacancyFilterValues>(initialFilters);
  const [specializationSearch, setSpecializationSearch] = useState("");
  const [salaryFromDisplay, setSalaryFromDisplay] = useState("");
  const [salaryToDisplay, setSalaryToDisplay] = useState("");

  // Функция для форматирования числа с пробелами
  const formatNumber = (value: string): string => {
    // Удаляем все нечисловые символы
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    
    // Форматируем с пробелами
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Функция для преобразования форматированной строки в число
  const parseFormattedNumber = (value: string): number | undefined => {
    const numbers = value.replace(/\D/g, '');
    return numbers ? Number(numbers) : undefined;
  };

  // Получаем только подспециализации (те, у которых есть parentIds)
  // Исключаем "Работа на 1 день" и "Другое"
  const allSubspecializations = SPECIALIZATIONS.filter(
    (spec) => 
      spec.parentIds && 
      spec.parentIds.length > 0 && 
      spec.id !== 'one_day_job' && 
      spec.id !== 'other_category'
  );

  // Фильтруем специализации по поисковому запросу
  const subspecializations = allSubspecializations.filter((spec) => {
    if (!specializationSearch) return true;
    const searchLower = specializationSearch.toLowerCase();
    const specName = getSpecializationName(spec.id, locale).toLowerCase();
    return specName.includes(searchLower);
  });

  const handleFilterChange = (key: keyof VacancyFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    setSalaryFromDisplay("");
    setSalaryToDisplay("");
    setSpecializationSearch("");
    onFilterChange({});
  };

  return (
    <div className="bg-card rounded-lg border p-6 sticky top-4">
      <h2 className="text-lg font-semibold mb-4">{t('title')}</h2>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">{t('search')}</Label>
          <Input
            id="search"
            placeholder={t('searchPlaceholder')}
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city">{t('city')}</Label>
          <Select
            value={filters.city || "all"}
            onValueChange={(value) => handleFilterChange("city", value === "all" ? undefined : value)}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder={t('selectCity')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCities')}</SelectItem>
              {UZBEKISTAN_CITIES.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {getCityName(city.id, locale)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category/Specialization */}
        <div>
          <Label htmlFor="category">{t('category')}</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => {
              handleFilterChange("category", value === "all" ? undefined : value);
              setSpecializationSearch(""); // Сбрасываем поиск при выборе
            }}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={t('selectCategory')} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {/* Поле поиска */}
              <div className="sticky top-0 z-10 bg-background p-2 border-b">
                <Input
                  placeholder={t('searchSpecialization') || 'Поиск специализации...'}
                  value={specializationSearch}
                  onChange={(e) => setSpecializationSearch(e.target.value)}
                  className="h-8"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              
              {subspecializations.length > 0 ? (
                subspecializations.map((spec) => (
                  <SelectItem key={spec.id} value={spec.id}>
                    {getSpecializationName(spec.id, locale)}
                  </SelectItem>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {t('noSpecializationsFound') || 'Специализации не найдены'}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Employment Type */}
        <div>
          <Label htmlFor="employmentType">{t('employmentType')}</Label>
          <Select
            value={filters.employmentType || "all"}
            onValueChange={(value) =>
              handleFilterChange("employmentType", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger id="employmentType">
              <SelectValue placeholder={t('selectEmploymentType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              <SelectItem value="full_time">{tEmployment('full_time')}</SelectItem>
              <SelectItem value="part_time">{tEmployment('part_time')}</SelectItem>
              <SelectItem value="project">{tEmployment('project')}</SelectItem>
              <SelectItem value="contract">{tEmployment('contract')}</SelectItem>
              <SelectItem value="temporary">{tEmployment('temporary')}</SelectItem>
              <SelectItem value="internship">{tEmployment('internship')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Work Format */}
        <div>
          <Label htmlFor="workFormat">{t('workFormat')}</Label>
          <Select
            value={filters.workFormat || "all"}
            onValueChange={(value) => handleFilterChange("workFormat", value === "all" ? undefined : value)}
          >
            <SelectTrigger id="workFormat">
              <SelectValue placeholder={t('selectWorkFormat')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allFormats')}</SelectItem>
              <SelectItem value="office">{tWorkFormat('office')}</SelectItem>
              <SelectItem value="remote">{tWorkFormat('remote')}</SelectItem>
              <SelectItem value="hybrid">{tWorkFormat('hybrid')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div>
          <Label htmlFor="experienceLevel">{t('experienceLevel')}</Label>
          <Select
            value={filters.experienceLevel || "all"}
            onValueChange={(value) =>
              handleFilterChange("experienceLevel", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger id="experienceLevel">
              <SelectValue placeholder={t('selectExperienceLevel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allExperience')}</SelectItem>
              <SelectItem value="no_experience">{tExperience('no_experience')}</SelectItem>
              <SelectItem value="less_than_1">{tExperience('less_than_1')}</SelectItem>
              <SelectItem value="1_to_3">{tExperience('1_to_3')}</SelectItem>
              <SelectItem value="3_to_5">{tExperience('3_to_5')}</SelectItem>
              <SelectItem value="more_than_5">{tExperience('more_than_5')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range */}
        <div>
          <Label>{t('salary')}</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="text"
              inputMode="numeric"
              placeholder={t('salaryFrom')}
              value={salaryFromDisplay}
              onChange={(e) => {
                const formatted = formatNumber(e.target.value);
                setSalaryFromDisplay(formatted);
                handleFilterChange("salaryFrom", parseFormattedNumber(formatted));
              }}
            />
            <Input
              type="text"
              inputMode="numeric"
              placeholder={t('salaryTo')}
              value={salaryToDisplay}
              onChange={(e) => {
                const formatted = formatNumber(e.target.value);
                setSalaryToDisplay(formatted);
                handleFilterChange("salaryTo", parseFormattedNumber(formatted));
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-4">
          <Button onClick={handleApply} className="w-full text-white">
            {t('apply')}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            {t('reset')}
          </Button>
        </div>
      </div>
    </div>
  );
}
