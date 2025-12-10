<script setup lang="ts">
import type { ApiResponse } from '@/api/common';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import * as echarts from 'echarts';
import { findStudentCountByClazz, findStudentEduLevelCount, type StudentCountByClazzResponse, type StudentEduLevelCountResponse } from '@/api/studentDash';

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
        data: studentCountByClazzData.clazzNameList,
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
        data: studentCountByClazzData.studentCountList,
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

const initStudentEduLevelCountChart = () => {
  type EChartsOption = echarts.EChartsOption;
  var chartDom = document.getElementById('studentEduLevelCountChart')!;
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
        data: studentEduLevelCountData.value.map((item) => ({
          value: item.count,
          name: item.educationLevel,
        }))
      }
    ]
  };
  option && myChart.setOption(option);
}

onMounted(() => {
  getStudentCountByClazz();
  getStudentEduLevelCount();
})

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