export type Student = {
  id: number;
  studentId: string;
  name: string;
  fatherName?: string | null;
  motherName?: string | null;
  class: number;
  roll: number;
  institutionId: number;
  institutionName: string;
  institutionEiin?: string;
  scholarshipId?: number | null;
  scholarshipName?: string | null;
  createdAt: string;
};

export type StudentFormValues = {
  name: string;
  fatherName?: string;
  motherName?: string;
  institutionId: number;
  scholarshipId?: number;
  class: number;
  roll: number;
};

export type StudentFormInitialValues = {
  name: string;
  fatherName?: string | null;
  motherName?: string | null;
  institutionId: number;
  scholarshipId?: number | null;
  class: number;
  roll: number;
};

export type StudentSummary = {
  id: number;
  studentId: string;
  name: string;
  fatherName?: string | null;
  motherName?: string | null;
  class: number;
  roll: number;
  institutionId: number;
  institutionName: string;
  scholarshipId?: number;
  scholarshipName?: string;
  status?: string;
  paymentStatus?: string;
};
