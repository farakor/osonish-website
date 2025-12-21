"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Users,
  Eye,
  MessageSquare,
  Utensils,
  Bus,
} from "lucide-react";
import type { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import Image from "next/image";
import { getSpecializationName, getSpecializationIconName } from "@/lib/specialization-utils";
import { SpecializationIcon } from "@/components/ui/specialization-icon";
import { useTranslations, useLocale } from 'next-intl';
import { getCityName } from "@/constants/registration";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const t = useTranslations('orders.card');
  const locale = useLocale();
  
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    response_received: "bg-purple-100 text-purple-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    rejected: "bg-red-100 text-red-800",
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      new: t('new'),
      response_received: t('responseReceived'),
      in_progress: t('inProgress'),
      completed: t('completed'),
      cancelled: t('cancelled'),
      rejected: t('rejected'),
    };
    return statusMap[status] || status;
  };

  // Проверяем, был ли заказ создан менее 3 дней назад
  const isNewOrder = () => {
    if (!order.createdAt) return false;
    const createdDate = new Date(order.createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays < 3;
  };

  return (
    <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all">
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="flex-1">
            <Link
              href={`/orders/${order.id}`}
              className="text-lg sm:text-xl font-semibold hover:text-primary transition-colors line-clamp-2"
            >
              {order.title}
            </Link>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {order.description}
            </p>
          </div>
          <div className="ml-3 sm:ml-4 flex items-center gap-2 sm:gap-3">
            {order.viewsCount !== undefined && order.viewsCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">{order.viewsCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-3 sm:mb-4">
          {order.city && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{getCityName(order.city, locale)}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatDate(order.serviceDate, locale)}</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-xs font-bold mr-2 text-primary">UZS</span>
            <span className="font-semibold text-primary">
              {formatPrice(order.budget)}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {isNewOrder() && order.status === 'new' && (
            <Badge 
              className="h-auto py-1.5 cursor-default text-xs sm:text-sm"
              style={{ 
                backgroundColor: '#DBEAFE',
                color: '#1E40AF'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DBEAFE';
              }}
            >
              {getStatusLabel(order.status)}
            </Badge>
          )}
          {order.specializationId && (
            <Badge 
              variant="outline" 
              className="flex items-center gap-1.5 h-auto py-1.5 text-xs sm:text-sm"
            >
              {getSpecializationIconName(order.specializationId) && (
                <SpecializationIcon 
                  iconName={getSpecializationIconName(order.specializationId)!} 
                  size={16} 
                />
              )}
              <span className="truncate max-w-[150px] sm:max-w-none">{getSpecializationName(order.specializationId, locale)}</span>
            </Badge>
          )}
          {order.workersNeeded > 1 && (
            <Badge variant="outline" className="h-auto py-1.5 text-xs sm:text-sm">
              <Users className="h-3 w-3 mr-1" />
              {t('people', { count: order.workersNeeded })}
            </Badge>
          )}
          {order.mealIncluded && (
            <Badge variant="outline" className="h-auto py-1.5 text-xs sm:text-sm">
              <Utensils className="h-3 w-3 mr-1" />
              {t('mealIncluded')}
            </Badge>
          )}
          {order.transportPaid && (
            <Badge variant="outline" className="h-auto py-1.5 text-xs sm:text-sm">
              <Bus className="h-3 w-3 mr-1" />
              {t('transportPaid')}
            </Badge>
          )}
        </div>

        {/* Stats */}
        {order.applicantsCount > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 sm:mb-0">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{t('responses', { count: order.applicantsCount })}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-0">
        <Button asChild className="w-full text-white h-11 sm:h-10 text-base sm:text-sm">
          <Link href={`/orders/${order.id}`}>{t('viewDetails')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

