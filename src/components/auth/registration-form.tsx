'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Calendar } from 'lucide-react';

interface RegistrationFormProps {
  phone: string;
  redirectTo?: string;
}

export function RegistrationForm({ phone, redirectTo }: RegistrationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    role: 'customer' as 'customer' | 'worker',
    city: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Введите имя');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Введите фамилию');
      return false;
    }
    if (!formData.birthDate) {
      setError('Введите дату рождения');
      return false;
    }

    // Проверка возраста (18+)
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (age < 18 || (age === 18 && monthDiff < 0)) {
      setError('Вам должно быть не менее 18 лет');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          birthDate: formData.birthDate,
          role: formData.role,
          city: formData.city.trim() || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Регистрация успешна');
        // Перенаправляем на dashboard или указанную страницу
        const targetUrl = redirectTo || '/dashboard';
        window.location.href = targetUrl;
      } else {
        setError(data.error || 'Не удалось завершить регистрацию');
      }
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError('Ошибка при регистрации. Попробуйте позже');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Завершите регистрацию</CardTitle>
        <CardDescription>
          Заполните информацию о себе для завершения регистрации
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-md text-sm">
            <p className="text-blue-800">
              📱 Номер телефона: <span className="font-medium">{phone}</span>
            </p>
          </div>

          {/* Имя и Фамилия */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Иван"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Фамилия *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Иванов"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Дата рождения */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">Дата рождения *</Label>
            <div className="relative">
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                required
                disabled={loading}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-xs text-muted-foreground">
              Вам должно быть не менее 18 лет
            </p>
          </div>

          {/* Город */}
          <div className="space-y-2">
            <Label htmlFor="city">Город</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Ташкент"
              disabled={loading}
            />
          </div>

          {/* Выбор роли */}
          <div className="space-y-3">
            <Label>Выберите вашу роль *</Label>
            <RadioGroup 
              value={formData.role} 
              onValueChange={(value) => setFormData({ ...formData, role: value as 'customer' | 'worker' })}
              disabled={loading}
            >
              <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="customer" id="customer" />
                <div className="flex-1">
                  <Label htmlFor="customer" className="font-medium cursor-pointer">
                    Заказчик
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Я хочу найти исполнителя для моих задач
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="worker" id="worker" />
                <div className="flex-1">
                  <Label htmlFor="worker" className="font-medium cursor-pointer">
                    Исполнитель
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Я хочу находить работу и выполнять заказы
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Регистрация...
              </>
            ) : (
              'Завершить регистрацию'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

