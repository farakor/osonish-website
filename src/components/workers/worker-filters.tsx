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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { UZBEKISTAN_CITIES, SPECIALIZATIONS, getCityName } from "@/constants/registration";
import { getSpecializationName } from '@/lib/specialization-utils';
import { MobileFiltersDrawer } from "@/components/shared/mobile-filters-drawer";

export interface WorkerFilterValues {
  search?: string;
  city?: string;
  specialization?: string;
  workerType?: "daily_worker" | "professional" | "job_seeker";
  minRating?: number;
}

interface WorkerFiltersProps {
  onFilterChange: (filters: WorkerFilterValues) => void;
  initialFilters?: WorkerFilterValues;
}

export function WorkerFilters({
  onFilterChange,
  initialFilters = {},
}: WorkerFiltersProps) {
  const t = useTranslations('workers.filters');
  const locale = useLocale();
  const [filters, setFilters] = useState<WorkerFilterValues>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [specializationSearch, setSpecializationSearch] = useState("");

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

  const handleFilterChange = (key: keyof WorkerFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApply = () => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    setSpecializationSearch("");
    onFilterChange({});
  };

  // Подсчет активных фильтров
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== "").length;

  // Содержимое фильтров
  const filtersContent = (
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

      {/* Specialization */}
      <div>
        <Label htmlFor="specialization">{t('specialization')}</Label>
        <Select
          value={filters.specialization || "all"}
          onValueChange={(value) => {
            handleFilterChange("specialization", value === "all" ? undefined : value);
            setSpecializationSearch("");
          }}
        >
          <SelectTrigger id="specialization">
            <SelectValue placeholder={t('selectSpecialization')} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
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
            
            <SelectItem value="all">{t('allSpecializations')}</SelectItem>
            
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

      {/* Worker Type */}
      <div>
        <Label htmlFor="workerType">{t('workerType')}</Label>
        <Select
          value={filters.workerType || "all"}
          onValueChange={(value) =>
            handleFilterChange("workerType", value === "all" ? undefined : value as any)
          }
        >
          <SelectTrigger id="workerType">
            <SelectValue placeholder={t('selectWorkerType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allTypes')}</SelectItem>
            <SelectItem value="professional">{t('professional')}</SelectItem>
            <SelectItem value="daily_worker">{t('dailyWorker')}</SelectItem>
            <SelectItem value="job_seeker">{t('jobSeeker')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Min Rating */}
      <div>
        <Label htmlFor="minRating">{t('minRating')}</Label>
        <Select
          value={filters.minRating?.toString() || "all"}
          onValueChange={(value) =>
            handleFilterChange("minRating", value === "all" ? undefined : Number(value))
          }
        >
          <SelectTrigger id="minRating">
            <SelectValue placeholder={t('anyRating')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('anyRating')}</SelectItem>
            <SelectItem value="4.5">4.5+ ⭐</SelectItem>
            <SelectItem value="4.0">4.0+ ⭐</SelectItem>
            <SelectItem value="3.5">3.5+ ⭐</SelectItem>
            <SelectItem value="3.0">3.0+ ⭐</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div>
      {/* Mobile Filter Drawer */}
      <div className="lg:hidden mb-4">
        <MobileFiltersDrawer
          title={t('title')}
          onApply={handleApply}
          onClear={handleReset}
          applyLabel={t('apply') || 'Применить'}
          clearLabel={t('clear')}
          activeFilterCount={activeFilterCount}
        >
          {filtersContent}
        </MobileFiltersDrawer>
      </div>

      {/* Desktop Filters Card */}
      <Card className="hidden lg:block">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{t('title')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset} className="border border-gray-300 hover:border-gray-400">
            <X className="h-4 w-4 mr-2" />
            {t('clear')}
          </Button>
        </CardHeader>
        <CardContent>
          {filtersContent}
          {/* Apply button for desktop */}
          <div className="pt-4">
            <Button onClick={handleApply} className="w-full text-white">
              {t('apply')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

