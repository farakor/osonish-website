"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/shared/container";
import { WorkerCard } from "@/components/workers/worker-card";
import {
  WorkerFilters,
  WorkerFilterValues,
} from "@/components/workers/worker-filters";
import { PageLoader } from "@/components/shared/loading";
import { Pagination } from "@/components/ui/pagination";
import type { WorkerProfile } from "@/types";
import { useTranslations } from 'next-intl';

export function WorkersPageClient() {
  const t = useTranslations('workers');
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<WorkerFilterValues>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    fetchWorkers();
  }, [filters, page]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      // Строим параметры запроса
      const params = new URLSearchParams();
      
      if (filters.city) params.append("city", filters.city);
      if (filters.specialization) params.append("specialization", filters.specialization);
      if (filters.workerType) params.append("workerType", filters.workerType);
      if (filters.minRating) params.append("minRating", filters.minRating.toString());
      if (filters.search) params.append("search", filters.search);
      
      params.append("page", page.toString());
      params.append("limit", ITEMS_PER_PAGE.toString());

      // Запрос к API
      const response = await fetch(`/api/workers?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      
      setWorkers(data.workers);
      setTotalCount(data.total);
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Failed to fetch workers:", error);
      setWorkers([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: WorkerFilterValues) => {
    setFilters(newFilters);
    setPage(1); // Сбрасываем на первую страницу при изменении фильтров
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Прокручиваем страницу вверх при смене страницы
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <WorkerFilters
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Workers List */}
          <div className="lg:col-span-3">
            {loading ? (
              <PageLoader />
            ) : workers.length === 0 ? (
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
                  {t('totalResults', { count: totalCount })}
                </div>

                {/* Workers Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {workers.map((worker) => (
                    <WorkerCard key={worker.id} worker={worker} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
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

