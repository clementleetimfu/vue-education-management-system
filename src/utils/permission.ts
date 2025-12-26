import { RoleEnum } from "@/constants/role";
import { useEmployeeStore } from '@/stores/emp';

const isDisabled = (): boolean => {
  const empStore = useEmployeeStore();
  return empStore.roleName !== RoleEnum.ROLE_ADMIN;
};

export { isDisabled };