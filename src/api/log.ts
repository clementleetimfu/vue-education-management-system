import request from '@/utils/request';
import type { ApiResponse, PageResult } from './common';

export interface FindActivityLogResponse {
  operator: string;
  operateTime: string;
  className: string;
  methodName: string;
  duration: number;
  methodParams: string;
  returnValue: string;
}

export interface Page {
  page: number;
  pageSize: number;
}

export const findActivityLog = (page: Page): Promise<ApiResponse<PageResult<FindActivityLogResponse>>> => request.get('/logs', { params: page });