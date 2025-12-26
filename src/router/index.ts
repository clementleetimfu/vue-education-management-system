import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/login/Index.vue'
import EmpDashboard from '@/views/dashboard/EmpDashboard.vue'
import StudentDashboard from '@/views/dashboard/StudentDashboard.vue'
import DepartmentView from '@/views/department/Index.vue'
import EmployeeView from '@/views/employee/Index.vue'
import LogView from '@/views/log/Index.vue'
import StudentView from '@/views/student/Index.vue'
import ClazzView from '@/views/clazz/Index.vue'
import LayoutView from '@/views/layout/Index.vue'
import { ref } from 'vue'
import { isDisabled } from '@/utils/permission'

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
          meta: { requiresAuth: true }
        },
        {
          path: 'dash-student',
          name: 'dash-student',
          component: StudentDashboard,
          meta: { requiresAuth: true }
        },
        {
          path: 'dept',
          name: 'dept',
          component: DepartmentView,
          meta: { requiresAuth: true }
        },
        {
          path: 'emp',
          name: 'emp',
          component: EmployeeView,
          meta: { requiresAuth: true }
        },
        {
          path: 'clazz',
          name: 'clazz',
          component: ClazzView,
          meta: { requiresAuth: true }
        },
        {
          path: 'stud',
          name: 'stud',
          component: StudentView,
          meta: { requiresAuth: true }
        },
        {
          path: 'log',
          name: 'log',
          component: LogView,
          meta: {
            requiresAuth: true,
            requiresAdmin: true,
          }
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

router.beforeEach((to, from, next) => {
  const disabledFlag = ref<boolean>(isDisabled());
  const isLoggedIn = !!sessionStorage.getItem('token')

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (to.meta.requiresAdmin && disabledFlag.value) {
    return next({ path: '/' });
  }
  
  next()
})

export default router