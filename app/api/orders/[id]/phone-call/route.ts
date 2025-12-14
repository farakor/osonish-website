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

    // Логируем попытку звонка
    const { error: insertError } = await supabase
      .from("order_phone_calls")
      .insert({
        order_id: id,
        caller_id: user?.id || null,
        called_at: body.timestamp || new Date().toISOString(),
      });

    if (insertError) {
      console.error("Error logging phone call:", insertError);
      // Не возвращаем ошибку, так как это не критично
    }

    // Увеличиваем счетчик звонков в заказе
    const { error: updateError } = await supabase.rpc(
      "increment_order_phone_calls",
      { order_id: id }
    );

    if (updateError) {
      console.error("Error incrementing phone calls:", updateError);
    }

    return NextResponse.json({ 
      success: true,
      message: "Phone call logged successfully" 
    });
  } catch (error) {
    console.error("Error in phone call API:", error);
    // Возвращаем успех даже при ошибке, чтобы не мешать UX
    return NextResponse.json({ 
      success: true,
      message: "Phone call logged (with errors)" 
    });
  }
}

