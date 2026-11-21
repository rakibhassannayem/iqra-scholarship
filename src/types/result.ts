export type ResultStatus = "awarded" | "not-awarded" | "not-registered";

export type StudentResult = {
  studentId: string;
  name: string;
  class: number;
  roll: number;
  institutionName?: string;
  scholarshipName?: string | null;
  result: {
    status: ResultStatus;
    category: string | null;
    marks?: number | null;
  };
};

export type AdminResultItem = {
  id?: number;
  studentDbId: number;
  studentId: string;
  name: string;
  class: number;
  roll: number;
  institutionId: number;
  institutionName: string;
  scholarshipId: number;
  scholarshipName: string;
  marks: number | null;
  categoryId: number | null;
  categoryName: string | null;
  status: "awarded" | "not-awarded" | "pending";
  updatedAt?: string | null;
};

export type ResultSaveInput = {
  studentId: number;
  scholarshipId: number;
  marks: number;
};

export type BulkResultSaveInput = {
  scholarshipId: number;
  entries: {
    studentId: number;
    marks: number;
  }[];
};
