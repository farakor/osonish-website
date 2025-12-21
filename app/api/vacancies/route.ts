import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Получаем параметры фильтрации
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const experienceLevel = searchParams.get("experienceLevel");
    const employmentType = searchParams.get("employmentType");
    const workFormat = searchParams.get("workFormat");
    const salaryFrom = searchParams.get("salaryFrom");
    const salaryTo = searchParams.get("salaryTo");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // Строим запрос к базе данных
    let query = supabase
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
      `, { count: "exact" })
      .eq("type", "vacancy")
      .in("status", ["new", "response_received"]);

    // Применяем фильтры
    if (city) {
      query = query.eq("city", city);
    }

    if (category) {
      query = query.eq("specialization_id", category);
    }

    if (experienceLevel) {
      query = query.eq("experience_level", experienceLevel);
    }

    if (employmentType) {
      query = query.eq("employment_type", employmentType);
    }

    if (workFormat) {
      query = query.eq("work_format", workFormat);
    }

    if (salaryFrom) {
      query = query.gte("salary_from", parseInt(salaryFrom));
    }

    if (salaryTo) {
      query = query.lte("salary_to", parseInt(salaryTo));
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,job_title.ilike.%${search}%`);
    }

    // Применяем сортировку, пагинацию
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching vacancies:", error);
      return NextResponse.json(
        { error: "Failed to fetch vacancies" },
        { status: 500 }
      );
    }

    // Преобразуем данные в нужный формат
    const vacancies = data?.map((vacancy: any) => ({
      id: vacancy.id,
      type: vacancy.type,
      title: vacancy.title,
      jobTitle: vacancy.job_title,
      description: vacancy.description,
      specializationId: vacancy.specialization_id,
      location: vacancy.location,
      city: vacancy.city,
      budget: vacancy.budget,
      workersNeeded: vacancy.workers_needed,
      serviceDate: vacancy.service_date,
      status: vacancy.status,
      customerId: vacancy.customer_id,
      applicantsCount: vacancy.applicants_count || 0,
      viewsCount: vacancy.views_count || 0,
      employmentType: vacancy.employment_type,
      workFormat: vacancy.work_format,
      workSchedule: vacancy.work_schedule,
      salaryFrom: vacancy.salary_from,
      salaryTo: vacancy.salary_to,
      salaryPeriod: vacancy.salary_period,
      salaryType: vacancy.salary_type,
      experienceLevel: vacancy.experience_level,
      skills: vacancy.skills || [],
      languages: vacancy.languages || [],
      createdAt: vacancy.created_at,
      updatedAt: vacancy.updated_at,
      // Информация о компании из профиля заказчика
      companyName: vacancy.customer?.company_name || null,
      customerName: vacancy.customer 
        ? `${vacancy.customer.first_name} ${vacancy.customer.last_name}`
        : null,
      customerUserType: vacancy.customer?.user_type || 'individual',
    })) || [];

    return NextResponse.json({
      vacancies,
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit,
    });
  } catch (error) {
    console.error("Error in vacancies API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

