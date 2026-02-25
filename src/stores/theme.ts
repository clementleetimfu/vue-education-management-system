import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

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
