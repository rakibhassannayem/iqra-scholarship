export type Student = {
  id: number;
  studentId: string;
  name: string;
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
  institutionId: number;
  scholarshipId?: number;
  class: number;
  roll: number;
};

export type StudentFormInitialValues = {
  name: string;
  institutionId: number;
  scholarshipId?: number | null;
  class: number;
  roll: number;
};

export type StudentSummary = {
  id: number;
  studentId: string;
  name: string;
  class: number;
  roll: number;
  institutionId: number;
  institutionName: string;
  scholarshipId?: number;
  scholarshipName?: string;
  status?: string;
  paymentStatus?: string;
};
