export type Category = {
  id: number;
  name: string;
  description: string | null;
  minMarks: number | null;
  maxMarks: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ScholarshipCategory = Category;

export type CategoryFormValues = {
  name: string;
  description: string;
  minMarks: number | null;
  maxMarks: number | null;
};
