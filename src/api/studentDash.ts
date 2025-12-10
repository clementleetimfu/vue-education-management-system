import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface StudentCountByClazzResponse {
  clazzNameList: string[];
  studentCountList: number[];
}

export interface StudentEduLevelCountResponse {
  educationLevel: string;
  count: number;
}

export const findStudentCountByClazz = (): Promise<ApiResponse<StudentCountByClazzResponse>> => request.get('/students/clazz/count');

export const findStudentEduLevelCount = (): Promise<ApiResponse<StudentEduLevelCountResponse[]>> => request.get('/students/edu-level/count');