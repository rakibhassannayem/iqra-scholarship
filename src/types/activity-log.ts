export type ActivityLog = {
  id: number;
  userId: number | null;
  userName: string | null;
  userEmail: string | null;
  action: string;
  module: string;
  recordId: number | null;
  description: string;
  previousData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  createdAt: string;
};

export type ActivityPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ActivitySummaryData = {
  total: number;
  create: number;
  update: number;
  delete: number;
};

export type ActivityFilters = {
  search: string;
  action: string;
  module: string;
  startDate: string;
  endDate: string;
};

export type CreateActivityLogInput = {
  userId?: number | null;
  action: string;
  module: string;
  recordId?: number | null;
  description: string;
  previousData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
};
