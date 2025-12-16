import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📸 [upload-avatar] Начало загрузки аватара');
    
    // Проверяем авторизацию
    const user = await getCurrentUser();
    
    if (!user) {
      console.error('❌ [upload-avatar] Пользователь не авторизован');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('👤 [upload-avatar] Пользователь:', user.id);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    console.log('📄 [upload-avatar] Файл:', file?.name, file?.type, file?.size);

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
    const oldAvatarUrl = (user as any).avatar_url || (user as any).profile_image;
    if (oldAvatarUrl) {
      try {
        const oldFileName = oldAvatarUrl.split('/').pop();
        if (oldFileName) {
          console.log('🗑️ Удаляем старый аватар:', oldFileName);
          await supabase.storage
            .from('order-media')
            .remove([`avatars/${user.id}/${oldFileName}`]);
        }
      } catch (error) {
        console.warn('⚠️ Не удалось удалить старый аватар:', error);
      }
    }

    // Генерируем уникальное имя файла
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${user.id}/${fileName}`;
    console.log('📁 [upload-avatar] Путь файла:', filePath);

    // Загружаем файл в Supabase Storage
    console.log('⏳ [upload-avatar] Загрузка в Storage (bucket: order-media)...');
    const { error: uploadError } = await supabase.storage
      .from('order-media')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('❌ [upload-avatar] Ошибка загрузки файла:', uploadError);
      return NextResponse.json(
        { success: false, error: `Не удалось загрузить файл: ${uploadError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ [upload-avatar] Файл загружен в Storage');

    // Получаем публичный URL
    const { data: { publicUrl } } = supabase.storage
      .from('order-media')
      .getPublicUrl(filePath);
    
    console.log('🔗 [upload-avatar] Публичный URL:', publicUrl);

    // Обновляем URL аватара в профиле пользователя (оба поля для совместимости)
    console.log('💾 [upload-avatar] Обновляем профиль в БД...');
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        avatar_url: publicUrl,
        profile_image: publicUrl, // Дублируем для совместимости
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('❌ [upload-avatar] Ошибка обновления профиля:', updateError);
      return NextResponse.json(
        { success: false, error: `Не удалось обновить профиль: ${updateError.message}` },
        { status: 500 }
      );
    }

    console.log('✅ [upload-avatar] Аватар успешно загружен:', publicUrl);
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

