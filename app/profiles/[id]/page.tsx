import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { ProfileHeader } from "@/components/profiles/profile-header";
import { ProfileInfo } from "@/components/profiles/profile-info";
import { ProfilePortfolio } from "@/components/profiles/profile-portfolio";
import { ReviewCard } from "@/components/reviews/review-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, DollarSign, MapPin } from "lucide-react";
import type { WorkerProfile } from "@/types";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  
  // Получаем реальные данные профиля
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/workers/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return {
        title: "Профиль не найден",
      };
    }

    const data = await response.json();
    const profile = data.profile;

    return {
      title: `${profile.firstName} ${profile.lastName} - Профиль исполнителя`,
      description: `Профиль исполнителя ${profile.firstName} ${profile.lastName}. Рейтинг: ${profile.averageRating}. Выполнено заказов: ${profile.completedJobs}.`,
      openGraph: {
        title: `${profile.firstName} ${profile.lastName} - Osonish`,
        description: `Рейтинг: ${profile.averageRating} ⭐ | ${profile.completedJobs} выполненных заказов`,
      },
    };
  } catch (error) {
    return {
      title: "Профиль не найден",
    };
  }
}

async function getProfile(id: string): Promise<WorkerProfile | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/workers/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = await getProfile(id);

  if (!profile) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${profile.firstName} ${profile.lastName}`,
    telephone: profile.phone,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: profile.averageRating,
      reviewCount: profile.totalReviews,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pt-24 pb-8">
        <Container>
          {/* Different layout for job_seekers vs other worker types */}
          {profile.workerType === 'job_seeker' ? (
            // Job Seeker Layout - with sidebar
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <ProfileHeader profile={profile} />
                
                {/* About Me */}
                {profile.aboutMe && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        О себе
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {profile.aboutMe}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Info Grid - only for job_seekers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Desired Salary */}
                  {profile.desiredSalary && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Желаемая зарплата
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg font-semibold text-primary">
                          {profile.desiredSalary.toLocaleString('ru-RU')} сум
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Willing to Relocate */}
                  {profile.willingToRelocate !== undefined && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Готовность к переездам
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-medium">
                          {profile.willingToRelocate ? (
                            <span className="text-green-600">Готов к переездам</span>
                          ) : (
                            <span className="text-orange-600">Не готов к переездам</span>
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Portfolio - only for professionals */}
                {profile.workerType === 'professional' && (
                  <ProfilePortfolio photos={profile.workPhotos} />
                )}
              </div>

              {/* Sidebar - only for job_seekers */}
              <div className="lg:col-span-1">
                <ProfileInfo
                  education={profile.education}
                  workExperience={profile.workExperience}
                  skills={profile.skills}
                  aboutMe={profile.aboutMe}
                  willingToRelocate={profile.willingToRelocate}
                  desiredSalary={profile.desiredSalary}
                />
              </div>
            </div>
          ) : (
            // Professional and Daily Worker Layout - full width, no sidebar
            <div className="max-w-4xl mx-auto space-y-6">
              <ProfileHeader profile={profile} />
              
              {/* About Me */}
              {profile.aboutMe && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      О себе
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {profile.aboutMe}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Portfolio - only for professionals */}
              {profile.workerType === 'professional' && (
                <ProfilePortfolio photos={profile.workPhotos} />
              )}
              
              {/* Reviews - only for daily_worker and professional */}
              {profile.workerType !== 'job_seeker' && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Отзывы ({profile.reviews.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

