"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import {
  MapPin,
  Calendar,
  Briefcase,
  Users,
  Eye,
  Building2,
  Clock,
} from "lucide-react";
import {
  employmentTypeLabels,
  workFormatLabels,
  experienceLevelLabels,
} from "@/constants/translations";
import { getSpecializationName, getSpecializationIconName } from "@/lib/specialization-utils";
import { SpecializationIcon } from "@/components/ui/specialization-icon";

interface VacancyCardProps {
  vacancy: Order;
}

export function VacancyCard({ vacancy }: VacancyCardProps) {
  const formatSalary = (from?: number, to?: number, period?: string) => {
    if (!from && !to) return "По договоренности";

    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat("ru-RU").format(amount);
    };

    const periodText =
      period === "month" ? "в месяц" : period === "hour" ? "в час" : "";

    if (from && to) {
      return `${formatAmount(from)} - ${formatAmount(to)} сум ${periodText}`;
    } else if (from) {
      return `от ${formatAmount(from)} сум ${periodText}`;
    } else if (to) {
      return `до ${formatAmount(to)} сум ${periodText}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Вчера";
    if (diffDays < 7) return `${diffDays} дней назад`;
    
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  return (
    <Link href={`/vacancies/${vacancy.id}`}>
      <div className="bg-card rounded-lg border border-[#DAE3EC] p-6 hover:border-blue-300 transition-all cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors">
              {vacancy.title}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Building2 className="w-4 h-4" />
              <span>{vacancy.companyName || "Компания"}</span>
            </div>
            {vacancy.specializationId && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                {getSpecializationIconName(vacancy.specializationId) && (
                  <SpecializationIcon 
                    iconName={getSpecializationIconName(vacancy.specializationId)!} 
                    size={16}
                  />
                )}
                <span>{getSpecializationName(vacancy.specializationId)}</span>
              </div>
            )}
          </div>
          <Badge variant="secondary" className="bg-[#F3F4F6] text-primary hover:bg-[#F3F4F6]">
            {employmentTypeLabels[vacancy.employmentType] || vacancy.employmentType}
          </Badge>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-bold" style={{ color: '#679B00' }}>UZS</span>
          <span className="font-semibold text-lg" style={{ color: '#679B00' }}>
            {formatSalary(
              vacancy.salaryFrom,
              vacancy.salaryTo,
              vacancy.salaryPeriod
            )}
          </span>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {vacancy.description}
        </p>

        {/* Skills */}
        {vacancy.skills && vacancy.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {vacancy.skills.slice(0, 5).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-[#F3F4F6] text-primary border-transparent hover:bg-[#F3F4F6]">
                {skill}
              </Badge>
            ))}
            {vacancy.skills.length > 5 && (
              <Badge variant="outline" className="text-xs bg-[#F3F4F6] text-primary border-transparent hover:bg-[#F3F4F6]">
                +{vacancy.skills.length - 5}
              </Badge>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{vacancy.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4" />
            <span>{workFormatLabels[vacancy.workFormat] || vacancy.workFormat}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="truncate">{experienceLevelLabels[vacancy.experienceLevel] || vacancy.experienceLevel}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(vacancy.createdAt)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{vacancy.applicantsCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{vacancy.viewsCount}</span>
            </div>
          </div>
          <Button variant="default" size="sm" className="text-white">
            Подробнее
          </Button>
        </div>
      </div>
    </Link>
  );
}
