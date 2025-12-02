import request from '@/utils/request';

export const findAllDepartment = () => request.get('/depts');
