import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, type } = body; // type: 'order' или 'vacancy'

    console.log(`[Update Application Status] Обновление статуса отклика ${id} на ${status}, тип: ${type}`);

    // Проверка авторизации
    const supabase = await createClient();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token");

    if (!sessionToken) {
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
      return NextResponse.json(
        { success: false, error: "Сессия недействительна" },
        { status: 401 }
      );
    }

    // Получаем роль пользователя
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user_id)
      .single();

    if (user?.role !== 'customer') {
      return NextResponse.json(
        { success: false, error: "Только работодатели могут изменять статус откликов" },
        { status: 403 }
      );
    }

    // Определяем таблицу и поля в зависимости от типа
    const tableName = type === 'vacancy' ? 'vacancy_applications' : 'applicants';
    const idField = type === 'vacancy' ? 'vacancy_id' : 'order_id';
    
    // Получаем отклик и проверяем владельца
    const { data: application, error: fetchError } = await supabase
      .from(tableName)
      .select(`*, ${type === 'vacancy' ? 'vacancy:orders!vacancy_id' : 'order:orders!order_id'}(customer_id)`)
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { success: false, error: "Отклик не найден" },
        { status: 404 }
      );
    }

    // Проверяем, что текущий пользователь является владельцем заказа/вакансии
    const customerData = type === 'vacancy' ? application.vacancy : application.order;
    if (customerData?.customer_id !== session.user_id) {
      return NextResponse.json(
        { success: false, error: "У вас нет прав для изменения этого отклика" },
        { status: 403 }
      );
    }

    // Обновляем статус отклика
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error(`[Update Application Status] Ошибка обновления:`, updateError);
      return NextResponse.json(
        { success: false, error: "Не удалось обновить статус отклика" },
        { status: 500 }
      );
    }

    // Обновляем счетчики в заказе/вакансии при необходимости
    if (status === 'accepted' || status === 'rejected') {
      const orderId = type === 'vacancy' ? application.vacancy_id : application.order_id;
      
      // Получаем текущие счетчики
      const { data: order } = await supabase
        .from('orders')
        .select('pending_applicants_count')
        .eq('id', orderId)
        .single();

      if (order && order.pending_applicants_count > 0) {
        await supabase
          .from('orders')
          .update({ 
            pending_applicants_count: order.pending_applicants_count - 1
          })
          .eq('id', orderId);
      }
    }

    console.log(`[Update Application Status] Статус успешно обновлен на ${status}`);

    return NextResponse.json({
      success: true,
      message: `Отклик ${status === 'accepted' ? 'принят' : 'отклонен'}`,
    });
  } catch (error) {
    console.error("[Update Application Status] Ошибка:", error);
    return NextResponse.json(
      { success: false, error: "Произошла ошибка при обновлении статуса" },
      { status: 500 }
    );
  }
}








































