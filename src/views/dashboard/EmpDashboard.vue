<script setup lang="ts">
import type { ApiResponse } from '@/api/common';
import { findEmpJobTitleCount, findEmpGenderCount } from '@/api/empDash';
import type { EmpJobTitleCountResponse, EmpGenderCountResponse } from '@/api/empDash';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { getBarChartOption, getPieChartOption } from '@/utils/chartTheme';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

const empJobTitleCountData = reactive<EmpJobTitleCountResponse>({
  jobTitleList: [],
  jobTitleCountList: [],
});

const empGenderCountData = ref<EmpGenderCountResponse[]>([]);

const getEmpJobTitleCount = async () => {
  try {
    const result: ApiResponse<EmpJobTitleCountResponse> = await findEmpJobTitleCount();
    if (result?.code === 0 && result?.data) {
      empJobTitleCountData.jobTitleList = result?.data?.jobTitleList;
      empJobTitleCountData.jobTitleCountList = result?.data?.jobTitleCountList;
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to get employee job title count");
  } finally {
    initEmpJobTitleCountChart();
  }
}

const getEmpGenderCount = async () => {
  try {
    const result: ApiResponse<EmpGenderCountResponse[]> = await findEmpGenderCount();
    if (result?.code === 0 && result?.data) {
      empGenderCountData.value = result?.data;
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to get employee gender count");
  } finally {
    initEmpGenderCountChart();
  }
}

const initEmpJobTitleCountChart = () => {
  type EChartsOption = echarts.EChartsOption;
  var chartDom = document.getElementById('empJobTitleCountChart')!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  option = getBarChartOption(
    empJobTitleCountData.jobTitleList,
    empJobTitleCountData.jobTitleCountList,
    ['#3b82f6', '#1d4ed8']
  );
  
  option && myChart.setOption(option);
}

const initEmpGenderCountChart = () => {
  type EChartsOption = echarts.EChartsOption;
  var chartDom = document.getElementById('empGenderCountChart')!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  const data = empGenderCountData.value.length > 0 ?
    empGenderCountData.value.map((item) => ({
      value: item.count,
      name: item.gender,
      itemStyle: {
        color: item.gender === 'Male'
          ? new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: '#3b82f6' },
            { offset: 1, color: '#1d4ed8' }
          ])
          : item.gender === 'Female'
            ? new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#f472b6' },
              { offset: 1, color: '#db2777' }
            ])
            : undefined
      }
    })) : [{ value: 0, name: 'No Data' }];

  option = getPieChartOption(data);
  option && myChart.setOption(option);
}

onMounted(() => {
  getEmpJobTitleCount();
  getEmpGenderCount();
});

watch(() => themeStore.isDark, () => {
  getEmpJobTitleCount();
  getEmpGenderCount();
});

</script>
<template>
  <h1>Employee Dashboard</h1>

  <div id="container">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="dashboard-container" id="empJobTitleCountChart"></div>
      </el-col>
      <el-col :span="12">
        <div class="dashboard-container" id="empGenderCountChart"></div>
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