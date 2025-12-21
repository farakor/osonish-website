"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { WorkerProfile } from "@/types";
import {
  Star,
  MapPin,
  Briefcase,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { UZBEKISTAN_CITIES } from "@/constants/registration";
import { useTranslations, useLocale } from 'next-intl';
import { translateCategory } from "@/lib/category-translations";

interface WorkerCardProps {
  worker: WorkerProfile;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const t = useTranslations('workers.card');
  const tCities = useTranslations('cities');
  const locale = useLocale();
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };
  
  const getCityName = (cityId: string) => {
    // Пытаемся получить перевод города
    try {
      return tCities(cityId);
    } catch {
      // Если перевода нет, ищем в константах
      const city = UZBEKISTAN_CITIES.find(c => c.id === cityId);
      return city?.name || cityId;
    }
  };

  const getSpecializationName = (specialization: string) => {
    // Пытаемся перевести специализацию
    return translateCategory(specialization, locale);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const years = now.getFullYear() - date.getFullYear();
    const months = now.getMonth() - date.getMonth();
    const totalMonths = years * 12 + months;

    if (totalMonths < 1) return t('newbie');
    if (totalMonths < 12) return t('monthsOnPlatform', { count: totalMonths });
    
    // Для русского языка используем правильное склонение
    if (locale === 'ru') {
      if (years === 1) return t('yearsOnPlatform_one', { count: years });
      if (years < 5) return t('yearsOnPlatform_few', { count: years });
      return t('yearsOnPlatform_many', { count: years });
    }
    
    // Для узбекского языка используем единую форму
    return t('yearsOnPlatform', { count: years });
  };

  return (
    <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <Avatar className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
            <AvatarImage src={worker.profileImage} alt={worker.firstName} />
            <AvatarFallback className="text-base sm:text-lg font-semibold">
              {getInitials(worker.firstName, worker.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link
              href={`/profiles/${worker.id}`}
              className="text-lg sm:text-xl font-semibold hover:text-primary transition-colors block truncate"
            >
              {worker.firstName} {worker.lastName}
            </Link>
            {worker.specialization && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                {getSpecializationName(worker.specialization)}
              </p>
            )}
            {worker.city && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{getCityName(worker.city)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Rating and Stats - only for daily_worker and professional */}
        {worker.workerType !== 'job_seeker' && (
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-base sm:text-lg">
                {worker.averageRating.toFixed(1)}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                ({worker.totalReviews})
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <span className="truncate">{t('completedJobs', { count: worker.completedJobs })}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-0">
        <Button asChild className="w-full text-white h-11 sm:h-10 text-base sm:text-sm">
          <Link href={`/profiles/${worker.id}`}>{t('viewProfile')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

