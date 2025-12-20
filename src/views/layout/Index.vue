<script setup lang="ts">
import { updatePassword, type UpdatePasswordRequest } from '@/api/auth';
import type { ApiResponse } from '@/api/common';
import { useEmployeeStore } from '@/stores/emp';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const empStore = useEmployeeStore();
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

const handleCloseDialogForm = (): void => {
  dialogFormVisible.value = false;
  dialogFormRef?.value?.resetFields();
}

const handleDialogFormSubmit = async () => {
  if (!dialogFormRef.value) return;
  dialogFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      dialogFormInput.id = empStore.id;
      const { confirmPassword, ...rest } = dialogFormInput;
      const result: ApiResponse<boolean> = await updatePassword(rest);
      if (result?.code === 0 && result?.data) {
        dialogFormVisible.value = false;
        ElMessage.success("Password updated successfully");
      } else {
        ElMessage.error(result?.message);
      }
    } catch (error: any) {
      ElMessage.error(`Failed to update employee password`);
    }
  })
}

const handleChangePassword = () => {
  dialogFormVisible.value = true;
  dialogFormInput.confirmPassword = '';
  dialogFormInput.password = '';
}

const handleLogout = () => {
  ElMessageBox.confirm(
    'Are you sure you want to logout?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      sessionStorage.removeItem('token');
      ElMessage({
        type: 'success',
        message: 'Logout successful',
      })
      router.push("/login");
      empStore.setUsername('');
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Logout canceled',
      })
    })
}

</script>
<template>
  <div id="common-layout">
    <el-container>
      <el-header class="header">
        <el-row align="middle">
          <el-col :span="20">
            <el-text class="header-left"><el-icon>
                <Management />
              </el-icon>Education Management System</el-text>
          </el-col>

          <el-col :span="4" class="header-right">
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-text class="header-username"><el-icon>
                    <Avatar />
                  </el-icon>&nbsp;&nbsp;{{ empStore.username }}</el-text>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleChangePassword"><el-icon>
                      <Lock />
                    </el-icon>&nbsp;Change Password</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout"><el-icon>
                      <SwitchButton />
                    </el-icon>&nbsp;Logout</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside class="aside" width="200px">

          <el-scrollbar class="aside-scroll">
            <el-menu router active-text-color="#4FC3F7" background-color="#162640" default-active="1" text-color="#fff">

              <el-sub-menu index="/dashboard">
                <template #title>
                  <el-icon>
                    <DataAnalysis />
                  </el-icon>
                  <span>Dashboard</span>
                </template>
                <el-menu-item index="/dash-emp">Employee</el-menu-item>
                <el-menu-item index="/dash-student">Student</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="/org">
                <template #title>
                  <el-icon>
                    <OfficeBuilding />
                  </el-icon>
                  <span>Organization</span>
                </template>
                <el-menu-item index="/dept">Department</el-menu-item>
                <el-menu-item index="/emp">Employee</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="/academic">
                <template #title>
                  <el-icon>
                    <School />
                  </el-icon>
                  <span>Academic</span>
                </template>
                <el-menu-item index="/clazz">Class</el-menu-item>
                <el-menu-item index="/stud">Student</el-menu-item>
              </el-sub-menu>

              <el-menu-item index="/log">
                <el-icon>
                  <Notebook />
                </el-icon>
                <span>Log</span>
              </el-menu-item>

            </el-menu>
          </el-scrollbar>

        </el-aside>

        <el-main class="main">
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
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
.el-row {
  height: 100%;
}

.header {
  background-color: #162640;
}

.header-left {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.header-username {
  color: white;
  font-size: 15px;
  margin-right: 20px;
}

#common-layout {
  height: 100%;
}

.el-container {
  height: 100%;
}

.aside {
  height: 100%;
  background-color: #162640;
}

.el-dropdown-link {
  outline: none;
}

::v-deep(.el-menu) {
  border-right: none;
}
</style>