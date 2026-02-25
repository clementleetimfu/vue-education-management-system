<script setup lang="ts">
import type { ApiResponse } from '@/api/common';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { findStudentCountByClazz, findStudentEduLevelCount, type StudentCountByClazzResponse, type StudentEduLevelCountResponse } from '@/api/studentDash';
import { getBarChartOption, getPieChartOption } from '@/utils/chartTheme';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

const studentCountByClazzData = reactive<StudentCountByClazzResponse>({
  clazzNameList: [],
  studentCountList: [],
});

const studentEduLevelCountData = ref<StudentEduLevelCountResponse[]>([]);

const getStudentCountByClazz = async () => {
  try {
    const result: ApiResponse<StudentCountByClazzResponse> = await findStudentCountByClazz();
    if (result?.code === 0 && result?.data) {
      studentCountByClazzData.clazzNameList = result?.data?.clazzNameList;
      studentCountByClazzData.studentCountList = result?.data?.studentCountList;
      initStudentCountByClazzChart();
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to get student count by clazz");
  }
}

const getStudentEduLevelCount = async () => {
  try {
    const result: ApiResponse<StudentEduLevelCountResponse[]> = await findStudentEduLevelCount();
    if (result?.code === 0 && result?.data) {
      studentEduLevelCountData.value = result?.data;
      initStudentEduLevelCountChart();
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to get student education level count");
  }
}

const initStudentCountByClazzChart = () => {
  type EChartsOption = echarts.EChartsOption;
  var chartDom = document.getElementById('studentCountByClazzChart')!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  option = getBarChartOption(
    studentCountByClazzData.clazzNameList,
    studentCountByClazzData.studentCountList,
    ['#f97316', '#ea580c']
  );
  
  option && myChart.setOption(option);
}

const initStudentEduLevelCountChart = () => {
  type EChartsOption = echarts.EChartsOption;
  var chartDom = document.getElementById('studentEduLevelCountChart')!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  const pieData = studentEduLevelCountData.value.map((item, index) => ({
    value: item.count,
    name: item.educationLevel,
    itemStyle: {
      color: ['#f97316', '#fb923c', '#fbbf24', '#ef4444', '#ec4899'][index % 5]
    }
  }));

  option = getPieChartOption(pieData);
  option && myChart.setOption(option);
}

onMounted(() => {
  getStudentCountByClazz();
  getStudentEduLevelCount();
});

watch(() => themeStore.isDark, () => {
  getStudentCountByClazz();
  getStudentEduLevelCount();
});

</script>
<template>
  <h1>Student Dashboard</h1>

  <div id="container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="dashboard-container" id="studentCountByClazzChart"></div>
      </el-col>
      <el-col :span="12">
        <div class="dashboard-container" id="studentEduLevelCountChart"></div>
      </el-col>
    </el-row>
  </div>

</template>

<style scoped>
#container {
  margin-top: 20px;
  min-height: calc(100vh - 180px);
}

.el-row {
  min-height: calc(100vh - 180px);
}

.el-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dashboard-container {
  width: 100%;
  height: 400px;
}
</style>