// User Types
export interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string; // ISO date string
  profileImage?: string;
  role: 'customer' | 'worker';
  city?: string;
  preferredLanguage?: 'ru' | 'uz';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Worker fields
  workerType?: 'daily_worker' | 'professional' | 'job_seeker';
  aboutMe?: string;
  specializations?: Specialization[];
  workPhotos?: string[];
  profileViewsCount?: number;
  // Job seeker fields
  education?: Education[];
  skills?: string[];
  workExperience?: WorkExperience[];
  willingToRelocate?: boolean;
  desiredSalary?: number;
}

// Education Types
export interface Education {
  institution: string;
  degree?: string;
  yearStart?: string;
  yearEnd?: string;
}

// Work Experience Types
export interface WorkExperience {
  company: string;
  position: string;
  yearStart?: string;
  yearEnd?: string;
  description?: string;
}

// Specialization Types
export interface Specialization {
  id: string;
  name: string;
  isPrimary: boolean;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token?: string;
}

export interface LoginRequest {
  phone: string;
}

export interface VerifyCodeRequest {
  phone: string;
  code: string;
}

export interface RegisterRequest {
  phone: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  birthDate: string;
  profileImage?: string;
  role: 'customer' | 'worker';
  city?: string;
  workerType?: 'daily_worker' | 'professional' | 'job_seeker';
  aboutMe?: string;
  specializations?: Specialization[];
  workPhotos?: string[];
  education?: Education[];
  skills?: string[];
  workExperience?: WorkExperience[];
  willingToRelocate?: boolean;
  desiredSalary?: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  requiresVerification?: boolean;
  requiresProfileInfo?: boolean;
  phone?: string;
}

// Order Types
export type OrderType = 'daily' | 'vacancy';
export type OrderStatus = 'new' | 'response_received' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';

export interface Order {
  id: string;
  type: OrderType;
  title: string;
  description: string;
  category?: string;
  specializationId?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  budget: number;
  workersNeeded: number;
  serviceDate: string;
  photos?: string[];
  status: OrderStatus;
  customerId: string;
  customerCity?: string;
  applicantsCount: number;
  pendingApplicantsCount?: number;
  viewsCount?: number;
  transportPaid?: boolean;
  mealIncluded?: boolean;
  mealPaid?: boolean;
  // Vacancy fields
  jobTitle?: string;
  experienceLevel?: string;
  employmentType?: string;
  workFormat?: string;
  workSchedule?: string;
  city?: string;
  salaryFrom?: number;
  salaryTo?: number;
  salaryPeriod?: string;
  salaryType?: string;
  paymentFrequency?: string;
  skills?: string[];
  languages?: string[];
  // Additional vacancy details
  companyName?: string;
  companyDescription?: string;
  benefits?: string[];
  requirements?: string[];
  responsibilities?: string[];
  // Additional order details
  customerName?: string;
  customerPhone?: string;
  workDetails?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  type: OrderType;
  title: string;
  description: string;
  category?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  budget: number;
  workersNeeded: number;
  serviceDate: string;
  photos?: string[];
  transportPaid?: boolean;
  mealIncluded?: boolean;
  mealPaid?: boolean;
  specializationId?: string;
  jobTitle?: string;
  experienceLevel?: string;
  employmentType?: string;
  workFormat?: string;
  workSchedule?: string;
  city?: string;
  salaryFrom?: number;
  salaryTo?: number;
  salaryPeriod?: string;
  salaryType?: string;
  paymentFrequency?: string;
  skills?: string[];
  languages?: string[];
}

export interface CreateOrderResponse {
  success: boolean;
  data?: Order;
  error?: string;
}

export interface UpdateOrderRequest {
  orderId: string;
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  budget?: number;
  workersNeeded?: number;
  photos?: string[];
  transportPaid?: boolean;
  mealIncluded?: boolean;
  mealPaid?: boolean;
}

export interface UpdateOrderResponse {
  success: boolean;
  data?: Order;
  error?: string;
}

export interface CancelOrderResponse {
  success: boolean;
  error?: string;
}

// Applicant Types
export interface Applicant {
  id: string;
  orderId: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  rating: number | null;
  completedJobs: number;
  avatar?: string;
  message?: string;
  proposedPrice: number;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  isAvailable?: boolean;
}

export interface CreateApplicantRequest {
  orderId: string;
  workerId: string;
  message?: string;
  proposedPrice?: number;
}

// Worker Application Types
export interface WorkerApplication {
  id: string;
  orderId: string;
  orderTitle: string;
  orderCategory: string;
  orderDescription: string;
  orderLocation: string;
  orderLatitude?: number;
  orderLongitude?: number;
  orderBudget: number;
  orderServiceDate: string;
  orderStatus: OrderStatus;
  orderType?: OrderType;
  customerName: string;
  customerPhone: string;
  rating?: number;
  completedJobs?: number;
  message?: string;
  proposedPrice?: number;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
}

// Vacancy Application Types
export type VacancyApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface VacancyApplication {
  id: string;
  vacancyId: string;
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  applicantAvatar?: string;
  applicantRating?: number;
  applicantCompletedJobs?: number;
  coverLetter?: string;
  status: VacancyApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  applicantEducation?: Education[];
  applicantSkills?: string[];
  applicantWorkExperience?: WorkExperience[];
  applicantWillingToRelocate?: boolean;
  applicantDesiredSalary?: number;
}

export interface CreateVacancyApplicationRequest {
  vacancyId: string;
  coverLetter?: string;
}

export interface CreateVacancyRequest {
  jobTitle: string;
  description: string;
  specializationId: string;
  location: string;
  latitude?: number;
  longitude?: number;
  city: string;
  experienceLevel: string;
  employmentType: string;
  workFormat: string;
  workSchedule: string;
  salaryFrom?: number;
  salaryTo?: number;
  salaryPeriod: string;
  salaryType: string;
  paymentFrequency: string;
  skills: string[];
  languages: string[];
}

export interface UpdateVacancyApplicationStatusRequest {
  applicationId: string;
  status: VacancyApplicationStatus;
}

// Review Types
export interface Review {
  id: string;
  orderId: string;
  workerId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
  orderTitle?: string;
}

export interface CreateReviewRequest {
  orderId: string;
  workerId: string;
  rating: number;
  comment?: string;
}

export interface WorkerRating {
  workerId: string;
  averageRating: number;
  totalReviews: number;
}

export interface WorkerProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileImage?: string;
  averageRating: number;
  totalReviews: number;
  completedJobs: number;
  joinedAt: string;
  reviews: Review[];
  workerType?: 'daily_worker' | 'professional' | 'job_seeker';
  city?: string;
  specialization?: string;
  aboutMe?: string;
  education?: Education[];
  skills?: string[];
  workExperience?: WorkExperience[];
  specializations?: { id: string; isPrimary: boolean }[];
  willingToRelocate?: boolean;
  desiredSalary?: number;
  workPhotos?: string[];
}

// City Types
export interface City {
  id: string;
  name: string;
  isAvailable: boolean;
}

export interface CitySelectionData {
  selectedCity: City;
}

