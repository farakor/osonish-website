"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

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

const cities = [
  "Все города",
  "Ташкент",
  "Самарканд",
  "Бухара",
  "Андижан",
  "Фергана",
  "Наманган",
  "Нукус",
];

const categories = [
  "Все категории",
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

export function OrderFilters({
  onFilterChange,
  initialFilters = {},
}: OrderFiltersProps) {
  const [filters, setFilters] = useState<OrderFilterValues>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

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
          {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
        </Button>
      </div>

      {/* Filters */}
      <Card className={`${showFilters ? "block" : "hidden md:block"}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Фильтры</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="border border-gray-300 hover:border-gray-400">
            <X className="h-4 w-4 mr-2" />
            Очистить
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Поиск</Label>
            <Input
              id="search"
              placeholder="Введите ключевые слова..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city">Город</Label>
            <select
              id="city"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={filters.city || ""}
              onChange={(e) => handleFilterChange("city", e.target.value)}
            >
              {cities.map((city) => (
                <option key={city} value={city === "Все города" ? "" : city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <select
              id="category"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={filters.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category === "Все категории" ? "" : category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <Label>Бюджет (сум)</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="От"
                value={filters.minBudget || ""}
                onChange={(e) =>
                  handleFilterChange("minBudget", Number(e.target.value))
                }
              />
              <Input
                type="number"
                placeholder="До"
                value={filters.maxBudget || ""}
                onChange={(e) =>
                  handleFilterChange("maxBudget", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Тип</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={!filters.type ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("type", undefined)}
                className={`text-xs ${!filters.type ? "text-white" : ""}`}
              >
                Все
              </Button>
              <Button
                variant={filters.type === "daily" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("type", "daily")}
                className={`text-xs whitespace-nowrap ${filters.type === "daily" ? "text-white" : ""}`}
              >
                Дневная
              </Button>
              <Button
                variant={filters.type === "vacancy" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("type", "vacancy")}
                className={`text-xs ${filters.type === "vacancy" ? "text-white" : ""}`}
              >
                Вакансия
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

