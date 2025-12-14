import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { CreateOrderRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const orderData: CreateOrderRequest = await request.json();

    // Валидация данных в зависимости от типа
    const isVacancy = orderData.type === "vacancy";

    if (isVacancy) {
      // Валидация для вакансии
      if (!orderData.jobTitle?.trim()) {
        return NextResponse.json(
          { success: false, error: "Название вакансии обязательно" },
          { status: 400 }
        );
      }

      if (orderData.jobTitle.length > 100) {
        return NextResponse.json(
          {
            success: false,
            error: "Название вакансии не должно превышать 100 символов",
          },
          { status: 400 }
        );
      }

      if (!orderData.description?.trim()) {
        return NextResponse.json(
          { success: false, error: "Описание вакансии обязательно" },
          { status: 400 }
        );
      }

      if (orderData.description.length > 2000) {
        return NextResponse.json(
          {
            success: false,
            error: "Описание вакансии не должно превышать 2000 символов",
          },
          { status: 400 }
        );
      }

      if (!orderData.specializationId) {
        return NextResponse.json(
          { success: false, error: "Специализация обязательна" },
          { status: 400 }
        );
      }

      if (!orderData.experienceLevel) {
        return NextResponse.json(
          { success: false, error: "Уровень опыта обязателен" },
          { status: 400 }
        );
      }

      if (!orderData.city) {
        return NextResponse.json(
          { success: false, error: "Город обязателен" },
          { status: 400 }
        );
      }

      if (!orderData.skills || orderData.skills.length === 0) {
        return NextResponse.json(
          { success: false, error: "Необходимо указать хотя бы один навык" },
          { status: 400 }
        );
      }

      if (!orderData.languages || orderData.languages.length === 0) {
        return NextResponse.json(
          { success: false, error: "Необходимо указать хотя бы один язык" },
          { status: 400 }
        );
      }
    } else {
      // Валидация для дневной работы
      if (!orderData.title?.trim()) {
        return NextResponse.json(
          { success: false, error: "Название заказа обязательно" },
          { status: 400 }
        );
      }

      if (orderData.title.length > 70) {
        return NextResponse.json(
          {
            success: false,
            error: "Название заказа не должно превышать 70 символов",
          },
          { status: 400 }
        );
      }

      if (!orderData.description?.trim()) {
        return NextResponse.json(
          { success: false, error: "Описание заказа обязательно" },
          { status: 400 }
        );
      }

      if (orderData.description.length > 500) {
        return NextResponse.json(
          {
            success: false,
            error: "Описание заказа не должно превышать 500 символов",
          },
          { status: 400 }
        );
      }
    }

    // Получаем текущего пользователя
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
    const { data: session } = await supabase
      .from("user_sessions")
      .select("user_id")
      .eq("id", sessionToken.value)
      .single();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Сессия недействительна" },
        { status: 401 }
      );
    }

    // Получаем информацию о пользователе
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user_id)
      .single();

    // Проверяем, что только заказчики могут создавать заказы
    if (user?.role !== 'customer') {
      return NextResponse.json(
        { success: false, error: "Только заказчики могут создавать заказы" },
        { status: 403 }
      );
    }

    // Создаем заказ
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          type: orderData.type || "daily",
          title: isVacancy ? orderData.jobTitle : orderData.title,
          description: orderData.description,
          category: orderData.category || "other",
          specialization_id: orderData.specializationId || null,
          location: orderData.location,
          latitude: orderData.latitude || null,
          longitude: orderData.longitude || null,
          budget: orderData.budget || 0,
          workers_needed: orderData.workersNeeded || 1,
          service_date: orderData.serviceDate,
          photos: orderData.photos || [],
          transport_paid: orderData.transportPaid || false,
          meal_included: orderData.mealIncluded || false,
          meal_paid: orderData.mealPaid || false,
          customer_id: session.user_id,
          status: "new",
          applicants_count: 0,
          pending_applicants_count: 0,
          views_count: 0,
          // Поля для вакансий
          job_title: orderData.jobTitle || null,
          experience_level: orderData.experienceLevel || null,
          employment_type: orderData.employmentType || null,
          work_format: orderData.workFormat || null,
          work_schedule: orderData.workSchedule || null,
          city: orderData.city || null,
          salary_from: orderData.salaryFrom || null,
          salary_to: orderData.salaryTo || null,
          salary_period: orderData.salaryPeriod || null,
          salary_type: orderData.salaryType || null,
          payment_frequency: orderData.paymentFrequency || null,
          skills: orderData.skills || null,
          languages: orderData.languages || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      return NextResponse.json(
        { success: false, error: "Не удалось создать заказ" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Create order API error:", error);
    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

