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
  };
};
