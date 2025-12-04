import axios from 'axios'
import type { AxiosInstance } from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const request: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response.status === 401) {
      router.push('/login')
      ElMessage.error('Session expired. Please login again')
    }
    return Promise.reject(error)
  }
)

request.interceptors.request.use(
  (config) => {
    config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request