import { defineStore } from 'pinia';

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    username: '' as string,
  }),
  actions: {
    setUsername(name: string) {
      this.username = name;
    },
  },
  persist: {
    storage: sessionStorage,
  },
});