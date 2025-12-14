import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, isLogin } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email обязателен' },
        { status: 400 }
      );
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат email' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Если это вход (а не регистрация), проверяем существование пользователя
    if (isLogin) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (!existingUser) {
        return NextResponse.json(
          { success: false, error: 'Пользователь с таким email не найден' },
          { status: 404 }
        );
      }
    }

    // Отправляем OTP через Supabase Auth
    // Не указываем emailRedirectTo, чтобы отправлялся код, а не magic link
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: !isLogin, // Создаем пользователя только при регистрации
      },
    });

    if (otpError) {
      console.error('Send OTP error:', otpError);
      
      // Обрабатываем специфичные ошибки
      if (otpError.message?.includes('rate_limit') || otpError.status === 429) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Слишком много попыток отправки. Пожалуйста, подождите несколько минут и попробуйте снова' 
          },
          { status: 429 }
        );
      }
      
      if (otpError.message?.includes('Email not confirmed')) {
        return NextResponse.json(
          { success: false, error: 'Email не подтвержден. Проверьте вашу почту' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ошибка отправки кода: ' + (otpError.message || 'Неизвестная ошибка')
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Код подтверждения отправлен на ваш email',
      email: email,
    });
  } catch (error) {
    console.error('Send email OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

