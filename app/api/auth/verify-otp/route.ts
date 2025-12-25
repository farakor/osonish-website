import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

// Используем dev версию только если явно не указан FORCE_PRODUCTION_SMS
const isDev = process.env.NODE_ENV === 'development' && process.env.FORCE_PRODUCTION_SMS !== 'true';
const smsService = isDev 
  ? require('@/lib/services/smsService.dev')
  : require('@/lib/services/smsService');

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();
    console.log('🔐 [verify-otp] Получен запрос:', { phone, code });

    if (!phone || !code) {
      console.log('❌ [verify-otp] Отсутствует телефон или код');
      return NextResponse.json(
        { success: false, error: 'Phone and code are required' },
        { status: 400 }
      );
    }

    console.log('🔍 [verify-otp] Вызываем smsService.verifyOTP...');
    const result = await smsService.verifyOTP(phone, code);
    console.log('📊 [verify-otp] Результат verifyOTP:', result);

    if (result.success) {
      // Проверяем, существует ли пользователь
      const supabase = await createClient();
      
      // Форматируем номер: убираем все нецифровые символы, кроме начального +
      const cleanPhone = phone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('998') ? `+${cleanPhone}` : cleanPhone;
      
      console.log('📞 [verify-otp] Форматирование номера:', { 
        original: phone, 
        cleanPhone, 
        formattedPhone 
      });
      
      // Ищем пользователя в разных форматах (используем limit(1) вместо single())
      const { data: users, error: searchError } = await supabase
        .from('users')
        .select('id, phone')
        .or(`phone.eq.${formattedPhone},phone.eq.${cleanPhone},phone.eq.+${cleanPhone}`)
        .limit(1);
      
      const existingUser = users && users.length > 0 ? users[0] : null;
      
      console.log('🔍 [verify-otp] Результат поиска пользователя:', { 
        existingUser, 
        searchError,
        usersFound: users?.length || 0,
        searchQuery: `phone.eq.${formattedPhone},phone.eq.${cleanPhone},phone.eq.+${cleanPhone}`
      });

      if (existingUser) {
        // Существующий пользователь - создаем сессию через cookies
        console.log('✅ [verify-otp] Существующий пользователь найден:', existingUser.id);
        
        // Создаем простую сессию (сохраняем user_id в cookie)
        const cookieStore = await cookies();
        cookieStore.set('user_id', existingUser.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 дней
          path: '/',
        });

        console.log('✅ [verify-otp] Авторизация завершена успешно');
        return NextResponse.json({ 
          success: true,
          isNewUser: false,
          userId: existingUser.id,
        });
      } else {
        // Новый пользователь - требуется регистрация
        console.log('🆕 [verify-otp] Новый пользователь, требуется регистрация. Возвращаем phone:', formattedPhone);
        
        // Удаляем использованный OTP (пробуем удалить в разных форматах)
        await supabase.from('otp_codes').delete().or(`phone.eq.${formattedPhone},phone.eq.${cleanPhone}`);
        
        return NextResponse.json({ 
          success: true,
          isNewUser: true,
          phone: formattedPhone, // Возвращаем номер с +
      });
      }
    } else {
      console.log('❌ [verify-otp] Верификация не удалась:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ [verify-otp] Критическая ошибка:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

