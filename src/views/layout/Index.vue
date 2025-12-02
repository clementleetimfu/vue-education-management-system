<script setup lang="ts">

const handleLogout = () => {
  console.log('logout');
}

</script>
<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <el-text class="header-left"><el-icon>
            <Management />
          </el-icon>Education Management System</el-text>
        <el-text class="header-username"><el-icon>
            <Avatar />
          </el-icon>&nbsp;Clement</el-text>
        <el-button class="header-logout-button" color="#162640"><el-icon>
            <SwitchButton />
          </el-icon>&nbsp;Logout</el-button>
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
              <el-menu-item index="/dash-clazz-stud">Class & Student</el-menu-item>
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
.header {
  display: flex;
  align-items: center;
  background-color: #162640;
}

.header-left {
  flex: 1;
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.header-username {
  color: white;
  font-size: 15px;
  margin-right: 10px;
}

.header-logout-button {
  font-size: 15px;
}

.common-layout {
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