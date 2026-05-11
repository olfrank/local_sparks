import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function isValidUKMobile(number: string): boolean {
  const cleaned = number.replace(/[\s\-().]/g, '');
  return /^07\d{9}$/.test(cleaned) || /^\+447\d{9}$/.test(cleaned);
}

export function normaliseToE164(number: string): string {
  const cleaned = number.replace(/[\s\-().]/g, '');
  if (cleaned.startsWith('07')) return '+44' + cleaned.slice(1);
  if (cleaned.startsWith('+44')) return cleaned;
  return cleaned;
}
