"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/shared/container";
import { VacancyCard } from "@/components/orders/vacancy-card";
import {
  VacancyFilters,
  VacancyFilterValues,
} from "@/components/orders/vacancy-filters";
import { PageLoader } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import { useTranslations } from 'next-intl';

export function VacanciesPageClient() {
  const t = useTranslations('vacancies');
  const [vacancies, setVacancies] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VacancyFilterValues>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchVacancies();
  }, [filters, page]);

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      // Строим параметры запроса
      const params = new URLSearchParams();
      
      if (filters.city) params.append("city", filters.city);
      if (filters.category) params.append("category", filters.category);
      if (filters.experienceLevel) params.append("experienceLevel", filters.experienceLevel);
      if (filters.employmentType) params.append("employmentType", filters.employmentType);
      if (filters.workFormat) params.append("workFormat", filters.workFormat);
      if (filters.salaryFrom) params.append("salaryFrom", filters.salaryFrom.toString());
      if (filters.salaryTo) params.append("salaryTo", filters.salaryTo.toString());
      if (filters.search) params.append("search", filters.search);
      
      params.append("page", page.toString());
      params.append("limit", "20");

      // Запрос к API
      const response = await fetch(`/api/vacancies?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch vacancies");
      }

      const data = await response.json();
      
      // Если это первая страница - заменяем список, иначе добавляем
      if (page === 1) {
        setVacancies(data.vacancies);
      } else {
        setVacancies((prev) => [...prev, ...data.vacancies]);
      }
      
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch vacancies:", error);
      setVacancies([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: VacancyFilterValues) => {
    setFilters(newFilters);
    setPage(1);
    setVacancies([]); // Сбрасываем список при изменении фильтров
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="pt-24 pb-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <VacancyFilters
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Vacancies List */}
          <div className="lg:col-span-3">
            {loading && page === 1 ? (
              <PageLoader />
            ) : vacancies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {t('notFound')}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('notFoundDescription')}
                </p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-muted-foreground">
                  {t('resultsCount', { count: vacancies.length })}
                </div>

                {/* Vacancies Grid */}
                <div className="grid gap-6">
                  {vacancies.map((vacancy) => (
                    <VacancyCard key={vacancy.id} vacancy={vacancy} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button onClick={loadMore} disabled={loading} size="lg">
                      {loading ? t('loading') : t('loadMore')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

