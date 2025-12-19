'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/shared/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/shared/image-upload';

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    address: '',
    budget: '',
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement order creation
      // 1. Upload images to Supabase Storage
      // 2. Create order in database
      // 3. Redirect to order page
      
      console.log('Creating order:', { ...formData, images });
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/dashboard/customer/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Не удалось создать заказ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="pt-24 pb-8">
      <Container>
        <h1 className="text-3xl font-bold mb-8">Создать заказ</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Основная информация */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Название заказа *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Например: Ремонт квартиры"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Описание *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Подробно опишите, что нужно сделать..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Категория *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#679B00] transition-all"
                      required
                    >
                      <option value="">Выберите категорию</option>
                      <option value="one_day_job">Работа на 1 день</option>
                      <optgroup label="Ремонт и строительство">
                        <option value="repair_construction">Ремонт и строительство (общее)</option>
                        <option value="plumbing">Сантехника</option>
                        <option value="electrical">Электрика</option>
                        <option value="painting">Покраска/Маляр</option>
                        <option value="carpenter">Плотник</option>
                        <option value="tiler">Плиточник</option>
                        <option value="construction">Строительство</option>
                      </optgroup>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Фотографии</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    images={images}
                    onChange={setImages}
                    maxImages={10}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Дополнительные детали */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Детали</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Город *</Label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-2 focus-visible:border-[#679B00] transition-all"
                      required
                    >
                      <option value="">Выберите город</option>
                      <option value="Ташкент">Ташкент</option>
                      <option value="Самарканд">Самарканд</option>
                      <option value="Бухара">Бухара</option>
                      <option value="Андижан">Андижан</option>
                      <option value="Наманган">Наманган</option>
                      <option value="Фергана">Фергана</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Улица, дом"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Бюджет (сум)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Срок выполнения</Label>
                    <Input
                      id="deadline"
                      name="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={handleChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Создание...' : 'Создать заказ'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}

