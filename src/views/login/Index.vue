<script setup lang="ts">
import { reactive } from 'vue';
import type { LoginRequest as  LoginForm} from '@/api/login';
import { ElMessage } from 'element-plus';
import { useEmployeeStore } from '@/stores/emp';
import { login } from '@/api/login';
import type { ApiResponse } from '@/api/common';
import type { LoginResponse } from '@/api/login';
import { useRouter } from 'vue-router';

const router = useRouter();
const empStore = useEmployeeStore();

const loginForm = reactive<LoginForm>({
  username: '',
  password: '',
});

const handleLogin = async (): Promise<void> => {
  try {
    const result: ApiResponse<LoginResponse> = await login(loginForm);
    if (result?.code === 0) {
      const token: string = result.data.token || '';
      const username: string = result.data.username || '';
      localStorage.setItem('token', token);
      empStore.setUsername(username);
      router.push("/dash-emp");
      ElMessage.success('Login success');
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

</script>
<template>
  <div id="container">
    <el-form :model="loginForm" label-width="auto">
      
      <h1 class="title">EMS</h1>
      
      <el-form-item label="Username">
        <el-input v-model="loginForm.username" />
      </el-form-item>

      <el-form-item label="Password">
        <el-input v-model="loginForm.password" type="password"/>
      </el-form-item>

      <div class="btn-group">
        <el-form-item>
          <el-button type="primary" @click="handleLogin">Login</el-button>
          <el-button @click="handleClear">Clear</el-button>
        </el-form-item>
      </div>
      
    </el-form>
  </div>
</template>

<style scoped>
#container {
  height: 100%;
  background-image: url('@/assets/login-background.jpg');
  display: flex;
  justify-content: center;
}

.el-form {
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
</style>