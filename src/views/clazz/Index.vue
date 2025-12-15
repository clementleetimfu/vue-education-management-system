<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { type SearchClazzResponse, type SearchClazzRequest, searchClazz, type AddClazzRequest, addClazz, deleteClazz, findClazzById, type FindClazzByIdResponse, updateClazz } from '@/api/clazz';
import type { ApiResponse, PageResult } from '@/api/common';
import { findAllClassTeacher, type ClassTeacherResponse, type SearchEmployeeResponse } from '@/api/emp';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { findAllSubject, type SubjectFindAllResponse } from '@/api/subject';

interface SearchForm {
  name: string;
  startDate: string;
  endDate: string;
  clazzEndDateArr: string[]
}

const searchForm = reactive<SearchForm>({
  name: '',
  startDate: '',
  endDate: '',
  clazzEndDateArr: []
})

const clazzTableData = ref<SearchClazzResponse[]>([]);
const searchClazzRequest = reactive<SearchClazzRequest>({
  page: 1,
  pageSize: 10,
  name: '',
  startDate: '',
  endDate: ''
})
const total = ref<number>(0);
const pageSizes = ref<number[]>([10, 20, 25, 50, 100]);
const dialogFormVisible = ref<boolean>(false);
const dialogFormTitle = ref<string>('');
const now = new Date();
const dialogFormRef = ref<FormInstance | null>(null);
const dialogFormInput = reactive<AddClazzRequest & { id: number | null }>({
  id: null,
  name: '',
  startDate: '',
  endDate: '',
  teacherId: null,
  subject: null,
})
const subjectOptions = ref<{ label: string; value: number }[]>([]);
const teacherOptions = ref<{ label: string; value: number }[]>([]);

watch(() => searchForm.clazzEndDateArr, (newVal: string[]) => {
  if (newVal && newVal.length === 2) {
    searchForm.startDate = newVal[0] || '';
    searchForm.endDate = newVal[1] || '';
  }
});

const getSubjectOptions = async () => {
  try {
    const result: ApiResponse<SubjectFindAllResponse[]> = await findAllSubject();
    if (result?.code === 0) {
      subjectOptions.value = result?.data?.map((job: SubjectFindAllResponse) => ({
        label: job.name,
        value: job.id
      }));
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find all job titles");
  }
}

const getTeacherOptions = async () => {
  try {
    const result: ApiResponse<ClassTeacherResponse[]> = await findAllClassTeacher();
    if (result?.code === 0) {
      teacherOptions.value = result?.data?.map((teacher: ClassTeacherResponse) => ({
        label: teacher.name,
        value: teacher.id
      }));
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find all class teachers");
  }
}

const rules = reactive({
  name: [
    { required: true, message: 'Please enter class name', trigger: ['blur'] },
    { min: 2, max: 50, message: 'Class name length must be between 2 and 50 characters', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: 'Please select start date', trigger: ['change'] }
  ],
  endDate: [
    { required: true, message: 'Please select end date', trigger: ['change'] },
    {
      validator: async (_: any, value: string) => {

        if (!value) throw new Error("End date is required");

        const start = new Date(dialogFormInput.startDate).getTime();
        const end = new Date(value).getTime();

        if (isNaN(start) || isNaN(end)) return;

        if (end <= start) {
          throw new Error("End date must be after start date");
        }
      },
      trigger: "change"
    }
  ],
  teacherId: [
    { required: true, message: 'Please select teacher', trigger: ['change'] }
  ],
  subject: [
    { required: true, message: 'Please select subject', trigger: ['change'] }
  ]
})

const getClazzTableData = async () => {
  try {
    searchClazzRequest.name = searchForm.name;
    searchClazzRequest.startDate = searchForm.startDate;
    searchClazzRequest.endDate = searchForm.endDate;
    const result: ApiResponse<PageResult<SearchClazzResponse>> = await searchClazz(searchClazzRequest);
    if (result?.code === 0) {
      clazzTableData.value = result?.data?.rows;
      total.value = result?.data?.total;
    } else {
      clazzTableData.value = [];
    }
  } catch (error: any) {
    ElMessage.error("Failed to search class");
  }
}

const handleAddClazz = () => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Add Class';
}

const handleSearch = () => {
  getClazzTableData();
}

const handleClear = () => {
  searchForm.name = '';
  searchForm.startDate = '';
  searchForm.endDate = '';
  searchForm.clazzEndDateArr = [];
  getClazzTableData();
}

const handlePageSizeChange = (val: number) => {
  searchClazzRequest.pageSize = val;
  getClazzTableData();
}

const handlePageChange = (val: number) => {
  searchClazzRequest.page = val;
  getClazzTableData();
}

const handleEdit = async (id: number) => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Edit Class';
  try {
    const result: ApiResponse<FindClazzByIdResponse> = await findClazzById(id);
    if (result?.code === 0 && result?.data) {
      console.log(result?.data);


      Object.assign(dialogFormInput, result?.data);
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find class by id");
  }
}

const handleDelete = async (id: number) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this class?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
        try {
          const result: ApiResponse<boolean> = await deleteClazz(id);
          if (result?.code === 0 && result?.data) {
            ElMessage.success("Class deleted successfully");
            getClazzTableData();
          } else {
            ElMessage.error(result?.message);
          }
        } catch (error: any) {
          ElMessage.error("Failed to delete class");
        }
    })
    .catch(() => {
      ElMessage.info("Class deletion canceled");
    })
}

