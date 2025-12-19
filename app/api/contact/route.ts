import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const { name, phone, subject, message } = await request.json();

    // Валидация полей
    if (!name || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    // Валидация длины полей
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Имя должно быть от 2 до 100 символов' },
        { status: 400 }
      );
    }

    if (phone.length < 10 || phone.length > 20) {
      return NextResponse.json(
        { success: false, error: 'Некорректный номер телефона' },
        { status: 400 }
      );
    }

    if (message.length < 10 || message.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Сообщение должно быть от 10 до 1000 символов' },
        { status: 400 }
      );
    }

    // Отправляем email
    const result = await sendContactEmail({
      name,
      phone,
      subject,
      message,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Не удалось отправить сообщение' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

