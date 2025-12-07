<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadProps } from 'element-plus';
import type { ApiResponse, PageResult } from '@/api/common';
import type { SearchEmployeeResponse, SearchEmployeeRequest, WorkExperience, AddEmployeeRequest, FindEmployeeByIdResponse } from '@/api/emp';
import { searchEmployee, deleteEmployee, addEmployee, findEmployeeById, updateEmployee } from '@/api/emp';
import { findAllDepartment } from '@/api/dept';
import type { FindAllDepartmentResponse } from '@/api/dept';

interface SearchForm {
  name: string;
  gender: string;
  startDate: string;
  endDate: string;
  hireDateArr: string[]
}

const searchForm = reactive<SearchForm>({
  name: '',
  gender: '',
  startDate: '',
  endDate: '',
  hireDateArr: []
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
const dialogFormVisible = ref<boolean>(false);
const dialogFormTitle = ref<string>('');
const deptData = ref<FindAllDepartmentResponse[]>([]);
const dialogFormRef = ref<FormInstance | null>(null);
const dialogFormInput = reactive<AddEmployeeRequest & { id: number | null }>({
  id: null,
  image: '',
  username: '',
  name: '',
  gender: null,
  jobTitle: null,
  hireDate: '',
  deptId: null,
  phone: '',
  salary: null,
  workExpList: []
});
const token = ref<string>('');

let rules = reactive<FormRules<any>>({
  username: [
    { required: true, message: 'Username is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'Username length must be between 2 and 50 characters', trigger: 'blur' }
  ],
  name: [
    { required: true, message: 'Name is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'Name length must be between 2 and 50 characters', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: 'Gender is required', trigger: 'change' }
  ],
  phone: [
    { required: true, message: 'Phone number is required', trigger: 'blur' },
    { pattern: /^\d{10,15}$/, message: 'Phone number must be 10-15 digits', trigger: 'blur' }
  ],
  jobTitle: [
    { required: true, message: 'Job title is required', trigger: 'change' }
  ],
  deptId: [
    { required: true, message: 'Department is required', trigger: 'change' }
  ],
  salary: [
    { required: true, message: 'Salary is required', trigger: 'blur' },
    { pattern: /^\d+$/, message: 'Salary must be a number', trigger: 'blur' }
  ],
  hireDate: [
    { required: true, message: 'Hire Date is required', trigger: 'blur' }
  ],
});

const getToken = () => {
  token.value = `Bearer ${sessionStorage.getItem('token')}`
}

const addWorkExpRules = (workExpList: WorkExperience[]) => {
  const workExpRules: FormRules<any> = {};
  workExpList.forEach((_, index) => {
    workExpRules[`workExpList.${index}.periodArr`] = [
      { required: true, message: 'Work period is required', trigger: 'change' },
    ];
    workExpRules[`workExpList.${index}.companyName`] = [
      { required: true, message: 'Company name is required', trigger: 'blur' }
    ];
    workExpRules[`workExpList.${index}.jobTitle`] = [
      { required: true, message: 'Job title is required', trigger: 'blur' }
    ];
  });
  Object.assign(rules, workExpRules);
};

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

const jobTitleOptions = reactive([
  { label: 'Student Affairs Coordinator', value: 1 },
  { label: 'Curriculum Specialist', value: 2 },
  { label: 'Academic Advisor', value: 3 },
  { label: 'Career Counselor', value: 4 },
  { label: 'HR Manager', value: 5 },
  { label: 'Administrative Officer', value: 6 }
])

watch(() => searchForm.hireDateArr, (newVal: string[]) => {
  if (newVal && newVal.length === 2) {
    searchForm.startDate = newVal[0] || '';
    searchForm.endDate = newVal[1] || '';
  }
});

watch(() => dialogFormInput.workExpList, (newVal: WorkExperience[]) => {
  newVal.forEach((exp: WorkExperience) => {
    if (exp.periodArr && exp.periodArr.length === 2) {
      exp.startDate = exp.periodArr[0] || '';
      exp.endDate = exp.periodArr[1] || '';
    }
  });
}, { deep: true });

const getDeptTableData = async () => {
  try {
    const result: ApiResponse<FindAllDepartmentResponse[]> = await findAllDepartment();
    if (result?.code === 0) {
      deptData.value = result?.data;
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find all departments");
  }
}

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
  searchForm.hireDateArr = [];
  getEmpTableData();
}

const handleAddEmployee = () => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Add Employee';
  dialogFormInput.workExpList = [];
}

const deleteEmp = async () => {
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

const handleDeleteSelected = async () => {
  try {
    if (selectedIds.value.length === 0) {
      ElMessage.warning("Please select at least one employee to delete");
      return;
    }
    ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedIds.value.length} employee(s)?`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
      .then(async () => {
        deleteEmp();
      })
      .catch(() => {
        ElMessage.info("Employee deletion canceled");
      })
  } catch (error: any) {
    ElMessage.error("Failed to delete employee");
  }
}

const handleEdit = async (id: number) => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Edit Employee';
  try {
    const result: ApiResponse<FindEmployeeByIdResponse> = await findEmployeeById(id);
    if (result?.code === 0 && result?.data) {
      Object.assign(dialogFormInput, result?.data);
      result.data.workExpList.forEach((exp: WorkExperience) => {
        exp.periodArr = [exp.startDate, exp.endDate];
      });
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find employee by id");
  }
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
      deleteEmp();
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

const handleDialogFormSubmit = async (type: string) => {
  if (!dialogFormRef.value) return;
  addWorkExpRules(dialogFormInput.workExpList);
  dialogFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    let actionType = type.trim().toLowerCase();
    try {
      if (actionType.includes('add')) {
        actionType = 'add';
        const result: ApiResponse<boolean> = await addEmployee(dialogFormInput);
        if (result?.code === 0 && result?.data) {
          dialogFormVisible.value = false;
          ElMessage.success("Employee added successfully");
          getEmpTableData();
        } else {
          ElMessage.error(result?.message);
        }
      } else if (actionType.includes("edit")) {
        actionType = 'edit';
        const result: ApiResponse<boolean> = await updateEmployee(dialogFormInput);
        if (result?.code === 0 && result?.data) {
          dialogFormVisible.value = false;
          ElMessage.success("Employee updated successfully");
          getEmpTableData();
        } else {
          ElMessage.error(result?.message);
        }
      }
    } catch (error: any) {
      ElMessage.error(`Failed to ${actionType} employee`);
    }
  })
}

const handleAddWorkExperience = () => {
  dialogFormInput.workExpList.push({
    periodArr: [],
    startDate: '',
    endDate: '',
    companyName: '',
    jobTitle: ''
  });
}

const handleDeleteWorkExperience = (index: number) => {
  dialogFormInput.workExpList.splice(index, 1);
}

const handleCloseDialogForm = () => {
  dialogFormRef.value?.resetFields();
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Only image files are allowed')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('Image size must be less than 10MB')
    return false
  }
  return true
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  if (response?.code === 0 && response?.data) {
    dialogFormInput.image = response?.data;
  } else {
    ElMessage.error(response?.message);
  }
}

onMounted(() => {
  getEmpTableData();
  getDeptTableData();
  getToken();
});

</script>
<template>
  <h1>Employee</h1>

  <el-form :inline="true" :model="searchForm" class="searchForm">

    <el-form-item label="Name">
      <el-input v-model="searchForm.name" placeholder="Search by employee name" />
    </el-form-item>

    <el-form-item label="Gender">
      <el-select v-model="searchForm.gender" placeholder="Select gender" clearable>
        <el-option v-for="gender in genderOptions" :key="gender.value" :label="gender.label" :value="gender.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="Hire Date">
      <el-date-picker v-model="searchForm.hireDateArr" type="daterange" range-separator="To"
        start-placeholder="Start date" end-placeholder="End date" value-format="YYYY-MM-DD" />
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
    <el-table-column prop="gender" label="Gender" align="center">
      <template #default="{ row }">
        {{genderOptions.find(option => option.value === row.gender)?.label}}
      </template>
    </el-table-column>
    <el-table-column prop="image" label="Avatar" align="center">
      <template #default="{ row }">
        <el-image v-if="row.image" :src="row.image" fit="fill" style="height: 50px;" />
        <span v-else>N/A</span>
      </template>
    </el-table-column>
    <el-table-column prop="deptName" label="Department" align="center" />
    <el-table-column prop="jobTitle" label="Job Title" align="center">
      <template #default="{ row }">
        {{jobTitleOptions.find(option => option.value === row.jobTitle)?.label}}
      </template>
    </el-table-column>
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

  <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="55%" @close="handleCloseDialogForm">
    <el-form :model="dialogFormInput" label-width="160px" :rules="rules" ref="dialogFormRef">

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Username" prop="username">
            <el-input class="main-form-input" v-model="dialogFormInput.username"
              placeholder="Enter username (2-50 characters)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Name" prop="name">
            <el-input class="main-form-input" v-model="dialogFormInput.name"
              placeholder="Enter name (2-50 characters)" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Gender" prop="gender">
            <el-select class="main-form-input" v-model="dialogFormInput.gender" placeholder="Select gender">
              <el-option v-for="gender in genderOptions" :key="gender.value" :label="gender.label"
                :value="gender.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Phone" prop="phone">
            <el-input class="main-form-input" v-model="dialogFormInput.phone" placeholder="Enter phone number " />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Job Title" prop="jobTitle">
            <el-select class="main-form-input" v-model="dialogFormInput.jobTitle" placeholder="Select job title">
              <el-option v-for="jobTitle in jobTitleOptions" :key="jobTitle.value" :label="jobTitle.label"
                :value="jobTitle.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Salary" prop="salary">
            <el-input class="main-form-input" v-model="dialogFormInput.salary" placeholder="Enter salary" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Department" prop="deptId">
            <el-select class="main-form-input" v-model="dialogFormInput.deptId" placeholder="Select department">
              <el-option v-for="dept in deptData" :key="dept.id" :label="dept.name" :value="dept.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Hire Date" prop="hireDate">
            <el-date-picker v-model="dialogFormInput.hireDate" type="date" value-format="YYYY-MM-DD"
              placeholder="Select hire date" style="width: 300px" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="Avatar" prop="image">
        <el-upload class="avatar-uploader" action="/api/upload" :headers="{ 'Authorization': token }"
          :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="dialogFormInput.image" :src="dialogFormInput.image" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>

      <el-row>
        <el-col :span="24">
          <el-form-item label="Work Experience">
            <el-button type="success" size="small" @click="handleAddWorkExperience">+ Add Work Experience</el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-for="(workExp, index) in dialogFormInput.workExpList" :gutter="3">
        <el-col :span="10">
          <el-form-item label="Period" label-width="90px" size="small" :prop="`workExpList.${index}.periodArr`">
            <el-date-picker v-model="workExp.periodArr" type="daterange" range-separator="To"
              start-placeholder="Start date" end-placeholder="End date" value-format="YYYY-MM-DD" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Company" label-width="80px" size="small" :prop="`workExpList.${index}.companyName`">
            <el-input v-model="workExp.companyName" placeholder="Enter company name" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Job Title" label-width="80px" size="small" :prop="`workExpList.${index}.jobTitle`">
            <el-input v-model="workExp.jobTitle" placeholder="Enter job title" size="small" />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="danger" size="small" @click="handleDeleteWorkExperience(index)"
            style="margin-left: 5px;">Delete</el-button>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDialogFormSubmit(dialogFormTitle)">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.searchForm {
  margin-top: 20px;
}

.searchForm .el-input {
  width: 200px;
}

.searchForm .el-select {
  width: 200px;
}

.el-table {
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;
}

.main-form-input {
  width: 300px;
}

.avatar-uploader .avatar {
  width: 78px;
  height: 78px;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
  border: 1px dashed var(--el-border-color);
}
</style>