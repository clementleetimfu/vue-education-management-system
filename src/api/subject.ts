import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface SubjectFindAllResponse {
  name: string;
  id: number;
}

export const findAllSubject = (): Promise<ApiResponse<SubjectFindAllResponse[]>> => request.get('/subjects');