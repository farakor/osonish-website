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

    // Проверяем, есть ли отклик пользователя на эту вакансию
    const { data: application, error } = await supabase
      .from("vacancy_applications")
      .select("id, status")
      .eq("vacancy_id", id)
      .eq("applicant_id", session.user_id)
      .maybeSingle();

    if (error) {
      console.error("[Check Vacancy Application API] Ошибка:", error);
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
    console.error("[Check Vacancy Application API] Общая ошибка:", error);
    return NextResponse.json(
      { hasApplied: false },
      { status: 200 }
    );
  }
}

