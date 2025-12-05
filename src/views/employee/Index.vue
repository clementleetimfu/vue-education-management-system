<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ApiResponse, PageResult } from '@/api/common';
import type { SearchEmployeeResponse, SearchEmployeeRequest } from '@/api/emp';
import { searchEmployee, deleteEmployee } from '@/api/emp';

interface SearchForm {
  name: string;
  gender: string;
  startDate: string;
  endDate: string;
  dateArr: string[]
}

const searchForm = reactive<SearchForm>({
  name: '',
  gender: '',
  startDate: '',
  endDate: '',
  dateArr: []
})

const empTableDate = ref<SearchEmployeeResponse[]>([]);
const searchEmployeeRequest = reactive<SearchEmployeeRequest>({
  page: 1,
  pageSize: 10,
  name: '',
  gender: '',
  startDate: '',
  endDate: ''
})

const total = ref<number>(0);
const pageSizes = ref<number[]>([10, 20, 25, 50, 100]);
const selectedIds = ref<number[]>([]);

const genderOptions = reactive([
  {
    label: 'Male',
    value: 1
  },
  {
    label: 'Female',
    value: 2
  }
])

watch(() => searchForm.dateArr, (newVal: string[]) => {
  if (newVal && newVal.length === 2) {
    searchForm.startDate = newVal[0] || '';
    searchForm.endDate = newVal[1] || '';
  }
});

const getEmpTableData = async () => {
  try {
    searchEmployeeRequest.name = searchForm.name || '';
    searchEmployeeRequest.gender = searchForm.gender || '';
    searchEmployeeRequest.startDate = searchForm.startDate || '';
    searchEmployeeRequest.endDate = searchForm.endDate || '';
    const result: ApiResponse<PageResult<SearchEmployeeResponse>> = await searchEmployee(searchEmployeeRequest);
    if (result?.code === 0) {
      empTableDate.value = result?.data?.rows;
      total.value = result?.data?.total;
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to search employee");
  }
}

const handleSearch = async () => {
  getEmpTableData();
}

const handleClear = () => {
  searchForm.name = '';
  searchForm.gender = '';
  searchForm.startDate = '';
  searchForm.endDate = '';
  searchForm.dateArr = [];
  getEmpTableData();
}

const handleAddEmployee = () => {
  // dialogFormVisible.value = true;
}

const handleDeleteSelected = async () => {
  try {
    const result: ApiResponse<boolean> = await deleteEmployee(selectedIds.value);
    if (result?.code === 0) {
      ElMessage.success("Employees deleted successfully");
      getEmpTableData();
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to delete employee");
  }
}

const handleEdit = (row: Employee) => {
  console.log(row);
}

const handleDelete = async (id: number) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this employee?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      selectedIds.value = [id];
      handleDeleteSelected();
    })
    .catch(() => {
      ElMessage.info("Employee deletion canceled");
    })
}

const handleSelectionChange = (newSelection: Array<SearchEmployeeResponse>) => {
  selectedIds.value = newSelection.map(item => item.id);
};

const handlePageSizeChange = (val: number) => {
  searchEmployeeRequest.pageSize = val;
  getEmpTableData();
}

const handlePageChange = (val: number) => {
  searchEmployeeRequest.page = val;
  getEmpTableData();
}

onMounted(() => {
  getEmpTableData();
});

</script>
<template>
  <h1>Employee</h1>

  <el-form :inline="true" :model="searchForm" class="demo-form-inline">

    <el-form-item label="Name">
      <el-input v-model="searchForm.name" placeholder="Search by employee name" clearable />
    </el-form-item>

    <el-form-item label="Gender">
      <el-select v-model="searchForm.gender" placeholder="Select gender" clearable>
        <el-option v-for="gender in genderOptions" :key="gender.value" :label="gender.label" :value="gender.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="Hire Date">
      <el-date-picker v-model="searchForm.dateArr" type="daterange" range-separator="To" start-placeholder="Start date"
        end-placeholder="End date" value-format="YYYY-MM-DD" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch">Search</el-button>
      <el-button @click="handleClear">Clear</el-button>
    </el-form-item>
  </el-form>

  <el-button @click="handleAddEmployee" type="primary">+ Add Employee</el-button>
  <el-button @click="handleDeleteSelected" type="danger">- Delete Selected</el-button>

  <el-table :data="empTableDate" border style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column prop="name" label="Name" align="center" />
    <el-table-column prop="gender" label="Gender" align="center" />
    <el-table-column prop="image" label="Avatar" align="center" />
    <el-table-column prop="deptName" label="Department" align="center" />
    <el-table-column prop="jobTitle" label="Job Title" align="center" />
    <el-table-column prop="hireDate" label="Hire Date" align="center" />
    <el-table-column prop="updateTime" label="Last Updated" align="center" />
    <el-table-column fixed="right" label="Operations" min-width="120" align="center">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="handleEdit(row.id)">
          Edit
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row.id)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="searchEmployeeRequest.page" v-model:page-size="searchEmployeeRequest.pageSize"
    :page-sizes="pageSizes" size="default" layout="total, sizes, prev, pager, next, jumper" :total="total"
    @size-change="handlePageSizeChange" @current-change="handlePageChange" />

</template>

<style scoped>
.el-form {
  margin-top: 20px;
}

.el-input {
  width: 200px;
}

.el-select {
  width: 200px;
}

.el-table {
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;
}
</style>