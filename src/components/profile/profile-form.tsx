'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Loader2, Calendar as CalendarIcon, MapPin, X, Plus, Trash2, GraduationCap, Briefcase, Star, Award } from 'lucide-react';
import { UZBEKISTAN_CITIES } from '@/constants/registration';
import { FEATURED_SPECIALIZATIONS, MORE_SPECIALIZATIONS } from '@/constants/specializations';
import { SPECIALIZATIONS as ALL_SPECIALIZATIONS, getSpecializationById, getSpecializationIcon, type SpecializationOption } from '@/constants/specializations-full';
import Image from 'next/image';
import starIconSvg from '@/components/assets/star-rev-yellow.svg';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useTranslations } from 'next-intl';

interface Education {
  institution: string;
  degree: string;
  yearStart: string;
  yearEnd: string;
}

interface WorkExperience {
  company: string;
  position: string;
  yearStart: string;
  yearEnd: string;
  description?: string;
}

interface Specialization {
  id: string;
  name: string;
  isPrimary?: boolean;
}

interface User {
  id: string;
  phone: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  city?: string;
  birth_date?: string;
  gender?: 'male' | 'female';
  bio?: string; // Для совместимости с UI
  about_me?: string; // Основное поле в БД
  avatar_url?: string;
  profile_image?: string; // Альтернативное поле для аватара
  role: string;
  rating?: number;
  reviews_count?: number;
  skills?: string[];
  education?: Education[] | string;
  work_experience?: WorkExperience[];
  desired_salary?: number;
  willing_to_relocate?: boolean;
  specializations?: Specialization[];
}

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('profile');
  
  // Отладка: выводим информацию об аватаре
  console.log('👤 User avatar data:', {
    avatar_url: user.avatar_url,
    profile_image: user.profile_image,
    has_avatar: !!(user.avatar_url || user.profile_image)
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  // Поддержка обоих полей: avatar_url и profile_image
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar_url || user.profile_image || null
  );
  
  // Модальные окна
  const [showCityModal, setShowCityModal] = useState(false);
  const [showSpecializationModal, setShowSpecializationModal] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  // Парсим образование - может быть строкой или массивом
  const parseEducation = (): Education[] => {
    if (Array.isArray(user.education)) {
      return user.education;
    }
    if (typeof user.education === 'string' && user.education) {
      return [{ institution: user.education, degree: '', yearStart: '', yearEnd: '' }];
    }
    return [];
  };

  // Парсим опыт работы - может быть JSON-строкой или массивом
  const parseWorkExperience = (): WorkExperience[] => {
    if (Array.isArray(user.work_experience)) {
      return user.work_experience;
    }
    if (typeof user.work_experience === 'string' && user.work_experience) {
      try {
        const parsed = JSON.parse(user.work_experience);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.error('❌ [ProfileForm] Ошибка парсинга work_experience:', error);
      }
    }
    return [];
  };
  
  // Функция для форматирования числа с пробелами
  const formatNumberWithSpaces = (value: number | string | undefined): string => {
    if (!value) return '';
    const numString = value.toString().replace(/\D/g, '');
    return numString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    city: user.city || '',
    birth_date: user.birth_date || '',
    gender: user.gender || '',
    bio: user.about_me || user.bio || '', // Используем about_me из БД
    skills: Array.isArray(user.skills) ? user.skills : [],
    education: parseEducation(),
    work_experience: parseWorkExperience(), // Используем функцию парсинга
    desired_salary: formatNumberWithSpaces(user.desired_salary),
    willing_to_relocate: user.willing_to_relocate || false,
    specializations: Array.isArray(user.specializations) ? user.specializations : [],
  });

  const [newSkill, setNewSkill] = useState('');
  
  // Список всех специализаций (фильтруем только специализации, без родительских категорий)
  const allSpecializations = ALL_SPECIALIZATIONS.filter(spec => !spec.isParent);
  
  // Компонент для отображения иконки специализации
  const SpecializationIcon = ({ spec, className = "w-5 h-5" }: { spec: SpecializationOption; className?: string }) => {
    if (spec.iconPath) {
      return (
        <Image 
          src={spec.iconPath} 
          alt={spec.name} 
          width={20} 
          height={20} 
          className={className}
        />
      );
    }
    return <span className={`text-xl ${className}`}>{spec.icon}</span>;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCityName = (cityId: string) => {
    const city = UZBEKISTAN_CITIES.find(c => c.id === cityId);
    return city ? city.name : cityId;
  };

  const addEducation = () => {
    const currentEducation = Array.isArray(formData.education) ? formData.education : [];
    setFormData({
      ...formData,
      education: [...currentEducation, { institution: '', degree: '', yearStart: '', yearEnd: '' }],
    });
  };

  const removeEducation = (index: number) => {
    const currentEducation = Array.isArray(formData.education) ? formData.education : [];
    setFormData({
      ...formData,
      education: currentEducation.filter((_, i) => i !== index),
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const currentEducation = Array.isArray(formData.education) ? formData.education : [];
    const newEducation = [...currentEducation];
    if (newEducation[index]) {
      newEducation[index] = { ...newEducation[index], [field]: value };
      setFormData({ ...formData, education: newEducation });
    }
  };

  const addWorkExperience = () => {
    const currentExperience = Array.isArray(formData.work_experience) ? formData.work_experience : [];
    setFormData({
      ...formData,
      work_experience: [...currentExperience, { company: '', position: '', yearStart: '', yearEnd: '', description: '' }],
    });
  };

  const removeWorkExperience = (index: number) => {
    const currentExperience = Array.isArray(formData.work_experience) ? formData.work_experience : [];
    setFormData({
      ...formData,
      work_experience: currentExperience.filter((_, i) => i !== index),
    });
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const currentExperience = Array.isArray(formData.work_experience) ? formData.work_experience : [];
    const newExperience = [...currentExperience];
    if (newExperience[index]) {
      newExperience[index] = { ...newExperience[index], [field]: value };
      setFormData({ ...formData, work_experience: newExperience });
    }
  };

  const addSkill = () => {
    const skill = newSkill.trim();
    const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
    if (skill && !currentSkills.includes(skill)) {
      setFormData({
        ...formData,
        skills: [...currentSkills, skill],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
    setFormData({
      ...formData,
      skills: currentSkills.filter((_, i) => i !== index),
    });
  };

  const toggleSpecialization = (specId: string) => {
    const currentSpecializations = Array.isArray(formData.specializations) ? formData.specializations : [];
    const exists = currentSpecializations.find(s => s.id === specId);
    
    if (exists) {
      // Удаляем специализацию
      setFormData({
        ...formData,
        specializations: currentSpecializations.filter(s => s.id !== specId),
      });
    } else {
      // Добавляем специализацию
      const spec = allSpecializations.find(s => s.id === specId);
      if (spec) {
        const hasPrimary = currentSpecializations.some(s => s.isPrimary);
        const newSpec: Specialization = {
          id: spec.id,
          name: spec.name,
          isPrimary: currentSpecializations.length === 0 || !hasPrimary,
        };
        setFormData({
          ...formData,
          specializations: [...currentSpecializations, newSpec],
        });
      }
    }
  };

  const setPrimarySpecialization = (specId: string) => {
    const currentSpecializations = Array.isArray(formData.specializations) ? formData.specializations : [];
    setFormData({
      ...formData,
      specializations: currentSpecializations.map(s => ({
        ...s,
        isPrimary: s.id === specId,
      })),
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 handleAvatarChange вызван');
    const file = e.target.files?.[0];
    console.log('📄 Выбран файл:', file?.name, file?.size);
    if (!file) {
      console.log('❌ Файл не выбран');
      return;
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setError(t('errorImage'));
      return;
    }

    // Проверяем размер (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('errorFileSize'));
      return;
    }

    setUploadingAvatar(true);
    setError('');
    console.log('⏳ Начинаем загрузку аватара...');

    try {
      // Создаем превью
      console.log('🖼️ Создаем превью...');
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('✅ Превью создано');
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Загружаем файл
      console.log('📤 Отправляем файл на сервер...');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Получен ответ от сервера:', response.status);
      const data = await response.json();
      console.log('📦 Данные ответа:', data);

      if (data.success) {
        console.log('✅ Аватар загружен успешно');
        // Обновляем страницу для получения актуальных данных
        router.refresh();
      } else {
        console.error('❌ Ошибка от сервера:', data.error);
        setError(data.error || 'Не удалось загрузить аватар');
        setAvatarPreview(user.avatar_url || user.profile_image || null);
      }
    } catch (err) {
      console.error('❌ Критическая ошибка загрузки аватара:', err);
      setError('Ошибка при загрузке аватара');
      setAvatarPreview(user.avatar_url || user.profile_image || null);
    } finally {
      console.log('🏁 Завершение загрузки');
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
        birth_date: formData.birth_date || null,
        gender: formData.gender || null,
        about_me: formData.bio.trim() || null, // Отправляем как about_me в БД
      };

      // Добавляем поля для исполнителей (используем snake_case как в БД)
      if (user.role === 'worker') {
        updates.skills = Array.isArray(formData.skills) ? formData.skills : [];
        updates.education = Array.isArray(formData.education) ? formData.education : [];
        updates.work_experience = Array.isArray(formData.work_experience) ? formData.work_experience : [];
        updates.desired_salary = formData.desired_salary ? parseInt(formData.desired_salary.replace(/\s/g, '')) : null;
        updates.willing_to_relocate = formData.willing_to_relocate;
        updates.specializations = Array.isArray(formData.specializations) ? formData.specializations : [];
      }

      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        // Обновляем страницу для получения актуальных данных
        router.refresh();
        alert(t('successMessage'));
      } else {
        setError(data.error || t('error'));
      }
    } catch (err) {
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
            <CardTitle>{t('photoCard')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4 relative">
                <AvatarImage 
                  src={avatarPreview || undefined} 
                  alt={user.first_name || ''} 
                  className="object-cover"
                />
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
                onClick={() => {
                  console.log('🖱️ Клик на кнопку "Изменить фото"');
                  console.log('📎 fileInputRef.current:', fileInputRef.current);
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                    console.log('✅ Диалог выбора файла должен открыться');
                  } else {
                    console.error('❌ fileInputRef.current is null!');
                  }
                }}
                disabled={uploadingAvatar}
              >
                {uploadingAvatar ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('uploading')}
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    {t('changePhoto')}
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">{t('phone')}</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('role')}</p>
                <p className="font-medium">
                  {user.role === 'customer' ? t('customer') : t('worker')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('rating')}</p>
                <p className="font-medium flex items-center gap-1">
                  <Image src={starIconSvg} alt="star" width={20} height={20} className="w-5 h-5" />
                  {user.rating?.toFixed(1) || '0.0'} ({user.reviews_count || 0} {t('reviewsCount')})
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
            <CardTitle>{t('personalData')}</CardTitle>
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
                  <Label htmlFor="last_name">{t('lastName')} <span className="text-red-500">{t('required')}</span></Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder={t('lastName')}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="first_name">{t('firstName')} <span className="text-red-500">{t('required')}</span></Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder={t('firstName')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
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
                <Label>{t('birthDate')}</Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.birth_date ? formatDate(formData.birth_date) : t('selectDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.birth_date ? new Date(formData.birth_date) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setFormData({ ...formData, birth_date: format(date, 'yyyy-MM-dd') });
                          setDatePickerOpen(false);
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1950-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>{t('city')}</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => setShowCityModal(true)}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {formData.city ? getCityName(formData.city) : t('selectCity')}
                </Button>
              </div>

              <div className="space-y-2">
                <Label>{t('gender')}</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.gender === 'male' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                  >
                    {t('male')}
                  </Button>
                  <Button
                    type="button"
                    variant={formData.gender === 'female' ? 'default' : 'outline'}
                    className="w-full"
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                  >
                    {t('female')}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t('bio')}</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder={t('bioPlaceholder')}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.bio.length} / 500
                </p>
              </div>

              {user.role === 'worker' && (
                <>
                  {/* Пожелания к работе */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Пожелания к работе
                    </h3>
                    
                    <div className="space-y-4">
                  <div className="space-y-2">
                        <Label htmlFor="desired_salary">Желаемая зарплата (сум)</Label>
                        <Input
                          id="desired_salary"
                          name="desired_salary"
                          value={formData.desired_salary}
                          onChange={(e) => {
                            setFormData({ ...formData, desired_salary: formatNumberWithSpaces(e.target.value) });
                          }}
                          placeholder="5 000 000"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="willing_to_relocate"
                          checked={formData.willing_to_relocate}
                          onChange={(e) => setFormData({ ...formData, willing_to_relocate: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="willing_to_relocate" className="font-normal cursor-pointer">
                          Готов к переездам
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Образование */}
                  <div className="border-t pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Образование ({Array.isArray(formData.education) ? formData.education.length : 0})
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addEducation}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Добавить
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {Array.isArray(formData.education) && formData.education.map((edu, index) => (
                        <Card key={index} className="p-4 bg-gray-50">
                          <div className="space-y-3">
                            <Input
                              placeholder="Название учебного заведения"
                              value={edu.institution}
                              onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                            />
                            <Input
                              placeholder="Степень/специальность"
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Год начала"
                                value={edu.yearStart}
                                onChange={(e) => updateEducation(index, 'yearStart', e.target.value)}
                                maxLength={4}
                              />
                    <Input
                                placeholder="Год окончания"
                                value={edu.yearEnd}
                                onChange={(e) => updateEducation(index, 'yearEnd', e.target.value)}
                                maxLength={4}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeEducation(index)}
                              className="w-full"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Удалить
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Опыт работы */}
                  <div className="border-t pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Опыт работы ({Array.isArray(formData.work_experience) ? formData.work_experience.length : 0})
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addWorkExperience}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Добавить
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {Array.isArray(formData.work_experience) && formData.work_experience.map((exp, index) => (
                        <Card key={index} className="p-4 bg-gray-50">
                          <div className="space-y-3">
                            <Input
                              placeholder="Название компании"
                              value={exp.company}
                              onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                            />
                            <Input
                              placeholder="Должность"
                              value={exp.position}
                              onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Год начала"
                                value={exp.yearStart}
                                onChange={(e) => updateWorkExperience(index, 'yearStart', e.target.value)}
                                maxLength={4}
                              />
                              <Input
                                placeholder="Год окончания"
                                value={exp.yearEnd}
                                onChange={(e) => updateWorkExperience(index, 'yearEnd', e.target.value)}
                                maxLength={4}
                              />
                            </div>
                    <Textarea
                              placeholder="Описание обязанностей (опционально)"
                              value={exp.description || ''}
                              onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                      rows={3}
                    />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeWorkExperience(index)}
                              className="w-full"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Удалить
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Навыки */}
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Навыки ({Array.isArray(formData.skills) ? formData.skills.length : 0})
                    </h3>

                    <div className="space-y-4">
                      {/* Список навыков */}
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(formData.skills) && formData.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-[#679B00]"
                            style={{ 
                              backgroundColor: 'rgba(103, 155, 0, 0.1)',
                              color: '#679B00'
                            }}
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Добавление нового навыка */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Введите навык"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={addSkill}
                          disabled={!newSkill.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Добавьте навыки, которыми владеете
                      </p>
                    </div>
                  </div>

                  {/* Специализации */}
                  <div className="border-t pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Специализации ({Array.isArray(formData.specializations) ? formData.specializations.length : 0})
                      </h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSpecializationModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Добавить
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground flex items-center flex-wrap gap-1">
                        Выберите интересующие вас специализации. Нажмите на специализацию, чтобы сделать её основной (отмечена 
                        <Image src={starIconSvg} alt="star" width={16} height={16} className="w-4 h-4 inline-block" />)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(formData.specializations) && formData.specializations.map((spec) => {
                          const specData = getSpecializationById(spec.id);
                          return (
                            <div
                              key={spec.id}
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border ${
                                spec.isPrimary
                                  ? 'text-white border-[#679B00]'
                                  : 'bg-white text-gray-700 border-gray-300'
                              }`}
                              style={spec.isPrimary ? { backgroundColor: '#679B00' } : undefined}
                            >
                              <button
                                type="button"
                                onClick={() => setPrimarySpecialization(spec.id)}
                                className="flex items-center gap-1.5 hover:opacity-80"
                              >
                                {spec.isPrimary && (
                                  <Image src={starIconSvg} alt="primary" width={16} height={16} className="w-4 h-4" />
                                )}
                                {specData && <SpecializationIcon spec={specData} className="w-4 h-4" />}
                                <span>{spec.name}</span>
                              </button>
                            <button
                              type="button"
                              onClick={() => toggleSpecialization(spec.id)}
                              className="hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                        })}
                      </div>
                    </div>
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
                      {t('saving')}
                    </>
                  ) : (
                    t('saveChanges')
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  {t('cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Модальное окно выбора города */}
      <Dialog open={showCityModal} onOpenChange={setShowCityModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('cityModalTitle')}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            <div className="space-y-1">
              {UZBEKISTAN_CITIES.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  className={`w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    formData.city === city.id ? 'bg-green-50 text-green-700 font-medium' : ''
                  }`}
                  onClick={() => {
                    setFormData({ ...formData, city: city.id });
                    setShowCityModal(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span>{city.name}</span>
                    {formData.city === city.id && (
                      <span className="text-green-600">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модальное окно выбора специализаций */}
      <Dialog open={showSpecializationModal} onOpenChange={setShowSpecializationModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('specializationsModalTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('specializationsModalDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto px-1">
              {allSpecializations.map((spec) => {
                const currentSpecializations = Array.isArray(formData.specializations) ? formData.specializations : [];
                const isSelected = currentSpecializations.some(s => s.id === spec.id);
                return (
                  <button
                    key={spec.id}
                    type="button"
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left hover:shadow-sm ${
                      isSelected
                        ? 'border-[#679B00] hover:opacity-90'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    style={isSelected ? { backgroundColor: 'rgba(103, 155, 0, 0.1)' } : undefined}
                    onClick={() => toggleSpecialization(spec.id)}
                  >
                    <div className="flex-shrink-0">
                      <SpecializationIcon spec={spec} />
                    </div>
                    <span className="flex-1 font-medium text-sm">{spec.name}</span>
                    {isSelected && (
                      <span className="font-bold text-lg flex-shrink-0" style={{ color: '#679B00' }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSpecializationModal(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                type="button"
                onClick={() => setShowSpecializationModal(false)}
              >
                {t('done')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

