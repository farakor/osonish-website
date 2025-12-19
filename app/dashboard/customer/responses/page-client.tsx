'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, Briefcase, FileText } from 'lucide-react';
import { ResponseCard } from './response-card';
import { useTranslations } from 'next-intl';

interface Response {
  id: string;
  order_id: string;
  worker_id: string;
  message: string;
  applied_at: string;
  status: string;
  order?: {
    id: string;
    title: string;
    status: string;
    type?: string;
  };
  worker?: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    profile_image?: string;
    rating?: number;
    completed_orders?: number;
  };
  proposed_price?: number;
  views_count?: number;
}

interface ResponsesClientProps {
  orderResponses: Response[];
  vacancyResponses: Response[];
}

export function ResponsesClient({ orderResponses, vacancyResponses }: ResponsesClientProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'vacancies'>('orders');
  const t = useTranslations('customerResponses');

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
          {t('tabs.orders')}
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
          {t('tabs.vacancies')}
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
            <p className="text-sm text-muted-foreground">{t('stats.totalResponses')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {currentPendingCount}
            </div>
            <p className="text-sm text-muted-foreground">{t('stats.awaitingResponse')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {currentAcceptedCount}
            </div>
            <p className="text-sm text-muted-foreground">{t('stats.accepted')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Список откликов */}
      {!currentResponses || currentResponses.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4 text-lg">
              {t('empty.noResponses')} {activeTab === 'orders' ? t('empty.onOrders') : t('empty.onVacancies')}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {activeTab === 'orders' 
                ? t('empty.ordersDescription')
                : t('empty.vacanciesDescription')
              }
            </p>
            <Link href={activeTab === 'orders' ? '/dashboard/customer/create-order' : '/dashboard/customer/create-vacancy'}>
              <Button>
                {activeTab === 'orders' ? t('empty.createOrder') : t('empty.createVacancy')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentResponses.map((response) => (
            <ResponseCard key={response.id} response={response} />
          ))}
        </div>
      )}
    </>
  );
}

