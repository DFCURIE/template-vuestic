import { ref, computed } from 'vue'
import { getPermission, newPermission, updatePermission } from '../../../services/api'

export type Permission = {
  id: string;
  isDelete: string;
  isGet: string;
  isPost: string;
  isPut: string;
  level: {
    id: string;
    name: string | null;
  };
};

export function usePermissions() {
  const permissions = ref<Permission[]>([])
  const isLoading = ref(false)

  const fetchPermissions = async () => {
    isLoading.value = true
    try {
      const response = await getPermission()
      if (response.status === 200) {
        permissions.value = response.data
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addPermission = async (permissionData: Partial<Permission>) => {
    try {
      await newPermission(permissionData)
      await fetchPermissions()
    } catch (error) {
      console.error('Error adding permission:', error)
      throw error
    }
  }

  const updatePermissionData = async (permissionData: Partial<Permission>) => {
    try {
      await updatePermission(permissionData)
      await fetchPermissions()
    } catch (error) {
      console.error('Error updating permission:', error)
      throw error
    }
  }

  return {
    permissions: computed(() => permissions.value),
    isLoading: computed(() => isLoading.value),
    fetchPermissions,
    addPermission,
    updatePermissionData
  }
}