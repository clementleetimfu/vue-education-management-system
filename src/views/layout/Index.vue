<script setup lang="ts">
import { useEmployeeStore } from '@/stores/emp';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const empStore = useEmployeeStore();

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
            <el-text class="header-username"><el-icon>
                <Avatar />
              </el-icon>&nbsp;{{ empStore.username }}</el-text>
            <el-button link @click="handleLogout" class="header-logout-button" color="#162640"><el-icon>
                <SwitchButton />
              </el-icon>&nbsp;Logout</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside class="aside" width="200px">

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
        </el-aside>

        <el-main class="main">
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
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

.header-logout-button {
  font-size: 15px;
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
</style>