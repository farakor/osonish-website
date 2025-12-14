import { createClient } from "../supabase/server";
import type { User, RegisterRequest, AuthResponse } from "@/types";

export async function getUserSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user profile from database
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile as User | null;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const supabase = await createClient();

    // Create user in database
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          phone: data.phone,
          first_name: data.firstName,
          last_name: data.lastName,
          middle_name: data.middleName,
          birth_date: data.birthDate,
          profile_image: data.profileImage,
          role: data.role,
          city: data.city,
          worker_type: data.workerType,
          about_me: data.aboutMe,
          work_photos: data.workPhotos,
          education: data.education,
          skills: data.skills,
          work_experience: data.workExperience,
          willing_to_relocate: data.willingToRelocate,
          desired_salary: data.desiredSalary,
        },
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: user as unknown as User };
  } catch (error) {
    return { success: false, error: "Failed to register user" };
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update profile" };
  }
}

