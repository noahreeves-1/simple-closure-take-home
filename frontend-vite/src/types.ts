interface WorkExperience {
  title?: string;
  company?: string;
  dateRange?: string;
  description?: string;
  location?: string;
}

interface Education {
  degree?: string;
  school?: string;
  dateRange?: string;
  description?: string;
}

export interface ProfileData {
  name?: string;
  photoUrl?: string;
  workExperience: WorkExperience[];
  education: Education[];
  linkedInUrl: string;
}
