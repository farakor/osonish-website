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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Файл не загружен' },
        { status: 400 }
      );
    }

    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Недопустимый тип файла. Разрешены только изображения JPG, PNG, WEBP' },
        { status: 400 }
      );
    }

    // Проверяем размер файла (макс 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Размер файла не должен превышать 5MB' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Удаляем старый аватар, если он есть
    if (user.avatar_url) {
      try {
        const oldFileName = user.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldFileName}`]);
        }
      } catch (error) {
        console.warn('⚠️ Не удалось удалить старый аватар:', error);
      }
    }

    // Генерируем уникальное имя файла
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Загружаем файл в Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ Ошибка загрузки файла:', uploadError);
      return NextResponse.json(
        { success: false, error: 'Не удалось загрузить файл' },
        { status: 500 }
      );
    }

    // Получаем публичный URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Обновляем URL аватара в профиле пользователя
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ Ошибка обновления профиля:', updateError);
      return NextResponse.json(
        { success: false, error: 'Не удалось обновить профиль' },
        { status: 500 }
      );
    }

    console.log('✅ Аватар успешно загружен:', publicUrl);
    return NextResponse.json({ 
      success: true, 
      avatar_url: publicUrl 
    });

  } catch (error) {
    console.error('❌ Критическая ошибка при загрузке аватара:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

