'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import {
  MapPin,
  Phone,
  Briefcase,
  Calendar,
  Award,
  CheckCircle,
} from "lucide-react";
import type { WorkerProfile } from "@/types";
import { formatPhoneNumber, getInitials } from "@/lib/utils";
import { getSpecializationName, getSpecializationIconName } from "@/lib/specialization-utils";
import { SpecializationIcon } from "@/components/ui/specialization-icon";
import Image from "next/image";

interface ProfileHeaderProps {
  profile: WorkerProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [showPhone, setShowPhone] = useState(false);
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profile.profileImage} alt={profile.firstName} />
              <AvatarFallback className="text-2xl">
                {getInitials(profile.firstName, profile.lastName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name and Rating */}
            <div className="mb-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {profile.firstName} {profile.lastName}
              </h1>
              {/* Rating - only for daily_worker and professional */}
              {profile.workerType !== 'job_seeker' && (
                <div className="flex flex-wrap items-center gap-4">
                  <StarRating
                    rating={profile.averageRating}
                    showValue
                    size="md"
                  />
                  <span className="text-sm text-muted-foreground">
                    {profile.totalReviews} отзывов
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {/* Completed Jobs - only for daily_worker and professional */}
              {profile.workerType !== 'job_seeker' && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Выполнено</p>
                    <p className="font-semibold">{profile.completedJobs} заказов</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">На платформе</p>
                  <p className="font-semibold">
                    {new Date(profile.joinedAt).getFullYear()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Телефон</p>
                  {showPhone ? (
                    <p className="font-semibold text-sm">
                      {formatPhoneNumber(profile.phone)}
                    </p>
                  ) : (
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => setShowPhone(true)}
                      className="h-auto p-0 font-semibold text-sm"
                    >
                      Показать номер
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Specializations */}
            {profile.specializations && profile.specializations.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.map((spec, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1.5 h-auto py-1.5"
                    >
                      {getSpecializationIconName(spec.id) && (
                        <SpecializationIcon 
                          iconName={getSpecializationIconName(spec.id)!} 
                          size={16}
                        />
                      )}
                      <span>{getSpecializationName(spec.id)}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