const handleDialogFormSubmit = async (type: string) => {
  if (!dialogFormRef.value) return;
  dialogFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    let actionType = type.trim().toLowerCase();
    try {
      if (actionType.includes('add')) {
        actionType = 'add';
        const result: ApiResponse<boolean> = await addClazz(dialogFormInput);
        if (result?.code === 0 && result?.data) {
          dialogFormVisible.value = false;
          ElMessage.success("Class added successfully");
          getClazzTableData();
        } else {
          ElMessage.error(result?.message);
        }
      } else if (actionType.includes("edit")) {
        actionType = 'edit';
        const result: ApiResponse<boolean> = await updateClazz(dialogFormInput);
        if (result?.code === 0 && result?.data) {
          dialogFormVisible.value = false;
          ElMessage.success("Class updated successfully");
          getClazzTableData();
        } else {
          ElMessage.error(result?.message);
        }
      }
    } catch (error: any) {
      ElMessage.error(`Failed to ${actionType} class`);
    }
  })
}

const handleCloseDialogForm = () => {
  dialogFormRef.value?.resetFields();
}

onMounted(() => {
  getClazzTableData();
  getSubjectOptions();
  getTeacherOptions();
})

</script>
<template>
  <h1>Class</h1>

  <el-form :inline="true" :model="searchForm" class="searchForm">

    <el-form-item label="Name">
      <el-input v-model="searchForm.name" placeholder="Search by class name" />
    </el-form-item>

    <el-form-item label="Class End Date">
      <el-date-picker v-model="searchForm.clazzEndDateArr" type="daterange" range-separator="To"
        start-placeholder="Select start date" end-placeholder="Select end date" value-format="YYYY-MM-DD" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch">Search</el-button>
      <el-button @click="handleClear">Clear</el-button>
    </el-form-item>
  </el-form>

  <el-button class="add-clazz-btn" type="primary" @click="handleAddClazz">+ Add Class</el-button>

  <el-table :data="clazzTableData" border style="width: 100%">
    <el-table-column type="index" label="No." width="50" align="center" />
    <el-table-column prop="clazzName" label="Class Name" align="center" />
    <el-table-column prop="teacherName" label="Teacher Name" width="200" align="center" />
    <el-table-column prop="startDate" label="Class Start Date" width="150" align="center" />
    <el-table-column prop="endDate" label="Class End Date" width="150" align="center" />
    <el-table-column label="Status" width="150" align="center">
      <template #default="{ row }">
        <el-tag v-if="now < new Date(row.startDate)" type="success">Scheduled</el-tag>
        <el-tag v-else-if="now >= new Date(row.startDate) && now <= new Date(row.endDate)"
          type="primary">Ongoing</el-tag>
        <el-tag v-else type="danger">Ended</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="updateTime" label="Update Time" width="200" align="center" />
    <el-table-column fixed="right" label="Actions" align="center">
      <template #default="{ row }">
        <el-button link type="primary" size="small" @click="handleEdit(row.id)">
          Edit
        </el-button>
        <el-button link type="danger" size="small" @click="handleDelete(row.id)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="30%" @close="handleCloseDialogForm">
    <el-form :model="dialogFormInput" ref="dialogFormRef" :rules="rules" label-width="auto">
      <el-form-item label="Class Name" prop="name">
        <el-input v-model="dialogFormInput.name" placeholder="Enter class name" />
      </el-form-item>
      <el-form-item label="Class Start Date" prop="startDate">
        <el-date-picker v-model="dialogFormInput.startDate" type="date" placeholder="Select start date"
          value-format="YYYY-MM-DD" style="width: 500px;" />
      </el-form-item>
      <el-form-item label="Class End Date" prop="endDate">
        <el-date-picker v-model="dialogFormInput.endDate" type="date" placeholder="Select end date"
          value-format="YYYY-MM-DD" style="width: 500px;" />
      </el-form-item>
      <el-form-item label="Class Teacher" prop="teacherId">
        <el-select v-model="dialogFormInput.teacherId" placeholder="Select teacher">
          <el-option v-for="teacher in teacherOptions" :key="teacher.value" :label="teacher.label"
            :value="teacher.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Subject" prop="subject">
        <el-select v-model="dialogFormInput.subject" placeholder="Select subject">
          <el-option v-for="subject in subjectOptions" :key="subject.value" :label="subject.label"
            :value="subject.value" />
        </el-select>
      </el-form-item>
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

  <el-pagination v-model:current-page="searchClazzRequest.page" v-model:page-size="searchClazzRequest.pageSize"
    :page-sizes="pageSizes" size="default" layout="total, sizes, prev, pager, next, jumper" :total="total"
    @size-change="handlePageSizeChange" @current-change="handlePageChange" />
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
</style>