import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token');
    const userId = cookieStore.get('user_id');

    if (sessionToken) {
      // Удаляем старую сессию из базы данных (если таблица существует)
      try {
        await supabase
          .from('user_sessions')
          .delete()
          .eq('id', sessionToken.value);
      } catch (err) {
        // Игнорируем ошибку если таблица не существует
        console.log('Session cleanup skipped (table may not exist)');
      }
    }

    // Удаляем cookies
    cookieStore.delete('session_token');
    cookieStore.delete('user_id');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
