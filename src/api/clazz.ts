import request from '@/utils/request';
import type { ApiResponse, PageResult } from './common';

export interface SearchClazzResponse {
  id: number;
  clazzName: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  updateTime: string;
}

export interface SearchClazzRequest {
  page: number;
  pageSize: number;
  name: string;
  startDate: string;
  endDate: string;
}

export interface AddClazzRequest {
  name: string;
  startDate: string;
  endDate: string;
  teacherId: number | null;
  subject: number | null;
}

export interface FindClazzByIdResponse {
  id: number | null;
  name: string;
  startDate: string;
  endDate: string;
  teacherId: number | null;
  subject: number | null;
}

interface UpdateClazzRequest extends AddClazzRequest {
  id: number | null;
}

export const searchClazz = (params: SearchClazzRequest): Promise<ApiResponse<PageResult<SearchClazzResponse>>> => request.get('/clazz/search', { params });

export const addClazz = (data: AddClazzRequest): Promise<ApiResponse<boolean>> => request.post('/clazz', data);

export const findClazzById = (id: number): Promise<ApiResponse<FindClazzByIdResponse>> => request.get(`/clazz/${id}`);

export const updateClazz = (data: UpdateClazzRequest): Promise<ApiResponse<boolean>> => request.put('clazz', data);

export const deleteClazz = (id: number): Promise<ApiResponse<boolean>> => request.delete(`/clazz/${id}`);