import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Получаем параметры фильтрации
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const minBudget = searchParams.get("minBudget");
    const maxBudget = searchParams.get("maxBudget");
    const search = searchParams.get("search");
    const type = searchParams.get("type") as "daily" | "vacancy" | null;
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
      .in("status", ["new", "response_received"]);

    // Фильтр по типу (если указан, иначе показываем только daily, без vacancy)
    if (type) {
      query = query.eq("type", type);
    } else {
      // По умолчанию показываем только дневные заказы
      query = query.eq("type", "daily");
    }

    // Применяем фильтры
    if (city) {
      query = query.ilike("location", `%${city}%`);
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (minBudget) {
      query = query.gte("budget", parseInt(minBudget));
    }

    if (maxBudget) {
      query = query.lte("budget", parseInt(maxBudget));
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
    }

    // Применяем сортировку, пагинацию
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    // Преобразуем данные в нужный формат
    const orders = data?.map((order: any) => ({
      id: order.id,
      type: order.type,
      title: order.title,
      description: order.description,
      category: order.category,
      specializationId: order.specialization_id,
      location: order.location,
      latitude: order.latitude,
      longitude: order.longitude,
      budget: order.budget,
      workersNeeded: order.workers_needed,
      serviceDate: order.service_date,
      status: order.status,
      customerId: order.customer_id,
      applicantsCount: order.applicants_count || 0,
      viewsCount: order.views_count || 0,
      transportPaid: order.transport_paid,
      mealIncluded: order.meal_included,
      mealPaid: order.meal_paid,
      photos: order.photos || [],
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      // Информация о заказчике
      customerName: order.customer 
        ? `${order.customer.first_name} ${order.customer.last_name}`
        : null,
      companyName: order.customer?.company_name || null,
      customerUserType: order.customer?.user_type || 'individual',
      // Поля для вакансий (если type === 'vacancy')
      jobTitle: order.job_title,
      employmentType: order.employment_type,
      workFormat: order.work_format,
      workSchedule: order.work_schedule,
      city: order.city,
      salaryFrom: order.salary_from,
      salaryTo: order.salary_to,
      salaryPeriod: order.salary_period,
      experienceLevel: order.experience_level,
      skills: order.skills || [],
      languages: order.languages || [],
    })) || [];

    return NextResponse.json({
      orders,
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit,
    });
  } catch (error) {
    console.error("Error in orders API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

