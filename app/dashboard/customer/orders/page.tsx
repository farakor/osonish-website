import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, MapPin, DollarSign, User } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { getCityName } from '@/constants/registration';

export const metadata = {
  title: 'Мои заказы - Osonish',
  description: 'Управление заказами',
};

export default async function CustomerOrdersPage() {
  const user = await getCurrentUser();
  const t = await getTranslations('customerOrders');
  const locale = await getLocale();
  
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'customer') {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  // Получаем заказы пользователя
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  }

  // Для каждого заказа/вакансии получаем количество откликов
  const ordersWithResponses = await Promise.all(
    (orders || []).map(async (order) => {
      let responsesCount = 0;

      if (order.type === 'vacancy') {
        // Для вакансий считаем отклики из vacancy_applications
        const { count } = await supabase
          .from('vacancy_applications')
          .select('*', { count: 'exact', head: true })
          .eq('vacancy_id', order.id);
        
        responsesCount = count || 0;
      } else {
        // Для заказов считаем отклики из applicants
        const { count } = await supabase
          .from('applicants')
          .select('*', { count: 'exact', head: true })
          .eq('order_id', order.id);
        
        responsesCount = count || 0;
      }

      return {
        ...order,
        responsesCount,
      };
    })
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
      open: { label: t('statuses.open'), variant: 'default', className: 'bg-primary text-white border-primary hover:bg-primary' },
      in_progress: { label: t('statuses.in_progress'), variant: 'secondary' },
      completed: { label: t('statuses.completed'), variant: 'outline' },
      cancelled: { label: t('statuses.cancelled'), variant: 'destructive' },
      new: { label: t('statuses.new'), variant: 'default', className: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-500' },
      response_received: { label: t('statuses.response_received'), variant: 'secondary', className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100' },
    };

    const config = statusConfig[status] || statusConfig.open;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="pt-24 pb-8">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <Link href="/dashboard/customer/create-order">
            <Button>{t('createNewOrder')}</Button>
          </Link>
        </div>

        {!ordersWithResponses || ordersWithResponses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                {t('noOrders')}
              </p>
              <Link href="/dashboard/customer/create-order">
                <Button>{t('createFirstOrder')}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ordersWithResponses.map((order: any) => (
              <Card key={order.id} className="border border-[#DAE3EC] hover:border-blue-300 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{order.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString('ru-RU')}
                        </div>
                        {order.city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {getCityName(order.city, locale)}
                          </div>
                        )}
                        {order.budget && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {order.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} {t('currency')}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {order.responsesCount || 0} {t('responsesCount')}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {order.description}
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        {t('view')}
                      </Button>
                    </Link>
                    <Link href={`/dashboard/customer/orders/${order.id}/responses`}>
                      <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                        {t('responses')} ({order.responsesCount || 0})
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

