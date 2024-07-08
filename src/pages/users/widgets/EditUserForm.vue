<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue';
import { useForm } from 'vuestic-ui';
import { User } from '../types';
import { validators } from '../../../services/utils';
import { getLevels } from '../../../data/pages/users';

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
    if (key === 'projects') {
      return false;
    }
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

const onSave = () => {
  if (form.validate()) {
    const userToSave = isEditMode.value
      ? { 
          id: newUser.value.userId || newUser.value.id, 
          level: newUser.value.level 
        }
      : { ...newUser.value };

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
