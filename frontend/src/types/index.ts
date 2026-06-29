export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  active: boolean;
  emailVerified: boolean;
  profilePictureUrl: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface Institute {
  id: number;
  instituteName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  phone: string;
  establishedYear: number;
  affiliation: string;
  instituteType: string;
  logoUrl: string;
  verified: boolean;
  userId: number;
  userEmail: string;
  createdAt: string;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  subject: string;
  minExperienceYears: number;
  maxExperienceYears: number;
  qualificationRequired: string;
  employmentType: string;
  positionsAvailable: number;
  applicationDeadline: string;
  status: string;
  remote: boolean;
  instituteId: number;
  instituteName: string;
  recruiterId: number;
  recruiterName: string;
  applicationCount: number;
  createdAt: string;
  publishedAt: string;
}

export interface CandidateProfile {
  id: number;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  highestQualification: string;
  specialization: string;
  totalExperienceYears: number;
  skills: string;
  bio: string;
  currentEmployer: string;
  currentPosition: string;
  preferredSubjects: string;
  preferredLocations: string;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  openToRelocate: boolean;
  resumeUrl: string;
  profilePictureUrl: string;
  userId: number;
  userEmail: string;
  username: string;
  createdAt: string;
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  instituteName: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  status: string;
  coverLetter: string;
  resumeUrl: string;
  additionalDocumentsUrl: string;
  recruiterNotes: string;
  feedback: string;
  currentStage: string;
  appliedAt: string;
  updatedAt: string;
}

export interface Resume {
  id: number;
  title: string;
  professionalSummary: string;
  education: string;
  experience: string;
  certifications: string;
  achievements: string;
  publications: string;
  projects: string;
  languages: string;
  referencesInfo: string;
  templateId: string;
  primary: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface HiringStage {
  id: number;
  stageName: string;
  stageOrder: number;
  description: string;
  active: boolean;
  jobId: number;
  candidateCount: number;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  closedJobs: number;
  draftJobs: number;
  appliedCount: number;
  shortlistedCount: number;
  interviewedCount: number;
  selectedCount: number;
  rejectedCount: number;
  hiredCount: number;
  totalInstitutes: number;
  totalRecruiters: number;
  totalCandidates: number;
  verifiedInstitutes: number;
  instituteJobs: number;
  assignedJobs: number;
  reviewedApplications: number;
  myApplications: number;
  lastWeekApplications: number;
  lastWeekJobs: number;
  applicationStatusDistribution: Record<string, number>;
  jobStatusDistribution: Record<string, number>;
  monthlyApplications: Record<string, number>;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  statusCode: number;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface GoogleLoginRequest {
  credential: string;
  role?: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  roles: string[];
  // Institute fields
  instituteName?: string;
  instituteType?: string;
  instituteAddress?: string;
  instituteCity?: string;
  instituteState?: string;
  institutePincode?: string;
  instituteWebsite?: string;
  establishedYear?: number;
  affiliation?: string;
}

export interface JobRequest {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  subject?: string;
  minExperienceYears?: number;
  maxExperienceYears?: number;
  qualificationRequired?: string;
  employmentType?: string;
  positionsAvailable?: number;
  applicationDeadline?: string;
  status?: string;
  remote?: boolean;
  recruiterId?: number;
}

export interface ApplicationRequest {
  jobId: number;
  coverLetter?: string;
  resumeUrl?: string;
  additionalDocumentsUrl?: string;
}

export interface ProfileUpdateRequest {
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  highestQualification?: string;
  specialization?: string;
  totalExperienceYears?: number;
  skills?: string;
  bio?: string;
  currentEmployer?: string;
  currentPosition?: string;
  preferredSubjects?: string;
  preferredLocations?: string;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  openToRelocate?: boolean;
}

export interface ResumeRequest {
  title?: string;
  professionalSummary?: string;
  education?: string;
  experience?: string;
  certifications?: string;
  achievements?: string;
  publications?: string;
  projects?: string;
  languages?: string;
  referencesInfo?: string;
  templateId?: string;
  primary?: boolean;
}
