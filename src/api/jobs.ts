import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface JobTitleFindAllResponse {
  name: string;
  id: number;
}

export const findAllJobTitle = (): Promise<ApiResponse<JobTitleFindAllResponse[]>> => request.get('/jobs');