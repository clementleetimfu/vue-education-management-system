# AGENTS.md - Development Guidelines for AI Agents

## Project Overview

This is a Vue 3 + TypeScript education management system using:
- **Vue 3** with Composition API (`<script setup lang="ts">`)
- **TypeScript** for type safety
- **Element Plus** for UI components
- **Pinia** for state management
- **Vue Router** for routing
- **Axios** for HTTP requests
- **Vite** as the build tool

---

## Build / Lint / Test Commands

### Development
```bash
npm run dev          # Start development server
```

### Build
```bash
npm run build        # Run type-check + build
npm run build-only  # Build only (skip type-check)
npm run preview     # Preview production build
```

### Type Checking
```bash
npm run type-check  # Run vue-tsc type checking
```

### Note on Testing
- **No test framework is configured** in this project
- If adding tests, use Vitest or Vue Test Utils
- To run a single test file (if tests are added): `vitest run --single-thread src/path/to/test.spec.ts`

---

## Code Style Guidelines

### General Principles
- Use **Composition API** with `<script setup lang="ts">` for all Vue components
- Prefer **TypeScript** over JavaScript - always define types
- Keep functions small and focused
- Use meaningful variable and function names

### Imports

**Order (separate with blank lines):**
1. External library imports (Vue, Element Plus, etc.)
2. Internal type imports (`@/api/...`, `@/types/...`)
3. Internal module imports (`@/stores/...`, `@/utils/...`, `@/components/...`)
4. Relative imports from parent directories

```typescript
// Good
import { reactive, ref, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { LoginRequest, LoginResponse } from '@/api/auth';
import type { ApiResponse } from '@/api/common';
import { useEmployeeStore } from '@/stores/emp';
import { login } from '@/api/auth';
import ThemeToggle from '@/components/ThemeToggle.vue';
```

**Use `@/` alias** for imports from the `src/` directory:
```typescript
import { useEmployeeStore } from '@/stores/emp';
import request from '@/utils/request';
```

### TypeScript

**Always define return types** for functions:
```typescript
const handleLogin = async (): Promise<void> => { ... }
const getUsernameFromJwt = (token: string): string => { ... }
```

**Use interfaces** for data models:
```typescript
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number | null;
  token: string;
  isFirstLogged: boolean;
  roleName: string;
}
```

**Type the reactive objects**:
```typescript
const loginForm = reactive<LoginRequest>({
  username: '',
  password: '',
});
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Vue components | PascalCase | `ThemeToggle.vue`, `StudentIndex.vue` |
| TypeScript interfaces | PascalCase | `LoginRequest`, `ApiResponse` |
| Variables/functions | camelCase | `handleLogin`, `loginForm` |
| Enums | PascalCase + Uppercase values | `RoleEnum.ROLE_ADMIN` |
| File names (TS) | camelCase | `request.ts`, `permission.ts` |
| Directory names | camelCase | `api/`, `stores/`, `views/` |

### Vue Component Structure

```vue
<script setup lang="ts">
// 1. Imports (in order: external, types, internal modules, components)

// 2. Store initialization (if using Pinia)
const empStore = useEmployeeStore();

// 3. Reactive state
const loading = ref<boolean>(false);

// 4. Computed properties
const isAdmin = computed(() => empStore.roleName === 'ROLE_ADMIN');

// 5. Lifecycle hooks
onMounted(() => { ... });

// 6. Functions
const handleSubmit = async (): Promise<void> => { ... };
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
/* Component styles */
</style>
```

### Error Handling

**Always use try-catch** for async operations:
```typescript
const handleLogin = async (): Promise<void> => {
  try {
    const result: ApiResponse<LoginResponse> = await login(loginForm);
    if (result?.code === 0) {
      // Success logic
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error('Failed to login');
  }
};
```

**Check API responses** properly:
```typescript
if (result?.code === 0 && result?.data) {
  // Handle success
}
```

### API Layer

**Define request/response types** in the API file:
```typescript
// src/api/auth.ts
import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number | null;
  token: string;
  isFirstLogged: boolean;
  roleName: string;
}

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => 
  request.post('/auth/login', data);
```

### Pinia Stores

**Use setup store syntax**:
```typescript
import { defineStore } from 'pinia';
import type { RoleEnum } from '@/constants/role';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    id: null as number | null,
    username: '' as string,
    roleName: '' as string,
  }),
  actions: {
    setUsername(name: string) {
      this.username = name;
    },
    // ...other actions
  },
  persist: {
    storage: sessionStorage,
  },
});
```

### CSS / Styling

- Use **CSS custom properties** (variables) defined in assets
- Use **scoped styles** in Vue components
- Use **Element Plus** components with their default styling where possible
- Avoid inline styles; use classes instead
- Follow existing color variables: `var(--accent)`, `var(--bg-primary)`, etc.

### Boolean Types

**Be explicit** with boolean types:
```typescript
const dialogFormVisible = ref<boolean>(false);
const disabledFlag = ref<boolean>(isDisabled());
```

### Null Handling

**Use union types** when a value can be null:
```typescript
id: number | null
clazzId: number | null
```

---

## Project Structure

```
src/
├── api/           # API functions
├── assets/        # Static assets (CSS, images)
├── components/    # Reusable Vue components
├── constants/     # Constants (enums, config)
├── router/        # Vue Router configuration
├── stores/        # Pinia stores
├── utils/         # Utility functions
├── views/         # Page components (views)
│   └── [module]/
│       └── Index.vue
├── App.vue        # Root component
└── main.ts        # Entry point
```

---

## Common Patterns

### Form Handling
```typescript
const dialogFormRef = ref<FormInstance | null>(null);

const handleSubmit = async () => {
  if (!dialogFormRef.value) return;
  dialogFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    // Submit logic
  });
};
```

### Table Data Loading
```typescript
const getTableData = async (): Promise<void> => {
  try {
    const result: ApiResponse<PageResult<StudentData>> = await searchStudent(params);
    if (result?.code === 0) {
      tableData.value = result?.data?.rows;
      total.value = result?.data?.total;
    }
  } catch (error: any) {
    ElMessage.error('Failed to load data');
  }
};
```

### Options/Selection Data
```typescript
const clazzOptions = ref<{ label: string; value: number }[]>([]);
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build for prod | `npm run build` |
| Type check | `npm run type-check` |
| Add new API | Create file in `src/api/` with types + functions |
| Add new store | Create file in `src/stores/` using Pinia |
| Add new view | Create directory in `src/views/` with `Index.vue` |
| Add new component | Create file in `src/components/` |

---

## Notes for AI Agents

- **No ESLint/Prettier** is configured - write clean, consistent code manually
- **No tests exist** - consider adding tests when modifying critical logic
- **API base URL** is `/api` with proxy to `http://localhost:8080` (configure in `vite.config.ts`)
- **Session storage** is used for token persistence via `pinia-plugin-persistedstate`
- Always check `result?.code === 0` for successful API responses
- Use `ElMessage` from Element Plus for user feedback
