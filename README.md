# Vue Education Management System

![Vue](https://img.shields.io/badge/Vue-3.5.25-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.0-3178C6?style=flat&logo=typescript&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element_Plus-2.11.9-409EFF?style=flat&logo=element&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite&logoColor=white)

A modern application built with Vue 3, TypeScript, and Element Plus for managing educational institution data.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Components](#components)
- [Styling](#styling)
- [Build & Deploy](#build--deploy)
- [Backend Integration](#backend-integration)

---

## Overview

The Vue Education Management System is a frontend application that provides a comprehensive interface for administering departments, employees, classes, and students. It features role-based access control, analytics dashboards with ECharts visualizations, and a modern UI built with Element Plus.

### Key Highlights

- **Vue 3 Composition API** - All components use `<script setup>` syntax
- **TypeScript** - Full type safety across the application
- **Pinia** - State management with session persistence
- **Element Plus** - Comprehensive UI component library
- **ECharts** - Interactive data visualizations
- **JWT Authentication** - Secure token-based auth with role-based access

---

## Features

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
| **Role-Based Access** | ROLE_ADMIN vs ROLE_EMPLOYEE permissions |

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

## Quick Start

### Prerequisites

- **Node.js:** `^20.19.0` or `>=22.12.0`
- **Backend API:** Running at `http://localhost:8080`

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd vue-education-management-system

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
vue-education-management-system/
├── public/                      # Static assets
│   └── favicon.ico
├── src/
│   ├── api/                     # API service layer
│   │   ├── auth.ts              # Authentication endpoints
│   │   ├── clazz.ts             # Class endpoints
│   │   ├── common.ts            # Shared TypeScript interfaces
│   │   ├── dept.ts              # Department endpoints
│   │   ├── eduLevel.ts          # Education level endpoints
│   │   ├── emp.ts               # Employee endpoints
│   │   ├── empDash.ts           # Employee dashboard endpoints
│   │   ├── jobs.ts              # Job title endpoints
│   │   ├── log.ts               # Activity log endpoints
│   │   ├── student.ts           # Student endpoints
│   │   ├── studentDash.ts       # Student dashboard endpoints
│   │   └── subject.ts           # Subject endpoints
│   ├── assets/                  # Assets
│   │   ├── login-background.jpg
│   │   └── main.css             # Global styles
│   ├── components/              # Reusable components
│   │   └── ThemeToggle.vue      # Dark/light theme toggle switch
│   ├── constants/               # Constants
│   │   └── role.ts              # Role enum (ROLE_ADMIN, ROLE_EMPLOYEE)
│   ├── router/                  # Router
│   │   └── index.ts             # Route configuration & guards
│   ├── stores/                  # Pinia stores
│   │   ├── emp.ts               # Employee state with persistence
│   │   └── theme.ts             # Theme state (dark/light mode)
│   ├── utils/                   # Utilities
│   │   ├── permission.ts        # Permission utilities (isDisabled)
│   │   ├── request.ts           # Axios instance with interceptors
│   │   └── chartTheme.ts        # ECharts theme configuration
│   ├── views/                   # Page components
│   │   ├── clazz/               # Class management
│   │   ├── dashboard/           # Dashboards (Emp/Student)
│   │   ├── department/          # Department management
│   │   ├── employee/            # Employee management
│   │   ├── layout/              # Main layout with sidebar
│   │   ├── log/                 # Activity logs (admin only)
│   │   ├── login/               # Login page
│   │   └── student/             # Student management
│   ├── App.vue                  # Root component
│   └── main.ts                  # Entry point
├── .vscode/                     # VSCode settings
├── dist/                        # Build output
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

---

## Routing

### Route Configuration

**Location:** `src/router/index.ts`

```typescript
const routes = [
  {
    path: '/',
    component: LayoutView,
    redirect: '/dash-emp',
    children: [
      { path: 'dash-emp', component: EmpDashboard },
      { path: 'dash-student', component: StudentDashboard },
      { path: 'dept', component: DepartmentView },
      { path: 'emp', component: EmployeeView },
      { path: 'clazz', component: ClazzView },
      { path: 'stud', component: StudentView },
      { path: 'log', component: LogView, meta: { requiresAdmin: true } }
    ]
  },
  { path: '/login', component: LoginView }
]
```

### Route Guards

The router implements navigation guards for:

1. **Authentication Check** - Redirects to login if not authenticated
2. **Admin Check** - Blocks non-admin users from admin-only routes
3. **Redirect Handling** - Preserves intended destination after login

```typescript
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!sessionStorage.getItem('token')
  const isAdmin = !isDisabled()

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ path: '/' })
  } else {
    next()
  }
})
```

### Route Table

| Path | Component | Auth Required | Admin Required |
|------|-----------|---------------|----------------|
| `/login` | Login | No | No |
| `/dash-emp` | Employee Dashboard | Yes | No |
| `/dash-student` | Student Dashboard | Yes | No |
| `/dept` | Department | Yes | No |
| `/emp` | Employee | Yes | No |
| `/clazz` | Class | Yes | No |
| `/stud` | Student | Yes | No |
| `/log` | Activity Log | Yes | Yes |

---

## State Management

### Pinia Stores

The application uses two Pinia stores:

**Employee Store:** `src/stores/emp.ts`
```typescript
export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    id: null as number | null,
    username: '' as string,
    roleName: '' as string,  // ROLE_ADMIN or ROLE_EMPLOYEE
  }),
  actions: {
    setUsername(name: string) { this.username = name },
    setId(id: number | null) { this.id = id },
    setRoleName(roleName: string) { this.roleName = roleName },
  },
  persist: {
    storage: sessionStorage,  // Session-scoped persistence
  },
})
```

**Theme Store:** `src/stores/theme.ts`
```typescript
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(false)

  const initTheme = () => {
    const saved = localStorage.getItem('theme')
    isDark.value = saved === 'dark'
    applyTheme()
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  return { isDark, initTheme, toggleTheme }
})
```

### Usage

```typescript
import { useEmployeeStore } from '@/stores/emp'
import { useThemeStore } from '@/stores/theme'

// Employee store
const empStore = useEmployeeStore()
empStore.setUsername('admin')
empStore.setId(1)
empStore.setRoleName('ROLE_ADMIN')

// Theme store
const themeStore = useThemeStore()
themeStore.initTheme()  // Initialize on app mount
themeStore.toggleTheme() // Toggle dark/light mode
```

---

## API Integration

### HTTP Client Configuration

**Location:** `src/utils/request.ts`

The Axios instance is configured with:

- **Base URL:** `/api` (proxied to `http://localhost:8080` in dev)
- **Timeout:** 10000ms
- **Request Interceptor:** Automatically adds Bearer token
- **Response Interceptor:** Handles 401 errors with redirect to login

```typescript
request.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
  return config
})

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response.status === 401) {
      router.push('/login')
      ElMessage.error('Session expired. Please login again')
    }
    return Promise.reject(error)
  }
)
```

### API Service Layer

All API calls are organized in `src/api/` with TypeScript interfaces:

```typescript
// Example: src/api/auth.ts
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  id: number | null
  token: string
  isFirstLogged: boolean
  roleName: string
}

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
  request.post('/auth/login', data)
```

### Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  code: number        // 0 = success, 1 = error
  message: string     // Response message
  data: T            // Response data
}

// Paginated response
interface PageResult<T> {
  total: number
  rows: T[]
}
```

---

## Authentication

### Login Flow

```
┌─────────────────┐
│  User enters    │
│  credentials    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  POST /auth/    │
│  login          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────────┐
│ isFirstLogged   │────▶│ Set new password    │
│ = false         │     │ (min 10 chars)      │
└────────┬────────┘     └─────────────────────┘
         │
         ▼ true
┌─────────────────┐
│ Store token in  │
│ sessionStorage  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Parse JWT for   │
│ username & role │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store in Pinia  │
│ & redirect to   │
│ dashboard       │
└─────────────────┘
```

### Password Validation

```typescript
const rules = {
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 10, message: 'Password length at least 10 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Confirm password is required', trigger: 'blur' },
    {
      validator: (_, value: string) => {
        if (value !== dialogFormInput.password) {
          throw new Error('Passwords do not match')
        }
      },
      trigger: 'change'
    }
  ]
}
```

---

## Components

### Layout Component

**Location:** `src/views/layout/Index.vue`

The main layout contains:
- **Header** - App title, theme toggle, and user dropdown (Change Password, Logout)
- **Sidebar** - Navigation menu with grouped items
- **Main Content** - Router view for page content

**Menu Structure:**
```
Dashboard
  ├── Employee
  └── Student
Organization
  ├── Department
  └── Employee
Academic
  ├── Class
  └── Student
Log (admin only)
```

### Theme Toggle Component

**Location:** `src/components/ThemeToggle.vue`

A custom toggle switch component that allows users to switch between dark and light themes:
- Smooth animated transition with cubic-bezier easing
- Persists theme preference in localStorage
- Integrates with theme store for global state management

```typescript
// Theme store - src/stores/theme.ts
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(false)
  const initTheme = () => { /* ... */ }
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }
  return { isDark, initTheme, toggleTheme }
})
```

### Login Component

**Location:** `src/views/login/Index.vue`

Features:
- Username and password input
- First-time login password reset dialog
- JWT payload parsing for user info
- Form validation

### Dashboard Components

**Employee Dashboard:** `src/views/dashboard/EmpDashboard.vue`
- Bar chart: Employee count by job title
- Pie chart: Employee count by gender

**Student Dashboard:** `src/views/dashboard/StudentDashboard.vue`
- Bar chart: Student count by class
- Pie chart: Student count by education level

All charts use **ECharts** with gradient color styling.

---

## Styling

### Theme Colors

```css
/* Light Theme (Default) */
--font-display: 'Outfit', sans-serif;    /* Display font */
--font-body: 'DM Sans', sans-serif;       /* Body font */
--accent: #f97316;                        /* Orange accent */
--accent-hover: #ea580c;
--glass-bg: rgba(255, 255, 255, 0.7);    /* Glass morphism */
--glass-border: rgba(148, 163, 184, 0.3);
--text-primary: #0f172a;
--text-secondary: #475569;

