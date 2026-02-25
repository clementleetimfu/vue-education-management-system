<script setup lang="ts">
import { logout, updatePassword, type UpdatePasswordRequest } from '@/api/auth';
import type { ApiResponse } from '@/api/common';
import { useEmployeeStore } from '@/stores/emp';
import { isDisabled } from '@/utils/permission';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme';
import ThemeToggle from '@/components/ThemeToggle.vue';

const router = useRouter();
const empStore = useEmployeeStore();
const themeStore = useThemeStore();
const dialogFormVisible = ref<boolean>(false);
const dialogFormTitle = ref<string>('Set your new password');
const dialogFormRef = ref<FormInstance | null>(null);
const dialogFormInput = reactive<UpdatePasswordRequest & { confirmPassword: string }>({
  id: null,
  password: '',
  confirmPassword: '',
});
const disabledFlag = ref<boolean>(isDisabled());

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
    .then(async () => {
      try {
        await logout();
      } catch (error: any) {
        ElMessage.error(`Failed to logout`);
      }
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
      <el-header class="header glass">
        <el-row align="middle">
          <el-col :span="18">
            <el-text class="header-left"><el-icon>
                <Management />
              </el-icon>Education Management</el-text>
          </el-col>

          <el-col :span="6" class="header-right">
            <ThemeToggle />
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-text class="header-username"><el-icon>
                    <Avatar />
                  </el-icon>&nbsp;&nbsp;{{ empStore.username }}</el-text>
              </span>
              <template #dropdown>
                <el-dropdown-menu class="glass-dropdown">
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
        <el-aside class="aside glass">

          <el-scrollbar class="aside-scroll">
            <el-menu 
              router 
              active-text-color="var(--accent)" 
              background-color="transparent" 
              default-active="1" 
              text-color="var(--text-secondary)"
              class="glass-menu"
            >

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

              <el-menu-item index="/log" v-if="!disabledFlag">
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
.el-row {
  height: 100%;
}

.header {
  background: var(--header-bg) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--glass-border);
  box-shadow: 0 4px 24px var(--glass-shadow);
  transition: all 0.4s ease;
}

.header-left {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  font-family: var(--font-display);
  transition: color 0.4s ease;
}

.header-left .el-icon {
  font-size: 24px;
  margin-right: 10px;
  color: var(--accent);
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.header-username {
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
}

.header-username:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
}

.header-username .el-icon {
  font-size: 16px;
}

.el-dropdown-link {
  outline: none;
  cursor: pointer;
}

#common-layout {
  height: 100%;
  overflow: hidden;
}

.el-container {
  height: 100%;
}

.aside {
  height: 100%;
  background: var(--aside-bg) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid var(--glass-border);
  box-shadow: 4px 0 24px var(--glass-shadow);
  transition: all 0.4s ease;
}

.aside-scroll {
  height: 100%;
}

:deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

:deep(.el-scrollbar__bar) {
  opacity: 0;
}

:deep(.el-menu) {
  border-right: none;
  background: transparent;
  padding: 12px;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  margin: 4px 0;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: var(--text-secondary);
  font-family: var(--font-body);
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background: var(--glass-bg) !important;
  transform: translateX(4px);
}

:deep(.el-menu-item.is-active) {
  background: var(--accent-light) !important;
  color: var(--accent) !important;
  font-weight: 600;
  border: 1px solid var(--accent);
}

:deep(.el-sub-menu) {
  margin-bottom: 4px;
}

:deep(.el-sub-menu__title .el-icon) {
  font-size: 18px;
}

:deep(.el-menu-item .el-icon) {
  font-size: 18px;
  margin-right: 10px;
}

:deep(.el-sub-menu .el-menu-item) {
  padding-left: 52px !important;
  margin: 2px 8px;
  border-radius: 10px;
}

.main {
  background: var(--main-bg);
  padding: 24px;
  transition: background 0.4s ease;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.glass-dropdown {
  background: var(--card-bg) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 16px !important;
  box-shadow: 0 8px 32px var(--glass-shadow);
  padding: 8px;
}

:deep(.el-dropdown-menu) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.el-dropdown-menu__item) {
  padding: 12px 20px;
  border-radius: 10px;
  transition: all 0.3s ease;
  margin: 4px 0;
  color: var(--text-secondary);
}

:deep(.el-dropdown-menu__item:hover) {
  background: var(--glass-bg) !important;
  color: var(--text-primary);
  transform: translateX(2px);
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 10px;
  font-size: 16px;
}

.dialog-footer :deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%);
  border: none;
}

:deep(.glass-dialog .el-dialog) {
  background: var(--card-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
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
