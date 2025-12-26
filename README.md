# Education Management System (Frontend)

A modern web application for education management built with Vue 3, TypeScript, and Element Plus UI framework.

**Backend Repository:** [Java Backend](https://github.com/clementleetimfu/java-education-management-system)

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Development](#development)
  - [Build for Production](#build-for-production)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Routing](#routing)
- [Role-Based Access Control](#role-based-access-control)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [UI Components](#ui-components)

## Overview

The Education Management System is a comprehensive web application designed to manage various aspects of educational institutions. It provides separate dashboards for employees and students, allowing administrators to manage departments, classes, employees, and students efficiently.

The system features a role-based access control system with distinct permissions for administrators and regular employees, ensuring data security and appropriate access levels.

## Features

- 🔐 Secure authentication with JWT tokens
- 👥 Employee and student management
- 🏫 Department and class organization management
- 📊 Dashboard analytics for both employees and students
- 📝 Activity logging
- 🎨 UI with Element Plus components
- 🌐 RESTful API integration
- 👔 Role-based access control (Admin vs Employee)
- 🔒 First-time password reset (minimum 10 characters)

## Tech Stack

- **Framework**: [Vue 3](https://v3.vuejs.org/) with Composition API
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **UI Framework**: [Element Plus](https://element-plus.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charts**: [ECharts](https://echarts.apache.org/)
- **Icons**: [Element Plus Icons Vue](https://github.com/element-plus/element-plus-icons)

## Prerequisites

- Node.js version ^20.19.0 or >=22.12.0
- npm or yarn package manager
- Backend API server running at http://localhost:8080 (separate project)

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd vue-education-management-system
npm install
```

### Development

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default.

### Build for Production

Compile and minify for production deployment:

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
├── api/              # API service definitions
│   ├── auth.ts       # Authentication API
│   ├── clazz.ts      # Class management API
│   ├── common.ts     # Common API utilities
│   ├── dept.ts       # Department API
│   ├── eduLevel.ts   # Education level API
│   ├── emp.ts        # Employee API
│   ├── empDash.ts    # Employee dashboard API
│   ├── jobs.ts       # Jobs API
│   ├── log.ts        # Log API
│   ├── student.ts    # Student API
│   ├── studentDash.ts # Student dashboard API
│   └── subject.ts    # Subject API
├── assets/           # Static assets (images, styles)
├── constants/        # Constants (role.ts)
├── router/           # Vue Router configuration
├── stores/           # Pinia store modules
│   └── emp.ts        # Employee store
├── utils/            # Utility functions and helpers
│   ├── permission.ts # Permission utilities
│   └── request.ts    # HTTP request configuration
├── views/            # View components
│   ├── clazz/        # Class management view
│   ├── dashboard/    # Dashboard views (Employee & Student)
│   ├── department/   # Department management view
│   ├── employee/     # Employee management view
│   ├── layout/       # Main layout component
│   ├── log/          # Activity logs view
│   ├── login/        # Login view
│   └── student/      # Student management view
├── App.vue           # Root component
└── main.ts           # Application entry point
```

## Authentication

The system implements JWT-based authentication:

1. Users log in with username/password
2. On first login, users must set a new password (minimum 10 characters)
3. After authentication, a JWT token is stored in session storage
4. All subsequent API requests include the token in the Authorization header
5. Session expiration redirects users to the login page

## Routing

The application uses Vue Router with the following main routes:

- `/` - Redirects to employee dashboard
- `/login` - Authentication page
- `/dash-emp` - Employee dashboard
- `/dash-student` - Student dashboard
- `/dept` - Department management
- `/emp` - Employee management
- `/clazz` - Class management
- `/stud` - Student management
- `/log` - Activity logs

All routes except `/login` require authentication. The `/log` route requires admin privileges.

## Role-Based Access Control

The system implements role-based access control with two main roles:

- `ROLE_ADMIN`: Full access including log viewing
- `ROLE_EMPLOYEE`: Standard access without log viewing capabilities

The router checks for role permissions before allowing access to admin-only routes.

## API Integration

The frontend communicates with a backend API through Axios with the following features:

- Base URL configured to `/api` with proxy to `http://localhost:8080`
- Automatic JWT token injection in request headers
- Centralized error handling for authentication failures
- Type-safe API responses using TypeScript interfaces
- Request/response interceptors for consistent handling

## State Management

The application uses Pinia for state management with:

- Persistent storage using `pinia-plugin-persistedstate`
- Employee store (`stores/emp.ts`) to maintain user session
- Role-based permissions stored in the state
- Token and user information persistence across sessions

## UI Components

The application utilizes Element Plus for UI components:

- Layout: Container, Header, Aside, Main
- Navigation: Menu, SubMenu
- Forms: Form, FormItem, Input, Button
- Data Display: Table, Tag
- Feedback: Message, MessageBox, Dialog
- Icons: Element Plus Icons Vue
- Charts: ECharts integration for dashboard analytics

All components follow a consistent dark blue theme (`#162640`) with appropriate contrast for accessibility.

## License

This project is licensed under the MIT License - see the LICENSE file for details.