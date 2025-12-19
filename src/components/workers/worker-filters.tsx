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
import { useTranslations } from 'next-intl';

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

const cities = [
  "Все города",
  "Ташкент",
  "Самарканд",
  "Бухара",
  "Андижан",
  "Фергана",
  "Наманган",
  "Нукус",
  "Карши",
  "Ургенч",
];

const specializations = [
  "Все специализации",
  "Строительство и ремонт",
  "Электрика",
  "Сантехника",
  "Переезды и грузчики",
  "Отделочные работы",
  "Плотник и столяр",
  "Уборка",
  "Садовник",
  "Другое",
];

export function WorkerFilters({
  onFilterChange,
  initialFilters = {},
}: WorkerFiltersProps) {
  const t = useTranslations('workers.filters');
  const [filters, setFilters] = useState<WorkerFilterValues>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof WorkerFilterValues, value: any) => {
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

      {/* Filters Card */}
      <Card className={`${showFilters ? "block" : "hidden md:block"}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{t('title')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleReset} className="border border-gray-300 hover:border-gray-400">
            <X className="h-4 w-4 mr-2" />
            {t('clear')}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
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
                {cities.map((city) => (
                  <SelectItem
                    key={city}
                    value={city === "Все города" ? "all" : city}
                  >
                    {city === "Все города" ? t('allCities') : city}
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
              onValueChange={(value) =>
                handleFilterChange("specialization", value === "all" ? undefined : value)
              }
            >
              <SelectTrigger id="specialization">
                <SelectValue placeholder={t('selectSpecialization')} />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem
                    key={spec}
                    value={spec === "Все специализации" ? "all" : spec}
                  >
                    {spec === "Все специализации" ? t('allSpecializations') : spec}
                  </SelectItem>
                ))}
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

          {/* Buttons */}
          <div className="space-y-2 pt-4">
            <Button onClick={handleApply} className="w-full text-white">
              {t('apply')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

