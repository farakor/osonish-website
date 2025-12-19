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
import { useTranslations } from 'next-intl';

export interface VacancyFilterValues {
  search?: string;
  city?: string;
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
  const [filters, setFilters] = useState<VacancyFilterValues>(initialFilters);

  const handleFilterChange = (key: keyof VacancyFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({});
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
              <SelectItem value="Ташкент">Ташкент</SelectItem>
              <SelectItem value="Самарканд">Самарканд</SelectItem>
              <SelectItem value="Бухара">Бухара</SelectItem>
              <SelectItem value="Фергана">Фергана</SelectItem>
              <SelectItem value="Андижан">Андижан</SelectItem>
              <SelectItem value="Наманган">Наманган</SelectItem>
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
              <SelectItem value="Полная занятость">{tEmployment('full_time')}</SelectItem>
              <SelectItem value="Частичная занятость">{tEmployment('part_time')}</SelectItem>
              <SelectItem value="Проектная работа">{tEmployment('project')}</SelectItem>
              <SelectItem value="Стажировка">{tEmployment('internship')}</SelectItem>
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
              <SelectItem value="Офис">{tWorkFormat('on_site')}</SelectItem>
              <SelectItem value="Удаленно">{tWorkFormat('remote')}</SelectItem>
              <SelectItem value="Гибрид">{tWorkFormat('hybrid')}</SelectItem>
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
              <SelectItem value="Без опыта">{tExperience('no_experience')}</SelectItem>
              <SelectItem value="1-3 года">{tExperience('1_to_3')}</SelectItem>
              <SelectItem value="3+ года">{tExperience('3_to_5')}</SelectItem>
              <SelectItem value="5+ лет">{tExperience('more_than_5')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range */}
        <div>
          <Label>{t('salary')}</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="number"
              placeholder={t('salaryFrom')}
              value={filters.salaryFrom || ""}
              onChange={(e) =>
                handleFilterChange(
                  "salaryFrom",
                  e.target.value ? Number(e.target.value) * 1000000 : undefined
                )
              }
            />
            <Input
              type="number"
              placeholder={t('salaryTo')}
              value={filters.salaryTo || ""}
              onChange={(e) =>
                handleFilterChange(
                  "salaryTo",
                  e.target.value ? Number(e.target.value) * 1000000 : undefined
                )
              }
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
