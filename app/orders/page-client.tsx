"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/shared/container";
import { OrderCard } from "@/components/orders/order-card";
import {
  OrderFilters,
  OrderFilterValues,
} from "@/components/orders/order-filters";
import { PageLoader } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import { useTranslations } from 'next-intl';

export function OrdersPageClient() {
  const t = useTranslations('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilterValues>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [filters, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Строим параметры запроса
      const params = new URLSearchParams();
      
      if (filters.city) params.append("city", filters.city);
      if (filters.category) params.append("category", filters.category);
      if (filters.minBudget) params.append("minBudget", filters.minBudget.toString());
      if (filters.maxBudget) params.append("maxBudget", filters.maxBudget.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      
      params.append("page", page.toString());
      params.append("limit", "20");

      // Запрос к API
      const response = await fetch(`/api/orders?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      
      // Если это первая страница - заменяем список, иначе добавляем
      if (page === 1) {
        setOrders(data.orders);
      } else {
        setOrders((prev) => [...prev, ...data.orders]);
      }
      
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: OrderFilterValues) => {
    setFilters(newFilters);
    setPage(1);
    setOrders([]); // Сбрасываем список при изменении фильтров
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
            <OrderFilters
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />
          </div>

          {/* Orders List */}
          <div className="lg:col-span-3">
            {loading && page === 1 ? (
              <PageLoader />
            ) : orders.length === 0 ? (
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
                  {t('resultsCount', { count: orders.length })}
                </div>

                {/* Orders Grid */}
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
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

