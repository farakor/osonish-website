import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { createClient } from '@/lib/supabase/server';
import { ResponsesClient } from './page-client';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('customerResponses');
  return {
    title: `${t('title')} - Osonish`,
    description: t('description'),
  };
}

export default async function AllResponsesPage() {
  const user = await getCurrentUser();
  const t = await getTranslations('customerResponses');
  
  if (!user) {
    redirect('/auth/login');
  }

  if (user.role !== 'customer') {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  // Получаем ВСЕ заказы и вакансии пользователя
  const { data: allOrders, error: allOrdersError } = await supabase
    .from('orders')
    .select('id, title, status, type')
    .eq('customer_id', user.id);

  if (allOrdersError) {
    console.error('Error fetching orders:', allOrdersError);
  }

  // Разделяем на заказы и вакансии
  const orders = allOrders?.filter(order => order.type !== 'vacancy') || [];
  const vacancies = allOrders?.filter(order => order.type === 'vacancy') || [];

  const orderIds = orders?.map(order => order.id) || [];
  const vacancyIds = vacancies?.map(vac => vac.id) || [];
  
  let orderResponses: any[] = [];
  let vacancyResponses: any[] = [];

  // Получаем отклики на заказы (applicants)
  if (orderIds.length > 0) {
    const { data: responsesData, error: responsesError } = await supabase
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
      .in('order_id', orderIds)
      .order('applied_at', { ascending: false });

    if (responsesError) {
      console.error('Error fetching order responses:', responsesError);
    } else if (responsesData && responsesData.length > 0) {
      // Объединяем данные с заказами
      orderResponses = responsesData.map(response => {
        const order = orders?.find(o => o.id === response.order_id);
        return {
          ...response,
          order: order,
          // Используем актуальные данные из связанной таблицы users, если доступны
          worker: response.worker ? {
            id: response.worker.id,
            first_name: response.worker.first_name || 'Исполнитель',
            last_name: response.worker.last_name || '',
            phone: response.worker.phone || response.worker_phone,
            rating: response.rating, // Берем из applicants
            completed_orders: response.completed_jobs, // Берем из applicants
            profile_image: response.worker.profile_image
          } : {
            // Fallback на сохраненные данные, если связанный пользователь не найден
            id: response.worker_id,
            first_name: response.worker_name?.split(' ')[0] || 'Исполнитель',
            last_name: response.worker_name?.split(' ')[1] || '',
            phone: response.worker_phone,
            rating: response.rating,
            completed_orders: response.completed_jobs,
            profile_image: null
          }
        };
      });
    }
  }

  // Получаем отклики на вакансии (vacancy_applications)
  if (vacancyIds.length > 0) {
    const { data: vacancyAppsData, error: vacancyAppsError } = await supabase
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
      .in('vacancy_id', vacancyIds)
      .order('created_at', { ascending: false });

    if (vacancyAppsError) {
      console.error('Error fetching vacancy applications:', vacancyAppsError);
    } else if (vacancyAppsData && vacancyAppsData.length > 0) {
      // Объединяем данные с вакансиями
      vacancyResponses = vacancyAppsData.map((app: any) => {
        const vacancy = vacancies?.find(v => v.id === app.vacancy_id);
        return {
          id: app.id,
          order_id: app.vacancy_id,
          worker_id: app.applicant_id,
          message: app.cover_letter,
          applied_at: app.created_at,
          status: app.status,
          order: vacancy,
          worker: app.applicant ? {
            id: app.applicant.id,
            first_name: app.applicant.first_name || 'Соискатель',
            last_name: app.applicant.last_name || `#${app.applicant_id.substring(0, 8)}`,
            phone: app.applicant.phone,
            profile_image: app.applicant.profile_image
          } : {
            id: app.applicant_id,
            first_name: 'Соискатель',
            last_name: `#${app.applicant_id.substring(0, 8)}`,
            phone: null,
            profile_image: null
          }
        };
      });
    }
  }

  // Сортируем отклики по дате
  orderResponses.sort((a, b) => 
    new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
  );
  vacancyResponses.sort((a, b) => 
    new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
  );

  return (
    <div className="pt-24 pb-8">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <ResponsesClient 
          orderResponses={orderResponses} 
          vacancyResponses={vacancyResponses}
        />
      </Container>
    </div>
  );
}

