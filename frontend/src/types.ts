export interface WorkExperience {
  title?: string;
  company?: string;
  dateRange?: string;
  description?: string;
  location?: string;
}

export interface Education {
  degree?: string;
  school?: string;
  dateRange?: string;
  description?: string;
}

export interface ScrapeData {
  name?: string;
  photoUrl?: string;
  workExperience: WorkExperience[];
  education: Education[];
}
