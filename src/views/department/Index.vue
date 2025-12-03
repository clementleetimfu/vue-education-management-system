<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { addDepartment, findAllDepartment } from '@/api/dept';
import type { FindAllDepartmentResponse, AddDepartmentRequest as DeptForm} from '@/api/dept';
import type { ApiResponse } from '@/api/common';
import { ca } from 'element-plus/es/locales.mjs';

const deptTableData = ref<FindAllDepartmentResponse[]>([]);
const dialogFormVisible = ref<boolean>(false);
const dialogFormTitle = ref<string>('');
const dialogFormInput = reactive<DeptForm>({ name: '' });
const dialogFormRef = ref<FormInstance | null>(null);

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
    const result: ApiResponse<FindAllDepartmentResponse[]>= await findAllDepartment();
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

const handleEdit = () => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Edit Department';

  // TODO
  // get department value
  // 


}

const handleDelete = async () => {




}

const handleCloseDialogForm = () => {
  if (dialogFormRef && dialogFormRef.value) {
    dialogFormRef.value.resetFields();
  }
}

const handleDialogFormSubmit = async (type: string) => {
  const actionType = type.trim().toLowerCase()
  try {
    if (actionType.includes('add')) {
      const result: ApiResponse<boolean> = await addDepartment(dialogFormInput);
      if (result?.code === 0) {
        ElMessage.success("Department added successfully");
        dialogFormVisible.value = false;
        findAllDept();
      } else {
        ElMessage.error(result?.message);
      }
    } else if (actionType.includes('edit')) {
      // TODO
      // edit department logic

    }
  } catch (error: any) {
    ElMessage.error(`Failed to submit ${actionType} department form`);
  }
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
      <template #default>
        <el-button type="primary" size="small" @click="handleEdit">
          Edit
        </el-button>
        <el-button type="danger" size="small" @click="handleDelete">Delete</el-button>
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