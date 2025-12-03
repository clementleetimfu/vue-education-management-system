import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEmployeeStore = defineStore('employee', () => {
  const username = ref<string>('');
  const setUsername = (name: string) => {
    username.value = name;
  }
  return { username, setUsername };
});