<template>
  <h1 class="page-title">Users</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddUserModal">Add User</VaButton>
      </div>

      <UsersTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :users="users"
        :loading="isLoading"
        :pagination="pagination"
        @edit-user="showEditUserModal"
        @delete-user="onUserDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditUserModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ userToEdit ? 'Edit user' : 'Add user' }}</h1>
    <EditUserForm
      ref="editFormRef"
      :user="userToEdit"
      :save-button-label="userToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="onUserSaved"
    />
  </VaModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UsersTable from './widgets/UsersTable.vue';
import EditUserForm from './widgets/EditUserForm.vue';
import { User } from './types';
import { useUsers } from './composables/useUsers';
import { usePermissions } from './composables/usePermissions';
import { useModal, useToast } from 'vuestic-ui';

const doShowEditUserModal = ref(false);

const { users, isLoading, filters, sorting, pagination, fetch, add, update, remove } = useUsers();
const { permissions, isLoading: isLoadingPermissions, fetchPermissions } = usePermissions();

const userToEdit = ref<User | null>(null);

const showEditUserModal = (user: User) => {
  userToEdit.value = { ...user, id: user.userId || user.id };
  doShowEditUserModal.value = true;
};

const showAddUserModal = () => {
  userToEdit.value = null;
  doShowEditUserModal.value = true;
};

const { init: notify } = useToast();

const onUserSaved = async (user: User & { permissions?: any }) => {
  try {
    if (user.id) {
      // Update existing user's level
      await update(user);
      notify({
        message: `User level has been updated`,
        color: 'success',
      });
    } else {
      // Add new user
      await add(user);
      notify({
        message: `${user.firstName} ${user.lastName} has been added`,
        color: 'success',
      });
    }
    await fetch();  // Refresh user list
    doShowEditUserModal.value = false;  // Close modal
  } catch (error) {
    console.error('Failed to save user:', error);
    notify({
      message: 'Failed to save user',
      color: 'danger',
    });
  }
};

const onUserDelete = async (user: User) => {
  console.log('User to be deleted:', user);
  const userId = user.userId || user.id;
  if (userId) {
    try {
      await remove(userId);
      notify({
        message: `${user.firstName} ${user.lastName} has been deleted`,
        color: 'success',
      });
      await fetch();  // Refresh user list
    } catch (error) {
      console.error('Failed to delete user:', error);
      notify({
        message: 'Failed to delete user',
        color: 'danger',
      });
    }
  } else {
    console.error('Invalid user ID for delete in UsersPage:', userId);
  }
};

const editFormRef = ref();

const { confirm } = useModal();

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    });
    if (agreed) {
      hide();
    }
  } else {
    hide();
  }
};
</script>