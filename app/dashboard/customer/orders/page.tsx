import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Calendar, MapPin, DollarSign, User } from 'lucide-react';

export const metadata = {
  title: 'Мои заказы - Osonish',
  description: 'Управление заказами',
};

export default async function CustomerOrdersPage() {
  const user = await getCurrentUser();
  
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
      open: { label: 'Открыт', variant: 'default', className: 'bg-primary text-white border-primary hover:bg-primary' },
      in_progress: { label: 'В работе', variant: 'secondary' },
      completed: { label: 'Завершен', variant: 'outline' },
      cancelled: { label: 'Отменен', variant: 'destructive' },
      new: { label: 'Новый', variant: 'default', className: 'bg-blue-500 text-white border-blue-500 hover:bg-blue-500' },
      response_received: { label: 'Отклики получены', variant: 'secondary', className: 'bg-green-100 text-green-700 border-green-200' },
    };

    const config = statusConfig[status] || statusConfig.open;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="pt-24 pb-8">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Мои заказы</h1>
          <Link href="/dashboard/customer/create-order">
            <Button>Создать новый заказ</Button>
          </Link>
        </div>

        {!ordersWithResponses || ordersWithResponses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                У вас пока нет заказов
              </p>
              <Link href="/dashboard/customer/create-order">
                <Button>Создать первый заказ</Button>
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
                            {order.city}
                          </div>
                        )}
                        {order.budget && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {order.budget.toLocaleString()} сум
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {order.responsesCount || 0} откликов
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
                        Просмотр
                      </Button>
                    </Link>
                    <Link href={`/dashboard/customer/orders/${order.id}/responses`}>
                      <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                        Отклики ({order.responsesCount || 0})
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

