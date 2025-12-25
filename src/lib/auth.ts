import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

/**
 * Получение текущего авторизованного пользователя
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    
    // Сначала пробуем новый метод (user_id)
    const userIdCookie = cookieStore.get('user_id');
    
    // Если нет user_id, пробуем старый метод (session_token)
    const sessionToken = cookieStore.get('session_token');

    let userId: string | null = null;

    if (userIdCookie) {
      userId = userIdCookie.value;
    } else if (sessionToken) {
      // Старый метод - получаем user_id из user_sessions
      const supabase = await createClient();
      const { data: sessionData } = await supabase
        .from('user_sessions')
        .select('user_id, expires_at')
        .eq('id', sessionToken.value)
        .single();

      if (sessionData) {
        // Проверяем срок действия
        if (new Date(sessionData.expires_at) < new Date()) {
          // Удаляем истекшую сессию
          await supabase.from('user_sessions').delete().eq('id', sessionToken.value);
          cookieStore.delete('session_token');
          return null;
        }
        userId = sessionData.user_id;
      }
    }

    if (!userId) {
      return null;
    }

    // Получаем данные пользователя
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return null;
    }

    return userData;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Проверка авторизации пользователя
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