/* Dark Theme */
--accent: #fb923c;                       /* Lighter orange for dark mode */
--bg-primary: #1a1a1a;
--text-primary: #f5f5f5;
--text-secondary: #d4d4d4;
```

### Global Styles

**Location:** `src/assets/main.css`

The app uses CSS custom properties for theming and glass morphism effects:

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Outfit:wght@100..900&display=swap');

:root, .light {
  --font-display: 'Outfit', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --accent: #f97316;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: var(--font-body);
  background: var(--bg-primary);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
}

.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px var(--glass-shadow);
}

.glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
}
```

### Component Styling

Each `.vue` file uses scoped styles with:
- CSS custom properties for theming
- Glass morphism effects with backdrop-filter
- Smooth transitions on interactive elements
- Gradient backgrounds for depth
- Hover effects for better UX

### Element Plus Customization

The app uses Element Plus components with custom styling via deep selectors:

```vue
<style scoped>
::v-deep(.el-menu-item.is-active) {
  background: var(--accent-light) !important;
  color: var(--accent) !important;
  font-weight: 600;
  border: 1px solid var(--accent);
}
</style>
```

The primary accent color is **orange** (#f97316), applied globally via CSS variables.

---

## Build & Deploy

### Build Configuration

**Location:** `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
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

## Backend Integration

**Repository:** [Java Backend](https://github.com/clementleetimfu/java-education-management-system)

### API Endpoints

| Module | Endpoints |
|--------|-----------|
| **Auth** | `POST /auth/login`, `POST /auth/update-password`, `POST /auth/logout` |
| **Employees** | `GET /emps/search`, `GET /emps/{id}`, `POST /emps`, `PUT /emps`, `DELETE /emps` |
| **Students** | `GET /students/search`, `GET /students/{id}`, `POST /students`, `PUT /students`, `DELETE /students` |
| **Departments** | `GET /depts`, `POST /depts`, `PUT /depts`, `DELETE /depts/{id}` |
| **Classes** | `GET /clazz/search`, `GET /clazz/{id}`, `POST /clazz`, `PUT /clazz`, `DELETE /clazz/{id}` |
| **Dashboard** | `GET /emps/jobTitle/count`, `GET /emps/gender/count`, `GET /students/clazz/count`, `GET /students/edu-level/count` |
| **Logs** | `GET /logs` |
| **Reference** | `GET /edu-levels`, `GET /jobs`, `GET /subjects` |