# Vue Education Management System

![Vue](https://img.shields.io/badge/Vue-3.5.25-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.0-3178C6?style=flat&logo=typescript&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element_Plus-2.11.9-409EFF?style=flat&logo=element&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

A modern Vue 3 + TypeScript application for managing educational institution data with role-based access control, analytics dashboards

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Table of Contents](#2-table-of-contents)
3. [Demo & Screenshots](#3-demo--screenshots)
4. [Tech Stack](#4-tech-stack)
5. [Key Features and User Roles](#5-key-features-and-user-roles)
6. [Authentication and Authorization](#6-authentication-and-authorization)
7. [Technical Architecture](#7-technical-architecture)
8. [API and Backend Integration](#8-api-and-backend-integration)
9. [Project Structure](#9-project-structure)
10. [Quick Start](#10-quick-start)
11. [Build and Deployment](#11-build-and-deployment)
12. [Troubleshooting](#12-troubleshooting)
13. [Contributing](#13-contributing)
14. [License](#14-license)

---

## Project Overview

The Vue Education Management System is a frontend application for administering departments, employees, classes, and students. It features role-based access control, analytics dashboards with ECharts visualizations, and a modern UI built with Element Plus.

### Key Highlights

- **Vue 3 Composition API** - All components use `<script setup>` syntax
- **TypeScript** - Full type safety across the application
- **Pinia** - State management with session persistence
- **Element Plus** - Comprehensive UI component library
- **ECharts** - Interactive data visualizations
- **JWT Authentication** - Secure token-based auth with role-based access

**Backend Repository:** [Java Education Management System](https://github.com/clementleetimfu/java-education-management-system)

## Demo & Screenshots

**Video Demo:** [YouTube Video](https://youtu.be/uLk7wINbTYo)

### Login

| Light Mode | Dark Mode |
|------------|-----------|
| ![Login Light](./screenshots/login_light.png) | ![Login Dark](./screenshots/login_dark.png) |

### Employee Dashboard

| Light Mode | Dark Mode |
|------------|-----------|
| ![Employee Dashboard Light](./screenshots/employee_dashboard_light.png) | ![Employee Dashboard Dark](./screenshots/employee_dashboard_dark.png) |

### Student Dashboard

| Light Mode | Dark Mode |
|------------|-----------|
| ![Student Dashboard Light](./screenshots/student_dashboard_light.png) | ![Student Dashboard Dark](./screenshots/student_dashboard_dark.png) |

### Employee Management

| Light Mode | Dark Mode |
|------------|-----------|
| ![Employee Light](./screenshots/employee_light.png) | ![Employee Dark](./screenshots/employee_dark.png) |

### Student Management

| Light Mode | Dark Mode |
|------------|-----------|
| ![Student Light](./screenshots/student_light.png) | ![Student Dark](./screenshots/student_dark.png) |

### Department Management

| Light Mode | Dark Mode |
|------------|-----------|
| ![Department Light](./screenshots/department_light.png) | ![Department Dark](./screenshots/department_dark.png) |

### Class Management

| Light Mode | Dark Mode |
|------------|-----------|
| ![Class Light](./screenshots/class_light.png) | ![Class Dark](./screenshots/class_dark.png) |

### Activity Logs

| Light Mode | Dark Mode |
|------------|-----------|
| ![Log Light](./screenshots/log_light.png) | ![Log Dark](./screenshots/log_dark.png) |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Vue](https://vuejs.org/) | ^3.5.25 | Progressive JavaScript framework |
| [TypeScript](https://www.typescriptlang.org/) | ~5.9.0 | Type-safe JavaScript |
| [Vite](https://vitejs.dev/) | ^7.2.4 | Build tool and dev server |
| [Vue Router](https://router.vuejs.org/) | ^4.6.3 | Official routing library |
| [Pinia](https://pinia.vuejs.org/) | ^3.0.4 | State management |
| [pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate) | ^4.7.1 | State persistence |
| [Element Plus](https://element-plus.org/) | ^2.11.9 | Vue 3 UI framework |
| [Element Plus Icons](https://element-plus.org/en-US/component/icon.html) | ^2.3.2 | Icon set for Element Plus |
| [Axios](https://axios-http.com/) | ^1.13.2 | HTTP client |
| [ECharts](https://echarts.apache.org/) | ^6.0.0 | Data visualization |

---

## Key Features and User Roles

### Features

| Feature | Description |
|---------|-------------|
| **Authentication** | JWT-based login with first-time password reset (min 10 chars) |
| **Dark/Light Theme** | Toggle between dark and light modes with localStorage persistence |
| **Employee Management** | Full CRUD with work experience tracking and search |
| **Student Management** | Complete student records with education levels and class assignment |
| **Department Management** | Organizational structure management |
| **Class Management** | Class scheduling with teacher and subject assignment |
| **Employee Dashboard** | Analytics charts for job title and gender distribution |
| **Student Dashboard** | Analytics charts for class and education level distribution |
| **Activity Logs** | Admin-only access to system activity logs with pagination |

### User Roles

| Role | Permissions |
|------|------------|
| **ROLE_ADMIN** | Full access to all features including activity logs |
| **ROLE_EMPLOYEE** | Access to dashboards, department, employee, class, and student management |

---

## Authentication and Authorization

### Login Flow

```
User enters credentials
        │
        ▼
  POST /auth/login
        │
        ▼
┌───────────────┐     ┌─────────────────────┐
│ isFirstLogged │────▶│ Set new password    │
│ = false      │     │ (min 10 chars)      │
└───────────────┘     └─────────────────────┘
        │
        ▼ true
  Store JWT token in sessionStorage
        │
        ▼
  Parse JWT for username & role
        │
        ▼
  Redirect to dashboard
```

### Password Validation

```typescript
const rules = reactive({
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 10, message: 'Password length at least 10 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Confirm password is required', trigger: 'blur' },
    {
      validator: async (_: any, value: string) => {
        if (value !== dialogFormInput.password) {
          throw new Error('Passwords do not match')
        }
      },
      trigger: 'change'
    }
  ]
})
```

### Route Guards

The router implements navigation guards:

```typescript
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
### Route Table

> **Note:** Routes from `/dash-emp` through `/log` are nested as children of the `/` Layout route. The Layout component provides the sidebar and navigation wrapper.

| Path | Component | Auth Required | Admin Required |
|------|-----------|---------------|----------------|
| `/` | Layout (redirects to `/dash-emp`) | No | No |
| `/login` | Login | No | No |
| `/dash-emp` | Employee Dashboard | Yes | No |
| `/dash-student` | Student Dashboard | Yes | No |
| `/dept` | Department | Yes | No |
| `/emp` | Employee | Yes | No |
| `/clazz` | Class | Yes | No |
| `/stud` | Student | Yes | No |
| `/log` | Activity Log | Yes | Yes |


## Technical Architecture

### State Management (Pinia)

**Employee Store:** `src/stores/emp.ts`
```typescript
export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    id: null as number | null,
    username: '' as string,
    roleName: '' as string,
  }),
  actions: {
    setUsername(name: string) { this.username = name },
    setId(id: number | null) { this.id = id },
    setRoleName(roleName: string) { this.roleName = roleName },
  },
  persist: { storage: sessionStorage },
})
```

**Theme Store:** `src/stores/theme.ts`
```typescript
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(false);

  const initTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      isDark.value = saved === 'dark';
    } else {
      isDark.value = false;
    }
    applyTheme();
  };

  const applyTheme = () => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(isDark.value ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    applyTheme();
  };

  watch(isDark, applyTheme);

  return {
    isDark,
    initTheme,
    toggleTheme,
  };
});
```

### Error Handling

All async functions use try-catch with ElMessage feedback:

```typescript
const handleSubmit = async (): Promise<void> => {
  try {
    const result = await apiCall(data)
    if (result?.code === 0 && result?.data) {
      ElMessage.success('Operation successful')
    } else {
      ElMessage.error(result?.message || 'Operation failed')
    }
  } catch (error: any) {
    ElMessage.error('An unexpected error occurred')
  }
}
```

### Common Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `0` | Success | Process data |
| `1` | Business error | Show message |
| `401` | Unauthorized | Redirect to login |
| `403` | Forbidden | Show access denied |
| `500` | Server error | Show generic error |

---

## API

### HTTP Client Configuration

**Location:** `src/utils/request.ts`

- **Base URL:** `/api` (proxied to `http://localhost:8080` in dev)
- **Timeout:** 10000ms
- **Request Interceptor:** Automatically adds Bearer token
- **Response Interceptor:** Handles 401 errors with redirect to login

```typescript
// Request Interceptor - Adds JWT token
request.interceptors.request.use(
  (config) => {
    config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor - Handles errors
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      router.push('/login')
      ElMessage.error('Session expired. Please login again')
    }
    return Promise.reject(error)
  }
)
```

### Response Format

```typescript
interface ApiResponse<T> {
  code: number        // 0 = success, 1 = error
  message: string     // Response message
  data: T            // Response data
}

interface PageResult<T> {
  total: number
  rows: T[]
}
```

### API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /auth/login`, `POST /auth/update-password`, `POST /auth/logout` |
| **Employees** | `GET /emps/search`, `GET /emps/{id}`, `POST /emps`, `PUT /emps`, `DELETE /emps`, `GET /emps/teachers` |
| **Students** | `GET /students/search`, `GET /students/{id}`, `POST /students`, `PUT /students`, `DELETE /students` |
| **Departments** | `GET /depts`, `POST /depts`, `PUT /depts`, `DELETE /depts/{id}` |
| **Classes** | `GET /clazz/search`, `GET /clazz`, `GET /clazz/{id}`, `POST /clazz`, `PUT /clazz`, `DELETE /clazz/{id}` |
| **Dashboard** | `GET /emps/jobTitle/count`, `GET /emps/gender/count`, `GET /students/clazz/count`, `GET /students/edu-level/count` |
| **Logs** | `GET /logs` |
| **Reference** | `GET /edu-levels`, `GET /jobs`, `GET /subjects` |

---

## Project Structure

```
vue-education-management-system/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/              # API service layer (auth, emp, student, dept, clazz, etc.)
│   ├── assets/           # CSS, images
│   ├── components/       # Reusable components (ThemeToggle)
│   ├── constants/        # Constants (role enum)
│   ├── router/           # Route configuration & guards
│   ├── stores/           # Pinia stores (emp, theme)
│   ├── utils/            # Utilities (request, permission, chartTheme)
│   ├── views/            # Page components
│   │   ├── clazz/        # Class management
│   │   ├── dashboard/    # Dashboards
│   │   ├── department/   # Department management
│   │   ├── employee/     # Employee management
│   │   ├── layout/       # Main layout with sidebar
│   │   ├── log/          # Activity logs
│   │   ├── login/        # Login page
│   │   └── student/      # Student management
│   ├── App.vue
│   └── main.ts
├── .vscode/
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Quick Start

### Prerequisites

- **Node.js:** `^20.19.0` or `>=22.12.0`
- **Backend API:** Running at `http://localhost:8080`

### Installation

```bash
git clone <repository-url>
cd vue-education-management-system
npm install
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (http://localhost:5173) |
| `npm run build` | Type check and build for production |
| `npm run build-only` | Build only (skip type-check) |
| `npm run preview` | Preview production build |
| `npm run type-check` | Run vue-tsc type checking |

---

## Build and Deployment

### Build Configuration

**Location:** `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### Production Build

```bash
npm run build
```

Output: `dist/` directory with static files

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **CORS errors** | Ensure backend runs on localhost:8080 |
| **401 after login** | Clear sessionStorage and re-login |
| **Theme not persisting** | Check localStorage theme key |
| **TypeScript errors** | Run `npm run type-check` |
| **Port 5173 in use** | Stop other processes or change port |

### Debugging Tips

- **Vue DevTools** - Component inspection
- **Network Tab** - Debug API calls
- **Console** - Check runtime errors

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/xxx`
3. Install dependencies: `npm install`
4. Run development: `npm run dev`
5. Type-check before committing: `npm run type-check`
6. Submit pull request

### Code Standards

- Use Composition API with `<script setup lang="ts">`
- Define TypeScript interfaces for all data models
- Use try-catch for async operations
- Follow naming conventions (camelCase, PascalCase)

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
