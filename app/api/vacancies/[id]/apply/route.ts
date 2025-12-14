import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("[Apply Vacancy API] Получен запрос на отклик для вакансии:", id);
    
    const body = await request.json();
    const { coverLetter } = body;

    // Получаем текущего пользователя
    const supabase = await createClient();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token");

    if (!sessionToken) {
      console.log("[Apply Vacancy API] Ошибка: нет токена сессии");
      return NextResponse.json(
        { success: false, error: "Требуется авторизация" },
        { status: 401 }
      );
    }

    // Получаем пользователя из сессии
    const { data: session, error: sessionError } = await supabase
      .from("user_sessions")
      .select("user_id")
      .eq("id", sessionToken.value)
      .single();

    if (sessionError || !session) {
      console.log("[Apply Vacancy API] Ошибка получения сессии:", sessionError);
      return NextResponse.json(
        { success: false, error: "Сессия недействительна" },
        { status: 401 }
      );
    }

    console.log("[Apply Vacancy API] Пользователь из сессии:", session.user_id);

    // Получаем информацию о пользователе
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user_id)
      .single();

    if (userError) {
      console.log("[Apply Vacancy API] Ошибка получения пользователя:", userError);
    }

    console.log("[Apply Vacancy API] Роль пользователя:", user?.role);

    // Проверяем, что пользователь - исполнитель
    if (user?.role !== "worker") {
      console.log("[Apply Vacancy API] Ошибка: пользователь не является исполнителем");
      return NextResponse.json(
        { success: false, error: "Только исполнители могут откликаться на вакансии" },
        { status: 403 }
      );
    }

    // Проверяем, что вакансия существует
    const { data: vacancy, error: vacancyError } = await supabase
      .from("orders")
      .select("id, customer_id, status, type, applicants_count, pending_applicants_count")
      .eq("id", id)
      .eq("type", "vacancy")
      .single();

    if (vacancyError || !vacancy) {
      console.log("[Apply Vacancy API] Ошибка получения вакансии:", vacancyError);
      return NextResponse.json(
        { success: false, error: "Вакансия не найдена" },
        { status: 404 }
      );
    }

    console.log("[Apply Vacancy API] Вакансия найдена:", vacancy.id, "статус:", vacancy.status, "откликов:", vacancy.applicants_count);

    // Проверяем, что пользователь не откликался ранее
    const { data: existingApplication, error: existingError } = await supabase
      .from("vacancy_applications")
      .select("id")
      .eq("vacancy_id", id)
      .eq("applicant_id", session.user_id)
      .maybeSingle();

    if (existingError) {
      console.log("[Apply Vacancy API] Ошибка проверки существующего отклика:", existingError);
    }

    if (existingApplication) {
      console.log("[Apply Vacancy API] Пользователь уже откликался на эту вакансию");
      return NextResponse.json(
        { success: false, error: "Вы уже откликнулись на эту вакансию" },
        { status: 400 }
      );
    }

    console.log("[Apply Vacancy API] Создаем отклик...");

    // Создаем отклик в таблице vacancy_applications
    const { data: application, error: insertError } = await supabase
      .from("vacancy_applications")
      .insert({
        vacancy_id: id,
        applicant_id: session.user_id,
        cover_letter: coverLetter || "",
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Apply Vacancy API] Ошибка создания отклика:", insertError);
      console.error("[Apply Vacancy API] Детали ошибки:", JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { success: false, error: `Не удалось отправить отклик: ${insertError.message}` },
        { status: 500 }
      );
    }

    console.log("[Apply Vacancy API] Отклик создан успешно:", application.id);

    // Обновляем счетчик откликов в вакансии
    const newApplicantsCount = (vacancy.applicants_count || 0) + 1;
    const newPendingCount = (vacancy.pending_applicants_count || 0) + 1;
    const newStatus = vacancy.status === "new" ? "response_received" : vacancy.status;

    console.log("[Apply Vacancy API] Обновляем счетчики:", {
      applicants_count: newApplicantsCount,
      pending_applicants_count: newPendingCount,
      status: newStatus
    });

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        applicants_count: newApplicantsCount,
        pending_applicants_count: newPendingCount,
        status: newStatus,
      })
      .eq("id", id);

    if (updateError) {
      console.error("[Apply Vacancy API] Ошибка обновления вакансии:", updateError);
    } else {
      console.log("[Apply Vacancy API] ✅ Счетчики успешно обновлены");
    }

    // TODO: Отправить уведомление заказчику
    // Можно добавить создание записи в таблицу notifications

    return NextResponse.json({
      success: true,
      data: application,
      message: "Отклик успешно отправлен",
    });
  } catch (error) {
    console.error("[Apply Vacancy API] Общая ошибка:", error);
    return NextResponse.json(
      { success: false, error: "Произошла ошибка при отправке отклика" },
      { status: 500 }
    );
  }
}

