import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

/**
 * Email Service для отправки OTP кодов
 */

/**
 * Генерация 6-значного OTP кода
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Отправка email через внешний сервис (например, через Supabase Functions или другой API)
 * Временно будем использовать console.log для разработки
 */
async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  try {
    // TODO: Интегрировать реальный email сервис (SendGrid, AWS SES, Mailgun и т.д.)
    // Пока что просто логируем для разработки
    console.log('📧 EMAIL TO:', to);
    console.log('📧 SUBJECT:', subject);
    console.log('📧 BODY:', body);
    console.log('📧 ====================');
    
    // Возвращаем true для разработки
    // В продакшене здесь должна быть настоящая отправка email
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Отправка OTP кода на email
 */
export async function sendEmailOTP(email: string): Promise<{ success: boolean; error?: string; code?: string }> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const otp = generateOTP();

    // Сохраняем OTP в базе данных
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут
    
    const { error: dbError } = await supabase
      .from('email_otp_codes')
      .upsert({
        email: email,
        code: otp,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
        verified: false,
        attempts: 0,
      }, {
        onConflict: 'email',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: 'Не удалось сохранить код' };
    }

    // Отправляем email
    const subject = 'Код подтверждения Osonish';
    const body = `
      Ваш код подтверждения: ${otp}
      
      Код действителен в течение 5 минут.
      Если вы не запрашивали этот код, проигнорируйте это письмо.
      
      С уважением,
      Команда Osonish
    `;
    
    const emailSent = await sendEmail(email, subject, body);

    if (!emailSent) {
      return { success: false, error: 'Не удалось отправить email' };
    }

    console.log(`✅ OTP код ${otp} успешно отправлен на ${email}`);
    return { success: true, code: otp }; // Возвращаем код для разработки (в продакшене убрать!)
  } catch (error) {
    console.error('Error in sendEmailOTP:', error);
    return { success: false, error: 'Внутренняя ошибка сервера' };
  }
}

/**
 * Проверка OTP кода для email
 */
export async function verifyEmailOTP(email: string, code: string): Promise<{ 
  success: boolean; 
  error?: string;
  userId?: string;
}> {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Получаем OTP из базы данных
    const { data: otpData, error: fetchError } = await supabase
      .from('email_otp_codes')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !otpData) {
      console.error('OTP not found:', fetchError);
      return { success: false, error: 'Код не найден или истек' };
    }

    // Проверяем количество попыток
    if (otpData.attempts >= 3) {
      return { success: false, error: 'Превышено количество попыток. Запросите новый код' };
    }

    // Проверяем, не истек ли код
    if (new Date(otpData.expires_at) < new Date()) {
      return { success: false, error: 'Код истек. Запросите новый код' };
    }

    // Проверяем, не был ли уже использован
    if (otpData.verified) {
      return { success: false, error: 'Код уже был использован' };
    }

    // Проверяем сам код
    if (otpData.code !== code) {
      // Увеличиваем счетчик попыток
      await supabase
        .from('email_otp_codes')
        .update({ attempts: otpData.attempts + 1 })
        .eq('email', email);

      return { success: false, error: 'Неверный код' };
    }

    // Отмечаем код как использованный
    await supabase
      .from('email_otp_codes')
      .update({ verified: true })
      .eq('email', email);

    // Проверяем, существует ли пользователь с таким email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user:', userError);
      return { success: false, error: 'Ошибка проверки пользователя' };
    }

    return { 
      success: true, 
      userId: userData?.id 
    };
  } catch (error) {
    console.error('Error in verifyEmailOTP:', error);
    return { success: false, error: 'Внутренняя ошибка сервера' };
  }
}

