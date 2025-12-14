import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("[Apply API] Получен запрос на отклик для заказа:", id);
    
    const body = await request.json();
    const { message, proposedPrice } = body;

    // Получаем текущего пользователя
    const supabase = await createClient();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token");

    if (!sessionToken) {
      console.log("[Apply API] Ошибка: нет токена сессии");
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
      console.log("[Apply API] Ошибка получения сессии:", sessionError);
      return NextResponse.json(
        { success: false, error: "Сессия недействительна" },
        { status: 401 }
      );
    }

    console.log("[Apply API] Пользователь из сессии:", session.user_id);

    // Получаем информацию о пользователе
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user_id)
      .single();

    if (userError) {
      console.log("[Apply API] Ошибка получения пользователя:", userError);
    }

    console.log("[Apply API] Роль пользователя:", user?.role);

    // Проверяем, что пользователь - исполнитель
    if (user?.role !== "worker") {
      console.log("[Apply API] Ошибка: пользователь не является исполнителем");
      return NextResponse.json(
        { success: false, error: "Только исполнители могут откликаться на заказы" },
        { status: 403 }
      );
    }

    // Проверяем, что заказ существует
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, customer_id, status, applicants_count")
      .eq("id", id)
      .single();

    if (orderError || !order) {
      console.log("[Apply API] Ошибка получения заказа:", orderError);
      return NextResponse.json(
        { success: false, error: "Заказ не найден" },
        { status: 404 }
      );
    }

    console.log("[Apply API] Заказ найден:", order.id, "статус:", order.status);

    // Проверяем, что пользователь не откликался ранее
    const { data: existingResponse, error: existingError } = await supabase
      .from("applicants")
      .select("id")
      .eq("order_id", id)
      .eq("worker_id", session.user_id)
      .maybeSingle();

    if (existingError) {
      console.log("[Apply API] Ошибка проверки существующего отклика:", existingError);
    }

    if (existingResponse) {
      console.log("[Apply API] Пользователь уже откликался на этот заказ");
      return NextResponse.json(
        { success: false, error: "Вы уже откликнулись на этот заказ" },
        { status: 400 }
      );
    }

    console.log("[Apply API] Создаем отклик в таблицу applicants...");

    // Генерируем уникальный ID для отклика
    const applicantId = `applicant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Получаем информацию о работнике для сохранения в отклике
    const { data: workerData } = await supabase
      .from("users")
      .select("first_name, last_name, phone, rating, completed_orders")
      .eq("id", session.user_id)
      .single();

    const workerName = workerData 
      ? `${workerData.first_name} ${workerData.last_name}`
      : "Неизвестный исполнитель";

    // Создаем отклик в таблице applicants (используется мобильным приложением)
    const { data: response, error: insertError } = await supabase
      .from("applicants")
      .insert({
        id: applicantId,
        order_id: id,
        worker_id: session.user_id,
        worker_name: workerName,
        worker_phone: workerData?.phone || "",
        rating: workerData?.rating || null,
        completed_jobs: workerData?.completed_orders || 0,
        message: message || "",
        proposed_price: proposedPrice || null,
        status: "pending",
        applied_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Apply API] Ошибка создания отклика:", insertError);
      console.error("[Apply API] Детали ошибки:", JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { success: false, error: `Не удалось отправить отклик: ${insertError.message}` },
        { status: 500 }
      );
    }

    console.log("[Apply API] Отклик создан успешно:", response.id);

    // Обновляем счетчик откликов в заказе
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        applicants_count: order.status === "new" ? 1 : order.applicants_count + 1,
        pending_applicants_count: 1,
        status: order.status === "new" ? "response_received" : order.status,
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating order:", updateError);
    }

    // TODO: Отправить уведомление заказчику
    // Можно добавить создание записи в таблицу notifications

    return NextResponse.json({
      success: true,
      data: response,
      message: "Отклик успешно отправлен",
    });
  } catch (error) {
    console.error("Error in apply API:", error);
    return NextResponse.json(
      { success: false, error: "Произошла ошибка при отправке отклика" },
      { status: 500 }
    );
  }
}

