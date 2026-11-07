export type Notice = {
  id: number;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
};

export type NoticeFormValues = {
  title: string;
  content: string;
  isPublished: boolean;
};
