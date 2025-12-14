'use client';

import { useState } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { EmailAuthForm } from '@/components/auth/email-auth-form';
import { Container } from '@/components/shared/container';
import { useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || undefined;
  
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('email');
  
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
      <Container>
        <div className="w-full max-w-[480px] mx-auto space-y-4">
          {/* Переключатель методов авторизации */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setAuthMethod('email')}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                authMethod === 'email'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Через Email
            </button>
            <button
              onClick={() => setAuthMethod('phone')}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                authMethod === 'phone'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Через Телефон
            </button>
          </div>

          {/* Форма регистрации */}
          {authMethod === 'email' ? (
            <EmailAuthForm mode="register" redirectTo={redirect} />
          ) : (
            <AuthForm mode="register" redirectTo={redirect} />
          )}
        </div>
      </Container>
    </div>
  );
}
