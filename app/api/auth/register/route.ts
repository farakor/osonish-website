import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      phone, 
      email,
      firstName, 
      lastName, 
      birthDate, 
      role, 
      profileImage,
      cityId,
      workerType,
      specializations,
      // Customer specific fields
      userType,
      companyName,
      // Job Seeker specific fields
      education,
      skills,
      workExperience,
      willingToRelocate,
      desiredSalary,
      // Professional specific fields
      aboutMe,
      workPhotos
    } = body;

    console.log('📝 Регистрация нового пользователя:', { 
      phone, 
      email,
      firstName, 
      lastName, 
      role,
      workerType,
      userType,
      companyName,
      cityId,
      specializationsCount: specializations?.length || 0,
      educationCount: education?.length || 0,
      skillsCount: skills?.length || 0,
      workExperienceCount: workExperience?.length || 0,
      willingToRelocate,
      desiredSalary,
      aboutMeLength: aboutMe?.length || 0,
      workPhotosCount: workPhotos?.length || 0
    });

    // Проверяем, что указан хотя бы телефон или email
    if (!phone && !email) {
      return NextResponse.json(
        { success: false, error: 'Необходимо указать телефон или email' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли уже пользователь с таким номером или email
    let existingUser = null;
    let checkError = null;
    
    if (phone) {
    const formattedPhoneForSearch = phone.replace(/\D/g, '');
    
      const result = await supabase
      .from('users')
      .select('id')
      .or(`phone.eq.${formattedPhoneForSearch},phone.eq.+${formattedPhoneForSearch}`)
      .single();
      
      existingUser = result.data;
      checkError = result.error;
    } else if (email) {
      const result = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();
      
      existingUser = result.data;
      checkError = result.error;
    }

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Ошибка проверки существующего пользователя:', checkError);
      return NextResponse.json({ 
        success: false, 
        error: 'Ошибка проверки данных' 
      }, { status: 500 });
    }

    if (existingUser) {
      console.log('⚠️ Пользователь уже существует');
      return NextResponse.json({ 
        success: false, 
        error: phone ? 'Пользователь с таким номером уже зарегистрирован' : 'Пользователь с таким email уже зарегистрирован'
      }, { status: 400 });
    }

    // Загружаем аватар, если он есть
    let avatarUrl = null;
    if (profileImage && profileImage.startsWith('data:')) {
      try {
        // Извлекаем base64 данные
        const base64Data = profileImage.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `${phone || email}-${Date.now()}.jpg`;

        // Загружаем в Supabase Storage (используем существующий bucket order-media)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('order-media')
          .upload(`avatars/${fileName}`, buffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (uploadError) {
          console.error('Ошибка загрузки аватара:', uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('order-media')
            .getPublicUrl(`avatars/${fileName}`);
          avatarUrl = publicUrlData.publicUrl;
          console.log('✅ Аватар загружен:', avatarUrl);
        }
      } catch (error) {
        console.error('Ошибка обработки аватара:', error);
      }
    }

    // Загружаем фото работ для профессионалов
    let workPhotosUrls: string[] = [];
    if (workerType === 'professional' && workPhotos && workPhotos.length > 0) {
      try {
        for (let i = 0; i < workPhotos.length; i++) {
          const photo = workPhotos[i];
          if (photo && photo.startsWith('data:')) {
            const base64Data = photo.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            const fileName = `${phone || email}-work-${Date.now()}-${i}.jpg`;

            const { error: uploadError } = await supabase.storage
              .from('order-media')
              .upload(`work-photos/${fileName}`, buffer, {
                contentType: 'image/jpeg',
                upsert: false,
              });

            if (uploadError) {
              console.error(`Ошибка загрузки фото работы ${i + 1}:`, uploadError);
            } else {
              const { data: publicUrlData } = supabase.storage
                .from('order-media')
                .getPublicUrl(`work-photos/${fileName}`);
              workPhotosUrls.push(publicUrlData.publicUrl);
              console.log(`✅ Фото работы ${i + 1} загружено:`, publicUrlData.publicUrl);
            }
          }
        }
      } catch (error) {
        console.error('Ошибка обработки фото работ:', error);
      }
    }

      // Создаем нового пользователя
      // Форматируем номер телефона с плюсом
      const formattedPhone = phone ? (phone.startsWith('+') ? phone : `+${phone}`) : null;
      
      console.log('📞 [register] Форматирование телефона:', { 
        original: phone, 
        formatted: formattedPhone 
      });
      
      const userData: any = {
        phone: formattedPhone,
        email: email || null,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        role,
        profile_image: avatarUrl, // Используем profile_image, а не avatar_url
        city: cityId, // Используем city, а не city_id
        created_at: new Date().toISOString(),
      };

    // Добавляем данные для исполнителей
    if (role === 'worker') {
      userData.worker_type = workerType;
      
      // Сохраняем специализации как JSON
      if (specializations && specializations.length > 0) {
        userData.specializations = specializations;
      }
      
      // Добавляем данные для профессиональных мастеров
      if (workerType === 'professional') {
        if (aboutMe) {
          userData.about_me = aboutMe;
        }
        if (workPhotosUrls.length > 0) {
          userData.work_photos = workPhotosUrls;
        }
      }
      
      // Добавляем данные для соискателей (job_seeker)
      if (workerType === 'job_seeker') {
        if (education && education.length > 0) {
          userData.education = education;
        }
        if (skills && skills.length > 0) {
          userData.skills = skills;
        }
        if (workExperience && workExperience.length > 0) {
          userData.work_experience = workExperience;
        }
        if (typeof willingToRelocate === 'boolean') {
          userData.willing_to_relocate = willingToRelocate;
        }
        if (desiredSalary) {
          userData.desired_salary = desiredSalary;
        }
      }
    }
    
    // Добавляем данные для заказчиков
    if (role === 'customer') {
      if (userType) {
        userData.user_type = userType;
      }
      if (userType === 'company' && companyName) {
        userData.company_name = companyName;
      }
    }

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (insertError) {
      console.error('Ошибка создания пользователя:', insertError);
      return NextResponse.json({ 
        success: false, 
        error: 'Не удалось создать пользователя' 
      }, { status: 500 });
    }

    console.log('✅ Пользователь успешно создан:', newUser.id);

    // Создаем сессию для нового пользователя (БЕЗ session_token - используем id)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Сессия на 30 дней

    const { data: sessionData, error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: newUser.id,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Ошибка создания сессии:', sessionError);
      return NextResponse.json({ 
        success: false, 
        error: 'Не удалось создать сессию' 
      }, { status: 500 });
    }

    console.log('✅ Сессия создана:', sessionData.id);

    // Устанавливаем cookie с ID сессии (не с токеном)
    const response = NextResponse.json({ 
      success: true, 
      user: newUser 
    });

    response.cookies.set('session_token', sessionData.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 дней
      path: '/',
    });

    console.log('✅ Cookie установлен с session ID:', sessionData.id);

    return response;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Внутренняя ошибка сервера' 
    }, { status: 500 });
  }
}
