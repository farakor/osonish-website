import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Используем dev версию только если явно не указан FORCE_PRODUCTION_SMS
const isDev = process.env.NODE_ENV === 'development' && process.env.FORCE_PRODUCTION_SMS !== 'true';
const smsService = isDev 
  ? require('@/lib/services/smsService.dev')
  : require('@/lib/services/smsService');

export async function POST(request: NextRequest) {
  try {
    const { phone, skipUserCheck } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь с таким телефоном
    const supabase = await createClient();
    // Убираем все нецифровые символы включая + для поиска
    const formattedPhone = phone.replace(/\D/g, '');
    
    // Ищем пользователя как с +, так и без +
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`phone.eq.${formattedPhone},phone.eq.+${formattedPhone}`)
      .single();

    const isNewUser = !existingUser;

    // Если это не регистрация и пользователь не найден, возвращаем ошибку
    if (!skipUserCheck && isNewUser) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден. Пожалуйста, зарегистрируйтесь.', isNewUser: true },
        { status: 404 }
      );
    }

    const result = await smsService.sendOTP(phone);

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        isNewUser 
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Send OTP API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


