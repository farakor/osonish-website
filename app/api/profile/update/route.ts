import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await request.json();
    console.log('🔄 [profile/update] Обновление профиля:', { userId: user.id, updates });

    // Валидация данных
    if (updates.first_name && updates.first_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Имя должно содержать минимум 2 символа' },
        { status: 400 }
      );
    }

    if (updates.last_name && updates.last_name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Фамилия должна содержать минимум 2 символа' },
        { status: 400 }
      );
    }

    if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
      return NextResponse.json(
        { success: false, error: 'Некорректный email адрес' },
        { status: 400 }
      );
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Обновляем профиль в базе данных
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ [profile/update] Ошибка обновления:', error);
      return NextResponse.json(
        { success: false, error: 'Не удалось обновить профиль' },
        { status: 500 }
      );
    }

    console.log('✅ [profile/update] Профиль успешно обновлен');
    return NextResponse.json({ 
      success: true, 
      user: data 
    });

  } catch (error) {
    console.error('❌ [profile/update] Критическая ошибка:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

