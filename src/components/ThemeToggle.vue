<script setup lang="ts">
import { useThemeStore } from '@/stores/theme';
import { Sunny, Moon } from '@element-plus/icons-vue';

const themeStore = useThemeStore();
</script>

<template>
  <button class="theme-toggle" @click="themeStore.toggleTheme" :aria-label="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'">
    <span class="toggle-track">
      <span class="toggle-thumb" :class="{ dark: themeStore.isDark }">
        <el-icon class="icon sun" v-if="themeStore.isDark"><Moon /></el-icon>
        <el-icon class="icon moon" v-else><Sunny /></el-icon>
      </span>
    </span>
  </button>
</template>

<style scoped>
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  outline: none;
}

.toggle-track {
  width: 52px;
  height: 28px;
  background: var(--glass-border);
  border-radius: 14px;
  position: relative;
  transition: background 0.3s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.theme-toggle:hover .toggle-track {
  background: var(--glass-border-hover);
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: var(--glass-bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.toggle-thumb.dark {
  transform: translateX(24px);
}

.icon {
  font-size: 12px;
  color: var(--accent);
  transition: transform 0.3s ease;
}

.icon.sun {
  transform: rotate(0deg);
}

.icon.moon {
  transform: rotate(-90deg);
}
</style>
