# AGENTS.md - Development Guidelines for AI Agents

Vue 3 + TypeScript education management system with Element Plus, Pinia, Vue Router, and Axios.

---

## Build / Lint / Test Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Type-check + build
npm run build-only  # Build only (skip type-check)
npm run preview     # Preview production build
npm run type-check  # Run vue-tsc type checking
```

**No test framework configured.** Use Vitest for tests. Single test: `vitest run --single-thread src/path/to/test.spec.ts`

---

## Code Style Guidelines

### Vue Component Structure

All components use `<script setup lang="ts">` with this order:

1. Imports (external, types, internal, components)
2. Store initialization
3. Reactive state (always type explicitly)
4. Computed properties & functions

```vue
<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import type { FormInstance } from 'element-plus';
import type { LoginRequest } from '@/api/auth';
import { useEmployeeStore } from '@/stores/emp';
import { login } from '@/api/auth';

const empStore = useEmployeeStore();
const loading = ref<boolean>(false);
const isAdmin = computed(() => empStore.roleName === 'ROLE_ADMIN');
const handleSubmit = async (): Promise<void> => { ... };
</script>
```

### Import Order

1. External libraries (Vue, Element Plus)
2. Internal types (`@/api/...`, `@/types/...`)
3. Internal modules (`@/stores/...`, `@/utils/...`, `@/components/...`)
4. Relative imports

**Always use `@/` alias** for src/ imports.

### TypeScript Guidelines

- Define return types: `async (): Promise<void> => { ... }`
- Use interfaces for data models with explicit types
- Type reactive objects: `reactive<Type>({ ... })`
- Use union types: `id: number | null`, `clazzId: number | null`
- Be explicit with booleans: `ref<boolean>(false)`

### Naming Conventions

| Element | Convention | Example |
|----------|------------|----------|
| Vue components | PascalCase | `ThemeToggle.vue` |
| TypeScript interfaces | PascalCase | `LoginRequest`, `ApiResponse` |
| Variables/functions | camelCase | `handleLogin`, `loginForm` |
| Enums | PascalCase + UPPERCASE | `RoleEnum.ROLE_ADMIN` |
| TS files | camelCase | `request.ts`, `permission.ts` |
| Directories | camelCase | `api/`, `stores/`, `views/` |

### Error Handling

```typescript
const handleSubmit = async (): Promise<void> => {
  try {
    const result = await apiCall(data)
    if (result?.code === 0 && result?.data) {
      // Success logic
    } else {
      ElMessage.error(result?.message || 'Operation failed')
    }
  } catch (error: any) {
    ElMessage.error('An unexpected error occurred')
  }
}
```

**Always check** `result?.code === 0` for successful API responses.

### API Layer Pattern

```typescript
// src/api/auth.ts
import request from '@/utils/request';
import type { ApiResponse } from './common';

export interface LoginRequest {
  username: string;
  password: string;
}

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
  request.post('/auth/login', data);
```

### Pinia Stores

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
});
```

### Theme Store (Composition API)

Uses localStorage for persistence (not Pinia persist plugin):

```typescript
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(false);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    applyTheme();
  };

  return { isDark, toggleTheme };
});
```

### Router Guards

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
```

---

## Critical Notes

- **No ESLint/Prettier** - Write clean, consistent code manually
- **No tests exist** - Add tests when modifying critical logic
- **API base URL**: `/api` proxied to `http://localhost:8080` (vite.config.ts)
- **Session storage** used for token persistence via pinia-plugin-persistedstate
- **Always check** `result?.code === 0` for successful API responses
- **Use ElMessage** from Element Plus for user feedback
- **Theme persistence** via localStorage (not Pinia)
