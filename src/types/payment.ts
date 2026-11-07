export type PaymentStudent = {
  registrationId: number;
  studentId: string;
  studentName: string;
  studentClass: number;
  studentRoll: number;
  amount: number;
};

export type PaymentSubmission = {
  id: number;
  institutionId: number;
  institutionName: string;
  scholarshipId: number;
  scholarshipName: string;
  totalAmount: number;
  paymentMethod: string;
  transactionId: string;
  screenshotUrl: string;
  status: "Pending" | "Approved" | "Rejected";
  adminNote: string | null;
  reviewedAt: string | null;
  submittedAt: string;
  students: PaymentStudent[];
};

