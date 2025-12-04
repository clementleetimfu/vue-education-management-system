<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { editDepartment, addDepartment, findAllDepartment, deleteDepartment } from '@/api/dept';
import type { FindAllDepartmentResponse } from '@/api/dept';
import type { ApiResponse } from '@/api/common';

interface DeptForm {
  name: string;
}

const deptTableData = ref<FindAllDepartmentResponse[]>([]);
const dialogFormVisible = ref<boolean>(false);
const dialogFormTitle = ref<string>('');
const dialogFormInput = reactive<DeptForm>({ name: '' });
const dialogFormRef = ref<FormInstance | null>(null);
const currentEditId = ref<number>(0);

const rules = reactive<FormRules<DeptForm>>({
  name: [
    { required: true, message: 'Department name is required', trigger: 'blur' },
    { min: 2, max: 50, message: 'Length should be 2 to 50 characters', trigger: 'blur' },
  ],
});

onMounted(() => {
  findAllDept();
});

const findAllDept = async () => {
  try {
    const result: ApiResponse<FindAllDepartmentResponse[]> = await findAllDepartment();
    if (result?.code === 0) {
      deptTableData.value = result?.data;
    } else {
      ElMessage.error(result?.message);
    }
  } catch (error: any) {
    ElMessage.error("Failed to find all departments");
  }
}

const handleAddDepartment = () => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Add Department';
  dialogFormInput.name = '';
}

const handleEdit = async (row: FindAllDepartmentResponse) => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Edit Department';
  dialogFormInput.name = row?.name;
  currentEditId.value = row?.id;
}

const handleDelete = async (id: number) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this department?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        const result: ApiResponse<boolean> = await deleteDepartment(id);
        if (result?.code === 0 && result?.data) {
          ElMessage.success("Department deleted successfully");
          findAllDept();
        } else {
          ElMessage.error(result?.message);
        }
      } catch (error: any) {
        ElMessage.error("Failed to delete department");
      }
    })
    .catch(() => {
      ElMessage.info("Department deletion canceled");
    })
}

const handleCloseDialogForm = () => {
  dialogFormRef?.value?.resetFields();
}

const handleDialogFormSubmit = async (type: string) => {
  if (!dialogFormRef.value) return;
  await dialogFormRef.value.validate(async (valid) => {
    if (!valid) return;
    const actionType = type.trim().toLowerCase();
    try {
      if (actionType.includes('add')) {
        const result: ApiResponse<boolean> = await addDepartment(dialogFormInput);
        if (result?.code === 0 && result?.data) {
          ElMessage.success("Department added successfully");
          dialogFormVisible.value = false;
          findAllDept();
        } else {
          ElMessage.error(result?.message);
        }
      } else if (actionType.includes('edit')) {
        const result: ApiResponse<boolean> = await editDepartment({ id: currentEditId.value, name: dialogFormInput.name });
        if (result?.code === 0 && result?.data) {
          ElMessage.success("Department edited successfully");
          dialogFormVisible.value = false;
          findAllDept();
        } else {
          ElMessage.error(result?.message);
        }
      }
    } catch (error: any) {
      ElMessage.error(`Failed to submit ${actionType} department form`);
    }
  })
}

</script>

<template>
  <h1>Department</h1>

  <el-button class="add-dept-btn" type="primary" @click="handleAddDepartment">+ Add Department</el-button>

  <el-table :data="deptTableData" border style="width: 100%">
    <el-table-column type="index" label="No." width="100" align="center" />
    <el-table-column prop="name" label="Department Name" align="center" />
    <el-table-column prop="updateTime" label="Update Time" align="center" />
    <el-table-column fixed="right" label="Actions" align="center">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="handleEdit(row)">
          Edit
        </el-button>
        <el-button type="danger" size="small" @click="handleDelete(row.id)">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="30%" @close="handleCloseDialogForm">
    <el-form :model="dialogFormInput" ref="dialogFormRef" :rules="rules">
      <el-form-item label="Department Name" label-width="150px" prop="name">
        <el-input v-model="dialogFormInput.name" />
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

</template>

<style scoped>
.add-dept-btn {
  margin: 20px 0;
}
</style>