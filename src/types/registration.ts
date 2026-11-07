export type Registration = {
  id: number;
  studentDbId: number;
  studentId: string;
  studentName: string;
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
  scholarshipId: number;
  name: string;
  class: number;
  roll: number;
};

export type { AdmitCardData } from "./admit-card";
