import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, пароль и имя обязательны' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Проверяем, существует ли пользователь с таким email в нашей таблице
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Создаем пользователя в Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          phone: phone || null,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    if (authError) {
      console.error('Supabase auth signup error:', authError);
      
      // Проверяем, не существует ли уже пользователь в Auth
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { success: false, error: 'Пользователь с таким email уже зарегистрирован' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Ошибка регистрации: ' + authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, error: 'Не удалось создать пользователя' },
        { status: 500 }
      );
    }

    // Создаем запись в таблице users
    const userId = randomUUID();
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        name: name,
        email: email,
        phone: phone || null,
        role: 'client', // По умолчанию роль клиента
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (userError) {
      console.error('User creation error:', userError);
      
      // Если не удалось создать пользователя в users, удаляем из Auth
      // (это нужно делать через admin API, но пока оставим так)
      
      return NextResponse.json(
        { success: false, error: 'Ошибка создания профиля пользователя' },
        { status: 500 }
      );
    }

    // Создаем сессию
    const sessionId = randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 дней

    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        id: sessionId,
        user_id: userId,
        expires_at: expiresAt.toISOString(),
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { success: false, error: 'Ошибка создания сессии' },
        { status: 500 }
      );
    }

    // Создаем ответ с cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: name,
        email: email,
        phone: phone || null,
        role: 'client',
      },
      message: 'Регистрация успешна! Проверьте email для подтверждения.',
    });

    // Устанавливаем cookie с session token
    response.cookies.set('session_token', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

