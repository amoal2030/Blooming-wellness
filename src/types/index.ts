export interface PartnerLogo {
  id: string;
  name: string;
  imageUrl: string;
}

export interface InitiativeSettings {
  id?: string;
  initiativeName: string;
  tagline: string;
  aboutText: string;
  visionText: string;
  missionText: string;
  goals: string[];
  logoUrl: string;
  partnerLogos: PartnerLogo[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  heroImageUrl?: string;
  updatedAt?: string;
}

export interface Broadcast {
  id: string;
  title: string;
  description: string;
  date: string;
  topic: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  createdAt: string;
  createdBy?: string;
}

export interface Lecture {
  id: string;
  title: string;
  description: string;
  speaker: string;
  videoUrl?: string;
  imageUrl?: string;
  date: string;
  duration?: string;
  topic: string;
  createdAt: string;
  createdBy?: string;
}

export interface Interview {
  id: string;
  title: string;
  guestName: string;
  guestTitle: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  date: string;
  topic: string;
  createdAt: string;
  createdBy?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuizQuestion[];
  imageUrl?: string;
  createdAt: string;
  createdBy?: string;
}

export interface QuizResponse {
  id?: string;
  quizId: string;
  quizTitle: string;
  respondentName?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: number[];
  submittedAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  imageUrl?: string;
  isFeatured: boolean;
  createdAt: string;
  createdBy?: string;
}

export interface RegistrationItem {
  id: string;
  title: string;
  description: string;
  externalUrl: string;
  deadline: string;
  status: 'open' | 'closed';
  imageUrl?: string;
  createdAt: string;
  createdBy?: string;
}

export interface SupervisorPermissions {
  broadcasts: boolean;
  lectures: boolean;
  interviews: boolean;
  quizzes: boolean;
  events: boolean;
  registrations: boolean;
  settings: boolean;
  supervisors: boolean;
}

export interface Supervisor {
  id: string; // uid or email
  email: string;
  name: string;
  role: 'admin' | 'editor';
  permissions: SupervisorPermissions;
  createdAt: string;
  createdBy?: string;
}

export interface Inquiry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'replied';
}

export type ActiveTab = 
  | 'home' 
  | 'broadcasts' 
  | 'lectures' 
  | 'interviews' 
  | 'quizzes' 
  | 'events' 
  | 'registrations' 
  | 'contact' 
  | 'admin';
