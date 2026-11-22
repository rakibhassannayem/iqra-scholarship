export type CertificateData = {
  studentDbId: number;
  studentId: string;
  studentName: string;
  fatherName?: string | null;
  motherName?: string | null;
  className: string;
  roll: number | string;
  examCenter: string;
  scholarshipName: string;
  academicYear: string;
  institutionName: string;
  institutionAddress?: string | null;
  categoryName: string;
  marks?: number | null;
  issueDate?: string;
};

export type CertificateFilterParams = {
  scholarshipId?: string;
  institutionId?: string;
  class?: string;
  categoryId?: string;
  search?: string;
};
