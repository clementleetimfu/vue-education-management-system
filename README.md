# Vue Education Management System

![Vue](https://img.shields.io/badge/Vue-3.5.25-4FC08D?style=flat&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.0-3178C6?style=flat&logo=typescript&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element_Plus-2.11.9-409EFF?style=flat&logo=element&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite&logoColor=white)

Frontend application for education management built with Vue 3, TypeScript, and Element Plus.

## Table of Contents

- [Overview](#overview)
- [Backend Integration](#backend-integration)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Configuration](#api-configuration)
- [Routes](#routes)
- [Authentication](#authentication)
- [Role-Based Access Control](#role-based-access-control)
- [API Endpoints Reference](#api-endpoints-reference)
- [State Management](#state-management)
- [UI Components](#ui-components)
- [Theme](#theme)

## Overview

The Education Management System is a web application for managing educational institution data. It provides:

- Management of departments, employees, classes, and students
- Role-based access control with Admin and Employee roles
- Separate dashboards for employee analytics and student analytics
- Activity logging for admin users

## Backend Integration

**Backend Repository:** [Java Backend](https://github.com/clementleetimfu/java-education-management-system)

This frontend connects to a backend API server (typically running at `http://localhost:8080` in development) for all data operations and authentication.

## Features

- **Authentication** - JWT-based login with first-time password reset (minimum 10 characters)
- **Employee Management** - Search, add, edit, and delete employees with work experience tracking
- **Student Management** - Search, add, edit, and delete students with education levels
- **Department Management** - Organizational structure management
- **Class Management** - Class scheduling with teacher assignment
- **Dashboards** - Analytics with ECharts for employee and student data
- **Activity Logs** - Admin-only access to system activity logs
- **Role-Based Access** - Admin vs Employee permissions

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Vue 3 | ^3.5.25 |
| Language | TypeScript | ~5.9.0 |
| Build Tool | Vite | ^7.2.4 |
| State Management | Pinia | ^3.0.4 |
| State Persistence | pinia-plugin-persistedstate | ^4.7.1 |
| Routing | Vue Router | ^4.6.3 |
| UI Framework | Element Plus | ^2.11.9 |
| Icons | @element-plus/icons-vue | ^2.3.2 |
| HTTP Client | Axios | ^1.13.2 |
| Charts | ECharts | ^6.0.0 |
| DevTools | vite-plugin-vue-devtools | ^8.0.5 |

## Prerequisites

- Node.js: `^20.19.0` or `>=22.12.0`

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── api/                      # API service layer
│   ├── auth.ts               # Authentication endpoints
│   ├── clazz.ts              # Class management endpoints
│   ├── common.ts             # Common type definitions
│   ├── dept.ts               # Department endpoints
│   ├── eduLevel.ts           # Education level endpoints
│   ├── emp.ts                # Employee endpoints
│   ├── empDash.ts            # Employee dashboard endpoints
│   ├── jobs.ts               # Job title endpoints
│   ├── log.ts                # Activity log endpoints
│   ├── student.ts            # Student endpoints
│   ├── studentDash.ts        # Student dashboard endpoints
│   └── subject.ts            # Subject endpoints
├── assets/                   # Static assets
│   ├── login-background.jpg
│   └── main.css
├── constants/
│   └── role.ts               # Role enum definitions
├── router/
│   └── index.ts              # Vue Router configuration
├── stores/
│   └── emp.ts                # Employee Pinia store
├── utils/
│   ├── permission.ts         # Permission utilities
│   └── request.ts            # Axios instance configuration
├── views/                    # Page components
│   ├── clazz/
│   │   └── Index.vue         # Class management page
│   ├── dashboard/
│   │   ├── EmpDashboard.vue  # Employee dashboard
│   │   └── StudentDashboard.vue # Student dashboard
│   ├── department/
│   │   └── Index.vue         # Department management page
│   ├── employee/
│   │   └── Index.vue         # Employee management page
│   ├── layout/
│   │   └── Index.vue         # Main layout with navigation
│   ├── log/
│   │   └── Index.vue         # Activity logs page (admin only)
│   ├── login/
│   │   └── Index.vue         # Login page
│   └── student/
│       └── Index.vue         # Student management page
├── App.vue                   # Root component
└── main.ts                   # Application entry point
```

## API Configuration

The application uses Axios with the following configuration:

- **Base URL**: `/api` (proxied to `http://localhost:8080` in development)
- **Timeout**: 10000ms
- **Authentication**: Bearer token stored in `sessionStorage`

Request interceptor automatically adds the Authorization header:
```typescript
config.headers.Authorization = 'Bearer ' + sessionStorage.getItem('token')
```

Response interceptor handles 401 errors by redirecting to login.

## Routes

| Path | Component | Auth Required | Admin Required |
|------|-----------|---------------|----------------|
| `/` | Layout (redirects to `/dash-emp`) | Yes | No |
| `/login` | Login | No | No |
| `/dash-emp` | Employee Dashboard | Yes | No |
| `/dash-student` | Student Dashboard | Yes | No |
| `/dept` | Department Management | Yes | No |
| `/emp` | Employee Management | Yes | No |
| `/clazz` | Class Management | Yes | No |
| `/stud` | Student Management | Yes | No |
| `/log` | Activity Logs | Yes | Yes |

## Authentication

Login flow:

1. POST `/auth/login` with `username` and `password`
2. Response includes:
   - `id`: User ID
   - `token`: JWT bearer token
   - `isFirstLogged`: Boolean flag for first-time login
   - `roleName`: User role (ROLE_ADMIN or ROLE_EMPLOYEE)
3. If `isFirstLogged` is false, user must set a new password (min 10 characters)
4. Token stored in `sessionStorage`
5. User info (id, username, roleName) persisted in Pinia store

Password change endpoints:
- POST `/auth/update-password` - Update user password
- POST `/auth/logout` - Logout

## Role-Based Access Control

Two roles defined in `constants/role.ts`:

- `ROLE_ADMIN`: Full system access including log viewing
- `ROLE_EMPLOYEE`: Standard access without log viewing

The `isDisabled()` utility in `utils/permission.ts` checks if the current user is not an admin.

## API Endpoints Reference

### Authentication (`api/auth.ts`)
- `POST /auth/login` - User login
- `POST /auth/update-password` - Update password
- `POST /auth/logout` - User logout

### Departments (`api/dept.ts`)
- `GET /depts` - List all departments
- `POST /depts` - Add department
- `PUT /depts` - Edit department
- `DELETE /depts/{id}` - Delete department

### Employees (`api/emp.ts`)
- `GET /emps/search` - Search employees with pagination
- `GET /emps/{id}` - Find employee by ID
- `GET /emps/teachers` - List all class teachers
- `POST /emps` - Add employee
- `PUT /emps` - Update employee
- `DELETE /emps?ids={ids}` - Delete employees
- `GET /emps/jobTitle/count` - Employee count by job title
- `GET /emps/gender/count` - Employee count by gender

### Students (`api/student.ts`)
- `GET /students/search` - Search students with pagination
- `GET /students/{id}` - Find student by ID
- `POST /students` - Add student
- `PUT /students` - Update student
- `DELETE /students?ids={ids}` - Delete students
- `GET /students/clazz/count` - Student count by class
- `GET /students/edu-level/count` - Student count by education level

### Classes (`api/clazz.ts`)
- `GET /clazz/search` - Search classes with pagination
- `GET /clazz/{id}` - Find class by ID
- `GET /clazz` - List all classes
- `POST /clazz` - Add class
- `PUT /clazz` - Update class
- `DELETE /clazz/{id}` - Delete class

### Reference Data
- `GET /edu-levels` - List all education levels (`api/eduLevel.ts`)
- `GET /subjects` - List all subjects (`api/subject.ts`)
- `GET /jobs` - List all job titles (`api/jobs.ts`)

### Logs (`api/log.ts`)
- `GET /logs` - Get activity logs with pagination (admin only)

## Common Types (`api/common.ts`)

```typescript
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface PageResult<T> {
  total: number;
  rows: T[];
}

interface Page {
  page: number;
  pageSize: number;
}
```

## State Management (Pinia)

### Employee Store (`stores/emp.ts`)

Persisted to `sessionStorage`:

```typescript
state: {
  id: number | null
  username: string
  roleName: string
}
```

Actions:
- `setUsername(name: string)`
- `setId(id: number | null)`
- `setRoleName(roleName: string)`

## UI Components

The application uses Element Plus components:

### Layout
- `el-container`, `el-header`, `el-aside`, `el-main` - Main layout structure

### Navigation
- `el-menu`, `el-sub-menu`, `el-menu-item` - Sidebar navigation
- `el-scrollbar` - Scrollable sidebar
- `el-dropdown`, `el-dropdown-menu`, `el-dropdown-item` - User menu

### Forms
- `el-form`, `el-form-item` - Form structure
- `el-input` - Text and password inputs
- `el-button` - Action buttons

### Data Display
- `el-table` - Data tables
- `el-tag` - Status indicators
- `el-text` - Text display

### Feedback
- `el-message` - Toast notifications
- `el-message-box` - Confirmation dialogs
- `el-dialog` - Modal dialogs

### Icons
- All icons from `@element-plus/icons-vue`:
  - `Management`, `Avatar`, `DataAnalysis`, `OfficeBuilding`
  - `School`, `Notebook`, `Lock`, `SwitchButton`

### Charts
- ECharts for dashboard visualizations

## Theme

Primary color: `#162640` (dark blue)
Accent color: `#4FC3F7` (light blue)

Layout includes:
- Header with logo, title, and user dropdown
- Sidebar with menu navigation
- Main content area

Menu structure:
- Dashboard (Employee, Student)
- Organization (Department, Employee)
- Academic (Class, Student)
- Log (admin only)

User dropdown options:
- Change Password
- Logout
