<script setup lang="ts">
import { logout, updatePassword, type UpdatePasswordRequest } from '@/api/auth';
import type { ApiResponse } from '@/api/common';
import { useEmployeeStore } from '@/stores/emp';
import { isDisabled } from '@/utils/permission';
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
  background: linear-gradient(135deg, #162640 0%, #1e3a5f 100%);
  box-shadow: 0 4px 20px rgba(22, 38, 64, 0.3);
}

.header-left {
  color: white;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.header-left .el-icon {
  font-size: 26px;
  margin-right: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.header-username {
  color: white;
  font-size: 15px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.header-username:hover {
  background: rgba(255, 255, 255, 0.2);
}

.header-username .el-icon {
  font-size: 18px;
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
  background: linear-gradient(180deg, #162640 0%, #1e3a5f 100%);
  box-shadow: 4px 0 20px rgba(22, 38, 64, 0.2);
}

.aside-scroll {
  height: 100%;
}

::v-deep(.el-scrollbar__wrap) {
  overflow-x: hidden;
}

::v-deep(.el-scrollbar__bar) {
  opacity: 0;
}

::v-deep(.el-menu) {
  border-right: none;
  background: transparent;
}

::v-deep(.el-menu-item),
::v-deep(.el-sub-menu__title) {
  margin: 4px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
}

::v-deep(.el-menu-item:hover),
::v-deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateX(4px);
}

::v-deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #4FC3F7 0%, #29b6f6 100%) !important;
  color: #162640 !important;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(79, 195, 247, 0.4);
}

::v-deep(.el-sub-menu) {
  margin-bottom: 4px;
}

::v-deep(.el-sub-menu__title .el-icon) {
  font-size: 18px;
}

::v-deep(.el-menu-item .el-icon) {
  font-size: 18px;
  margin-right: 8px;
}

::v-deep(.el-sub-menu .el-menu-item) {
  padding-left: 48px !important;
  margin: 3px 8px;
  border-radius: 6px;
}

.main {
  background: #f5f7fa;
  padding: 24px;
}

.el-dropdown-menu {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border: none;
  padding: 8px;
}

::v-deep(.el-dropdown-menu__item) {
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin: 4px 0;
}

::v-deep(.el-dropdown-menu__item:hover) {
  background: rgba(22, 38, 64, 0.08);
  transform: translateX(2px);
}

::v-deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 8px;
  font-size: 16px;
}
</style>