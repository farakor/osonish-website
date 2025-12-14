"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/shared/container";
import { WorkerCard } from "@/components/workers/worker-card";
import {
  WorkerFilters,
  WorkerFilterValues,
} from "@/components/workers/worker-filters";
import { PageLoader } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import type { WorkerProfile } from "@/types";

export function WorkersPageClient() {
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<WorkerFilterValues>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
      params.append("limit", "20");

      // Запрос к API
      const response = await fetch(`/api/workers?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch workers");
      }

      const data = await response.json();
      
      // Если это первая страница - заменяем список, иначе добавляем
      if (page === 1) {
        setWorkers(data.workers);
      } else {
        setWorkers((prev) => [...prev, ...data.workers]);
      }
      
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch workers:", error);
      setWorkers([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: WorkerFilterValues) => {
    setFilters(newFilters);
    setPage(1);
    setWorkers([]); // Сбрасываем список при изменении фильтров
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="pt-24 pb-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Работники и специалисты
          </h1>
          <p className="text-lg text-muted-foreground">
            Найдите проверенных исполнителей для ваших задач
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
            {loading && page === 1 ? (
              <PageLoader />
            ) : workers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Работников не найдено
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Попробуйте изменить фильтры
                </p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-muted-foreground">
                  Найдено специалистов: {workers.length}
                </div>

                {/* Workers Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {workers.map((worker) => (
                    <WorkerCard key={worker.id} worker={worker} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button onClick={loadMore} disabled={loading} size="lg">
                      {loading ? "Загрузка..." : "Показать еще"}
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

