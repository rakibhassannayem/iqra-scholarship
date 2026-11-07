export type Grant = {
  id: number;
  studentDbId: number;
  studentId: string;
  studentName: string;
  studentClass?: number;
  studentRoll?: number;
  institutionName: string;
  institutionEiin?: string;
  scholarshipId: number;
  scholarshipName: string;
  academicYear?: string;
  categoryId: number;
  categoryName: string;
  status: string;
  prizeStatus: string;
  prizeReceivedAt?: string | null;
  confirmedBy?: string | null;
  prizeNotes?: string | null;
  grantedAt: string;
  createdAt: string;
};

export type GrantFormValues = {
  studentId: number;
  scholarshipId: number;
  categoryId: number;
};

