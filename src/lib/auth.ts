import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

/**
 * Получение текущего авторизованного пользователя
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');

    if (!sessionToken) {
      return null;
    }

    const supabase = await createClient();

    // Получаем сессию
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_sessions')
      .select('user_id, expires_at')
      .eq('id', sessionToken.value)
      .single();

    if (sessionError || !sessionData) {
      return null;
    }

    // Проверяем срок действия
    if (new Date(sessionData.expires_at) < new Date()) {
      // Удаляем истекшую сессию
      await supabase.from('user_sessions').delete().eq('id', sessionToken.value);
      cookieStore.delete('session_token');
      return null;
    }

    // Получаем данные пользователя
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionData.user_id)
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

