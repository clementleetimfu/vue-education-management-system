export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
export interface PageResult<T> {
  total: number;
  rows: T[];
}

export interface Page {
  page: number;
  pageSize: number;
}