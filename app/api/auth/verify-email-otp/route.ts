import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email и код обязательны' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Верифицируем OTP через Supabase Auth
    const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: 'email',
    });

    if (verifyError || !authData.user) {
      console.error('Verify OTP error:', verifyError);
      return NextResponse.json(
        { success: false, error: 'Неверный код подтверждения' },
        { status: 401 }
      );
    }

    // Проверяем, существует ли пользователь в нашей таблице users
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Существующий пользователь - создаем сессию и входим
      const sessionId = randomUUID();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 дней

      const { error: sessionError } = await supabase
        .from('user_sessions')
        .insert({
          id: sessionId,
          user_id: existingUser.id,
          expires_at: expiresAt.toISOString(),
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return NextResponse.json(
          { success: false, error: 'Ошибка создания сессии' },
          { status: 500 }
        );
      }

      const response = NextResponse.json({
        success: true,
        isNewUser: false,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
        },
      });

      response.cookies.set('session_token', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
      });

      return response;
    } else {
      // Новый пользователь - перенаправляем на регистрацию
      return NextResponse.json({
        success: true,
        isNewUser: true,
        email: email,
        authUserId: authData.user.id, // ID из Supabase Auth для дальнейшего использования
      });
    }
  } catch (error) {
    console.error('Verify email OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

