<script setup lang="ts">
import { findAllClazz, type ClazzFindAllResponse } from '@/api/clazz';
import type { ApiResponse, PageResult } from '@/api/common';
import { findAllEduLevel, type EduLevelFindAllResponse } from '@/api/eduLevel';
import { addStudent, deleteStudent, findStudentById, searchStudent, updateStudent, type AddStudentRequest, type FindStudentByIdResponse, type SearchStudentRequest, type SearchStudentResponse } from '@/api/student';
import { isDisabled } from '@/utils/permission';
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue'

interface SearchForm {
  name: string;
  educationLevel: number | null;
  clazzId: number | null;
}

const searchForm = reactive<SearchForm>({
  name: '',
  educationLevel: null,
  clazzId: null
})

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

const rules = reactive({
  name: [
    { required: true, message: 'Please input student name', trigger: ['blur'] },
    { min: 2, max: 50, message: 'Student name length must be between 2 and 50 characters', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: 'Please select student gender', trigger: ['change'] }
  ],
  birthdate: [
    { required: true, message: 'Please input student birth date', trigger: ['blur'] }
  ],
  phone: [
    { required: true, message: 'Please input student phone number', trigger: ['blur'] },
    { pattern: /^\d{10,15}$/, message: 'Phone number must be 10-15 digits', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please input student email', trigger: ['blur'] },
    {
      pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      message: 'Please enter a valid email address',
      trigger: ['blur']
    }
  ],
  address: [
    { required: true, message: 'Please input student address', trigger: ['blur'] },
    {
      max: 100,
      message: 'Address is too long',
      trigger: ['blur', 'input']
    }
  ],
  educationLevel: [
    { required: true, message: 'Please select student education level', trigger: ['change'] }
  ],

  clazzId: [
    { required: true, message: 'Please select student class', trigger: ['change'] }
  ],
  intakeDate: [
    { required: true, message: 'Please input student intake date', trigger: ['blur'] }
  ]
})

const clazzOptions = ref<{ label: string; value: number }[]>([]);
const educationOptions = ref<{ label: string; value: number }[]>([]);
const pageSizes = ref<number[]>([10, 20, 25, 50, 100]);
const total = ref<number>(0);
const studentTableData = ref<SearchStudentResponse[]>([]);
const searchStudentRequest = reactive<SearchStudentRequest>({
  page: 1,
  pageSize: 10,
  name: '',
  educationLevel: null,
  clazzId: null
})
const dialogFormVisible = ref<boolean>(false);
const dialogFormTitle = ref<string>('');
const dialogFormRef = ref<FormInstance | null>(null);
const dialogFormInput = reactive<AddStudentRequest & { id: number | null }>({
  id: null,
  name: '',
  gender: null,
  birthdate: '',
  phone: '',
  email: '',
  address: '',
  educationLevel: null,
  graduationDate: '',
  clazzId: null,
  intakeDate: ''
});
const selectedIds = ref<number[]>([]);
const disabledFlag = ref<boolean>(isDisabled());

const getStudentTableData = async () => {
  try {
    searchStudentRequest.name = searchForm.name;
    searchStudentRequest.educationLevel = searchForm.educationLevel;
    searchStudentRequest.clazzId = searchForm.clazzId;
    const result: ApiResponse<PageResult<SearchStudentResponse>> = await searchStudent(searchStudentRequest);
    if (result?.code === 0) {
      studentTableData.value = result?.data?.rows;
      total.value = result?.data?.total;
    } else {
      studentTableData.value = [];
      total.value = 0;
    }
  } catch (error: any) {
    ElMessage.error("Failed to search student");
  }
}

const getEducationLevelOptions = async () => {
  try {
    const result: ApiResponse<EduLevelFindAllResponse[]> = await findAllEduLevel();
    if (result?.code === 0) {
      educationOptions.value = result?.data?.map((edu: EduLevelFindAllResponse) => ({
        label: edu.name,
        value: edu.id
      }));
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find all classes");
  }
}
const getClazzOptions = async () => {
  try {
    const result: ApiResponse<ClazzFindAllResponse[]> = await findAllClazz();
    if (result?.code === 0) {
      clazzOptions.value = result?.data?.map((clazz: ClazzFindAllResponse) => ({
        label: clazz.name,
        value: clazz.id
      }));
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find all classes");
  }
}

const handleAddStudent = () => {
  dialogFormTitle.value = 'Add Student';
  dialogFormVisible.value = true;
  dialogFormInput.id = null;
  dialogFormInput.name = '';
  dialogFormInput.gender = null;
  dialogFormInput.birthdate = '';
  dialogFormInput.phone = '';
  dialogFormInput.email = '';
  dialogFormInput.address = '';
  dialogFormInput.educationLevel = null;
  dialogFormInput.graduationDate = '';
  dialogFormInput.clazzId = null;
  dialogFormInput.intakeDate = '';
}

const delStudent = async () => {
  try {
    const result: ApiResponse<boolean> = await deleteStudent(selectedIds.value);
    if (result?.code === 0) {
      ElMessage.success("Students deleted successfully");
      getStudentTableData();
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to delete student");
  }
}

const handleDeleteSelected = () => {
  try {
    if (selectedIds.value.length === 0) {
      ElMessage.warning("Please select at least one student to delete");
      return;
    }
    ElMessageBox.confirm(
      `Are you sure you want to delete ${selectedIds.value.length} student(s)?`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
      .then(async () => {
        delStudent();
      })
      .catch(() => {
        ElMessage.info("Student deletion canceled");
      })
  } catch (error: any) {
    ElMessage.error("Failed to delete student");
  }
}

const handleSearch = () => {
  getStudentTableData();
}

const handleClear = () => {
  searchForm.name = ''
  searchForm.educationLevel = null
  searchForm.clazzId = null
  getStudentTableData();
}

const handleSelectionChange = (newSelection: Array<SearchStudentResponse>) => {
  selectedIds.value = newSelection.map(item => item.id);
};

const handleEdit = async (id: number) => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Edit Student';
  try {
    const result: ApiResponse<FindStudentByIdResponse> = await findStudentById(id);
    if (result?.code === 0 && result?.data) {
      Object.assign(dialogFormInput, result?.data);
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find student by id");
  }
}

const handleDelete = (id: number) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this student?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      selectedIds.value = [id];
      delStudent();
    })
    .catch(() => {
      ElMessage.info("Student deletion canceled");
    })
}

const handlePageSizeChange = (val: number) => {
  searchStudentRequest.pageSize = val;
  getStudentTableData();
}

const handlePageChange = (val: number) => {
  searchStudentRequest.page = val;
  getStudentTableData();
}

const handleDialogFormSubmit = async (type: string) => {
  if (!dialogFormRef.value) return;
  dialogFormRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    let actionType = type.trim().toLowerCase();
    try {
      if (actionType.includes('add')) {
        actionType = 'add';
        const result: ApiResponse<boolean> = await addStudent(dialogFormInput);
        if (result?.code === 0 && result?.data) {
          dialogFormVisible.value = false;
          ElMessage.success("Student added successfully");
          getStudentTableData();
        } else {
          ElMessage.error(result?.message);
        }
      } else if (actionType.includes("edit")) {
        actionType = 'edit';
        const result: ApiResponse<boolean> = await updateStudent(dialogFormInput);
        if (result?.code === 0 && result?.data) {
          dialogFormVisible.value = false;
          ElMessage.success("Student updated successfully");
          getStudentTableData();
        } else {
          ElMessage.error(result?.message);
        }
      }
    } catch (error: any) {
      ElMessage.error(`Failed to ${actionType} student`);
    }
  })
}

