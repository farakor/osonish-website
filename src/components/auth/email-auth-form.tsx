'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface EmailAuthFormProps {
  redirectTo?: string;
  mode?: 'login' | 'register';
}

const translations = {
  title: 'Вход через Email',
  registerTitle: 'Регистрация через Email',
  enterEmail: 'Введите email для входа',
  enterEmailRegister: 'Введите email для регистрации',
  enterOtp: 'Введите код подтверждения',
  emailLabel: 'Email',
  otpLabel: 'Код подтверждения',
  otpSentTo: 'Код отправлен на',
  sendOtp: 'Войти',
  sendOtpRegister: 'Отправить код',
  sending: 'Отправка...',
  verify: 'Подтвердить',
  verifying: 'Проверка...',
  resendOtp: 'Отправить код повторно',
  changeEmail: 'Изменить email',
  register: 'Зарегистрироваться',
  login: 'У меня уже есть аккаунт',
  errors: {
    sendOtpFailed: 'Не удалось отправить код',
    verifyOtpFailed: 'Неверный код подтверждения',
    networkError: 'Ошибка сети. Попробуйте позже',
    invalidEmail: 'Введите корректный email'
  }
};

export function EmailAuthForm({ redirectTo, mode = 'login' }: EmailAuthFormProps) {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Refs для OTP input полей
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Автофокус на первое поле OTP при переходе на шаг ввода кода
  useEffect(() => {
    if (step === 'otp' && otpInputs.current[0]) {
      setTimeout(() => {
        otpInputs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Обработка ввода OTP в отдельные клетки
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    
    const otpArray = otp.split('');
    otpArray[index] = digit;
    const newOtp = otpArray.join('');
    setOtp(newOtp);
    
    if (digit && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const otpArray = otp.split('');
      
      if (otpArray[index]) {
        otpArray[index] = '';
        setOtp(otpArray.join(''));
      } else if (index > 0) {
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
    
    const nextIndex = Math.min(pastedData.length, 5);
    otpInputs.current[nextIndex]?.focus();
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError(translations.errors.invalidEmail);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          isLogin: authMode === 'login' // Передаем информацию о режиме
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('otp');
      } else {
        setError(data.error || translations.errors.sendOtpFailed);
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(translations.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Начинаем верификацию Email OTP:', { email, otp });

    try {
      const response = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
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
            email: data.email,
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
      const response = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          isLogin: authMode === 'login' // Передаем информацию о режиме
        }),
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
            {authMode === 'register' ? translations.registerTitle : translations.title}
          </CardTitle>
        </CardHeader>

        {step === 'email' ? (
          <form onSubmit={handleSendOTP}>
            <CardContent className="space-y-6 px-8 pb-6">
              {/* Поле ввода email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">{translations.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  autoFocus
                  className="h-12 text-base"
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-3 px-8 pb-8">
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-base" 
                disabled={loading || !email}
              >
                {loading ? translations.sending : (authMode === 'register' ? translations.sendOtpRegister : translations.sendOtp)}
              </Button>
              
              <Button 
                type="button"
                variant="ghost"
                className="w-full h-12 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-lg text-base"
                onClick={async () => {
                  if (authMode === 'login') {
                    // Переключаемся на регистрацию и сразу отправляем OTP
                    if (!validateEmail(email)) {
                      setError(translations.errors.invalidEmail);
                      return;
                    }
                    setAuthMode('register');
                    setError('');
                    setLoading(true);
                    try {
                      const response = await fetch('/api/auth/send-email-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          email,
                          isLogin: false // Режим регистрации
                        }),
                      });

                      const data = await response.json();

                      if (data.success) {
                        setStep('otp');
                      } else {
                        setError(data.error || translations.errors.sendOtpFailed);
                      }
                    } catch (err) {
                      console.error('Send OTP error:', err);
                      setError(translations.errors.networkError);
                    } finally {
                      setLoading(false);
                    }
                  } else {
                    // Переключаемся обратно на вход
                    setAuthMode('login');
                    setError('');
                  }
                }}
                disabled={loading || (authMode === 'login' && !email)}
              >
                {authMode === 'register' ? translations.login : translations.register}
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
                      ref={(el) => (otpInputs.current[index] = el)}
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
                  {translations.otpSentTo} {email}
                </p>
              </div>
              {error && (
                <div className="text-sm text-red-500 text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
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
                  setStep('email');
                  setOtp('');
                  setError('');
                }}
              >
                {translations.changeEmail}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}

