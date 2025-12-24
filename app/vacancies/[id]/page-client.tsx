"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/shared/container";
import { PageLoader } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth/auth-modal";
import type { Order } from "@/types";
import {
  MapPin,
  Calendar,
  Briefcase,
  Clock,
  Users,
  Eye,
  ArrowLeft,
  Building2,
  Star,
} from "lucide-react";
import Image from "next/image";
import {
  getEmploymentTypeLabel,
  getWorkFormatLabel,
  getExperienceLevelLabel,
  getWorkScheduleLabel,
  getLanguageLabel,
  getSalaryTypeLabel,
  getSkillLabel,
} from "@/constants/translations";
import { getCityName } from "@/constants/registration";
import { getSpecializationName, getSpecializationIconName } from "@/lib/specialization-utils";
import { SpecializationIcon } from "@/components/ui/specialization-icon";
import TelegramIcon from "@/components/assets/Telegram.svg";
import WhatsappIcon from "@/components/assets/Whatsapp.svg";

interface VacancyDetailClientProps {
  id: string;
  isAuthenticated?: boolean;
  userRole?: 'customer' | 'worker';
}

export function VacancyDetailClient({ id, isAuthenticated = false, userRole }: VacancyDetailClientProps) {
  const router = useRouter();
  const t = useTranslations('vacancies.detail');
  const locale = useLocale();
  const [vacancy, setVacancy] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  useEffect(() => {
    fetchVacancy();
    if (isAuthenticated) {
      checkApplication();
    }
  }, [id, isAuthenticated]);

  const checkApplication = async () => {
    setCheckingApplication(true);
    try {
      const response = await fetch(`/api/vacancies/${id}/check-application`);
      if (response.ok) {
        const data = await response.json();
        setHasApplied(data.hasApplied);
      }
    } catch (error) {
      console.error('Failed to check application:', error);
    } finally {
      setCheckingApplication(false);
    }
  };

  const fetchVacancy = async () => {
    setLoading(true);
    try {
      // Запрос к API для получения вакансии
      const response = await fetch(`/api/vacancies/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch vacancy");
      }

      const data = await response.json();
      
      if (!data.vacancy) {
        console.error("Vacancy not found, redirecting...");
        router.push("/vacancies");
        return;
      }
      
      setVacancy(data.vacancy);
    } catch (error) {
      console.error("Failed to fetch vacancy:", error);
      router.push("/vacancies");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    // Проверяем авторизацию
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // Проверяем, не откликался ли уже пользователь
    if (hasApplied) {
      return;
    }

    setApplying(true);
    try {
      const response = await fetch(`/api/vacancies/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coverLetter: "", // Можно добавить поле ввода для сопроводительного письма
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось отправить отклик");
      }

      alert(data.message || "Ваш отклик успешно отправлен!");
      
      // Обновляем информацию о вакансии и проверяем статус отклика
      await Promise.all([fetchVacancy(), checkApplication()]);
    } catch (error: any) {
      console.error("Failed to apply:", error);
      alert(error.message || "Произошла ошибка при отправке отклика");
    } finally {
      setApplying(false);
    }
  };

  const handleShareTelegram = () => {
    const url = window.location.href;
    const text = `${vacancy?.title} - ${vacancy?.companyName}\nЗарплата: ${formatSalary(vacancy?.salaryFrom, vacancy?.salaryTo, vacancy?.salaryPeriod, vacancy?.salaryType)}\n${vacancy?.location}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `${vacancy?.title} - ${vacancy?.companyName}\nЗарплата: ${formatSalary(vacancy?.salaryFrom, vacancy?.salaryTo, vacancy?.salaryPeriod, vacancy?.salaryType)}\n${vacancy?.location}\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatSalary = (from?: number, to?: number, period?: string, type?: string) => {
    if (!from && !to) return t('byAgreement');
    
    const formatAmount = (amount: number) => {
      // Форматируем число с пробелами вместо запятых
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };
    
    const periodText = period === "month" || period === "per_month" 
      ? ` ${t('perMonth')}` 
      : period === "hour" || period === "per_hour" 
        ? ` ${t('perHour')}` 
        : period === "day" || period === "per_day" 
          ? ` ${t('perDay')}` 
          : "";
    
    // Получаем локализованный текст типа зарплаты
    const typeText = type ? ` (${getSalaryTypeLabel(type, locale)})` : "";
    
    if (from && to) {
      return `${formatAmount(from)} - ${formatAmount(to)}${periodText}${typeText}`;
    } else if (from) {
      return `${t('salaryFrom')} ${formatAmount(from)}${periodText}${typeText}`;
    } else if (to) {
      return `${t('salaryTo')} ${formatAmount(to)}${periodText}${typeText}`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (locale === 'uz') {
      // Узбекские названия месяцев
      const months = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
      ];
      
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      
      return `${year} yil ${day}-${month}`;
    }
    
    return new Intl.DateTimeFormat('ru-RU', {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!vacancy) {
    return null;
  }

  return (
    <div className="pt-24 pb-8">
      <Container>
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToVacancies')}
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{vacancy.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-lg">{vacancy.companyName}</span>
                  </div>
                  {vacancy.specializationId && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {getSpecializationIconName(vacancy.specializationId) && (
                        <SpecializationIcon 
                          iconName={getSpecializationIconName(vacancy.specializationId)!} 
                          size={18}
                        />
                      )}
                      <span className="text-base">{getSpecializationName(vacancy.specializationId, locale)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Info */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-sm font-bold" style={{ color: '#679B00' }}>UZS</span>
                  <span className="font-semibold">
                    {formatSalary(
                      vacancy.salaryFrom,
                      vacancy.salaryTo,
                      vacancy.salaryPeriod,
                      vacancy.salaryType
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{vacancy.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>{getEmploymentTypeLabel(vacancy.employmentType || '', locale)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>{getWorkScheduleLabel(vacancy.workSchedule || '', locale)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{t('applicantsCount', { count: vacancy.applicantsCount || 0 })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>{t('viewsCount', { count: vacancy.viewsCount || 0 })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(vacancy.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">{t('description')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {vacancy.description}
              </p>
            </div>

            {/* Requirements */}
            {vacancy.requirements && vacancy.requirements.length > 0 && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">{t('requirements')}</h2>
                <ul className="space-y-2">
                  {vacancy.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Responsibilities */}
            {vacancy.responsibilities && vacancy.responsibilities.length > 0 && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">{t('responsibilities')}</h2>
                <ul className="space-y-2">
                  {vacancy.responsibilities.map((resp, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-muted-foreground">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {vacancy.benefits && vacancy.benefits.length > 0 && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">{t('benefits')}</h2>
                <ul className="space-y-2">
                  {vacancy.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-1" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {vacancy.skills && vacancy.skills.length > 0 && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">{t('keySkills')}</h2>
                <div className="flex flex-wrap gap-2">
                  {vacancy.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#F3F4F6] text-primary hover:bg-[#F3F4F6]">
                      {getSkillLabel(skill, locale)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {vacancy.languages && vacancy.languages.length > 0 && (
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">{t('languages')}</h2>
                <div className="flex flex-wrap gap-2">
                  {vacancy.languages.map((language, index) => (
                    <Badge key={index} variant="outline" className="bg-[#F3F4F6] text-primary border-transparent hover:bg-[#F3F4F6]">
                      {getLanguageLabel(language, locale)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Apply Card - показываем только для работников */}
              {userRole === 'worker' && (
                <div className="bg-card rounded-lg border p-6">
                  <Button
                    onClick={handleApply}
                    disabled={applying || hasApplied || checkingApplication}
                    size="lg"
                    className="w-full mb-4 text-white"
                  >
                    {checkingApplication 
                      ? t('checking')
                      : hasApplied 
                        ? t('applied')
                        : applying 
                          ? t('applying')
                          : t('apply')}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    {hasApplied 
                      ? t('alreadyApplied')
                      : t('agreeToTerms')}
                  </p>
                </div>
              )}

              {/* Company Info */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-3">{t('aboutCompany')}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{vacancy.companyName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vacancy.companyDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-3">{t('additionalInfo')}</h3>
                <div className="space-y-3 text-sm">
                  {vacancy.city && (
                    <div>
                      <span className="text-muted-foreground">{t('city')}</span>
                      <p className="font-medium">{getCityName(vacancy.city, locale)}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">{t('workFormat')}</span>
                    <p className="font-medium">{getWorkFormatLabel(vacancy.workFormat || '', locale)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('experience')}</span>
                    <p className="font-medium">{getExperienceLevelLabel(vacancy.experienceLevel || '', locale)}</p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-3">{t('share')}</h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleShareTelegram}
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-[#0088cc] text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition-colors"
                  >
                    <Image src={TelegramIcon} alt="Telegram" width={18} height={18} className="mr-2" />
                    Telegram
                  </Button>
                  <Button 
                    onClick={handleShareWhatsApp}
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
                  >
                    <Image src={WhatsappIcon} alt="WhatsApp" width={18} height={18} className="mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Модальное окно авторизации */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        redirectTo={`/vacancies/${id}`}
      />
    </div>
  );
}

