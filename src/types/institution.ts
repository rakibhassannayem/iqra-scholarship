export type Institution = {
  id: number;
  name: string;
  eiin: string;
  principal?: string | null;
  principalPhone?: string | null;
  representative?: string | null;
  representativePhone?: string | null;
  division?: string | null;
  district?: string | null;
  upazila?: string | null;
  village?: string | null;
  block?: string | null;
  address?: string | null;
  createdAt?: string;
};

export type InstitutionFormValues = {
  name: string;
  eiin: string;
  principal: string;
  principalPhone: string;
  representative: string;
  representativePhone: string;
  division: string;
  district: string;
  upazila: string;
  village: string;
  block: string;
  address: string;
};
