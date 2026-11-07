export type PrizeItem = {
  id: number;
  grantId: number;
  studentDbId: number;
  studentId: string;
  studentName: string;
  class: number;
  roll: number;
  institutionId: number;
  institutionName: string;
  institutionEiin: string;
  scholarshipId: number;
  scholarshipName: string;
  categoryId: number;
  categoryName: string;
  grantStatus: "granted" | "revoked";
  prizeStatus: "pending" | "received";
  prizeReceivedAt: string | null;
  confirmedBy: string | null;
  prizeNotes: string | null;
  grantedAt: string;
  createdAt: string;
};

