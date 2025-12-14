import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Получаем вакансию с информацией о заказчике
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
          profile_image
        )
      `)
      .eq("id", id)
      .eq("type", "vacancy")
      .single();

    if (error || !data) {
      console.error("Error fetching vacancy:", error);
      return NextResponse.json(
        { error: "Vacancy not found" },
        { status: 404 }
      );
    }

    // Увеличиваем счетчик просмотров
    await supabase.rpc("increment_order_views", { order_id: id });

    // Преобразуем данные в нужный формат
    const vacancy = {
      id: data.id,
      type: data.type,
      title: data.title,
      jobTitle: data.job_title,
      description: data.description,
      specializationId: data.specialization_id,
      location: data.location,
      city: data.city,
      budget: data.budget,
      workersNeeded: data.workers_needed,
      serviceDate: data.service_date,
      status: data.status,
      customerId: data.customer_id,
      applicantsCount: data.applicants_count || 0,
      viewsCount: (data.views_count || 0) + 1, // +1 для текущего просмотра
      employmentType: data.employment_type,
      workFormat: data.work_format,
      workSchedule: data.work_schedule,
      salaryFrom: data.salary_from,
      salaryTo: data.salary_to,
      salaryPeriod: data.salary_period,
      experienceLevel: data.experience_level,
      skills: data.skills || [],
      languages: data.languages || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      // Информация о компании
      companyName: data.customer?.company_name || null,
      customerName: data.customer 
        ? `${data.customer.first_name} ${data.customer.last_name}`
        : null,
      customerUserType: data.customer?.user_type || 'individual',
    };

    return NextResponse.json({ vacancy });
  } catch (error) {
    console.error("Error in vacancy detail API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

