import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import nodemailer from 'nodemailer';

/**
 * Email Service для отправки OTP кодов и сообщений
 */

// SMTP конфигурация
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@oson-ish.uz';

// Создаем транспортер для nodemailer
let transporter: nodemailer.Transporter | null = null;

// Инициализируем транспортер только если SMTP настроен
if (SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true для 465, false для других портов
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

/**
 * Генерация 6-значного OTP кода
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Отправка email через SMTP
 */
async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  try {
    // Проверяем, настроен ли SMTP
    if (!transporter) {
      console.warn('⚠️  SMTP не настроен. Email будет залогирован в консоль.');
      console.log('📧 EMAIL TO:', to);
      console.log('📧 SUBJECT:', subject);
      console.log('📧 BODY:', body);
      console.log('📧 ====================');
      return true;
    }

    // Отправляем email через SMTP
    const info = await transporter.sendMail({
      from: `"Oson Ish" <${SMTP_FROM}>`,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>'),
    });

    console.log('✅ Email отправлен:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error);
    return false;
  }
}

/**
 * Отправка письма на info@oson-ish.uz (из контактной формы)
 */
export async function sendContactEmail(data: {
  name: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const emailBody = `
Новое сообщение с формы обратной связи

Имя: ${data.name}
Телефон: ${data.phone}
Тема: ${data.subject}
Сообщение:
${data.message}

---
Отправлено с формы контактов Oson Ish
    `;

    const emailSent = await sendEmail(
      'info@oson-ish.uz',
      `Новое сообщение: ${data.subject}`,
      emailBody
    );

    if (!emailSent) {
      return { success: false, error: 'Не удалось отправить сообщение' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendContactEmail:', error);
    return { success: false, error: 'Внутренняя ошибка сервера' };
  }
}

/**
 * Отправка OTP кода на email
 */
export async function sendEmailOTP(email: string): Promise<{ success: boolean; error?: string; code?: string }> {
  try {
    const supabase = await createClient();
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
    const supabase = await createClient();

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

