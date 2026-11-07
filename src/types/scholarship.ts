export type Scholarship = {
  id: number;
  name: string;
  description: string;
  academicYear: string;
  endDate: string;
  eligibilityClass: number;
  registrationFee: number;
  isActive: boolean;
  examCenter: string | null;
  examDate: string | null;
  examTime: string | null;
  createdAt: string;
  updatedAt: string;
  examStartTime: string | null;
  examEndTime: string | null;
};

export type ScholarshipFormValues = {
  name: string;
  description: string;
  academicYear: string;
  endDate: string;
  eligibilityClass: number;
  registrationFee: number;
  examCenter: string;
  examDate: string;
  examTime: string;
  examStartTime: string;
  examEndTime: string;
};
