import { createClient } from "../supabase/server";
import type {
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
  Applicant,
} from "@/types";

export async function getOrders(filters?: {
  type?: "daily" | "vacancy";
  city?: string;
  specializationId?: string;
  status?: string;
  minBudget?: number;
  maxBudget?: number;
  customerId?: string;
  limit?: number;
  offset?: number;
}): Promise<{ orders: Order[]; total: number }> {
  try {
    const supabase = await createClient();

    let query = supabase.from("orders").select("*", { count: "exact" });

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }

    if (filters?.city) {
      query = query.eq("city", filters.city);
    }

    if (filters?.specializationId) {
      query = query.eq("specialization_id", filters.specializationId);
    }

    if (filters?.status) {
      query = query.eq("status", filters.status);
    } else {
      // By default, show only active orders
      query = query.in("status", ["new", "response_received", "in_progress"]);
    }

    if (filters?.minBudget) {
      query = query.gte("budget", filters.minBudget);
    }

    if (filters?.maxBudget) {
      query = query.lte("budget", filters.maxBudget);
    }

    if (filters?.customerId) {
      query = query.eq("customer_id", filters.customerId);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 20) - 1
      );
    }

    query = query.order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error || !data) {
      return { orders: [], total: 0 };
    }

    return { orders: data as Order[], total: count || 0 };
  } catch (error) {
    return { orders: [], total: 0 };
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !data) {
      return null;
    }

    // Increment views count
    await supabase.rpc("increment_order_views", { order_id: orderId });

    return data as Order;
  } catch (error) {
    return null;
  }
}

export async function createOrder(
  orderData: CreateOrderRequest
): Promise<CreateOrderResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          type: orderData.type,
          title: orderData.title,
          description: orderData.description,
          category: orderData.category,
          specialization_id: orderData.specializationId,
          location: orderData.location,
          latitude: orderData.latitude,
          longitude: orderData.longitude,
          budget: orderData.budget,
          workers_needed: orderData.workersNeeded,
          service_date: orderData.serviceDate,
          photos: orderData.photos,
          transport_paid: orderData.transportPaid,
          meal_included: orderData.mealIncluded,
          meal_paid: orderData.mealPaid,
          job_title: orderData.jobTitle,
          experience_level: orderData.experienceLevel,
          employment_type: orderData.employmentType,
          work_format: orderData.workFormat,
          work_schedule: orderData.workSchedule,
          city: orderData.city,
          salary_from: orderData.salaryFrom,
          salary_to: orderData.salaryTo,
          salary_period: orderData.salaryPeriod,
          salary_type: orderData.salaryType,
          payment_frequency: orderData.paymentFrequency,
          skills: orderData.skills,
          languages: orderData.languages,
          status: "new",
        },
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Order };
  } catch (error) {
    return { success: false, error: "Failed to create order" };
  }
}

export async function updateOrder(
  updateData: UpdateOrderRequest
): Promise<UpdateOrderResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", updateData.orderId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Order };
  } catch (error) {
    return { success: false, error: "Failed to update order" };
  }
}

export async function cancelOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to cancel order" };
  }
}

export async function getOrderApplicants(
  orderId: string
): Promise<Applicant[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("applicants")
      .select("*, workers:worker_id(*)")
      .eq("order_id", orderId)
      .order("applied_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as Applicant[];
  } catch (error) {
    return [];
  }
}

export async function acceptApplicant(
  applicantId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("applicants")
      .update({ status: "accepted" })
      .eq("id", applicantId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to accept applicant" };
  }
}

export async function rejectApplicant(
  applicantId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("applicants")
      .update({ status: "rejected" })
      .eq("id", applicantId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to reject applicant" };
  }
}