const handleCloseDialogForm = () => {
  dialogFormRef.value?.resetFields();
}

onMounted(() => {
  getStudentTableData();
  getClazzOptions();
  getEducationLevelOptions();
});

</script>
<template>
  <h1>Student</h1>

  <el-form :inline="true" :model="searchForm" class="searchForm">

    <el-form-item label="Name">
      <el-input v-model="searchForm.name" placeholder="Search by student name" />
    </el-form-item>

    <el-form-item label="Education Level">
      <el-select v-model="searchForm.educationLevel" placeholder="Select education level" clearable
        style="width: 300px;">
        <el-option v-for="edu in educationOptions" :key="edu.value" :label="edu.label" :value="edu.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="Class">
      <el-select v-model="searchForm.clazzId" placeholder="Select class" clearable>
        <el-option v-for="clazz in clazzOptions" :key="clazz.value" :label="clazz.label" :value="clazz.value" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSearch">Search</el-button>
      <el-button @click="handleClear">Clear</el-button>
    </el-form-item>
  </el-form>

  <el-button :disabled="disabledFlag" @click="handleAddStudent" type="primary">+ Add Student</el-button>
  <el-button :disabled="disabledFlag" @click="handleDeleteSelected" type="danger">- Delete Selected</el-button>

  <el-table :data="studentTableData" border style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column prop="name" label="Name" align="center" />
    <el-table-column prop="no" label="No" align="center" />
    <el-table-column prop="gender" label="Gender" align="center" />
    <el-table-column prop="educationLevel" label="Education Level" align="center" />
    <el-table-column prop="clazzName" width="400" label="Class" align="center" />
    <el-table-column prop="intakeDate" label="Intake Date" align="center" />
    <el-table-column prop="updateTime" label="Last Updated" align="center" />
    <el-table-column fixed="right" label="Operations" min-width="120" align="center">
      <template #default="{ row }">
        <el-button :disabled="disabledFlag" link type="primary" size="small" @click="handleEdit(row.id)">
          Edit
        </el-button>
        <el-button :disabled="disabledFlag" link type="danger" size="small" @click="handleDelete(row.id)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination v-model:current-page="searchStudentRequest.page" v-model:page-size="searchStudentRequest.pageSize"
    :page-sizes="pageSizes" size="default" layout="total, sizes, prev, pager, next, jumper" :total="total"
    @size-change="handlePageSizeChange" @current-change="handlePageChange" />

  <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="60%" @close="handleCloseDialogForm">
    <el-form :model="dialogFormInput" label-width="150px" :rules="rules" ref="dialogFormRef">

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Name" prop="name">
            <el-input v-model="dialogFormInput.name" placeholder="Enter name (2-50 characters)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Gender" prop="gender">
            <el-select v-model="dialogFormInput.gender" placeholder="Select gender">
              <el-option v-for="gender in genderOptions" :key="gender.value" :label="gender.label"
                :value="gender.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Birthdate" prop="birthdate">
            <el-date-picker v-model="dialogFormInput.birthdate" type="date" value-format="YYYY-MM-DD"
              placeholder="Select birthdate" style="width: 350px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Phone" prop="phone">
            <el-input v-model="dialogFormInput.phone" placeholder="Enter phone number " />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Email" prop="email">
            <el-input v-model="dialogFormInput.email" placeholder="Enter email" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Address" prop="address">
            <el-input v-model="dialogFormInput.address" placeholder="Enter address" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Education Level" prop="educationLevel">
            <el-select v-model="dialogFormInput.educationLevel" placeholder="Select education level">
              <el-option v-for="edu in educationOptions" :key="edu.value" :label="edu.label" :value="edu.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Graduation Date" prop="graduationDate">
            <el-date-picker v-model="dialogFormInput.graduationDate" type="date" value-format="YYYY-MM-DD"
              placeholder="Select graduation date" style="width: 350px" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Class" prop="clazzId">
            <el-select v-model="dialogFormInput.clazzId" placeholder="Select class">
              <el-option v-for="clazz in clazzOptions" :key="clazz.value" :label="clazz.label" :value="clazz.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="dialogFormTitle === 'Add Student'" label="Intake Date" prop="intakeDate">
            <el-date-picker v-model="dialogFormInput.intakeDate" type="date" value-format="YYYY-MM-DD"
              placeholder="Select intake date" style="width: 350px" />
          </el-form-item>
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
  width: 400px;
}

.el-table {
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;
}

.el-dialog .el-input {
  width: 350px;
}

.el-dialog .el-select {
  width: 350px;
}
</style>