<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { findActivityLog } from '@/api/log';
import type { ApiResponse, PageResult } from '@/api/common';
import type { FindActivityLogResponse, Page } from '@/api/log';

const logTableData = ref<FindActivityLogResponse[]>([]);
const pageData = reactive<Page>({
  page: 1,
  pageSize: 10,
})
const total = ref<number>(0);
const pageSizes = ref<number[]>([10, 20, 25, 50, 100]);

const getLogTableData = async () => {
  try {
    const result: ApiResponse<PageResult<FindActivityLogResponse>> = await findActivityLog(pageData);
    if (result?.code === 0) {
      logTableData.value = result?.data?.rows;
      total.value = result?.data?.total;
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find activity log");
  }
}

const handlePageSizeChange = (val: number) => {
  pageData.pageSize = val;
  getLogTableData();
}

const handlePageChange = (val: number) => {
  pageData.page = val;
  getLogTableData();
}

onMounted(() => {
  getLogTableData();
});

</script>
<template>
  <el-table :data="logTableData" border style="width: 100%">
    <el-table-column prop="operator" label="Operator" width="180" align="center" />
    <el-table-column prop="operateTime" label="Operate Time" width="180" align="center" />
    <el-table-column prop="className" label="Class Name" align="center" />
    <el-table-column prop="methodName" label="Method Name" align="center" />
    <el-table-column prop="duration" label="Time Cost（ms）" align="center" />
    <el-table-column prop="methodParams" label="Method Parameters" align="center" />
    <el-table-column prop="returnValue" label="Return Value" align="center" />
  </el-table>
  <el-pagination v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize" :page-sizes="pageSizes"
    size="default" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handlePageSizeChange"
    @current-change="handlePageChange" />
</template>

<style scoped>
.el-pagination {
  margin-top: 20px;
}
</style>