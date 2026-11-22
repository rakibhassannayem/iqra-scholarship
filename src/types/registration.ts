export type Registration = {
  id: number;
  studentDbId: number;
  studentId: string;
  studentName: string;
  fatherName?: string | null;
  motherName?: string | null;
  studentClass: number;
  studentRoll: number;
  institutionId?: number;
  institutionName: string;
  scholarshipId: number;
  scholarshipName: string;
  registrationFee: number;
  status: string;
  paymentStatus: string;
  registeredAt: string;
};

export type DirectRegisterFormData = {
  institutionId: number;
  scholarshipId?: number;
  name: string;
  fatherName?: string;
  motherName?: string;
  class: number;
  roll: number;
};

export type { AdmitCardData } from "./admit-card";
