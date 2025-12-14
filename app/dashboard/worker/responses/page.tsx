import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WorkerResponsesClient } from './page-client';

export const metadata = {
  title: 'Мои отклики - Osonish',
  description: 'Управление откликами на заказы и вакансии',
};

export default async function WorkerResponsesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'worker') {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  let orderResponses: any[] = [];
  let vacancyResponses: any[] = [];

  // Получаем отклики на заказы пользователя (applicants)
  const { data: orderApplicants, error: orderError } = await supabase
    .from('applicants')
    .select(`
      *,
      order:orders(
        id,
        title,
        customer_id,
        type
      ),
      customer:orders!order_id(
        customer:customer_id(
          id,
          first_name,
          last_name,
          phone
        )
      )
    `)
    .eq('worker_id', user.id)
    .order('applied_at', { ascending: false });

  if (orderError) {
    console.error('Error fetching order responses:', orderError);
  } else {
    orderResponses = orderApplicants?.map((response: any) => ({
      ...response,
      customer: response.customer?.customer,
      response_type: 'order'
    })) || [];
  }

  // Получаем отклики на вакансии пользователя (vacancy_applications)
  const { data: vacancyApplicants, error: vacancyError } = await supabase
    .from('vacancy_applications')
    .select('*')
    .eq('applicant_id', user.id)
    .order('created_at', { ascending: false });

  if (vacancyError) {
    console.error('Error fetching vacancy responses:', vacancyError);
  }

  // Если есть отклики, загружаем дополнительные данные
  if (vacancyApplicants && vacancyApplicants.length > 0) {
    // Получаем ID вакансий
    const vacancyIds = vacancyApplicants.map((app: any) => app.vacancy_id);
    
    // Загружаем данные о вакансиях
    const { data: vacancies, error: vacanciesError } = await supabase
      .from('orders')
      .select(`
        id,
        title,
        customer_id,
        type,
        employer:users!customer_id(
          id,
          first_name,
          last_name,
          phone
        )
      `)
      .in('id', vacancyIds);

    if (vacanciesError) {
      console.error('Error fetching vacancies:', vacanciesError);
    }

    // Объединяем данные
    vacancyResponses = vacancyApplicants.map((app: any) => {
      const vacancy = vacancies?.find((v: any) => v.id === app.vacancy_id);
      return {
        id: app.id,
        order_id: app.vacancy_id,
        applied_at: app.created_at,
        status: app.status,
        message: app.cover_letter || '',
        views_count: 0,
        order: vacancy ? {
          id: vacancy.id,
          title: vacancy.title,
          customer_id: vacancy.customer_id,
          type: vacancy.type
        } : null,
        customer: vacancy?.employer || null,
        response_type: 'vacancy'
      };
    });
  }

  // Объединяем все отклики и сортируем по дате
  const allResponses = [...orderResponses, ...vacancyResponses].sort((a, b) => 
    new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
  );

  return (
    <div className="pt-24 pb-8">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Мои отклики</h1>
          <Link href="/orders">
            <Button className="text-white">Найти заказы</Button>
          </Link>
        </div>

        {!allResponses || allResponses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                У вас пока нет откликов
              </p>
              <Link href="/orders">
                <Button className="text-white">Найти заказы и вакансии</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <WorkerResponsesClient responses={allResponses} />
        )}
      </Container>
    </div>
  );
}

