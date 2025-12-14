import { createClient } from "../supabase/server";

export async function uploadFile(
  file: File,
  bucket: string = "order-media"
): Promise<{ url: string | null; error?: string }> {
  try {
    const supabase = await createClient();

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${Date.now()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      return { url: null, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl };
  } catch (error) {
    return { url: null, error: "Failed to upload file" };
  }
}

export async function uploadMultipleFiles(
  files: File[],
  bucket: string = "order-media"
): Promise<{ urls: string[]; errors: string[] }> {
  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const result = await uploadFile(file, bucket);
    if (result.url) {
      urls.push(result.url);
    } else if (result.error) {
      errors.push(result.error);
    }
  }

  return { urls, errors };
}

export async function deleteFile(
  filePath: string,
  bucket: string = "order-media"
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete file" };
  }
}

