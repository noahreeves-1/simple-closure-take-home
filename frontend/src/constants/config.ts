export const API_CONFIG = {
  BASE_URL: "http://localhost:3001",
  ENDPOINTS: {
    SCRAPE: "/api/scrape",
  },
} as const;

export const LINKEDIN_PROFILE_REGEX =
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[^\/]+\/?$/i;

export const FILE_NAMES = {
  RESUME: (name: string) => `${name.replace(/\s+/g, "_")}_Resume.pdf`,
} as const;
