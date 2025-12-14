import { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Briefcase, 
  Clock, 
  CheckCircle,
  AlertCircle 
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Личный кабинет заказчика - Osonish",
  description: "Управление заказами, поиск исполнителей, отзывы",
};

export default function CustomerDashboardPage() {
  // TODO: Fetch user data and orders
  const stats = {
    activeOrders: 3,
    completedOrders: 12,
    inProgressOrders: 1,
    pendingApplicants: 8,
  };

  return (
    <div className="pt-24 pb-8">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Личный кабинет</h1>
            <p className="text-muted-foreground">
              Управляйте вашими заказами
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/orders/create">
              <Plus className="h-5 w-5 mr-2" />
              Создать заказ
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeOrders}</p>
                  <p className="text-sm text-muted-foreground">Активных</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgressOrders}</p>
                  <p className="text-sm text-muted-foreground">В работе</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completedOrders}</p>
                  <p className="text-sm text-muted-foreground">Завершено</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pendingApplicants}</p>
                  <p className="text-sm text-muted-foreground">Новых откликов</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/orders/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать новый заказ
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/customer/orders">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Мои заказы
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/workers">
                  Найти исполнителей
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Недавняя активность</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Новый отклик на "Ремонт квартиры"
                    </p>
                    <p className="text-xs text-muted-foreground">2 часа назад</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Заказ "Переезд" завершен
                    </p>
                    <p className="text-xs text-muted-foreground">1 день назад</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Создан заказ "Сантехника"
                    </p>
                    <p className="text-xs text-muted-foreground">3 дня назад</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Активные заказы</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Загрузка заказов... (TODO: Implement orders list)
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

