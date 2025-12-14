import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Получаем информацию о работнике
    const { data: worker, error: workerError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .eq("role", "worker")
      .single();

    if (workerError || !worker) {
      console.error("Error fetching worker:", workerError);
      return NextResponse.json(
        { error: "Worker not found" },
        { status: 404 }
      );
    }

    // Получаем отзывы работника
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*")
      .eq("worker_id", id)
      .order("created_at", { ascending: false });

    const reviews = (reviewsData || []).map((r: any) => ({
      id: r.id,
      orderId: r.order_id,
      workerId: r.worker_id,
      customerId: r.customer_id,
      customerName: r.customer_name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      orderTitle: r.order_title,
    }));

    // Вычисляем рейтинг
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    // Получаем количество завершённых работ
    const { data: completedJobsData } = await supabase
      .from("applicants")
      .select("id")
      .eq("worker_id", id)
      .eq("status", "completed");

    const completedJobs = completedJobsData?.length || 0;

    // Парсим JSONB поля, если они пришли как строки
    const parseJsonField = (field: any) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return [];
        }
      }
      return [];
    };

    // Формируем профиль
    const profile = {
      id: worker.id,
      firstName: worker.first_name,
      lastName: worker.last_name,
      phone: worker.phone,
      profileImage: worker.profile_image,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      completedJobs,
      joinedAt: worker.created_at,
      reviews,
      workerType: worker.worker_type,
      city: worker.city,
      specialization: worker.specialization,
      aboutMe: worker.about_me,
      skills: worker.skills || [],
      education: parseJsonField(worker.education),
      workExperience: parseJsonField(worker.work_experience),
      specializations: parseJsonField(worker.specializations),
      willingToRelocate: worker.willing_to_relocate,
      desiredSalary: worker.desired_salary,
      workPhotos: parseJsonField(worker.work_photos),
    };

    console.log('Worker data from DB:', {
      id: worker.id,
      workExperience: worker.work_experience,
      workExperienceParsed: profile.workExperience,
      education: worker.education,
      educationParsed: profile.education,
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error in worker profile API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


