'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
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
import { useTranslations } from 'next-intl';

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
  const pathname = usePathname();
  const currentLocale = useLocale() as 'ru' | 'uz';
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState(user.preferred_language || currentLocale);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const t = useTranslations('settings');

  const handleSaveSettings = async () => {
    setLoading(true);
    setError('');

    try {
      // Сохраняем язык в профиле пользователя
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferred_language: language,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Настройки сохранены, выбранный язык:', language);
        
        // Если язык изменился, переключаем локаль
        if (language !== currentLocale) {
          console.log('🔄 Переключение локали с', currentLocale, 'на', language);
          
          // Сохраняем выбранный язык в cookie
          document.cookie = `NEXT_LOCALE=${language}; path=/; max-age=31536000; SameSite=Lax`;
          
          alert(t('mainSettings.saveSuccess'));
          
          // Используем setTimeout, чтобы cookie успела установиться
          setTimeout(() => {
            // Перезагружаем страницу с принудительной перезагрузкой с сервера
            window.location.href = pathname;
          }, 100);
        } else {
          alert(t('mainSettings.saveSuccess'));
          router.refresh();
        }
      } else {
        setError(data.error || t('mainSettings.saveError'));
      }
    } catch (err) {
      console.error('Ошибка сохранения настроек:', err);
      setError(t('mainSettings.generalError'));
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
      alert(t('privacy.deleteNotImplemented'));
    } catch (err) {
      console.error('Ошибка удаления аккаунта:', err);
      setError(t('privacy.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Основные настройки */}
      <Card>
        <CardHeader>
          <CardTitle>{t('mainSettings.title')}</CardTitle>
          <CardDescription>{t('mainSettings.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Язык */}
          <div className="space-y-2">
            <Label htmlFor="language">{t('mainSettings.language')}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language">
                <SelectValue placeholder={t('mainSettings.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">{t('mainSettings.russian')}</SelectItem>
                <SelectItem value="uz">{t('mainSettings.uzbek')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Роль */}
          <div className="space-y-2">
            <Label>{t('mainSettings.role')}</Label>
            <div className="text-sm text-muted-foreground">
              {user.role === 'customer' ? t('mainSettings.customer') : t('mainSettings.worker')}
            </div>
          </div>

          <Button onClick={handleSaveSettings} disabled={loading || isPending}>
            {loading || isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t('mainSettings.saving')}
              </>
            ) : (
              t('mainSettings.saveButton')
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Уведомления */}
      <Card>
        <CardHeader>
          <CardTitle>{t('notifications.title')}</CardTitle>
          <CardDescription>{t('notifications.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('notifications.push')}</Label>
              <div className="text-sm text-muted-foreground">
                {t('notifications.pushDescription')}
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('notifications.email')}</Label>
              <div className="text-sm text-muted-foreground">
                {t('notifications.emailDescription')}
              </div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Конфиденциальность */}
      <Card>
        <CardHeader>
          <CardTitle>{t('privacy.title')}</CardTitle>
          <CardDescription>{t('privacy.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('privacy.phone')}</Label>
            <div className="text-sm text-muted-foreground">{user.phone}</div>
          </div>

          <div className="pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('privacy.deleteAccount')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {t('privacy.deleteConfirmTitle')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('privacy.deleteConfirmDescription')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('privacy.cancelButton')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {t('privacy.deleteButton')}
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

