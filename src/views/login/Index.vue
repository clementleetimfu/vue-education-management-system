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
const dialogFormTitle = ref<string>('Set Your New Password');
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
    <el-form :model="loginForm" label-width="auto">

      <h1 class="title">EMS</h1>

      <el-form-item label="Username">
        <el-input v-model="loginForm.username" />
      </el-form-item>

      <el-form-item label="Password">
        <el-input v-model="loginForm.password" type="password" />
      </el-form-item>

      <div class="btn-group">
        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
          <el-button @click="handleClear">Clear</el-button>
        </el-form-item>
      </div>

    </el-form>
  </div>

  <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="30%" @close="handleCloseDialogForm">
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
  height: 100%;
  background-image: url('@/assets/login-background.jpg');
  display: flex;
  justify-content: center;
}

#container .el-form {
  width: 400px;
  height: 200px;
  margin: 200px auto;
  border-radius: 5px;
  padding: 20px;
  background-color: white;
}

.btn-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.el-dialog {
  height: 200px;
}
</style>