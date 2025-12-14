"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Container } from "../shared/container";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();
  const [phone, setPhone] = useState("+998 ");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    // Форматируем номер телефона
    const formattedPhone = phone.replace(/\D/g, '');
    
    if (formattedPhone.length < 12) {
      setError("Пожалуйста, введите корректный номер телефона");
      setIsSubmitting(false);
      return;
    }

    try {
      // Отправляем SMS код для регистрации
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone, skipUserCheck: true }),
      });

      const data = await response.json();

      if (data.success) {
        // Перенаправляем на страницу регистрации с номером телефона и шагом OTP
        router.push(`/auth/register?phone=${formattedPhone}&step=otp`);
      } else {
        setError(data.error || 'Не удалось отправить код. Попробуйте снова');
      }
    } catch (err) {
      setError('Ошибка сети. Проверьте подключение к интернету');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhone = (value: string) => {
    // Убираем все нецифровые символы
    const numbers = value.replace(/\D/g, '');
    
    // Если пользователь стирает все, возвращаем +998
    if (numbers.length === 0) return '+998 ';
    
    // Всегда начинаем с 998
    let formatted = '+998 ';
    
    // Если введено меньше 3 цифр или не начинается с 998, начинаем заново
    if (numbers.length < 3 || !numbers.startsWith('998')) {
      if (numbers.length > 0) {
        // Берем только введенные цифры после 998
        const userDigits = numbers.startsWith('998') ? numbers.substring(3) : numbers;
        formatted = '+998 ';
        
        // Форматируем: +998 XX XXX XX XX
        if (userDigits.length > 0) {
          formatted += userDigits.substring(0, 2); // XX
        }
        if (userDigits.length > 2) {
          formatted += ' ' + userDigits.substring(2, 5); // XXX
        }
        if (userDigits.length > 5) {
          formatted += ' ' + userDigits.substring(5, 7); // XX
        }
        if (userDigits.length > 7) {
          formatted += ' ' + userDigits.substring(7, 9); // XX
        }
      }
      return formatted;
    }
    
    // Форматируем номер: +998 XX XXX XX XX
    const userDigits = numbers.substring(3);
    if (userDigits.length > 0) {
      formatted += userDigits.substring(0, 2); // XX
    }
    if (userDigits.length > 2) {
      formatted += ' ' + userDigits.substring(2, 5); // XXX
    }
    if (userDigits.length > 5) {
      formatted += ' ' + userDigits.substring(5, 7); // XX
    }
    if (userDigits.length > 7) {
      formatted += ' ' + userDigits.substring(7, 9); // XX
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Не позволяем удалить +998
    if (!value.startsWith('+998')) {
      setPhone('+998 ');
      return;
    }
    
    setPhone(formatPhone(value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Предотвращаем удаление +998
    if ((e.key === 'Backspace' || e.key === 'Delete') && phone === '+998 ') {
      e.preventDefault();
    }
  };

  return (
    <section className="relative py-24 md:py-32 lg:py-36 overflow-hidden min-h-[500px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Osonish"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <Container className="relative z-10 pt-20">
        <div className="max-w-2xl">
          {/* Liquid Glass morphism container */}
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/10 rounded-3xl p-8 md:p-10 shadow-2xl border border-white/40 overflow-hidden">
            {/* Liquid glass animated gradients */}
            <div className="absolute inset-0 opacity-50 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-blue-500/10 animate-liquid-1" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-green-400/20 via-transparent to-primary/10 animate-liquid-2" />
            </div>
            
            {/* Glass shine effect */}
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/50 via-transparent to-transparent blur-3xl opacity-40 pointer-events-none rotate-12" />
            
            <div className="relative z-10">
              {/* Title */}
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-6 text-white leading-tight drop-shadow-lg">
                Напишите телефон, чтобы работодатели могли предложить вам работу
              </h1>

              {/* Phone Input Form */}
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-3 mb-2">
                  <Input
                    type="tel"
                    placeholder="+998 XX XXX XX XX"
                    value={phone}
                    onChange={handlePhoneChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="h-14 text-lg bg-white/90 backdrop-blur-md border-white/40 text-gray-900 placeholder:text-gray-500 shadow-lg"
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="px-8 h-14 text-base font-medium shadow-2xl whitespace-nowrap bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border border-white/30 text-white"
                    disabled={isSubmitting || phone.replace(/\D/g, '').length < 12}
                  >
                    {isSubmitting ? "Загрузка..." : "Продолжить"}
                  </Button>
                </div>
                {error && (
                  <div className="text-sm text-red-100 bg-red-500/30 backdrop-blur-md px-4 py-2 rounded-lg border border-red-400/40">
                    {error}
                  </div>
                )}
              </form>

              {/* Privacy Policy */}
              <p className="text-sm text-white font-medium drop-shadow-lg">
                Продолжая, вы принимаете{" "}
                <a href="/terms" className="underline hover:text-white/80 font-semibold">
                  соглашение
                </a>{" "}
                и{" "}
                <a href="/privacy" className="underline hover:text-white/80 font-semibold">
                  политику конфиденциальности
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes liquid-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          33% { 
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.8;
          }
          66% { 
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.4;
          }
        }
        @keyframes liquid-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.5;
          }
          33% { 
            transform: translate(-30px, 30px) scale(1.2) rotate(120deg);
            opacity: 0.7;
          }
          66% { 
            transform: translate(20px, -20px) scale(0.8) rotate(240deg);
            opacity: 0.3;
          }
        }
        .animate-liquid-1 {
          animation: liquid-1 15s ease-in-out infinite;
        }
        .animate-liquid-2 {
          animation: liquid-2 20s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  );
}
