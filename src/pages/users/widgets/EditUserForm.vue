<script setup lang="ts">
import { PropType, computed, ref, watch, onMounted } from 'vue';
import { useForm, defineVaDataTableColumns } from 'vuestic-ui';
import { User } from '../types';
import { validators } from '../../../services/utils';
import { getLevels } from '../../../data/pages/users';
import { usePermissions, Permission } from '../composables/usePermissions';

const props = defineProps({
  user: {
    type: Object as PropType<User | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
});

const defaultNewUser: User = {
  id: undefined,
  userId: undefined,
  firstName: '',
  lastName: '',
  email: '',
  level: '',
  password: '',
};

const newUser = ref<User>({ ...defaultNewUser });

const isEditMode = computed(() => !!props.user?.userId || !!props.user?.id);

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    return newUser.value[key as keyof User] !== (props.user ?? defaultNewUser)?.[key as keyof User];
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(() => props.user, () => {
  if (props.user) {
    newUser.value = { ...props.user };
  } else {
    newUser.value = { ...defaultNewUser };
  }
}, { immediate: true });

const form = useForm('user-form');

const emit = defineEmits(['close', 'save']);

const { permissions, isLoading: isLoadingPermissions, fetchPermissions } = usePermissions();

const permissionColumns = defineVaDataTableColumns([
  { key: 'level.name', label: 'Level' },
  { key: 'isGet', label: 'Read' },
  { key: 'isPost', label: 'Write' },
  { key: 'isPut', label: 'Update' },
  { key: 'isDelete', label: 'Delete' },
]);

onMounted(async () => {
  await fetchPermissions();
});

const onSave = () => {
  if (form.validate()) {
    const userToSave = isEditMode.value
      ? { 
          id: newUser.value.userId || newUser.value.id, 
          level: newUser.value.level,
          permissions: permissions.value.find(p => p.level.id === newUser.value.level)
        }
      : { 
          firstName: newUser.value.firstName,
          lastName: newUser.value.lastName,
          email: newUser.value.email,
          password: newUser.value.password,
          level: newUser.value.level,
          permissions: permissions.value.find(p => p.level.id === newUser.value.level)
        };

    console.log('Data to be saved:', userToSave);
    emit('save', userToSave);
  }
};

const levelSelectOptions = ref<{ text: string; value: string }[]>([]);

const fetchLevels = async () => {
  try {
    const data = await getLevels();
    levelSelectOptions.value = data.map(level => ({
      text: level.name,
      value: level.id
    }));
  } catch (error) {
    console.error('Failed to fetch levels:', error);
  }
};

fetchLevels();
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="user-form" class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-4 w-full">
      <template v-if="!isEditMode">
        <div class="flex flex-wrap gap-4 w-full">
          <VaInput
            v-model="newUser.firstName"
            label="First Name"
            class="w-full sm:w-1/2"
            :rules="[validators.required]"
            name="firstName"
            autocomplete="off"
          />
          <VaInput
            v-model="newUser.lastName"
            label="Last Name"
            class="w-full sm:w-1/2"
            :rules="[validators.required]"
            name="lastName"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-wrap gap-4 w-full">
          <VaInput
            v-model="newUser.email"
            label="Email"
            class="w-full sm:w-1/2"
            :rules="[validators.required, validators.email]"
            name="email"
            autocomplete="off"
          />
          <VaInput
            v-model="newUser.password"
            label="Password"
            type="password"
            class="w-full sm:w-1/2"
            :rules="[validators.required]"
            name="password"
            autocomplete="new-password"
          />
        </div>
      </template>
      
      <VaSelect
        v-model="newUser.level"
        label="Level"
        class="w-full sm:w-1/2"
        :options="levelSelectOptions"
        :rules="[validators.required]"
        name="level"
        value-by="value"
        text-by="text"
      />

      <div v-if="permissions.length > 0" class="w-full mt-4">
        <h3 class="va-h6 mb-2">Level Permissions</h3>
        <VaDataTable :items="permissions" :columns="permissionColumns">
          <template #cell(isGet)="{ rowData }">
            <VaCheckbox v-model="rowData.isGet" :true-value="'Y'" :false-value="'N'" disabled />
          </template>
          <template #cell(isPost)="{ rowData }">
            <VaCheckbox v-model="rowData.isPost" :true-value="'Y'" :false-value="'N'" disabled />
          </template>
          <template #cell(isPut)="{ rowData }">
            <VaCheckbox v-model="rowData.isPut" :true-value="'Y'" :false-value="'N'" disabled />
          </template>
          <template #cell(isDelete)="{ rowData }">
            <VaCheckbox v-model="rowData.isDelete" :true-value="'Y'" :false-value="'N'" disabled />
          </template>
        </VaDataTable>
      </div>

      <div class="flex flex-wrap justify-end gap-4 w-full">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>

<style scoped>
.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-wrap {
  display: flex;
  flex-wrap: wrap;
}

.gap-4 {
  gap: 1rem;
}

.w-full {
  width: 100%;
}

.sm\:w-1\/2 {
  width: 50%;
}

.justify-end {
  justify-content: flex-end;
}
</style>