import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // Получаем текущего пользователя (если авторизован)
    const { data: { user } } = await supabase.auth.getUser();

    // Логируем просмотр номера телефона
    const { error: insertError } = await supabase
      .from("order_phone_views")
      .insert({
        order_id: id,
        viewer_id: user?.id || null,
        viewed_at: body.timestamp || new Date().toISOString(),
      });

    if (insertError) {
      console.error("Error logging phone view:", insertError);
      // Не возвращаем ошибку, так как это не критично
    }

    // Увеличиваем счетчик просмотров номера телефона в заказе
    const { error: updateError } = await supabase.rpc(
      "increment_order_phone_views",
      { order_id: id }
    );

    if (updateError) {
      console.error("Error incrementing phone views:", updateError);
    }

    return NextResponse.json({ 
      success: true,
      message: "Phone view logged successfully" 
    });
  } catch (error) {
    console.error("Error in phone view API:", error);
    // Возвращаем успех даже при ошибке, чтобы не мешать UX
    return NextResponse.json({ 
      success: true,
      message: "Phone view logged (with errors)" 
    });
  }
}

