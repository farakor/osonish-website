import { createClient } from "../supabase/server";
import type { Review, CreateReviewRequest, WorkerRating } from "@/types";

export async function createReview(
  reviewData: CreateReviewRequest
): Promise<{ success: boolean; review?: Review; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          order_id: reviewData.orderId,
          worker_id: reviewData.workerId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        },
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, review: data as Review };
  } catch (error) {
    return { success: false, error: "Failed to create review" };
  }
}

export async function getWorkerReviews(workerId: string): Promise<Review[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("*, customers:customer_id(first_name, last_name)")
      .eq("worker_id", workerId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as Review[];
  } catch (error) {
    return [];
  }
}

export async function getWorkerRating(
  workerId: string
): Promise<WorkerRating | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("worker_id", workerId);

    if (error || !data || data.length === 0) {
      return {
        workerId,
        averageRating: 0,
        totalReviews: 0,
      };
    }

    const totalRating = data.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / data.length;

    return {
      workerId,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: data.length,
    };
  } catch (error) {
    return null;
  }
}

export async function canUserReview(
  orderId: string,
  customerId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Check if order is completed and belongs to customer
    const { data: order } = await supabase
      .from("orders")
      .select("status, customer_id")
      .eq("id", orderId)
      .single();

    if (!order || order.customer_id !== customerId || order.status !== "completed") {
      return false;
    }

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("order_id", orderId)
      .eq("customer_id", customerId)
      .single();

    return !existingReview;
  } catch (error) {
    return false;
  }
}

