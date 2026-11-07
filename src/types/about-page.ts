export type AboutPageItem = {
  id: number;
  title: string;
  slug: string;
  content: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AboutPageFormValues = {
  title: string;
  slug: string;
  content: string;
  order: number;
  isPublished: boolean;
};

export type SubPage = {
  id: number;
  title: string;
  slug: string;
  order?: number;
};

