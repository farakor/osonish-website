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

interface WorkerCardProps {
  worker: WorkerProfile;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };
  
  const getCityName = (cityId: string) => {
    const city = UZBEKISTAN_CITIES.find(c => c.id === cityId);
    return city?.name || cityId;
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const years = now.getFullYear() - date.getFullYear();
    const months = now.getMonth() - date.getMonth();
    const totalMonths = years * 12 + months;

    if (totalMonths < 1) return "Новичок";
    if (totalMonths < 12) return `${totalMonths} мес. на платформе`;
    return `${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"} на платформе`;
  };

  const workerTypeLabels = {
    daily_worker: "Дневной работник",
    professional: "Профессионал",
    job_seeker: "Ищет работу",
  };

  return (
    <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={worker.profileImage} alt={worker.firstName} />
            <AvatarFallback className="text-lg font-semibold">
              {getInitials(worker.firstName, worker.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link
              href={`/profiles/${worker.id}`}
              className="text-xl font-semibold hover:text-primary transition-colors block truncate"
            >
              {worker.firstName} {worker.lastName}
            </Link>
            {worker.specialization && (
              <p className="text-sm text-muted-foreground mt-1">
                {worker.specialization}
              </p>
            )}
            {worker.city && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3 h-3" />
                <span>{getCityName(worker.city)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Rating and Stats - only for daily_worker and professional */}
        {worker.workerType !== 'job_seeker' && (
          <div className="flex items-center gap-4 mb-4 pb-4 border-b">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-lg">
                {worker.averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({worker.totalReviews})
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>{worker.completedJobs} заказов</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full text-white">
          <Link href={`/profiles/${worker.id}`}>Посмотреть профиль</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

