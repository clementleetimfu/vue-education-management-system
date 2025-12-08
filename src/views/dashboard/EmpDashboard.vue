<script setup lang="ts">
import type { ApiResponse } from '@/api/common';
import { findEmpJobTitleCount, findEmpGenderCount } from '@/api/dashEmp';
import type { EmpJobTitleCountResponse, EmpGenderCountResponse } from '@/api/dashEmp';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';

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
      initEmpJobTitleCountChart();
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to get employee job title count");
  }
}

const getEmpGenderCount = async () => {
  try {
    const result: ApiResponse<EmpGenderCountResponse[]> = await findEmpGenderCount();
    if (result?.code === 0 && result?.data) {
      empGenderCountData.value = result?.data;
      initEmpGenderCountChart();
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to get employee gender count");
  }
}

const initEmpJobTitleCountChart = () => {
  type EChartsOption = echarts.EChartsOption;
  var chartDom = document.getElementById('empJobTitleCountChart')!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: empJobTitleCountData.jobTitleList,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          rotate: 20,
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Count',
        type: 'bar',
        barWidth: '60%',
        data: empJobTitleCountData.jobTitleCountList,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: '#1890ff' },
            { offset: 1, color: '#162640' }
          ])
        }
      }
    ]
  };
  option && myChart.setOption(option);
}

const initEmpGenderCountChart = () => {
  type EChartsOption = echarts.EChartsOption;
  var chartDom = document.getElementById('empGenderCountChart')!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: empGenderCountData.value.map((item) => ({
          value: item.count,
          name: item.gender,
          itemStyle: {
            color: item.gender === 'Male' ? '#1890ff' : item.gender === 'Female' ? '#ff99cc' : undefined
          }
        }))
      }
    ]
  };
  option && myChart.setOption(option);
}

onMounted(() => {
  getEmpJobTitleCount();
  getEmpGenderCount();
})

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
  height: 100%;
}

.el-row {
  height: 100%;
}

.el-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dashboard-container {
  width: 80%;
  height: 80%;
}
</style>