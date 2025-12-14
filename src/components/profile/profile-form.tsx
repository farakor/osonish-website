'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Loader2 } from 'lucide-react';

interface User {
  id: string;
  phone: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  city?: string;
  bio?: string;
  avatar_url?: string;
  role: string;
  rating?: number;
  reviews_count?: number;
  experience_years?: number;
  skills?: string[];
  education?: string;
}

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar_url || null);
  
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    city: user.city || '',
    bio: user.bio || '',
    experience_years: user.experience_years || 0,
    skills: user.skills?.join(', ') || '',
    education: user.education || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    // Проверяем размер (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setUploadingAvatar(true);
    setError('');

    try {
      // Создаем превью
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Загружаем файл
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Аватар загружен успешно');
        // Обновляем страницу для получения актуальных данных
        router.refresh();
      } else {
        setError(data.error || 'Не удалось загрузить аватар');
        setAvatarPreview(user.avatar_url || null);
      }
    } catch (err) {
      console.error('Ошибка загрузки аватара:', err);
      setError('Ошибка при загрузке аватара');
      setAvatarPreview(user.avatar_url || null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Подготавливаем данные для отправки
      const updates: any = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim() || null,
        city: formData.city.trim() || null,
        bio: formData.bio.trim() || null,
      };

      // Добавляем поля для исполнителей
      if (user.role === 'worker') {
        updates.experience_years = parseInt(formData.experience_years.toString()) || 0;
        updates.skills = formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
        updates.education = formData.education.trim() || null;
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Профиль обновлен успешно');
        // Обновляем страницу для получения актуальных данных
        router.refresh();
        alert('Профиль успешно обновлен!');
      } else {
        setError(data.error || 'Не удалось обновить профиль');
      }
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      setError('Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Левая колонка - Фото и основная информация */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Фото профиля</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4 relative">
                <AvatarImage src={avatarPreview || undefined} alt={user.first_name || ''} />
                <AvatarFallback className="text-2xl">
                  {user.first_name?.[0] || user.phone?.[0] || '?'}
                </AvatarFallback>
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  </div>
                )}
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Изменить фото
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Телефон</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Роль</p>
                <p className="font-medium">
                  {user.role === 'customer' ? 'Заказчик' : 'Исполнитель'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Рейтинг</p>
                <p className="font-medium">
                  ⭐ {user.rating?.toFixed(1) || '0.0'} ({user.reviews_count || 0} отзывов)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Правая колонка - Форма редактирования */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Личные данные</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Имя *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Фамилия *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Ваша фамилия"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Город</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Ваш город"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">О себе</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Расскажите о себе..."
                  rows={4}
                />
              </div>

              {user.role === 'worker' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Опыт работы (лет)</Label>
                    <Input
                      id="experience_years"
                      name="experience_years"
                      type="number"
                      min="0"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Навыки</Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="Перечислите ваши навыки через запятую"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Образование</Label>
                    <Textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="Информация об образовании"
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    'Сохранить изменения'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

