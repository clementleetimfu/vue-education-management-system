import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface EduLevelFindAllResponse {
  id: number;
  name: string;
}
export const findAllEduLevel = (): Promise<ApiResponse<EduLevelFindAllResponse[]>> => request.get('/edu-levels');
