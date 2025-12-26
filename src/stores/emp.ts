import type { RoleEnum } from '@/constants/role';
import { defineStore } from 'pinia';

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
    setId(id: number | null) {
      this.id = id;
    },
    setRoleName(roleName: string) {
      this.roleName = roleName;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});