import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Получаем текущего пользователя
    const supabase = await createClient();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token");

    if (!sessionToken) {
      return NextResponse.json(
        { hasApplied: false },
        { status: 200 }
      );
    }

    // Получаем пользователя из сессии
    const { data: session, error: sessionError } = await supabase
      .from("user_sessions")
      .select("user_id")
      .eq("id", sessionToken.value)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { hasApplied: false },
        { status: 200 }
      );
    }

    // Проверяем, есть ли отклик пользователя на этот заказ
    const { data: application, error } = await supabase
      .from("applicants")
      .select("id, status")
      .eq("order_id", id)
      .eq("worker_id", session.user_id)
      .maybeSingle();

    if (error) {
      console.error("[Check Application API] Ошибка:", error);
      return NextResponse.json(
        { hasApplied: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      hasApplied: !!application,
      status: application?.status || null,
    });
  } catch (error) {
    console.error("[Check Application API] Общая ошибка:", error);
    return NextResponse.json(
      { hasApplied: false },
      { status: 200 }
    );
  }
}
