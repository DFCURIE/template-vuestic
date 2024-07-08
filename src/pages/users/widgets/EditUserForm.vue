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
  fullname: '',
  level: '',
  username: '',
  notes: '',
  email: '',
  active: true,
  projects: [],
  password: '',
  firstName: '',
  lastName: '',
};

const newUser = ref<User>({ ...defaultNewUser });

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

watch(
  () => props.user,
  () => {
    if (!props.user) {
      newUser.value = { ...defaultNewUser };
      return;
    }

    newUser.value = {
      ...props.user,
    };
  },
  { immediate: true },
);

const form = useForm('add-user-form');

const emit = defineEmits(['close', 'save']);

const onSave = () => {
  if (form.validate()) {
    const userToSave = {
      id: newUser.value.id,
      firstName: newUser.value.firstName,
      lastName: newUser.value.lastName,
      email: newUser.value.email,
      level: newUser.value.level,
      notes: newUser.value.notes,
    };

    if (!userToSave.id) {
      // Hanya tambahkan password untuk user baru
      userToSave.password = newUser.value.password;
    }

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
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.email"
          label="Email"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.email]"
          name="email"
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

      <div class="flex gap-4 w-full">
        <div class="w-1/2">
          <VaInput
            v-model="newUser.firstName"
            label="First Name"
            class="w-full"
            :rules="[validators.required]"
            name="firstName"
            autocomplete="off"
          />
        </div>
      </div>

      <div class="flex gap-4 w-full">
        <div class="w-1/2">
          <VaSelect
            v-model="newUser.level"
            label="Level"
            class="w-full"
            :options="levelSelectOptions"
            :rules="[validators.required]"
            name="level"
            value-by="value"
            text-by="text"
          />
        </div>
      </div>

      <div class="flex gap-4 w-full" v-if="!newUser.id">
      <div class="w-1/2">
        <VaInput
          v-model="newUser.password"
          label="Password"
          type="password"
          class="w-full"
          :rules="[validators.required]"
          name="password"
          autocomplete="new-password"
        />
      </div>
    </div>

      <VaTextarea v-model="newUser.notes" label="Notes" class="w-full" name="notes" />
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>