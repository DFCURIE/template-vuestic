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
  id: -1,
  avatar: '',
  fullname: '',
  role: 'global:member',
  username: '',
  notes: '',
  email: '',
  active: true,
  projects: [],
  level: '',
  password: '',
  firstName: '', // Tambahkan ini untuk memastikan firstName kosong
  lastName: '',  // Tambahkan ini untuk memastikan lastName kosong
};

const newUser = ref<User>({ ...defaultNewUser });

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
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
      newUser.value = { ...defaultNewUser }; // Reset form ketika tidak ada user yang di-edit
      return;
    }

    newUser.value = {
      ...props.user,
      avatar: props.user.avatar || '',
      role: 'global:member',
    };
  },
  { immediate: true },
);

const avatar = ref<File>();

const makeAvatarBlobUrl = (avatar: File) => {
  return URL.createObjectURL(avatar);
};

watch(avatar, (newAvatar) => {
  newUser.value.avatar = newAvatar ? makeAvatarBlobUrl(newAvatar) : '';
});

const form = useForm('add-user-form');

const emit = defineEmits(['close', 'save']);

const onSave = () => {
  if (form.validate()) {
    emit('save', newUser.value);
  }
};

const levelSelectOptions = ref<{ text: string; value: string }[]>([
  { text: 'Supereadmin', value: '707028e3-904c-4af7-9a46-6cfd9c6ec911' },
  { text: 'Admin', value: '627a88c0-99af-4018-997e-b26393a6956f' },
  { text: 'Member', value: '2b7c705f-bc12-41d1-94a5-ae3a9cc2e388' },
  { text: 'User', value: 'a8bcdfff-e789-405b-b125-8a3dbc88ce6a' },
]);

const fetchLevels = async () => {
  try {
    const data = await getLevels();
    levelSelectOptions.value = data.map((level: any) => ({
      text: level.name,
      value: level.id,
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
          />
        </div>
      </div>

      <div class="flex gap-4 w-full">
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
