"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useTranslations } from 'next-intl';

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
  const tCommon = useTranslations('common');
  const tCities = useTranslations('cities');
  const [filters, setFilters] = useState<OrderFilterValues>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const cities = [
    t('allCities'),
    "Ташкент",
    "Самарканд",
    "Бухара",
    "Андижан",
    "Фергана",
    "Наманган",
    "Нукус",
  ];

  const categories = [
    t('allCategories'),
    "Работа на 1 день",
    "Ремонт и строительство",
    "Сантехника",
    "Электрика",
    "Покраска/Маляр",
    "Плотник",
    "Плиточник",
    "Строительство",
    "Уборка",
    "Садоводство",
    "Общепит",
    "Грузоперевозки",
    "Другое",
  ];

  const handleFilterChange = (key: keyof OrderFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <div>
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? t('hideFilters') : t('showFilters')}
        </Button>
      </div>

      {/* Filters */}
      <Card className={`${showFilters ? "block" : "hidden md:block"}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{t('title')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="border border-gray-300 hover:border-gray-400">
            <X className="h-4 w-4 mr-2" />
            {t('clear')}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
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
              {cities.map((city) => (
                <option key={city} value={city === t('allCities') ? "" : city}>
                  {city}
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
              {categories.map((category) => (
                <option
                  key={category}
                  value={category === t('allCategories') ? "" : category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <Label>{t('budget')}</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder={t('budgetFrom')}
                value={filters.minBudget || ""}
                onChange={(e) =>
                  handleFilterChange("minBudget", Number(e.target.value))
                }
              />
              <Input
                type="number"
                placeholder={t('budgetTo')}
                value={filters.maxBudget || ""}
                onChange={(e) =>
                  handleFilterChange("maxBudget", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>{t('type')}</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={!filters.type ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("type", undefined)}
                className={`text-xs ${!filters.type ? "text-white" : ""}`}
              >
                {t('all')}
              </Button>
              <Button
                variant={filters.type === "daily" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("type", "daily")}
                className={`text-xs whitespace-nowrap ${filters.type === "daily" ? "text-white" : ""}`}
              >
                {t('daily')}
              </Button>
              <Button
                variant={filters.type === "vacancy" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("type", "vacancy")}
                className={`text-xs ${filters.type === "vacancy" ? "text-white" : ""}`}
              >
                {t('vacancy')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

