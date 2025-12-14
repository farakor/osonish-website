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
      <h2 className="text-lg font-semibold mb-4">Фильтры</h2>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <Label htmlFor="search">Поиск</Label>
          <Input
            id="search"
            placeholder="Должность, навыки..."
            value={filters.search || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city">Город</Label>
          <Select
            value={filters.city || "all"}
            onValueChange={(value) => handleFilterChange("city", value === "all" ? undefined : value)}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder="Выберите город" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все города</SelectItem>
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
          <Label htmlFor="employmentType">Тип занятости</Label>
          <Select
            value={filters.employmentType || "all"}
            onValueChange={(value) =>
              handleFilterChange("employmentType", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger id="employmentType">
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="Полная занятость">Полная занятость</SelectItem>
              <SelectItem value="Частичная занятость">
                Частичная занятость
              </SelectItem>
              <SelectItem value="Проектная работа">Проектная работа</SelectItem>
              <SelectItem value="Стажировка">Стажировка</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Work Format */}
        <div>
          <Label htmlFor="workFormat">Формат работы</Label>
          <Select
            value={filters.workFormat || "all"}
            onValueChange={(value) => handleFilterChange("workFormat", value === "all" ? undefined : value)}
          >
            <SelectTrigger id="workFormat">
              <SelectValue placeholder="Выберите формат" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все форматы</SelectItem>
              <SelectItem value="Офис">Офис</SelectItem>
              <SelectItem value="Удаленно">Удаленно</SelectItem>
              <SelectItem value="Гибрид">Гибрид</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div>
          <Label htmlFor="experienceLevel">Опыт работы</Label>
          <Select
            value={filters.experienceLevel || "all"}
            onValueChange={(value) =>
              handleFilterChange("experienceLevel", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger id="experienceLevel">
              <SelectValue placeholder="Выберите опыт" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Любой опыт</SelectItem>
              <SelectItem value="Без опыта">Без опыта</SelectItem>
              <SelectItem value="1-3 года">1-3 года</SelectItem>
              <SelectItem value="3+ года">3+ года</SelectItem>
              <SelectItem value="5+ лет">5+ лет</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Salary Range */}
        <div>
          <Label>Зарплата (млн сум)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="number"
              placeholder="От"
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
              placeholder="До"
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
            Применить фильтры
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
}
