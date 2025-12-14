'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Upload, Check, Search, X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { WORKER_TYPES, SPECIALIZATIONS, UZBEKISTAN_CITIES, WorkerType, Education, WorkExperience, POPULAR_SKILLS, PARENT_CATEGORIES, getSubcategoriesByParentId, getSpecializationById } from '@/constants/registration';
import { SpecializationIcon } from '@/components/ui/specialization-icon';
import { Checkbox } from '@/components/ui/checkbox';

interface StepByStepRegistrationFormProps {
  phone?: string;
  email?: string;
  redirectTo?: string;
}

export function StepByStepRegistrationForm({ phone, email, redirectTo }: StepByStepRegistrationFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['repair_construction']));
  
  const [formData, setFormData] = useState({
    profileImage: null as string | null,
    firstName: '',
    lastName: '',
    birthDate: '',
    privacyAccepted: false,
    role: 'customer' as 'customer' | 'worker',
    workerType: null as WorkerType | null,
    specializations: [] as string[],
    cityId: '',
    // Customer specific fields
    userType: null as 'individual' | 'company' | null,
    companyName: '',
    // Job Seeker specific fields
    education: [] as Education[],
    skills: [] as string[],
    workExperience: [] as WorkExperience[],
    willingToRelocate: false,
    desiredSalary: '',
    // Professional specific fields
    aboutMe: '',
    workPhotos: [] as string[],
  });

  // Временные состояния для добавления образования
  const [newEducation, setNewEducation] = useState<Education>({
    institution: '',
    degree: '',
    yearStart: '',
    yearEnd: '',
  });

  // Временные состояния для добавления опыта работы
  const [newWorkExp, setNewWorkExp] = useState<WorkExperience>({
    company: '',
    position: '',
    yearStart: '',
    yearEnd: '',
  });

  // Временное состояние для добавления своего навыка
  const [customSkill, setCustomSkill] = useState('');

  // Очищаем ошибку при смене шага
  useEffect(() => {
    setError('');
  }, [currentStep]);

  // Вычисляем общее количество шагов (всегда актуальное значение)
  const getTotalSteps = () => {
    // Базовые шаги: фото, имя, дата, согласие, роль = 5
    let total = 5;
    
    // Для заказчика: + тип пользователя (физ/юр), + город = 7 шагов
    if (formData.role === 'customer') {
      total += 1; // тип пользователя (физ/юр лицо)
      total += 1; // город
    }
    // Для исполнителя:
    else if (formData.role === 'worker') {
      total += 1; // тип исполнителя
      
      // Для профессионала: + специализации, "о себе", фото работ, город
      if (formData.workerType === 'professional') {
        total += 3; // специализации, о себе, фото работ
      }
      
      // Для соискателя: + образование, навыки, опыт работы, доп.инфо, специализации
      if (formData.workerType === 'job_seeker') {
        total += 5; // образование, навыки, опыт, доп.инфо, специализации
      }
      
      total += 1; // город (всегда в конце)
    }
    
    return total;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла не должен превышать 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Валидация даты рождения
  const validateBirthDate = (dateString: string): { isValid: boolean; error?: string } => {
    if (!dateString || dateString.length !== 10) {
      return { isValid: false, error: 'Введите дату в формате дд.мм.гггг' };
    }

    const [day, month, year] = dateString.split('.').map(Number);

    if (!day || !month || !year) {
      return { isValid: false, error: 'Неверный формат даты' };
    }

    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
      return { isValid: false, error: 'Неверный формат даты' };
    }

    const date = new Date(year, month - 1, day);

    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return { isValid: false, error: 'Такой даты не существует' };
    }

    const today = new Date();
    const age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - (month - 1);
    const dayDiff = today.getDate() - day;

    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (actualAge < 18) {
      return { isValid: false, error: 'Вам должно быть не менее 18 лет' };
    }

    return { isValid: true };
  };

  // Форматирование даты при вводе
  const formatDateInput = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4, 8)}`;
    }
  };

  // Форматирование зарплаты
  const formatSalary = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleNext = () => {
    setError('');
    if (!validateStep(currentStep)) {
      return;
    }
    
    console.log('Next step:', currentStep + 1, 'Total steps:', getTotalSteps(), 'Current:', currentStep);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((prev) => prev - 1);
  };

  const validateStep = (step: number): boolean => {
    const totalSteps = getTotalSteps();
    
    // Шаг 1: Фото профиля (необязательно)
    if (step === 1) {
      return true;
    }
    
    // Шаг 2: Имя и фамилия
    if (step === 2) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('Пожалуйста, введите ваше имя и фамилию.');
        return false;
      }
      return true;
    }
    
    // Шаг 3: Дата рождения
    if (step === 3) {
      const birthDateValidation = validateBirthDate(formData.birthDate);
      if (!birthDateValidation.isValid) {
        setError(birthDateValidation.error || 'Неверная дата рождения.');
        return false;
      }
      return true;
    }
    
    // Шаг 4: Согласие с политикой
    if (step === 4) {
      if (!formData.privacyAccepted) {
        setError('Вы должны согласиться с политикой конфиденциальности.');
        return false;
      }
      return true;
    }
    
    // Шаг 5: Выбор роли
    if (step === 5) {
      if (!formData.role) {
        setError('Пожалуйста, выберите вашу роль.');
        return false;
      }
      return true;
    }
    
    // Дальнейшие шаги зависят от роли
    if (formData.role === 'customer') {
      // Шаг 6: Тип пользователя (физ/юр лицо)
      if (step === 6) {
        if (!formData.userType) {
          setError('Пожалуйста, выберите тип пользователя.');
          return false;
        }
        // Если юр. лицо - проверяем название компании
        if (formData.userType === 'company' && !formData.companyName.trim()) {
          setError('Пожалуйста, введите название компании.');
          return false;
        }
        return true;
      }
      // Шаг 7: Выбор города (для заказчика это последний шаг)
      if (step === 7) {
        if (!formData.cityId) {
          setError('Пожалуйста, выберите город.');
          return false;
        }
        return true;
      }
    } else if (formData.role === 'worker') {
      // Шаг 6: Тип исполнителя
      if (step === 6) {
        if (!formData.workerType) {
          setError('Пожалуйста, выберите тип исполнителя.');
          return false;
        }
        return true;
      }
      
      // Для профессионала
      if (formData.workerType === 'professional') {
        // Шаг 7: Специализации (для профессионала)
        if (step === 7) {
          if (formData.specializations.length === 0) {
            setError('Пожалуйста, выберите хотя бы одну специализацию.');
            return false;
          }
          return true;
        }
        // Шаг 8: О себе (для профессионала)
        if (step === 8) {
          if (formData.aboutMe.trim().length < 20) {
            setError('Пожалуйста, напишите о себе минимум 20 символов.');
            return false;
          }
          return true;
        }
        // Шаг 9: Фото работ (для профессионала)
        if (step === 9) {
          if (formData.workPhotos.length < 1) {
            setError('Пожалуйста, добавьте минимум 1 фото ваших работ.');
            return false;
          }
          return true;
        }
        // Шаг 10: Город (для профессионала это последний шаг)
        if (step === 10) {
          if (!formData.cityId) {
            setError('Пожалуйста, выберите город.');
            return false;
          }
          return true;
        }
      }
      
      // Для соискателя
      if (formData.workerType === 'job_seeker') {
        // Шаг 7: Образование (необязательно, можно пропустить)
        if (step === 7) {
          // Автоматически добавляем заполненное образование перед переходом
          if (newEducation.institution.trim()) {
            handleAddEducation();
          }
          return true;
        }
        
        // Шаг 8: Навыки (необязательно, можно пропустить)
        if (step === 8) {
          return true;
        }
        
        // Шаг 9: Опыт работы (необязательно, можно пропустить)
        if (step === 9) {
          // Автоматически добавляем заполненный опыт перед переходом
          if (newWorkExp.company.trim() && newWorkExp.position.trim()) {
            handleAddWorkExperience();
          }
          return true;
        }
        
        // Шаг 10: Дополнительная информация (необязательно, можно пропустить)
        if (step === 10) {
          return true;
        }
        
        // Шаг 11: Специализации (обязательно для соискателя)
        if (step === 11) {
          if (formData.specializations.length === 0) {
            setError('Пожалуйста, выберите хотя бы одну специализацию.');
            return false;
          }
          return true;
        }
        
        // Шаг 12: Город (для соискателя это последний шаг)
        if (step === 12) {
          if (!formData.cityId) {
            setError('Пожалуйста, выберите город.');
            return false;
          }
          return true;
        }
      }
      
      // Для работника на день и соискателя (без специализаций)
      if (formData.workerType === 'daily_worker') {
        // Шаг 7: Город (для работника на день это последний шаг)
        if (step === 7) {
          if (!formData.cityId) {
            setError('Пожалуйста, выберите город.');
            return false;
          }
          return true;
        }
      }
    }
    
    return true;
  };

  // Handlers для job seeker
  const handleAddEducation = () => {
    if (!newEducation.institution.trim()) {
      setError('Введите название учебного заведения');
      return;
    }
    
    setFormData({
      ...formData,
      education: [...formData.education, { ...newEducation }],
    });
    
    setNewEducation({
      institution: '',
      degree: '',
      yearStart: '',
      yearEnd: '',
    });
    setError('');
  };

  const handleRemoveEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const handleAddWorkExperience = () => {
    if (!newWorkExp.company.trim()) {
      setError('Введите название компании');
      return;
    }
    if (!newWorkExp.position.trim()) {
      setError('Введите должность');
      return;
    }
    
    setFormData({
      ...formData,
      workExperience: [...formData.workExperience, { ...newWorkExp }],
    });
    
    setNewWorkExp({
      company: '',
      position: '',
      yearStart: '',
      yearEnd: '',
    });
    setError('');
  };

  const handleRemoveWorkExperience = (index: number) => {
    setFormData({
      ...formData,
      workExperience: formData.workExperience.filter((_, i) => i !== index),
    });
  };

  const toggleSkill = (skill: string) => {
    if (formData.skills.includes(skill)) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(s => s !== skill),
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
    }
  };

  const handleAddCustomSkill = () => {
    if (!customSkill.trim()) return;
    
    if (!formData.skills.includes(customSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, customSkill.trim()],
      });
    }
    setCustomSkill('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const totalSteps = getTotalSteps();
    if (!validateStep(totalSteps)) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        phone: phone || undefined,
        email: email || undefined,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        role: formData.role,
        profileImage: formData.profileImage,
        workerType: formData.role === 'worker' ? formData.workerType : null,
        // Преобразуем ID специализаций в полные объекты для совместимости с мобильным приложением
        specializations: formData.role === 'worker' && (formData.workerType === 'professional' || formData.workerType === 'job_seeker') 
          ? formData.specializations.map(id => {
              const spec = getSpecializationById(id);
              return spec ? { id: spec.id, name: spec.name, icon: spec.icon, iconName: spec.iconName } : null;
            }).filter(Boolean)
          : [],
        cityId: formData.cityId,
        // Customer specific data
        userType: formData.role === 'customer' ? formData.userType : undefined,
        companyName: formData.role === 'customer' && formData.userType === 'company' ? formData.companyName.trim() : undefined,
        // Job Seeker specific data
        education: formData.role === 'worker' && formData.workerType === 'job_seeker' ? formData.education : undefined,
        skills: formData.role === 'worker' && formData.workerType === 'job_seeker' ? formData.skills : undefined,
        workExperience: formData.role === 'worker' && formData.workerType === 'job_seeker' ? formData.workExperience : undefined,
        willingToRelocate: formData.role === 'worker' && formData.workerType === 'job_seeker' ? formData.willingToRelocate : undefined,
        desiredSalary: formData.role === 'worker' && formData.workerType === 'job_seeker' && formData.desiredSalary ? parseInt(formData.desiredSalary.replace(/\s/g, '')) : undefined,
        // Professional specific data
        aboutMe: formData.role === 'worker' && formData.workerType === 'professional' ? formData.aboutMe.trim() : undefined,
        workPhotos: formData.role === 'worker' && formData.workerType === 'professional' ? formData.workPhotos : undefined,
      };

      console.log('📤 Отправка данных регистрации:', payload);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Регистрация успешна, редирект на:', redirectTo || '/dashboard');
        // Используем window.location.href для полной перезагрузки страницы
        // чтобы Header получил обновленные данные пользователя
        window.location.href = redirectTo || '/dashboard';
      } else {
        setError(data.error || 'Ошибка регистрации.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Ошибка сети. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const totalSteps = getTotalSteps();
    
    // Определяем, на каком логическом шаге мы находимся
    let logicalStep = currentStep;
    
    // Для worker после выбора типа
    if (formData.role === 'worker' && currentStep > 6) {
      if (formData.workerType === 'professional') {
        // Шаг 7 - специализации, шаг 8 - город
        logicalStep = currentStep;
      } else if (formData.workerType === 'job_seeker') {
        // Шаг 7 - образование, 8 - навыки, 9 - опыт, 10 - доп.инфо, 11 - специализации, 12 - город
        logicalStep = currentStep;
      } else if (formData.workerType === 'daily_worker') {
        // Шаг 7 - город
        logicalStep = currentStep;
      }
    }
    
    switch (logicalStep) {
      case 1:
        return renderProfilePhotoStep();
      case 2:
        return renderNameStep();
      case 3:
        return renderBirthDateStep();
      case 4:
        return renderPrivacyStep();
      case 5:
        return renderRoleStep();
      case 6:
        if (formData.role === 'customer') {
          return renderUserTypeStep();
        } else {
          return renderWorkerTypeStep();
        }
      case 7:
        if (formData.role === 'customer') {
          return renderCityStep();
        } else if (formData.role === 'worker') {
          if (formData.workerType === 'professional') {
            return renderSpecializationsStep();
          } else if (formData.workerType === 'job_seeker') {
            return renderEducationStep();
          } else {
            return renderCityStep();
          }
        }
        break;
      case 8:
        if (formData.role === 'worker') {
          if (formData.workerType === 'professional') {
            return renderAboutMeStep();
          } else if (formData.workerType === 'job_seeker') {
            return renderSkillsStep();
          }
        }
        break;
      case 9:
        if (formData.role === 'worker') {
          if (formData.workerType === 'professional') {
            return renderWorkPhotosStep();
          } else if (formData.workerType === 'job_seeker') {
            return renderWorkExperienceStep();
          }
        }
        break;
      case 10:
        if (formData.role === 'worker') {
          if (formData.workerType === 'professional') {
            return renderCityStep();
          } else if (formData.workerType === 'job_seeker') {
            return renderAdditionalInfoStep();
          }
        }
        break;
      case 11:
        if (formData.role === 'worker' && formData.workerType === 'job_seeker') {
          return renderSpecializationsStep();
        }
        break;
      case 12:
        if (formData.role === 'worker' && formData.workerType === 'job_seeker') {
          return renderCityStep();
        }
        break;
    }
    
    return null;
  };

  const renderProfilePhotoStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Фото профиля</h2>
        <p className="text-gray-600">Добавьте свою фотографию (необязательно)</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {formData.profileImage ? (
            <Image
              src={formData.profileImage}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          {formData.profileImage ? 'Изменить фото' : 'Добавить фото'}
        </Button>
      </div>
    </div>
  );

  const renderNameStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Как вас зовут?</h2>
        <p className="text-gray-600">Введите ваше имя и фамилию</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="firstName">Имя *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Например: Алишер"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Фамилия *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Например: Усманов"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const renderBirthDateStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Дата рождения</h2>
        <p className="text-gray-600">Укажите вашу дату рождения</p>
      </div>

      <div>
        <Label htmlFor="birthDate">Дата рождения *</Label>
        <Input
          id="birthDate"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: formatDateInput(e.target.value) })}
          placeholder="дд.мм.гггг"
          maxLength={10}
          className="mt-1"
        />
        <p className="text-sm text-gray-500 mt-1">Вам должно быть не менее 18 лет</p>
      </div>
    </div>
  );

  const renderPrivacyStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Согласие</h2>
        <p className="text-gray-600">Ознакомьтесь с условиями</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
          <h3 className="font-semibold mb-2">Политика конфиденциальности</h3>
          <p className="text-sm text-gray-600">
            Мы собираем и обрабатываем ваши персональные данные в соответствии с законодательством.
            Ваши данные защищены и используются только для предоставления услуг платформы.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="privacy"
            checked={formData.privacyAccepted}
            onCheckedChange={(checked) => setFormData({ ...formData, privacyAccepted: checked as boolean })}
          />
          <label htmlFor="privacy" className="text-sm cursor-pointer">
            Я согласен с политикой конфиденциальности *
          </label>
        </div>
      </div>
    </div>
  );

  const renderRoleStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите роль</h2>
        <p className="text-gray-600">Кто вы на нашей платформе?</p>
      </div>

      <RadioGroup
        value={formData.role}
        onValueChange={(value) => setFormData({ ...formData, role: value as 'customer' | 'worker' })}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="customer" id="customer" />
          <label htmlFor="customer" className="flex-1 cursor-pointer">
            <div className="font-semibold">Заказчик</div>
            <div className="text-sm text-gray-600">Ищу исполнителей для работ</div>
          </label>
        </div>

        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="worker" id="worker" />
          <label htmlFor="worker" className="flex-1 cursor-pointer">
            <div className="font-semibold">Исполнитель</div>
            <div className="text-sm text-gray-600">Предлагаю свои услуги</div>
          </label>
        </div>
      </RadioGroup>
    </div>
  );

  const renderWorkerTypeStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Тип исполнителя</h2>
        <p className="text-gray-600">Выберите подходящий вариант</p>
      </div>

      <RadioGroup
        value={formData.workerType || ''}
        onValueChange={(value) => setFormData({ ...formData, workerType: value as WorkerType })}
        className="space-y-3"
      >
        {WORKER_TYPES.map((type) => (
          <div key={type.id} className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value={type.id} id={type.id} />
            <label htmlFor={type.id} className="flex-1 cursor-pointer">
              <div className="font-semibold">{type.name}</div>
              <div className="text-sm text-gray-600">{type.description}</div>
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const renderEducationStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Где вы учились?</h2>
        <p className="text-gray-600">Добавьте учебные заведения, которые вы закончили</p>
      </div>

      {/* Список добавленных учебных заведений */}
      {formData.education.length > 0 && (
        <div className="space-y-3">
          {formData.education.map((edu, index) => (
            <div key={index} className="bg-white border rounded-lg p-4 flex justify-between items-start">
              <div>
                <div className="font-semibold">{edu.institution}</div>
                {edu.degree && <div className="text-sm text-gray-600">{edu.degree}</div>}
                {(edu.yearStart || edu.yearEnd) && (
                  <div className="text-xs text-gray-500 mt-1">
                    {edu.yearStart || '?'} - {edu.yearEnd || 'н.в.'}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveEducation(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Форма добавления */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <Label htmlFor="institution">Учебное заведение *</Label>
          <Input
            id="institution"
            value={newEducation.institution}
            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
            placeholder="Например: НУУз, ТАТУ"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="degree">Специальность</Label>
          <Input
            id="degree"
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
            placeholder="Например: Программист"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="yearStart">Год начала</Label>
            <Input
              id="yearStart"
              value={newEducation.yearStart}
              onChange={(e) => setNewEducation({ ...newEducation, yearStart: e.target.value })}
              placeholder="2015"
              maxLength={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="yearEnd">Год окончания</Label>
            <Input
              id="yearEnd"
              value={newEducation.yearEnd}
              onChange={(e) => setNewEducation({ ...newEducation, yearEnd: e.target.value })}
              placeholder="2019"
              maxLength={4}
              className="mt-1"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddEducation}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>
    </div>
  );

  const renderSkillsStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Какими навыками владеете?</h2>
        <p className="text-gray-600">Выберите навыки из списка или добавьте свои</p>
      </div>

      {/* Выбранные навыки */}
      {formData.skills.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="font-semibold text-sm mb-2">Выбрано: {formData.skills.length}</div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 cursor-pointer"
                onClick={() => toggleSkill(skill)}
              >
                {skill}
                <X className="w-3 h-3" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Популярные навыки */}
      <div>
        <h3 className="font-semibold mb-3">Популярные навыки</h3>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SKILLS.map((skill) => {
            const isSelected = formData.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  isSelected
                    ? 'bg-blue-100 border-blue-600 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Добавить свой навык */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <Label htmlFor="customSkill">Добавить свой навык</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="customSkill"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Введите навык"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomSkill();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddCustomSkill}
            className="flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderWorkExperienceStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Опыт работы</h2>
        <p className="text-gray-600">Добавьте места работы</p>
      </div>

      {/* Список добавленного опыта */}
      {formData.workExperience.length > 0 && (
        <div className="space-y-3">
          {formData.workExperience.map((work, index) => (
            <div key={index} className="bg-white border rounded-lg p-4 flex justify-between items-start">
              <div>
                <div className="font-semibold">{work.position}</div>
                <div className="text-sm text-gray-600">{work.company}</div>
                {(work.yearStart || work.yearEnd) && (
                  <div className="text-xs text-gray-500 mt-1">
                    {work.yearStart || '?'} - {work.yearEnd || 'н.в.'}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveWorkExperience(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Форма добавления */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <Label htmlFor="position">Должность *</Label>
          <Input
            id="position"
            value={newWorkExp.position}
            onChange={(e) => setNewWorkExp({ ...newWorkExp, position: e.target.value })}
            placeholder="Например: Менеджер по продажам"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="company">Компания *</Label>
          <Input
            id="company"
            value={newWorkExp.company}
            onChange={(e) => setNewWorkExp({ ...newWorkExp, company: e.target.value })}
            placeholder="Например: ООО 'Рога и копыта'"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="workYearStart">Год начала</Label>
            <Input
              id="workYearStart"
              value={newWorkExp.yearStart}
              onChange={(e) => setNewWorkExp({ ...newWorkExp, yearStart: e.target.value })}
              placeholder="2018"
              maxLength={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="workYearEnd">Год окончания</Label>
            <Input
              id="workYearEnd"
              value={newWorkExp.yearEnd}
              onChange={(e) => setNewWorkExp({ ...newWorkExp, yearEnd: e.target.value })}
              placeholder="2023 или н.в."
              className="mt-1"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddWorkExperience}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>
    </div>
  );

  const renderAdditionalInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Дополнительная информация</h2>
        <p className="text-gray-600">Укажите желаемую зарплату и готовность к переезду</p>
      </div>

      <div>
        <Label htmlFor="desiredSalary">Желаемая зарплата</Label>
        <div className="relative mt-1">
          <Input
            id="desiredSalary"
            value={formData.desiredSalary}
            onChange={(e) => setFormData({ ...formData, desiredSalary: formatSalary(e.target.value) })}
            placeholder="Например: 5 000 000"
            className="pr-12"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            сум
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Можете оставить пустым, если не хотите указывать</p>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="relocate"
            checked={formData.willingToRelocate}
            onCheckedChange={(checked) => setFormData({ ...formData, willingToRelocate: checked as boolean })}
          />
          <div className="flex-1">
            <label htmlFor="relocate" className="font-semibold cursor-pointer">
              Готов к переездам
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Отметьте, если готовы рассматривать вакансии в других городах
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpecializationsStep = () => {
    const toggleCategory = (categoryId: string) => {
      const newExpanded = new Set(expandedCategories);
      if (newExpanded.has(categoryId)) {
        newExpanded.delete(categoryId);
      } else {
        newExpanded.add(categoryId);
      }
      setExpandedCategories(newExpanded);
    };

    const toggleSpecialization = (specId: string) => {
      if (formData.specializations.includes(specId)) {
        setFormData({
          ...formData,
          specializations: formData.specializations.filter(id => id !== specId),
        });
      } else {
        setFormData({
          ...formData,
          specializations: [...formData.specializations, specId],
        });
      }
    };

    // Для мастеров показываем только категорию "Ремонт и строительство"
    const categoriesToShow = formData.workerType === 'professional' 
      ? PARENT_CATEGORIES.filter(cat => cat.id === 'repair_construction')
      : PARENT_CATEGORIES;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Выберите специализации</h2>
          <p className="text-gray-600">
            {formData.workerType === 'job_seeker' 
              ? 'Выберите специализации, которые вам интересны. Первая будет основной.'
              : 'Выберите специализации, в которых вы работаете'
            }
          </p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm font-medium">
            Выбрано: {formData.specializations.length}
          </p>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {categoriesToShow.map((category) => {
            const subcategories = getSubcategoriesByParentId(category.id);
            const isExpanded = expandedCategories.has(category.id);
            
            return (
              <div key={category.id} className="border rounded-lg overflow-hidden">
                {/* Родительская категория */}
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {category.iconName ? (
                      <SpecializationIcon iconName={category.iconName} size={28} />
                    ) : (
                      <span className="text-2xl">{category.icon}</span>
                    )}
                    <span className="font-semibold text-left">{category.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Подкатегории */}
                {isExpanded && subcategories.length > 0 && (
                  <div className="bg-gray-50 p-2 space-y-2">
                    {subcategories.map((subcategory, index) => {
                      const isSelected = formData.specializations.includes(subcategory.id);
                      const isPrimary = formData.specializations[0] === subcategory.id;
                      const selectionOrder = formData.specializations.indexOf(subcategory.id) + 1;

                      return (
                        <button
                          key={subcategory.id}
                          type="button"
                          onClick={() => toggleSpecialization(subcategory.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                            isSelected
                              ? isPrimary
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-900 border-2 border-blue-600'
                              : 'bg-white border border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {subcategory.iconName ? (
                              <SpecializationIcon iconName={subcategory.iconName} size={24} />
                            ) : (
                              <span className="text-xl">{subcategory.icon}</span>
                            )}
                            <span className={`text-left ${isSelected ? 'font-semibold' : ''}`}>
                              {subcategory.name}
                            </span>
                          </div>
                          {isSelected && (
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                              isPrimary ? 'bg-yellow-400 text-blue-900' : 'bg-blue-600 text-white'
                            }`}>
                              <span className="text-sm font-bold">
                                {isPrimary ? '★' : selectionOrder}
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUserTypeStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Тип пользователя</h2>
        <p className="text-gray-600">Выберите тип вашего аккаунта</p>
      </div>

      <RadioGroup
        value={formData.userType || ''}
        onValueChange={(value) => setFormData({ ...formData, userType: value as 'individual' | 'company', companyName: value === 'individual' ? '' : formData.companyName })}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="individual" id="individual" />
          <label htmlFor="individual" className="flex-1 cursor-pointer">
            <div className="font-semibold">Физическое лицо</div>
            <div className="text-sm text-gray-600">Я частное лицо</div>
          </label>
        </div>

        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <RadioGroupItem value="company" id="company" />
          <label htmlFor="company" className="flex-1 cursor-pointer">
            <div className="font-semibold">Юридическое лицо</div>
            <div className="text-sm text-gray-600">Я представляю компанию</div>
          </label>
        </div>
      </RadioGroup>

      {formData.userType === 'company' && (
        <div className="mt-4">
          <Label htmlFor="companyName">Название компании *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="Например: ООО 'Рога и копыта'"
            className="mt-1"
          />
        </div>
      )}
    </div>
  );

  const renderAboutMeStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Расскажите о себе</h2>
        <p className="text-gray-600">Опишите свой опыт работы и навыки (минимум 20 символов)</p>
      </div>

      <div>
        <Label htmlFor="aboutMe">О себе *</Label>
        <textarea
          id="aboutMe"
          value={formData.aboutMe}
          onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
          placeholder="Например: Я профессиональный сантехник с опытом работы более 5 лет. Выполняю все виды сантехнических работ качественно и в срок. Имею все необходимые инструменты."
          className="mt-1 w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          maxLength={500}
        />
        <p className="text-sm text-gray-500 mt-1 text-right">
          {formData.aboutMe.length} / 500
        </p>
      </div>
    </div>
  );

  const renderWorkPhotosStep = () => {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const maxPhotos = 10;
      const remainingSlots = maxPhotos - formData.workPhotos.length;
      
      if (remainingSlots <= 0) {
        setError(`Максимум ${maxPhotos} фотографий`);
        return;
      }

      Array.from(files).slice(0, remainingSlots).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          setError('Размер файла не должен превышать 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            workPhotos: [...prev.workPhotos, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    };

    const handleRemovePhoto = (index: number) => {
      setFormData({
        ...formData,
        workPhotos: formData.workPhotos.filter((_, i) => i !== index)
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Фото ваших работ</h2>
          <p className="text-gray-600">
            Добавьте фотографии выполненных работ (минимум 1, максимум 10 фото)
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {formData.workPhotos.map((photo, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={photo}
                alt={`Работа ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {formData.workPhotos.length < 10 && (
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Добавить фото</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {formData.workPhotos.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              Загружено фото: {formData.workPhotos.length} / 10
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderCityStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Выберите город</h2>
        <p className="text-gray-600">В каком городе вы находитесь?</p>
      </div>

      <RadioGroup
        value={formData.cityId}
        onValueChange={(value) => {
          setFormData({ ...formData, cityId: value });
          setError(''); // Очищаем ошибку при выборе города
        }}
        className="space-y-2"
      >
        {UZBEKISTAN_CITIES.map((city) => (
          <div key={city.id} className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value={city.id} id={city.id} />
            <label htmlFor={city.id} className="flex-1 cursor-pointer">
              {city.name}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const totalSteps = getTotalSteps();
  const progress = (currentStep / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps;
  
  // Определяем, можно ли пропустить текущий шаг
  const canSkip = formData.role === 'worker' && formData.workerType === 'job_seeker' && currentStep >= 7 && currentStep <= 10;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-t-lg">
        <div
          className="bg-blue-600 h-2 rounded-t-lg transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <CardContent className="p-6">
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600">
            Шаг {currentStep} из {totalSteps}
          </p>
        </div>

        <form onSubmit={isLastStep ? handleSubmit : (e) => e.preventDefault()}>
          {renderStep()}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={loading}
                className="flex-1"
              >
                Назад
              </Button>
            )}

            {canSkip && !isLastStep && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleNext}
                disabled={loading}
              >
                Пропустить
              </Button>
            )}

            {!isLastStep ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 text-white"
              >
                Далее
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Завершение...
                  </>
                ) : (
                  'Завершить регистрацию'
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
