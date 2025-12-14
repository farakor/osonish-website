'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

interface User {
  id: string;
  phone: string;
  role: string;
  preferred_language?: string;
}

interface SettingsFormProps {
  user: User;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState(user.preferred_language || 'ru');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferred_language: language,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Настройки сохранены');
        alert('Настройки успешно сохранены!');
        router.refresh();
      } else {
        setError(data.error || 'Не удалось сохранить настройки');
      }
    } catch (err) {
      console.error('Ошибка сохранения настроек:', err);
      setError('Ошибка при сохранении настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setError('');

    try {
      // TODO: Реализовать удаление аккаунта
      console.log('Удаление аккаунта...');
      alert('Функция удаления аккаунта будет реализована позже');
    } catch (err) {
      console.error('Ошибка удаления аккаунта:', err);
      setError('Ошибка при удалении аккаунта');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Основные настройки */}
      <Card>
        <CardHeader>
          <CardTitle>Основные настройки</CardTitle>
          <CardDescription>Управление параметрами вашего аккаунта</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Язык */}
          <div className="space-y-2">
            <Label htmlFor="language">Язык интерфейса</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Выберите язык" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="uz">O'zbekcha</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Роль */}
          <div className="space-y-2">
            <Label>Роль</Label>
            <div className="text-sm text-muted-foreground">
              {user.role === 'customer' ? 'Заказчик' : 'Исполнитель'}
            </div>
          </div>

          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить настройки'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Уведомления */}
      <Card>
        <CardHeader>
          <CardTitle>Уведомления</CardTitle>
          <CardDescription>Настройте, какие уведомления вы хотите получать</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push-уведомления</Label>
              <div className="text-sm text-muted-foreground">
                Получать уведомления о новых сообщениях и откликах
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email-уведомления</Label>
              <div className="text-sm text-muted-foreground">
                Получать важные уведомления на почту
              </div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Конфиденциальность */}
      <Card>
        <CardHeader>
          <CardTitle>Конфиденциальность</CardTitle>
          <CardDescription>Управление данными аккаунта</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Телефон</Label>
            <div className="text-sm text-muted-foreground">{user.phone}</div>
          </div>

          <div className="pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить аккаунт
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Вы уверены?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Это приведет к безвозвратному удалению вашего
                    аккаунта и всех связанных данных с наших серверов.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Удалить аккаунт
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

