<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { findAllDepartment } from '@/api/dept';

interface Dept {
  id: number;
  name: string;
  updateTime: string;
}

interface DeptForm {
  name: string;
}

// const deptTableData = ref<Dept[]>([]);
const deptTableData = ref<Dept[]>([ //testing
  { id: 1, name: 'HR', updateTime: '2024-01-01' },
  { id: 2, name: 'IT', updateTime: '2024-01-02' },
  { id: 3, name: 'Finance', updateTime: '2024-01-03' },
]);

const dialogFormVisible = ref<boolean>(false);
const dialogFormTitle = ref<string>('');
const dialogFormInput = ref<DeptForm>({ name: '' });
const dialogFormRef = ref<FormInstance | null>(null);

// const findAllDepartment = async () => {
//   const result = await findAllDepartment();
//   try {
//     if (result && result.data) {
//       deptTableData.value = result.data;
//     }
//   } catch (error) {
//     ElMessage.error('Failed to fetch departments');
//   } finally {
//     //
//   }
// }



const handleAddDepartment = () => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Add Department';
  dialogFormInput.value = { name: '' };
}

const handleEdit = () => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = 'Edit Department';

  // TODO
  // get department value
  // 


}

const handleDelete = () => {
  console.log('Delete button clicked');
}

const handleCloseDialogForm = () => {
  if (dialogFormRef && dialogFormRef.value) {
    dialogFormRef.value.resetFields();
  }
}

const handleDialogFormSubmit = () => {
  dialogFormVisible.value = false;
  // TODO
  // submit form add department
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
    <el-form :model="dialogFormInput" ref="dialogFormRef">
      <el-form-item label="Department Name" label-width="150px">
        <el-input v-model="dialogFormInput.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDialogFormSubmit">
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