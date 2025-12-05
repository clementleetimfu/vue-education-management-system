import request from '@/utils/request';
import type { ApiResponse, PageResult, Page } from './common';

export interface FindActivityLogResponse {
  operator: string;
  operateTime: string;
  className: string;
  methodName: string;
  duration: number;
  methodParams: string;
  returnValue: string;
}

export const findActivityLog = (page: Page): Promise<ApiResponse<PageResult<FindActivityLogResponse>>> => request.get('/logs', { params: page });