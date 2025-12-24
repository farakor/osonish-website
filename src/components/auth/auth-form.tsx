'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthFormProps {
  redirectTo?: string;
  mode?: 'login' | 'register'; // Режим: вход или регистрация
}

// Переводы для формы авторизации
const translations = {
  title: 'Вход',
  registerTitle: 'Регистрация',
  enterPhone: 'Введите номер телефона для входа',
  enterPhoneRegister: 'Введите номер телефона для регистрации',
  enterOtp: 'Введите код подтверждения',
  selectRole: 'Выберите вашу роль',
  phoneLabel: 'Номер телефона',
  otpLabel: 'Код подтверждения',
  roleLabel: 'Роль',
  otpSentTo: 'Код отправлен на номер',
  sendOtp: 'Войти',
  sendOtpRegister: 'Отправить код',
  sending: 'Отправка...',
  verify: 'Подтвердить',
  verifying: 'Проверка...',
  resendOtp: 'Отправить код повторно',
  changePhone: 'Изменить номер',
  register: 'Зарегистрироваться',
  login: 'У меня уже есть аккаунт',
  errors: {
    sendOtpFailed: 'Не удалось отправить код',
    verifyOtpFailed: 'Неверный код подтверждения',
    networkError: 'Ошибка сети. Попробуйте позже'
  }
};

