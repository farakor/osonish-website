"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "../shared/container";
import { 
  ArrowRight,
  Search,
  SlidersHorizontal,
  Loader2,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CategoryIcon } from "@/components/icons/category-icon";
import { useTranslations, useLocale } from 'next-intl';
import { translateCategory, formatVacancyCount } from "@/lib/category-translations";

interface CategoryStats {
  id: string;
  name: string;
  icon: string;
  count: number;
  minSalary: number | null;
  maxSalary: number | null;
  href: string;
}

interface VacancyStatsResponse {
  categories: CategoryStats[];
  totalVacancies: number;
}

// Форматирование числа с пробелами
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Форматирование зарплаты с переводами
function formatSalary(min: number | null, max: number | null, t: any): string | null {
  if (!min && !max) return null;
  if (min && max && min !== max) {
    return t('salaryRange', { min: formatNumber(min), max: formatNumber(max) });
  }
  if (min) {
    return t('salaryFrom', { amount: formatNumber(min) });
  }
  if (max) {
    return t('salaryTo', { amount: formatNumber(max) });
  }
  return null;
}

export function FeaturedSection() {
  const t = useTranslations('landing.featured');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [stats, setStats] = useState<VacancyStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Загружаем реальные данные при монтировании
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/vacancies/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch vacancy stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/vacancies?q=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = "/vacancies";
    }
  };

  // Фильтруем только категории с активными вакансиями (count > 0)
  const activeCategories = stats?.categories?.filter(cat => cat.count > 0) || [];
  
  // Показываем первые 8 или все, если "Развернуть" нажато
  const visibleCategories = showMore ? activeCategories : activeCategories.slice(0, 8);
  const hasMoreCategories = activeCategories.length > 8;

  return (
    <section className="pt-16 pb-8 md:pt-20 md:pb-10 bg-gradient-to-b from-gray-50 to-white">
      <Container>
        {/* Header with Search */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t('title')}
          </h2>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 text-base bg-white border-gray-300"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-14 px-5 border-gray-300"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
              <Button 
                type="submit"
                size="lg" 
                className="px-10 h-14 text-base font-medium shadow-lg text-white"
              >
                {t('searchButton')}
              </Button>
            </div>
          </form>

          {/* Link to Employee Search */}
          <Link 
            href="/auth/register?type=employer" 
            className="text-sm text-gray-600 hover:text-gray-900 underline inline-block"
          >
            {t('findEmployee')}
          </Link>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Empty state - no active vacancies */}
        {!loading && activeCategories.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Пока нет активных вакансий
            </h3>
            <p className="text-gray-500 mb-6">
              Станьте первым, кто разместит вакансию!
            </p>
            <Link href="/vacancies/create">
              <Button className="text-white">
                Разместить вакансию
              </Button>
            </Link>
          </div>
        )}

        {/* Categories with active vacancies */}
        {!loading && activeCategories.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {visibleCategories.map((category) => (
                <Link key={category.id} href={category.href}>
                  <Card className="border border-[#DAE3EC] hover:border-blue-300 hover:scale-[1.02] transition-all duration-200 cursor-pointer h-full">
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-3">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Image
                            src={category.icon}
                            alt={category.name}
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-1">
                          <h3 className="font-semibold text-base text-gray-900">
                            {translateCategory(category.name, locale)}
                          </h3>
                          {formatSalary(category.minSalary, category.maxSalary, tCommon) && (
                            <p className="text-sm text-gray-700 font-medium">
                              {formatSalary(category.minSalary, category.maxSalary, tCommon)}
                            </p>
                          )}
                        </div>

                        {/* Count */}
                        <p className="text-sm text-gray-500 mt-auto">
                          {formatVacancyCount(category.count, locale)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Expand/Collapse Button - only if more than 8 categories */}
            {hasMoreCategories && (
              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1"
                  onClick={() => setShowMore(!showMore)}
                >
                  <span>{showMore ? "Свернуть" : "Развернуть"}</span>
                  <ArrowRight 
                    className={`h-4 w-4 transition-transform ${showMore ? 'rotate-90' : ''}`} 
                  />
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
