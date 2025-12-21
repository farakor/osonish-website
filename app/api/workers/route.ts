import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Получаем параметры фильтрации
    const city = searchParams.get("city");
    const specialization = searchParams.get("specialization");
    const workerType = searchParams.get("workerType") as "daily_worker" | "professional" | "job_seeker" | null;
    const minRating = searchParams.get("minRating");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    // Строим запрос к базе данных
    // Получаем всех пользователей с ролью worker (все типы работников)
    // Исключаем только заказчиков (role='customer') и работодателей
    let query = supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("role", "worker"); // Все работники: daily_worker, professional, job_seeker

    // Применяем фильтры
    if (city) {
      query = query.eq("city", city);
    }

    if (specialization) {
      // Фильтруем по специализации используя PostgreSQL JSONB operator
      // Используем @> оператор для проверки, содержит ли массив объект с указанным id
      query = query.filter('specializations', 'cs', JSON.stringify([{ id: specialization }]));
    }

    if (workerType) {
      query = query.eq("worker_type", workerType);
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,about_me.ilike.%${search}%`);
    }

    // Применяем сортировку, пагинацию
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching workers:", error);
      return NextResponse.json(
        { error: "Failed to fetch workers" },
        { status: 500 }
      );
    }

    // Получаем ID всех работников
    const workerIds = data?.map((w: any) => w.id) || [];
    
    // Получаем отзывы для этих работников с информацией о заказчиках
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select(`
        *,
        customer:customer_id (
          first_name,
          last_name
        )
      `)
      .in("worker_id", workerIds);

    // Группируем отзывы по worker_id
    const reviewsByWorker = (reviewsData || []).reduce((acc: any, review: any) => {
      if (!acc[review.worker_id]) {
        acc[review.worker_id] = [];
      }
      acc[review.worker_id].push(review);
      return acc;
    }, {});
    
    // Получаем количество завершенных работ для каждого работника
    const { data: completedJobsData } = await supabase
      .from("applicants")
      .select("worker_id")
      .in("worker_id", workerIds)
      .eq("status", "completed");

    // Подсчитываем завершенные работы для каждого работника
    const completedJobsCounts = (completedJobsData || []).reduce((acc: any, item: any) => {
      acc[item.worker_id] = (acc[item.worker_id] || 0) + 1;
      return acc;
    }, {});

    // Преобразуем данные в нужный формат
    let workers = data?.map((worker: any) => {
      const reviews = reviewsByWorker[worker.id] || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
        : 0;

      return {
        id: worker.id,
        firstName: worker.first_name,
        lastName: worker.last_name,
        phone: worker.phone,
        profileImage: worker.profile_image,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalReviews,
        completedJobs: completedJobsCounts[worker.id] || 0,
        joinedAt: worker.created_at,
        reviews: reviews.map((r: any) => {
          // Пытаемся получить имя из разных источников
          let customerName = "Аноним";
          
          if (r.customer_name) {
            customerName = r.customer_name;
          } else if (r.customer && r.customer.first_name && r.customer.last_name) {
            customerName = `${r.customer.first_name} ${r.customer.last_name}`;
          } else if (r.customer && r.customer.first_name) {
            customerName = r.customer.first_name;
          }
          
          return {
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.created_at,
            customerName,
            orderTitle: r.order_title,
          };
        }),
        workerType: worker.worker_type,
        city: worker.city,
        specialization: worker.specialization || null,
        aboutMe: worker.about_me,
        skills: worker.skills || [],
        education: worker.education || [],
        workExperience: worker.work_experience || [],
        specializations: worker.specializations || [],
      };
    }) || [];

    // Фильтрация по минимальному рейтингу (на стороне приложения, т.к. рейтинг вычисляется)
    if (minRating) {
      const minRatingValue = parseFloat(minRating);
      workers = workers.filter((w: any) => w.averageRating >= minRatingValue);
    }

    return NextResponse.json({
      workers,
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > offset + limit,
    });
  } catch (error) {
    console.error("Error in workers API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

