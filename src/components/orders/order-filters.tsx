"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import { UZBEKISTAN_CITIES, SPECIALIZATIONS, getCityName } from "@/constants/registration";
import { getSpecializationName } from '@/lib/specialization-utils';
import { MobileFiltersDrawer } from "@/components/shared/mobile-filters-drawer";

interface OrderFiltersProps {
  onFilterChange: (filters: OrderFilterValues) => void;
  initialFilters?: OrderFilterValues;
}

export interface OrderFilterValues {
  search?: string;
  city?: string;
  minBudget?: number;
  maxBudget?: number;
  category?: string;
  type?: "daily" | "vacancy";
}

export function OrderFilters({
  onFilterChange,
  initialFilters = {},
}: OrderFiltersProps) {
  const t = useTranslations('orders.filters');
  const locale = useLocale();
  const [filters, setFilters] = useState<OrderFilterValues>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [minBudgetDisplay, setMinBudgetDisplay] = useState("");
  const [maxBudgetDisplay, setMaxBudgetDisplay] = useState("");

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

  // Получаем подспециализации из категории "Ремонт и строительство" + "Работа на 1 день"
  const categories = SPECIALIZATIONS.filter(
    (spec) => 
      spec.id === 'one_day_job' || 
      spec.parentIds?.includes('repair_construction')
  );

  const handleFilterChange = (key: keyof OrderFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setMinBudgetDisplay("");
    setMaxBudgetDisplay("");
    onFilterChange({});
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  // Подсчет активных фильтров
  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== "").length;

  // Содержимое фильтров (переиспользуется для мобильной и десктопной версий)
  const filtersContent = (
    <div className="space-y-4">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">{t('search')}</Label>
        <Input
          id="search"
          placeholder={t('searchPlaceholder')}
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">{t('city')}</Label>
        <select
          id="city"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#679B00] transition-all"
          value={filters.city || ""}
          onChange={(e) => handleFilterChange("city", e.target.value)}
        >
          <option value="">{t('allCities')}</option>
          {UZBEKISTAN_CITIES.map((city) => (
            <option key={city.id} value={city.id}>
              {getCityName(city.id, locale)}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">{t('category')}</Label>
        <select
          id="category"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#679B00] transition-all"
          value={filters.category || ""}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="">{t('allCategories')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {getSpecializationName(category.id, locale)}
            </option>
          ))}
        </select>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <Label>{t('budget')}</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="text"
            inputMode="numeric"
            placeholder={t('budgetFrom')}
            value={minBudgetDisplay}
            onChange={(e) => {
              const formatted = formatNumber(e.target.value);
              setMinBudgetDisplay(formatted);
              handleFilterChange("minBudget", parseFormattedNumber(formatted));
            }}
          />
          <Input
            type="text"
            inputMode="numeric"
            placeholder={t('budgetTo')}
            value={maxBudgetDisplay}
            onChange={(e) => {
              const formatted = formatNumber(e.target.value);
              setMaxBudgetDisplay(formatted);
              handleFilterChange("maxBudget", parseFormattedNumber(formatted));
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Mobile Filter Drawer */}
      <div className="lg:hidden mb-4">
        <MobileFiltersDrawer
          title={t('title')}
          onApply={handleApplyFilters}
          onClear={clearFilters}
          applyLabel={t('apply') || 'Применить'}
          clearLabel={t('clear')}
          activeFilterCount={activeFilterCount}
        >
          {filtersContent}
        </MobileFiltersDrawer>
      </div>

      {/* Desktop Filters */}
      <Card className="hidden lg:block">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{t('title')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="border border-gray-300 hover:border-gray-400">
            <X className="h-4 w-4 mr-2" />
            {t('clear')}
          </Button>
        </CardHeader>
        <CardContent>
          {filtersContent}
        </CardContent>
      </Card>
    </div>
  );
}

