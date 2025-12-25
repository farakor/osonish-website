'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

// Переводы для модального окна авторизации
const translations = {
  title: 'Вход',
  description: 'Войдите, чтобы откликнуться на заказ',
  enterPhone: 'Введите номер телефона для входа',
  enterOtp: 'Введите код подтверждения',
  phoneLabel: 'Номер телефона',
  otpLabel: 'Код подтверждения',
  otpSentTo: 'Код отправлен на номер',
  sendOtp: 'Войти',
  sending: 'Отправка...',
  verify: 'Подтвердить',
  verifying: 'Проверка...',
  resendOtp: 'Отправить код повторно',
  changePhone: 'Изменить номер',
  register: 'Зарегистрироваться',
  errors: {
    sendOtpFailed: 'Не удалось отправить код',
    verifyOtpFailed: 'Неверный код подтверждения',
    networkError: 'Ошибка сети. Попробуйте позже'
  }
};

export function AuthModal({ isOpen, onClose, redirectTo }: AuthModalProps) {
  const router = useRouter();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('998');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Refs для OTP input полей
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Сброс состояния при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setStep('phone');
      setPhone('998');
      setOtp('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  // Автофокус на первое поле OTP при переходе на шаг ввода кода
  useEffect(() => {
    if (isOpen && step === 'otp' && otpInputs.current[0]) {
      // Небольшая задержка для корректной работы автофокуса
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen, step]);

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
    while (otpArray.length < 6) otpArray.push('');
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
      while (otpArray.length < 6) otpArray.push('');
      
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
      // Форматируем номер с плюсом для отправки
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
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
      // Форматируем номер с плюсом для отправки
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: formattedPhone, 
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
          const targetUrl = redirectTo || window.location.pathname;
          console.log('✅ Успешная авторизация существующего пользователя, перезагружаем страницу');
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-2xl font-semibold text-center">{translations.title}</DialogTitle>
          <DialogDescription className="text-center">
            {translations.description}
          </DialogDescription>
        </DialogHeader>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <div className="space-y-6 px-8 pb-6">
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
            </div>
            
            <div className="flex flex-col space-y-3 px-8 pb-8">
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-base" 
                disabled={loading || phone.length < 12}
              >
                {loading ? translations.sending : translations.sendOtp}
              </Button>
              
              <Button 
                type="button"
                variant="ghost"
                className="w-full h-12 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-lg text-base"
                onClick={() => {
                  onClose();
                  router.push('/auth/register');
                }}
              >
                {translations.register}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="space-y-6 px-8 pb-6">
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
            </div>
            <div className="flex flex-col space-y-3 px-8 pb-8">
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
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

