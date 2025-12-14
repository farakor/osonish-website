'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, DollarSign, Eye, Phone, Briefcase, FileText, MessageSquare } from 'lucide-react';

interface Response {
  id: string;
  order_id: string;
  applied_at: string;
  proposed_price?: number;
  views_count: number;
  status: string;
  message: string;
  response_type: 'order' | 'vacancy';
  order?: {
    id: string;
    title: string;
    customer_id: string;
    type?: string;
  };
  customer?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
}

interface WorkerResponsesClientProps {
  responses: Response[];
}

export function WorkerResponsesClient({ responses }: WorkerResponsesClientProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'vacancies'>('orders');

  // Разделяем отклики по типу
  const orderResponses = responses.filter(r => r.response_type === 'order');
  const vacancyResponses = responses.filter(r => r.response_type === 'vacancy');

  // Статистика для заказов
  const ordersPendingCount = orderResponses.filter(r => r.status === 'pending').length;
  const ordersAcceptedCount = orderResponses.filter(r => r.status === 'accepted').length;
  const ordersTotalCount = orderResponses.length;

  // Статистика для вакансий
  const vacanciesPendingCount = vacancyResponses.filter(r => r.status === 'pending').length;
  const vacanciesAcceptedCount = vacancyResponses.filter(r => r.status === 'accepted').length;
  const vacanciesTotalCount = vacancyResponses.length;

  // Текущие данные в зависимости от активного таба
  const currentResponses = activeTab === 'orders' ? orderResponses : vacancyResponses;
  const currentPendingCount = activeTab === 'orders' ? ordersPendingCount : vacanciesPendingCount;
  const currentAcceptedCount = activeTab === 'orders' ? ordersAcceptedCount : vacanciesAcceptedCount;
  const currentTotalCount = activeTab === 'orders' ? ordersTotalCount : vacanciesTotalCount;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
      pending: { label: 'На рассмотрении', variant: 'outline', className: 'bg-[#DAE3EC] text-gray-700 border-[#DAE3EC]' },
      accepted: { label: 'Принят', variant: 'secondary', className: 'bg-[#679B00] text-white border-[#679B00] hover:bg-[#679B00]' },
      rejected: { label: 'Отклонен', variant: 'destructive' },
      completed: { label: 'Завершен', variant: 'outline' },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const handleCallCustomer = async (phone: string, orderId: string) => {
    try {
      // Логируем просмотр телефона
      await fetch(`/api/orders/${orderId}/phone-view`, {
        method: 'POST',
      });

      // Логируем звонок
      await fetch(`/api/orders/${orderId}/phone-call`, {
        method: 'POST',
      });

      // Открываем звонок
      window.location.href = `tel:${phone}`;
    } catch (error) {
      console.error('Error logging phone action:', error);
      // Открываем звонок даже если логирование не удалось
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <>
      {/* Табы */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setActiveTab('orders')}
          variant={activeTab === 'orders' ? 'default' : 'outline'}
          className={`flex items-center gap-2 ${
            activeTab === 'orders' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Заказы
          {ordersTotalCount > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === 'orders' 
                ? 'bg-white/20 text-white' 
                : 'bg-primary/10 text-primary'
            }`}>
              {ordersTotalCount}
            </span>
          )}
        </Button>
        
        <Button
          onClick={() => setActiveTab('vacancies')}
          variant={activeTab === 'vacancies' ? 'default' : 'outline'}
          className={`flex items-center gap-2 ${
            activeTab === 'vacancies' 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Вакансии
          {vacanciesTotalCount > 0 && (
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              activeTab === 'vacancies' 
                ? 'bg-white/20 text-white' 
                : 'bg-primary/10 text-primary'
            }`}>
              {vacanciesTotalCount}
            </span>
          )}
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">
              {currentTotalCount}
            </div>
            <p className="text-sm text-muted-foreground">Всего откликов</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {currentPendingCount}
            </div>
            <p className="text-sm text-muted-foreground">Ожидают ответа</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {currentAcceptedCount}
            </div>
            <p className="text-sm text-muted-foreground">Принято</p>
          </CardContent>
        </Card>
      </div>

      {/* Список откликов */}
      {!currentResponses || currentResponses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4 text-lg">
              У вас пока нет откликов {activeTab === 'orders' ? 'на заказы' : 'на вакансии'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {activeTab === 'orders' 
                ? 'Найдите интересные заказы и откликайтесь на них'
                : 'Найдите подходящие вакансии и откликайтесь на них'
              }
            </p>
            <Link href="/orders">
              <Button className="text-white">
                {activeTab === 'orders' ? 'Найти заказы' : 'Найти вакансии'}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentResponses.map((response: Response) => {
            const isVacancy = response.response_type === 'vacancy';
            const entityName = isVacancy ? 'вакансии' : 'заказа';
            const viewButtonText = isVacancy ? 'Просмотр вакансии' : 'Просмотр заказа';
            const contactButtonText = isVacancy ? 'Связаться с работодателем' : 'Связаться с заказчиком';
            
            return (
              <Card key={response.id} className="border border-[#DAE3EC] hover:border-blue-300 transition-all">
                <CardHeader>
                  {/* Информация о заказе/вакансии */}
                  <div className="mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium text-primary uppercase">
                            {isVacancy ? 'Вакансия' : 'Заказ'}
                          </span>
                        </div>
                        <Link 
                          href={isVacancy ? `/vacancies/${response.order?.id}` : `/orders/${response.order?.id}`}
                          className="text-base font-semibold hover:text-primary hover:underline block"
                        >
                          {response.order?.title}
                        </Link>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(response.status)}
                      </div>
                    </div>
                  </div>

                  {/* Информация о заказчике/работодателе */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {response.customer && (
                        <CardTitle className="text-lg mb-2">
                          {response.customer.first_name} {response.customer.last_name}
                        </CardTitle>
                      )}

                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(response.applied_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {response.proposed_price && !isVacancy && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {response.proposed_price.toLocaleString()} сум
                          </div>
                        )}
                        {response.views_count > 0 && !isVacancy && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {response.views_count}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {response.message && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {response.message}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Link href={isVacancy ? `/vacancies/${response.order?.id}` : `/orders/${response.order?.id}`}>
                      <Button variant="outline" size="sm">
                        {viewButtonText}
                      </Button>
                    </Link>
                    {response.status === 'accepted' && response.customer && response.customer.phone && (
                      <Button 
                        size="sm"
                        onClick={() => handleCallCustomer(response.customer!.phone, response.order?.id || '')}
                        className="text-white"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {contactButtonText}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

