import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/login/Index.vue'
import EmpDashboard from '@/views/dashboard/EmpDashboard.vue'
import ClazzStudDashboard from '@/views/dashboard/ClazzStudDashboard.vue'
import DepartmentView from '@/views/department/Index.vue'
import EmployeeView from '@/views/employee/Index.vue'
import LogView from '@/views/log/Index.vue'
import StudentView from '@/views/student/Index.vue'
import ClazzView from '@/views/clazz/Index.vue'
import LayoutView from '@/views/layout/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      redirect: '/dash-emp',
      component: LayoutView,
      children: [
        {
          path: 'dash-emp',
          name: 'dash-emp',
          component: EmpDashboard,
        },
        {
          path: 'dash-clazz-stud',
          name: 'dash-clazz-stud',
          component: ClazzStudDashboard,
        },
        {
          path: 'dept',
          name: 'dept',
          component: DepartmentView,
        },
        {
          path: 'emp',
          name: 'emp',
          component: EmployeeView,
        },
        {
          path: 'clazz',
          name: 'clazz',
          component: ClazzView,
        },
        {
          path: 'stud',
          name: 'stud',
          component: StudentView,
        },
        {
          path: 'log',
          name: 'log',
          component: LogView,
        }
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    }
  ],
})

export default router