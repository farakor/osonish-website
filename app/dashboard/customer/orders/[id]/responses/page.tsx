import { getCurrentUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { OrderResponseCard } from './response-card';

export const metadata = {
  title: 'Отклики на заказ - Osonish',
  description: 'Просмотр откликов на ваш заказ',
};

export default async function OrderResponsesPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'customer') {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  // Получаем заказ
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('customer_id', user.id)
    .single();

  if (orderError || !order) {
    notFound();
  }

  let responses: any[] = [];

  // Проверяем тип: вакансия или обычный заказ
  if (order.type === 'vacancy') {
    // Для вакансий получаем отклики из vacancy_applications
    const { data: vacancyAppsData, error: vacancyError } = await supabase
      .from('vacancy_applications')
      .select(`
        *,
        applicant:users!vacancy_applications_applicant_id_fkey(
          id,
          first_name,
          last_name,
          phone,
          profile_image
        )
      `)
      .eq('vacancy_id', id)
      .order('created_at', { ascending: false });

    if (vacancyError) {
      console.error('Error fetching vacancy applications:', vacancyError);
    } else if (vacancyAppsData) {
      // Преобразуем данные вакансий в общий формат
      responses = vacancyAppsData.map((app: any) => ({
        id: app.id,
        worker_id: app.applicant_id,
        worker: app.applicant ? {
          id: app.applicant.id,
          first_name: app.applicant.first_name || 'Соискатель',
          last_name: app.applicant.last_name || '',
          phone: app.applicant.phone,
          profile_image: app.applicant.profile_image,
          rating: null, // Рейтинг не хранится в таблице users
          completed_orders: null // Не хранится в таблице users
        } : null,
        worker_phone: app.applicant?.phone,
        message: app.cover_letter,
        applied_at: app.created_at,
        status: app.status,
        proposed_price: null,
        views_count: 0,
        rating: null, // Рейтинг для соискателей не применим
        completed_jobs: null // Для соискателей не применимо
      }));
    }
  } else {
    // Для обычных заказов получаем отклики из applicants
    const { data: applicantsData, error: applicantsError } = await supabase
      .from('applicants')
      .select(`
        *,
        worker:users!worker_id(
          id,
          first_name,
          last_name,
          phone,
          profile_image
        )
      `)
      .eq('order_id', id)
      .order('applied_at', { ascending: false });

    if (applicantsError) {
      console.error('Error fetching responses:', applicantsError);
    } else if (applicantsData) {
      // Для заказов используем данные из applicants (где есть rating и completed_jobs)
      responses = applicantsData.map((response: any) => ({
        ...response,
        worker: response.worker ? {
          id: response.worker.id,
          first_name: response.worker.first_name || 'Исполнитель',
          last_name: response.worker.last_name || '',
          phone: response.worker.phone,
          profile_image: response.worker.profile_image,
          rating: response.rating, // Из applicants
          completed_orders: response.completed_jobs // Из applicants
        } : null
      }));
    }
  }

  return (
    <div className="pt-24 pb-8">
      <Container>
        {/* Back Button */}
        <Link href="/dashboard/customer/orders">
          <Button
            variant="ghost"
            className="mb-6 -ml-2 border border-gray-200 hover:border-gray-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к заказам
          </Button>
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {order.type === 'vacancy' ? 'Отклики на вакансию' : 'Отклики на заказ'}
            </h1>
            <p className="text-muted-foreground">{order.title}</p>
          </div>
          <Link href={`/orders/${id}`}>
            <Button variant="outline">
              {order.type === 'vacancy' ? 'Просмотр вакансии' : 'Просмотр заказа'}
            </Button>
          </Link>
        </div>

        {!responses || responses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4 text-lg">
                {order.type === 'vacancy' 
                  ? 'На вашу вакансию пока нет откликов'
                  : 'На ваш заказ пока нет откликов'
                }
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {order.type === 'vacancy'
                  ? 'Когда соискатели начнут откликаться, вы увидите их здесь'
                  : 'Когда исполнители начнут откликаться, вы увидите их здесь'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {responses.map((response: any) => (
              <OrderResponseCard 
                key={response.id} 
                response={response}
                orderType={order.type}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

