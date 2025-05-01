import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LINKEDIN_PROFILE_REGEX =
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[^/]+\/?$/i;
