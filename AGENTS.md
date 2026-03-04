# AGENTS.md - Development Guidelines for AI Agents

Vue 3 + TypeScript education management system with Element Plus, Pinia, Vue Router, and Axios.

---

## Build / Lint / Test Commands

```bash
pnpm dev            # Start dev server (http://localhost:5173)
pnpm build          # Type-check + build
pnpm build-only     # Build only (skip type-check)
pnpm preview        # Preview production build
pnpm type-check     # Run vue-tsc type checking
```

**No test framework configured.** Use Vitest for tests. Single test: `vitest run --single-thread src/path/to/test.spec.ts`

---

## Code Style Guidelines

### Vue Component Structure

All components use `<script setup lang="ts">` with this order:

1. Imports (Vue, Element Plus, then types, then internal modules)
2. Store initialization
3. Reactive state (always type explicitly)
4. Computed properties & functions

```vue
<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { ApiResponse, PageResult } from '@/api/common'
import { searchEmployee } from '@/api/emp'

const loading = ref<boolean>(false)
const tableData = ref<Employee[]>([])

const handleSubmit = async (): Promise<void> => {
  try {
    const result = await apiCall(data)
    if (result?.code === 0) {
      // Success logic
    } else {
      ElMessage.error(result?.message || 'Operation failed')
    }
  } catch (error: any) {
    ElMessage.error('An unexpected error occurred')
  }
}

onMounted(() => {
  fetchData()
})
</script>
```

### Import Order

1. Vue core functions (ref, reactive, computed, watch, onMounted)
2. Element Plus (ElMessage, ElMessageBox, type imports)
3. Types (`type { ... }` from `@/api/...`)
4. Internal modules (`@/api/...`, `@/stores/...`, `@/utils/...`)

**Always use `@/` alias** for src/ imports.

### TypeScript Guidelines

- Define return types: `async (): Promise<void> => { ... }`
- Use interfaces for data models (export from api files)
- Type reactive objects: `reactive<Type>({ ... })`
- Use union types: `id: number | null`, `clazzId: number | null`
- Be explicit with booleans: `ref<boolean>(false)`
- Use `as` type assertions for state: `id: null as number | null`

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Vue components | PascalCase | `ThemeToggle.vue`, `Index.vue` |
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
      ElMessage.success('Operation successful')
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
// src/api/emp.ts
import request from '@/utils/request'
import type { ApiResponse, PageResult } from './common'

export interface SearchEmployeeRequest {
  page: number
  pageSize: number
  name: string
}

export const searchEmployee = (params: SearchEmployeeRequest): Promise<ApiResponse<PageResult<Employee>>> =>
  request.get('/emps/search', { params })
```

### Pinia Stores

```typescript
// src/stores/emp.ts - Options API with sessionStorage persistence
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

```typescript
// src/stores/theme.ts - Composition API with localStorage
export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(false)

  const initTheme = () => { /* ... */ }
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  return { isDark, initTheme, toggleTheme }
})
```

### Router Guards

```typescript
router.beforeEach((to, from, next) => {
  const disabledFlag = ref<boolean>(isDisabled())
  const isLoggedIn = !!sessionStorage.getItem('token')

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  }

  if (to.meta.requiresAdmin && disabledFlag.value) {
    return next({ path: '/' })
  }

  next()
})
```

---

## Critical Notes

- **No ESLint/Prettier** - Write clean, consistent code manually
- **No tests exist** - Add tests when modifying critical logic
- **API base URL**: `/api` proxied to `http://localhost:8080` (vite.config.ts)
- **Session storage** for token/auth state via pinia-plugin-persistedstate
- **localStorage** for theme preference (not Pinia persist)
- **Always check** `result?.code === 0` for successful API responses
- **Use ElMessage** from Element Plus for user feedback
- **Use ElMessageBox.confirm** for delete confirmations
