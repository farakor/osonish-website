import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Container } from '@/components/shared/container';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  ShoppingBag, 
  Briefcase, 
  MessageSquare, 
  Star,
  Settings,
  LogOut 
} from 'lucide-react';

export const metadata = {
  title: 'Личный кабинет - Osonish',
  description: 'Управляйте заказами и профилем',
};

async function logout() {
  'use server';
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout`, {
    method: 'POST',
  });
  
  if (response.ok) {
    redirect('/auth/login');
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  const isCustomer = user.role === 'customer';
  const isWorker = user.role === 'worker';
  const isJobSeeker = user.worker_type === 'job_seeker';

  return (
    <div className="pt-24 pb-8">
      <Container>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Добро пожаловать, {user.first_name || 'Пользователь'}!
            </h1>
            <p className="text-muted-foreground">
              {isCustomer ? 'Кабинет заказчика' : 'Кабинет исполнителя'}
            </p>
          </div>
          <form action={logout}>
            <Button variant="outline" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Выход
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isWorker && (
            <Link href="/orders">
              <Card className="border border-[#DAE3EC] hover:border-blue-400 transition-all cursor-pointer bg-primary text-white">
                <CardHeader>
                  <Briefcase className="h-8 w-8 mb-2" />
                  <CardTitle>Найти заказы</CardTitle>
                  <CardDescription className="text-white/80">
                    Откликнуться на заказы
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}

          <Link href="/dashboard/profile">
            <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all cursor-pointer">
              <CardHeader>
                <User className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Профиль</CardTitle>
                <CardDescription>
                  Редактировать персональные данные
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {isCustomer && (
            <>
              <Link href="/dashboard/customer/orders">
                <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all cursor-pointer">
                  <CardHeader>
                    <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Мои заказы</CardTitle>
                    <CardDescription>
                      Управление заказами
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/dashboard/customer/responses">
                <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all cursor-pointer">
                  <CardHeader>
                    <MessageSquare className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Все отклики</CardTitle>
                    <CardDescription>
                      Просмотр откликов на заказы
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              <Link href="/dashboard/customer/create-order">
                <Card className="border border-[#DAE3EC] hover:border-blue-400 transition-all cursor-pointer bg-primary text-white">
                  <CardHeader>
                    <Briefcase className="h-8 w-8 mb-2" />
                    <CardTitle>Создать заказ</CardTitle>
                    <CardDescription className="text-white/80">
                      Опубликовать новый заказ
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </>
          )}

          {isWorker && (
            <>
              <Link href="/dashboard/worker/responses">
                <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all cursor-pointer">
                  <CardHeader>
                    <MessageSquare className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Мои отклики</CardTitle>
                    <CardDescription>
                      Управление откликами
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>

              {!isJobSeeker && (
                <Link href="/dashboard/reviews">
                  <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all cursor-pointer">
                    <CardHeader>
                      <Star className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Отзывы</CardTitle>
                      <CardDescription>
                        Просмотр отзывов
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )}
            </>
          )}

          <Link href="/dashboard/settings">
            <Card className="border border-[#DAE3EC] hover:border-blue-300 transition-all cursor-pointer">
              <CardHeader>
                <Settings className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Настройки</CardTitle>
                <CardDescription>
                  Настройки аккаунта
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Статистика - только для исполнителей (кроме соискателей) */}
        {isWorker && !isJobSeeker && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">
                  {user.rating?.toFixed(1) || '0.0'}
                </div>
                <p className="text-xs text-muted-foreground">Рейтинг</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">
                  {user.reviews_count || 0}
                </div>
                <p className="text-xs text-muted-foreground">Отзывов</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">
                  {user.completed_orders || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Заказов выполнено
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}

