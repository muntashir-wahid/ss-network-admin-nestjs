export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}
