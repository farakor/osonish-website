import { createClient } from "../supabase/server";
import type { User, WorkerProfile } from "@/types";

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as User;
  } catch (error) {
    return null;
  }
}

export async function getWorkerProfile(
  workerId: string
): Promise<WorkerProfile | null> {
  try {
    const supabase = await createClient();

    // Get user data
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", workerId)
      .eq("role", "worker")
      .single();

    if (userError || !user) {
      return null;
    }

    // Get reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("*, customers:customer_id(first_name, last_name)")
      .eq("worker_id", workerId)
      .order("created_at", { ascending: false });

    // Calculate stats
    const averageRating =
      reviews && reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    // Get completed jobs count
    const { count: completedJobs } = await supabase
      .from("applicants")
      .select("*", { count: "exact", head: true })
      .eq("worker_id", workerId)
      .eq("status", "completed");

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      profileImage: user.profile_image,
      averageRating,
      totalReviews: reviews?.length || 0,
      completedJobs: completedJobs || 0,
      joinedAt: user.created_at,
      reviews: reviews || [],
      workerType: user.worker_type,
      education: user.education,
      skills: user.skills,
      workExperience: user.work_experience,
      specializations: user.specializations,
    };
  } catch (error) {
    return null;
  }
}

export async function searchWorkers(filters: {
  city?: string;
  specializationId?: string;
  minRating?: number;
  limit?: number;
}): Promise<User[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("users")
      .select("*")
      .eq("role", "worker")
      .eq("is_verified", true);

    if (filters.city) {
      query = query.eq("city", filters.city);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    return data as User[];
  } catch (error) {
    return [];
  }
}

