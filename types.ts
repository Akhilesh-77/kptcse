
export type FacultyCategory = 'HOD' | 'PERMANENT' | 'GUEST';

export interface Faculty {
  id: string;
  name: string;
  role: string;
  category: FacultyCategory;
  image?: string;
  description?: string;
  interests?: string[];
  subjects?: string[];
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  description: string;
  important: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'LINK' | 'DOC';
  url: string;
}

export interface Milestone {
  year: string;
  event: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
