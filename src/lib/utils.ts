import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dateObj);
}

export function formatPhoneNumber(phone: string): string {
  // Format phone number: +998901234567 -> +998 (90) 123-45-67
  if (!phone) return "";
  
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.length === 12 && cleaned.startsWith("998")) {
    return `+${cleaned.slice(0, 3)} (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
  }
  
  return phone;
}

export function getInitials(firstName: string, lastName?: string): string {
  if (!firstName) return "?";
  
  if (lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  
  return firstName.slice(0, 2).toUpperCase();
}

