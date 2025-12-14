'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Calendar, DollarSign, Eye, Phone, Briefcase, Check, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ResponseCardProps {
  response: any;
}

export function ResponseCard({ response }: ResponseCardProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(response.status);

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

  const handleUpdateStatus = async (newStatus: 'accepted' | 'rejected') => {
    if (isProcessing) return;

    const confirmMessage = newStatus === 'accepted' 
      ? `Вы уверены, что хотите принять отклик от ${response.worker?.first_name} ${response.worker?.last_name}?`
      : `Вы уверены, что хотите отклонить отклик от ${response.worker?.first_name} ${response.worker?.last_name}?`;

    if (!confirm(confirmMessage)) return;

    setIsProcessing(true);

    try {
      // Определяем тип (вакансия или заказ)
      const type = response.order?.type === 'vacancy' ? 'vacancy' : 'order';

      const res = await fetch(`/api/applications/${response.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, type }),
      });

      const data = await res.json();

      if (data.success) {
        setCurrentStatus(newStatus);
        // Обновляем страницу для получения актуальных данных
        router.refresh();
      } else {
        alert(data.error || 'Не удалось обновить статус отклика');
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      alert('Произошла ошибка при обновлении статуса');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all">
      <CardHeader>
        {/* Информация о заказе/вакансии - ЗАМЕТНО */}
        <div className="mb-4 pb-3 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase">
                  {response.order?.type === 'vacancy' ? 'Вакансия' : 'Заказ'}
                </span>
              </div>
              <Link 
                href={`/orders/${response.order?.id}`}
                className="text-base font-semibold hover:text-primary hover:underline block"
              >
                {response.order?.title}
              </Link>
            </div>
            <div className="ml-4">
              {getStatusBadge(currentStatus)}
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Информация об исполнителе */}
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src={response.worker?.profile_image} 
                  alt={`${response.worker?.first_name} ${response.worker?.last_name}`} 
                />
                <AvatarFallback className="bg-primary text-white">
                  {response.worker?.first_name?.[0]}{response.worker?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">
                {response.worker?.first_name} {response.worker?.last_name}
              </CardTitle>
            </div>

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
              {response.proposed_price && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {response.proposed_price.toLocaleString()} сум
                </div>
              )}
              {response.worker?.rating && (
                <div className="flex items-center gap-1">
                  ⭐ {response.worker.rating.toFixed(1)}
                </div>
              )}
              {response.views_count > 0 && (
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
          {/* Кнопки принять/отклонить только для pending статуса */}
          {currentStatus === 'pending' && (
            <>
              <Button 
                size="sm" 
                variant="default"
                onClick={() => handleUpdateStatus('accepted')}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                Принять
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleUpdateStatus('rejected')}
                disabled={isProcessing}
              >
                <X className="w-4 h-4 mr-2" />
                Отклонить
              </Button>
            </>
          )}

          {response.worker?.phone && (
            <Button 
              variant="outline" 
              size="sm"
              asChild
            >
              <a href={`tel:${response.worker.phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Позвонить
              </a>
            </Button>
          )}

          <Link href={`/profiles/${response.worker?.id}`}>
            <Button variant="outline" size="sm">
              Профиль
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

