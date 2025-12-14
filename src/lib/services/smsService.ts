import { createClient } from '@/lib/supabase/server';

/**
 * Eskiz SMS Service
 * Используется для отправки SMS через Eskiz API
 */

const ESKIZ_API_URL = process.env.NEXT_PUBLIC_ESKIZ_SMS_URL || 'https://notify.eskiz.uz/api';
const ESKIZ_EMAIL = process.env.ESKIZ_SMS_EMAIL;
const ESKIZ_PASSWORD = process.env.ESKIZ_SMS_PASSWORD;
const SMS_SENDER = process.env.SMS_SENDER_NAME || 'OsonIsh';

let authToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Получение токена авторизации Eskiz
 */
async function getAuthToken(): Promise<string> {
  // Если токен еще валиден, возвращаем его
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  try {
    const response = await fetch(`${ESKIZ_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ESKIZ_EMAIL,
        password: ESKIZ_PASSWORD,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Eskiz');
    }

    const data = await response.json();
    authToken = data.data.token;
    // Токен действителен 30 дней, но обновляем за день до истечения
    tokenExpiry = Date.now() + 29 * 24 * 60 * 60 * 1000;

    if (!authToken) {
      throw new Error('Auth token is null');
    }

    return authToken;
  } catch (error) {
    console.error('Eskiz auth error:', error);
    throw new Error('Failed to get Eskiz auth token');
  }
}

/**
 * Форматирование номера телефона для Eskiz
 * Ожидается формат: 998XXXXXXXXX
 */
function formatPhoneNumber(phone: string): string {
  // Убираем все нечисловые символы
  let cleaned = phone.replace(/\D/g, '');
  
  // Если начинается с +998, убираем +
  if (cleaned.startsWith('998')) {
    return cleaned;
  }
  
  // Если начинается с 998, возвращаем как есть
  if (cleaned.startsWith('998')) {
    return cleaned;
  }
  
  // Если начинается с 0, заменяем на 998
  if (cleaned.startsWith('0')) {
    return '998' + cleaned.substring(1);
  }
  
  // Иначе добавляем 998 в начало
  return '998' + cleaned;
}

/**
 * Генерация 6-значного OTP кода
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Отправка SMS через Eskiz
 */
export async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    const token = await getAuthToken();
    const formattedPhone = formatPhoneNumber(phone);

    const response = await fetch(`${ESKIZ_API_URL}/message/sms/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile_phone: formattedPhone,
        message: message,
        from: SMS_SENDER,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Eskiz SMS error:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

/**
 * Отправка OTP кода на телефон
 */
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const otp = generateOTP();
    const formattedPhone = formatPhoneNumber(phone);

    // Сохраняем OTP в базе данных
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут
    
    const { error: dbError } = await supabase
      .from('otp_codes')
      .upsert({
        phone: formattedPhone,
        code: otp,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'phone',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: 'Failed to save OTP' };
    }

    // Отправляем SMS
    const message = `${otp} - Код подтверждения авторизации в приложении Oson Ish`;
    const smsSent = await sendSMS(formattedPhone, message);

    if (!smsSent) {
      return { success: false, error: 'Failed to send SMS' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * Проверка OTP кода
 */
export async function verifyOTP(phone: string, code: string): Promise<{ 
  success: boolean; 
  error?: string;
  userId?: string;
}> {
  try {
    const supabase = await createClient();
    const formattedPhone = formatPhoneNumber(phone);

    // Получаем OTP из базы данных
    const { data: otpData, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('code', code)
      .single();

    if (otpError || !otpData) {
      return { success: false, error: 'Invalid OTP code' };
    }

    // Проверяем срок действия
    if (new Date(otpData.expires_at) < new Date()) {
      // Удаляем истекший код
      await supabase.from('otp_codes').delete().eq('phone', formattedPhone);
      return { success: false, error: 'OTP code expired' };
    }

    // Проверяем, существует ли пользователь
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', formattedPhone)
      .single();

    let userId: string;

    if (userError || !userData) {
      // Создаем нового пользователя
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          phone: formattedPhone,
          first_name: 'Новый',
          last_name: 'Пользователь',
          birth_date: '2000-01-01', // Значение по умолчанию
          role: 'customer', // По умолчанию заказчик
          is_verified: true,
          city: 'Ташкент',
        })
        .select('id')
        .single();

      if (createError || !newUser) {
        console.error('Create user error:', createError);
        return { success: false, error: 'Failed to create user' };
      }

      userId = newUser.id;
    } else {
      userId = userData.id;
    }

    // Удаляем использованный OTP
    await supabase.from('otp_codes').delete().eq('phone', formattedPhone);

    return { success: true, userId };
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return { success: false, error: 'Internal server error' };
  }
}