export function AuthForm({ redirectTo, mode = 'login' }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Получаем параметры из URL
  const phoneFromUrl = searchParams.get('phone') || '';
  const stepFromUrl = searchParams.get('step') as 'phone' | 'otp' | null;
  
  const [step, setStep] = useState<'phone' | 'otp'>(stepFromUrl || 'phone');
  const [phone, setPhone] = useState(phoneFromUrl || '998');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Refs для OTP input полей
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Если номер телефона пришел из URL, инициализируем форму
  useEffect(() => {
    if (phoneFromUrl && stepFromUrl === 'otp') {
      setPhone(phoneFromUrl);
      setStep('otp');
    }
  }, [phoneFromUrl, stepFromUrl]);

  // Автофокус на первое поле OTP при переходе на шаг ввода кода
  useEffect(() => {
    if (step === 'otp' && otpInputs.current[0]) {
      // Небольшая задержка для корректной работы автофокуса
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Форматирование номера телефона для отображения
  const formatPhoneDisplay = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    
    let formatted = '+998 ';
    if (cleaned.length > 3) {
      formatted += cleaned.slice(3, 5);
    }
    if (cleaned.length > 5) {
      formatted += ' ' + cleaned.slice(5, 8);
    }
    if (cleaned.length > 8) {
      formatted += ' ' + cleaned.slice(8, 10);
    }
    if (cleaned.length > 10) {
      formatted += ' ' + cleaned.slice(10, 12);
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 12) {
      setPhone(value);
    }
  };

  // Обработка ввода OTP в отдельные клетки
  const handleOtpChange = (index: number, value: string) => {
    // Разрешаем только цифры
    const digit = value.replace(/\D/g, '').slice(-1);
    
    // Обновляем массив цифр
    const otpArray = otp.split('');
    otpArray[index] = digit;
    const newOtp = otpArray.join('');
    setOtp(newOtp);
    
    // Автоматически переходим к следующему полю
    if (digit && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const otpArray = otp.split('');
      
      if (otpArray[index]) {
        // Если в текущем поле есть цифра, удаляем её
        otpArray[index] = '';
        setOtp(otpArray.join(''));
      } else if (index > 0) {
        // Если текущее поле пустое, переходим на предыдущее и удаляем его
        otpArray[index - 1] = '';
        setOtp(otpArray.join(''));
        otpInputs.current[index - 1]?.focus();
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setOtp(pastedData);
    
    // Фокусируемся на следующем пустом поле или на последнем
    const nextIndex = Math.min(pastedData.length, 5);
    otpInputs.current[nextIndex]?.focus();
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone,
          skipUserCheck: mode === 'register' // Для регистрации пропускаем проверку
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('otp');
      } else {
        setError(data.error || translations.errors.sendOtpFailed);
      }
    } catch (err) {
      setError(translations.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Начинаем верификацию OTP:', { phone, otp });

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          code: otp,
        }),
      });

      console.log('📡 Ответ сервера:', response.status);
      const data = await response.json();
      console.log('📦 Данные:', data);

      if (data.success) {
        if (data.isNewUser) {
          // Новый пользователь - перенаправляем на форму регистрации
          console.log('🆕 Новый пользователь, перенаправляем на регистрацию');
          const params = new URLSearchParams({
            phone: data.phone,
          });
          if (redirectTo) {
            params.append('redirect', redirectTo);
          }
          window.location.href = `/auth/complete-registration?${params.toString()}`;
        } else {
          // Существующий пользователь - входим
        const targetUrl = redirectTo || '/dashboard';
          console.log('✅ Успешная авторизация существующего пользователя, редирект на:', targetUrl);
        window.location.href = targetUrl;
        }
      } else {
        console.error('❌ Ошибка авторизации:', data.error);
        setError(data.error || translations.errors.verifyOtpFailed);
      }
    } catch (err) {
      console.error('❌ Ошибка сети:', err);
      setError(translations.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || translations.errors.sendOtpFailed);
      }
    } catch (err) {
      setError(translations.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto">
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-semibold">
            {mode === 'register' ? translations.registerTitle : translations.title}
          </CardTitle>
        </CardHeader>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <CardContent className="space-y-6 px-8 pb-6">
              {/* Поле ввода номера телефона */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">{translations.phoneLabel}</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 XX XXX XX XX"
                  value={formatPhoneDisplay(phone)}
                  onChange={handlePhoneChange}
                  disabled={loading}
                  required
                  autoFocus
                  className="h-12 text-base"
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 text-center">{error}</div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-3 px-8 pb-8">
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-base" 
                disabled={loading || phone.length < 12}
              >
                {loading ? translations.sending : (mode === 'register' ? translations.sendOtpRegister : translations.sendOtp)}
              </Button>
              
              <Button 
                type="button"
                variant="ghost"
                className="w-full h-12 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-lg text-base"
                onClick={async () => {
                  // Если номер введен, сразу отправляем код и переключаемся на ввод OTP
                  if (phone && phone.length === 12) {
                    setError('');
                    setLoading(true);
                    
                    try {
                      const response = await fetch('/api/auth/send-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          phone,
                          skipUserCheck: mode === 'login' // Если на странице входа нажимаем "Зарегистрироваться", то skipUserCheck = true
                        }),
                      });

                      const data = await response.json();

                      if (data.success) {
                        setStep('otp');
                      } else {
                        setError(data.error || translations.errors.sendOtpFailed);
                      }
                    } catch (err) {
                      setError(translations.errors.networkError);
                    } finally {
                      setLoading(false);
                    }
                  } else {
                    // Если номер не введен, просто переходим на другую страницу
                    const targetPath = mode === 'register' ? '/auth/login' : '/auth/register';
                    router.push(targetPath);
                  }
                }}
                disabled={loading}
              >
                {mode === 'register' ? translations.login : translations.register}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <CardContent className="space-y-6 px-8 pb-6">
              <div className="space-y-4">
                <Label className="text-base text-center block">{translations.otpLabel}</Label>
                
                {/* 6 клеток для OTP */}
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[index] || ''}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      disabled={loading}
                      className="w-12 h-14 text-center text-2xl font-semibold bg-white border-2 border-gray-300 rounded-lg focus:border-2 focus:border-[#679B00] focus:outline-none transition-all"
                    />
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  {translations.otpSentTo} {formatPhoneDisplay(phone)}
                </p>
              </div>
              {error && (
                <div className="text-sm text-red-500 text-center">{error}</div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 px-8 pb-8">
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg" 
                disabled={loading || otp.length !== 6}
              >
                {loading ? translations.verifying : translations.verify}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                onClick={handleResendOTP}
                disabled={loading}
              >
                {translations.resendOtp}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
              >
                {translations.changePhone}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}

