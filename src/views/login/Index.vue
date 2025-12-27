<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { LoginRequest as LoginForm, UpdatePasswordRequest } from '@/api/auth';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { useEmployeeStore } from '@/stores/emp';
import { login, updatePassword } from '@/api/auth';
import type { ApiResponse } from '@/api/common';
import type { LoginResponse } from '@/api/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const empStore = useEmployeeStore();

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
    <div class="login-card">
      <h1 class="title">EMS</h1>
      <p class="subtitle">Education Management System</p>

      <el-form :model="loginForm" label-width="auto" class="login-form">
        <el-form-item>
          <el-input v-model="loginForm.username" placeholder="Username" size="large" />
        </el-form-item>

        <el-form-item>
          <el-input v-model="loginForm.password" type="password" placeholder="Password" size="large" show-password />
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

  <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="400px" @close="handleCloseDialogForm" class="password-dialog">
    <el-form :model="dialogFormInput" ref="dialogFormRef" :rules="rules">
      <el-form-item label="New Password" label-width="130px" prop="password">
        <el-input v-model="dialogFormInput.password" type="password" placeholder="Enter new password" show-password />
      </el-form-item>
      <el-form-item label="Confirm Password" label-width="130px" prop="confirmPassword">
        <el-input v-model="dialogFormInput.confirmPassword" type="password" placeholder="Confirm new password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDialogFormSubmit">
          Update Password
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<style scoped>
#container {
  height: 100vh;
  background-image: url('@/assets/login-background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

#container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(22, 38, 64, 0.4);
  backdrop-filter: blur(2px);
}

.login-card {
  width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.35);
  position: relative;
  z-index: 1;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  text-align: center;
  margin: 0 0 12px 0;
  font-size: 48px;
  font-weight: 700;
  color: #162640;
  letter-spacing: 8px;
  text-shadow: 2px 2px 4px rgba(22, 38, 64, 0.1);
}

.subtitle {
  text-align: center;
  margin: 0 0 40px 0;
  font-size: 14px;
  color: #666;
  letter-spacing: 2px;
  font-weight: 500;
}

.login-form {
  margin-top: 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 28px;
}

.login-form :deep(.el-form-item__content) {
  line-height: normal;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.login-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 16px rgba(22, 38, 64, 0.15);
}

.login-form :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 20px rgba(22, 38, 64, 0.2);
}

.btn-group {
  margin-top: 8px;
}

.login-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #162640 0%, #1e3a5f 100%);
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(22, 38, 64, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(22, 38, 64, 0.4);
}

.login-btn:active {
  transform: translateY(0);
}

.clear-btn {
  text-align: center;
  margin-top: 20px;
}

.password-dialog :deep(.el-dialog) {
  border-radius: 16px;
}

.password-dialog :deep(.el-dialog__header) {
  padding: 24px 24px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.password-dialog :deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
  color: #162640;
}

.password-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.password-dialog :deep(.el-form-item) {
  margin-bottom: 24px;
}

.password-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

.password-dialog :deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.password-dialog :deep(.el-input__wrapper:hover),
.password-dialog :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 2px 12px rgba(22, 38, 64, 0.15);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer :deep(.el-button) {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
}

.dialog-footer :deep(.el-button--primary) {
  background: linear-gradient(135deg, #162640 0%, #1e3a5f 100%);
  border: none;
}
</style>