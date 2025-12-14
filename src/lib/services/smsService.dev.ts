import { createClient } from '@/lib/supabase/server';

const DEV_OTP = '123456'; // Фиксированный код для разработки

/**
 * Форматирование номера телефона
 */
function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('998')) {
    return cleaned;
  }
  
  if (cleaned.startsWith('0')) {
    return '998' + cleaned.substring(1);
  }
  
  return '998' + cleaned;
}

/**
 * Отправка OTP кода (DEV режим - без реальной отправки SMS)
 */
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const formattedPhone = formatPhoneNumber(phone);

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 минут
    
    const { error: dbError } = await supabase
      .from('otp_codes')
      .upsert({
        phone: formattedPhone,
        code: DEV_OTP,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'phone',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: 'Failed to save OTP' };
    }

    console.log(`🔐 DEV MODE: OTP код для ${formattedPhone} = ${DEV_OTP}`);
    console.log(`📱 Текст SMS: ${DEV_OTP} - Код подтверждения авторизации в приложении Oson Ish`);
    return { success: true };
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return { success: false, error: 'Internal server error' };
  }
}

/**
 * Проверка OTP кода (только проверка, без создания пользователя)
 */
export async function verifyOTPCode(
  phone: string, 
  code: string
): Promise<boolean> {
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
      return false;
    }

    // Проверяем срок действия
    if (new Date(otpData.expires_at) < new Date()) {
      await supabase.from('otp_codes').delete().eq('phone', formattedPhone);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in verifyOTPCode:', error);
    return false;
  }
}

/**
 * Проверка OTP кода (устаревший метод для обратной совместимости)
 */
export async function verifyOTP(
  phone: string, 
  code: string
): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    const isValid = await verifyOTPCode(phone, code);
    return isValid 
      ? { success: true }
      : { success: false, error: 'Invalid OTP code' };
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return { success: false, error: 'Internal server error' };
  }
}

