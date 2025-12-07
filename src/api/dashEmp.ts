import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface EmpJobTitleCountResponse {
  jobTitleList: string[];
  jobTitleCountList: number[];
}

export interface EmpGenderCountResponse {
  gender: string;
  count: number;
}

export const findEmpJobTitleCount = (): Promise<ApiResponse<EmpJobTitleCountResponse>> => request.get('/emps/jobTitle/count');

export const findEmpGenderCount = (): Promise<ApiResponse<EmpGenderCountResponse[]>> => request.get('/emps/gender/count');