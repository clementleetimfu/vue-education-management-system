<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import type { LoginRequest as LoginForm, UpdatePasswordRequest } from '@/api/auth';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { useEmployeeStore } from '@/stores/emp';
import { login, updatePassword } from '@/api/auth';
import type { ApiResponse } from '@/api/common';
import type { LoginResponse } from '@/api/auth';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme';
import ThemeToggle from '@/components/ThemeToggle.vue';

const router = useRouter();
const empStore = useEmployeeStore();
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
});

const dialogFormVisible = ref<boolean>(false);
const dialogFormTitle = ref<string>('Set your new password');
const dialogFormRef = ref<FormInstance | null>(null);
const dialogFormInput = reactive<UpdatePasswordRequest & { confirmPassword: string }>({
  id: null,
  password: '',
  confirmPassword: '',
});

const rules = reactive({
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 10, message: 'Password length at least 10 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Confirm password is required', trigger: 'blur' },
    {
      validator: async (_: any, value: string) => {
        const password = dialogFormInput.password;
        if (value !== password) {
          throw new Error('Passwords do not match');
        }
      },
      trigger: "change"
    }
  ]
});

const getJwtPayload = (token: string): any => {
  const payload = token.split('.')[1];
  if (!payload) return '';
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded);
}

const getUsernameFromJwt = (token: string): string => {
  const payload = getJwtPayload(token);
  return payload?.username || '';
}

const handleLogin = async (): Promise<void> => {
  try {
    const result: ApiResponse<LoginResponse> = await login(loginForm);
    if (result?.code === 0) {
      if (!result.data.isFirstLogged) {
        dialogFormInput.id = result.data.id;
        dialogFormVisible.value = true;
        dialogFormInput.confirmPassword = '';
        dialogFormInput.password = '';
      } else {
        const token: string = result.data.token || '';
        sessionStorage.setItem('token', token);
        empStore.setUsername(getUsernameFromJwt(token));
        empStore.setId(result.data.id);
        empStore.setRoleName(result.data.roleName);
        const redirect = router.currentRoute.value.query.redirect as string || '/dash-emp';
        router.push(redirect);
        ElMessage.success('Login success');
      }
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error(`Failed to login`);
  }
};

const handleClear = (): void => {
  loginForm.username = '';
  loginForm.password = '';
};

const handleCloseDialogForm = (): void => {
  dialogFormVisible.value = false;
  dialogFormRef?.value?.resetFields();
}

const handleDialogFormSubmit = async () => {
  if (!dialogFormRef.value) return;
  dialogFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      const { confirmPassword, ...rest } = dialogFormInput;
      const result: ApiResponse<boolean> = await updatePassword(rest);
      if (result?.code === 0 && result?.data) {
        dialogFormVisible.value = false;
        loginForm.password = '';
        ElMessage.success("Password updated successfully");
      } else {
        ElMessage.error(result?.message);
      }
    } catch (error: any) {
      ElMessage.error(`Failed to update employee password`);
    }
  })
}

</script>
<template>
  <div id="container">
    <div class="bg-gradient"></div>
    <div class="bg-gradient-2"></div>
    <div class="bg-gradient-3"></div>
    
    <div class="theme-toggle-wrapper animate-fade-in-up">
      <ThemeToggle />
    </div>

    <div class="login-card glass animate-fade-in-up animate-delay-2">
      <h1 class="title">EMS</h1>
      <p class="subtitle">Education Management System</p>

      <el-form :model="loginForm" label-width="auto" class="login-form">
        <el-form-item>
          <el-input 
            v-model="loginForm.username" 
            placeholder="Username" 
            size="large" 
            :prefix-icon="null"
          />
        </el-form-item>

        <el-form-item>
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="Password" 
            size="large" 
            show-password 
          />
        </el-form-item>

        <div class="btn-group">
          <el-button type="primary" size="large" class="login-btn" @click="handleLogin">Sign In</el-button>
        </div>
        <div class="clear-btn">
          <el-button link type="info" @click="handleClear">Clear</el-button>
        </div>
      </el-form>
    </div>
  </div>

  <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="30%" @close="handleCloseDialogForm" class="glass-dialog">
    <el-form :model="dialogFormInput" ref="dialogFormRef" :rules="rules">
      <el-form-item label="New Password" label-width="150px" prop="password">
        <el-input v-model="dialogFormInput.password" type="password" />
      </el-form-item>
      <el-form-item label="Confirm Password" label-width="150px" prop="confirmPassword">
        <el-input v-model="dialogFormInput.confirmPassword" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDialogFormSubmit">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
#container {
  height: 100vh;
  background: var(--bg-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: background 0.4s ease;
}

.bg-gradient {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-light) 0%, transparent 70%);
  top: -200px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

.bg-gradient-2 {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 146, 60, 0.08) 0%, transparent 70%);
  bottom: -150px;
  left: -100px;
  animation: float 10s ease-in-out infinite reverse;
  pointer-events: none;
}

.bg-gradient-3 {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%);
  top: 50%;
  left: 30%;
  transform: translate(-50%, -50%);
  animation: pulse 12s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -30px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}

.theme-toggle-wrapper {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 10;
}

.login-card {
  width: 420px;
  border-radius: 24px;
  padding: 48px 40px;
  position: relative;
  z-index: 1;
}

.title {
  text-align: center;
  margin: 0 0 12px 0;
  font-size: 52px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 10px;
  font-family: var(--font-display);
  transition: color 0.4s ease;
}

.subtitle {
  text-align: center;
  margin: 0 0 40px 0;
  font-size: 13px;
  color: var(--text-muted);
  letter-spacing: 3px;
  font-weight: 500;
  text-transform: uppercase;
  transition: color 0.4s ease;
}

.login-form {
  margin-top: 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.login-form :deep(.el-form-item__content) {
  line-height: normal;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 14px;
  padding: 14px 18px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: var(--glass-border-hover);
  background: var(--glass-bg-hover);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
  background: var(--glass-bg-hover);
}

.login-form :deep(.el-input__inner) {
  color: var(--text-primary);
  font-family: var(--font-body);
}

.login-form :deep(.el-input__inner::placeholder) {
  color: var(--text-muted);
}

.btn-group {
  margin-top: 8px;
}

.login-btn {
  width: 100%;
  height: 52px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
  border: none;
  border-radius: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
  font-family: var(--font-display);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.clear-btn {
  text-align: center;
  margin-top: 20px;
}

.clear-btn :deep(.el-button) {
  color: var(--text-muted);
  font-weight: 500;
}

.clear-btn :deep(.el-button:hover) {
  color: var(--text-primary);
}

.dialog-footer :deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
  border: none;
}

:deep(.glass-dialog) {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

:deep(.glass-dialog .el-dialog) {
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
}

:deep(.glass-dialog .el-dialog__header) {
  border-bottom: 1px solid var(--glass-border);
  padding: 20px 24px;
}

:deep(.glass-dialog .el-dialog__title) {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 600;
}

:deep(.glass-dialog .el-dialog__body) {
  padding: 24px;
  color: var(--text-primary);
}

:deep(.glass-dialog .el-form-item__label) {
  color: var(--text-secondary);
  font-family: var(--font-body);
}

:deep(.glass-dialog .el-input__wrapper) {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: none;
}

:deep(.glass-dialog .el-input__inner) {
  color: var(--text-primary);
}
</style>
