"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { PageLoader } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/auth-modal";
import type { Order } from "@/types";
import {
  MapPin,
  Calendar,
  Users,
  Eye,
  ArrowLeft,
  Clock,
  User,
  Phone,
  MessageSquare,
  CheckCircle,
  Utensils,
  Bus,
} from "lucide-react";
import Image from "next/image";
import { getSpecializationName, getSpecializationIconName } from "@/lib/specialization-utils";
import { SpecializationIcon } from "@/components/ui/specialization-icon";
import TelegramIcon from "@/components/assets/Telegram.svg";
import WhatsappIcon from "@/components/assets/Whatsapp.svg";

interface OrderDetailClientProps {
  id: string;
  isAuthenticated?: boolean;
  userRole?: 'customer' | 'worker';
}

export function OrderDetailClient({ id, isAuthenticated = false, userRole }: OrderDetailClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(false);

  useEffect(() => {
    fetchOrder();
    if (isAuthenticated) {
      checkApplication();
    }
  }, [id, isAuthenticated]);

  const checkApplication = async () => {
    setCheckingApplication(true);
    try {
      const response = await fetch(`/api/orders/${id}/check-application`);
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

  const fetchOrder = async () => {
    setLoading(true);
    try {
      // Запрос к API для получения заказа
      const response = await fetch(`/api/orders/${id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }

      const data = await response.json();
      
      if (!data.order) {
        console.error("Order not found, redirecting...");
        router.push("/orders");
        return;
      }
      
      setOrder(data.order);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      router.push("/orders");
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
      const response = await fetch(`/api/orders/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "", // Можно добавить поле ввода для сообщения
          proposedPrice: null, // Можно добавить поле для предложенной цены
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось отправить отклик");
      }

      alert(data.message || "Ваш отклик успешно отправлен!");
      
      // Обновляем состояние
      setHasApplied(true);
      
      // Обновляем информацию о заказе
      await fetchOrder();
    } catch (error: any) {
      console.error("Failed to apply:", error);
      alert(error.message || "Произошла ошибка при отправке отклика");
    } finally {
      setApplying(false);
    }
  };

  const handleShowPhone = async () => {
    setShowPhone(true);
    
    // Логирование просмотра номера телефона для статистики
    try {
      await fetch(`/api/orders/${id}/phone-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: id,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to log phone view:", error);
      // Не показываем ошибку пользователю, это внутренняя статистика
    }
  };

  const handlePhoneClick = async () => {
    // Логирование клика по номеру телефона (звонок)
    try {
      await fetch(`/api/orders/${id}/phone-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: id,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to log phone call:", error);
      // Не показываем ошибку пользователю, это внутренняя статистика
    }
  };

  const handleShareTelegram = () => {
    const url = window.location.href;
    const text = `${order?.title}\nБюджет: ${order?.budget ? formatPrice(order.budget) : 'По договоренности'}\n${order?.location}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `${order?.title}\nБюджет: ${order?.budget ? formatPrice(order.budget) : 'По договоренности'}\n${order?.location}\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " сум";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    response_received: "bg-purple-100 text-purple-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-gray-100 text-gray-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    new: "Новый",
    response_received: "Есть отклики",
    in_progress: "В работе",
    completed: "Завершен",
    cancelled: "Отменен",
    rejected: "Отклонен",
  };

  // Проверяем, был ли заказ создан менее 3 дней назад
  const isNewOrder = (order: any) => {
    if (!order?.createdAt) return false;
    const createdDate = new Date(order.createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    return diffInDays < 3;
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="pt-24 pb-8">
      <Container>
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mt-6 mb-6 -ml-2 border border-gray-200 hover:border-gray-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к заказам
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-3">{order.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      {isNewOrder(order) && order.status === 'new' && (
                        <Badge className={`${statusColors[order.status]} h-auto py-1.5`}>
                          {statusLabels[order.status]}
                        </Badge>
                      )}
                      {order.specializationId && (
                        <Badge 
                          variant="outline" 
                          className="flex items-center gap-2 h-auto py-1.5"
                        >
                          {getSpecializationIconName(order.specializationId) && (
                            <SpecializationIcon 
                              iconName={getSpecializationIconName(order.specializationId)!} 
                              size={16} 
                            />
                          )}
                          <span>{getSpecializationName(order.specializationId)}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Info */}
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-green-600">UZS</span>
                    <div>
                      <p className="text-xs text-muted-foreground">Бюджет</p>
                      <p className="font-semibold text-lg">
                        {formatPrice(order.budget)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Дата начала
                      </p>
                      <p className="font-semibold">
                        {formatDate(order.serviceDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Местоположение
                      </p>
                      <p className="font-semibold">{order.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Требуется
                      </p>
                      <p className="font-semibold">
                        {order.workersNeeded}{" "}
                        {order.workersNeeded === 1 ? "человек" : "человека"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                  {order.mealIncluded && (
                    <div className="flex items-center gap-2 text-sm">
                      <Utensils className="w-4 h-4 text-green-600" />
                      <span>Питание включено</span>
                    </div>
                  )}
                  {order.transportPaid && (
                    <div className="flex items-center gap-2 text-sm">
                      <Bus className="w-4 h-4 text-blue-600" />
                      <span>Транспорт оплачивается</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 mt-6 pt-6 border-t text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{order.applicantsCount} откликов</span>
                  </div>
                  {order.viewsCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{order.viewsCount} просмотров</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Опубликовано {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Описание заказа
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {order.description}
                </p>
              </CardContent>
            </Card>

            {/* Work Details */}
            {order.workDetails && order.workDetails.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Объем работ
                  </h2>
                  <ul className="space-y-2">
                    {order.workDetails.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {order.requirements && order.requirements.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Требования</h2>
                  <ul className="space-y-2">
                    {order.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Photos */}
            {order.photos && order.photos.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Фотографии</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {order.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden"
                      >
                        <Image
                          src={photo}
                          alt={`Фото ${index + 1}`}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Apply Card - показываем только для работников */}
              {userRole === 'worker' && (
                <Card>
                  <CardContent className="p-6">
                    <Button
                      onClick={handleApply}
                      disabled={applying || hasApplied || checkingApplication}
                      size="lg"
                      className="w-full mb-4 text-white"
                    >
                      {checkingApplication 
                        ? "Проверка..." 
                        : hasApplied 
                          ? "Отклик отправлен" 
                          : applying 
                            ? "Отправка..." 
                            : "Откликнуться на заказ"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      {hasApplied 
                        ? "Вы уже откликнулись на этот заказ"
                        : "Нажимая кнопку, вы соглашаетесь с условиями использования"}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Customer Info */}
              {order.customerName && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Заказчик</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{order.customerName}</span>
                      </div>
                      {order.customerPhone && (
                        <div className="space-y-2">
                          {!showPhone ? (
                            <Button
                              onClick={handleShowPhone}
                              variant="outline"
                              className="w-full"
                              size="sm"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Показать номер
                            </Button>
                          ) : (
                            <div className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <a
                                href={`tel:${order.customerPhone}`}
                                onClick={handlePhoneClick}
                                className="text-primary hover:underline font-medium"
                              >
                                {order.customerPhone}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Быстрая информация</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Тип заказа:
                      </span>
                      <p className="font-medium">
                        {order.type === "daily"
                          ? "Дневная работа"
                          : "Вакансия"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Статус:</span>
                      <p className="font-medium">
                        {statusLabels[order.status]}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Дата публикации:
                      </span>
                      <p className="font-medium">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Share */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Поделиться</h3>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>

      {/* Модальное окно авторизации */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        redirectTo={`/orders/${id}`}
      />
    </div>
  );
}

