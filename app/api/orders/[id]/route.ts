import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Получаем заказ с информацией о заказчике
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        customer:customer_id(
          id,
          first_name,
          last_name,
          company_name,
          user_type,
          profile_image,
          phone
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error fetching order:", error);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Увеличиваем счетчик просмотров
    await supabase.rpc("increment_order_views", { order_id: id });

    // Преобразуем данные в нужный формат
    const order = {
      id: data.id,
      type: data.type,
      title: data.title,
      description: data.description,
      category: data.category,
      specializationId: data.specialization_id,
      location: data.location,
      latitude: data.latitude,
      longitude: data.longitude,
      budget: data.budget,
      workersNeeded: data.workers_needed,
      serviceDate: data.service_date,
      status: data.status,
      customerId: data.customer_id,
      applicantsCount: data.applicants_count || 0,
      viewsCount: (data.views_count || 0) + 1, // +1 для текущего просмотра
      transportPaid: data.transport_paid,
      mealIncluded: data.meal_included,
      mealPaid: data.meal_paid,
      photos: data.photos || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      // Информация о заказчике
      customerName: data.customer 
        ? `${data.customer.first_name} ${data.customer.last_name}`
        : null,
      customerPhone: data.customer?.phone || null,
      companyName: data.customer?.company_name || null,
      customerUserType: data.customer?.user_type || 'individual',
      // Поля для вакансий (если type === 'vacancy')
      jobTitle: data.job_title,
      employmentType: data.employment_type,
      workFormat: data.work_format,
      workSchedule: data.work_schedule,
      city: data.city,
      salaryFrom: data.salary_from,
      salaryTo: data.salary_to,
      salaryPeriod: data.salary_period,
      salaryType: data.salary_type,
      experienceLevel: data.experience_level,
      skills: data.skills || [],
      languages: data.languages || [],
    };

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error in order detail API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

