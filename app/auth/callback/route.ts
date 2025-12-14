import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    
    // Обмениваем код на сессию
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Проверяем, есть ли пользователь в нашей таблице users
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.user.email)
        .single();

      if (userData) {
        // Создаем сессию в нашей таблице
        const sessionId = randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await supabase
          .from('user_sessions')
          .insert({
            id: sessionId,
            user_id: userData.id,
            expires_at: expiresAt.toISOString(),
          });

        // Устанавливаем cookie
        const cookieStore = await cookies();
        cookieStore.set('session_token', sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: expiresAt,
          path: '/',
        });

        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
    }
  }

  // Если что-то пошло не так, перенаправляем на страницу входа
  return NextResponse.redirect(new URL('/auth/login?error=auth_callback_error', requestUrl.origin));
}

