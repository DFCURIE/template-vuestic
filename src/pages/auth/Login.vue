<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <p class="text-base mb-4 leading-5">
      Admin Console Optiflow
    </p>
    <VaInput
      v-model="formData.email"
      :rules="[validators.required, validators.email]"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import { login } from '../../services/api'
import { useUserStore } from '../../stores/user-store' // Gunakan jalur relatif

const { validate } = useForm('form')
const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const formData = reactive({
  email: '',
  password: '',
})

const submit = async () => {
  if (validate()) {
    try {
      console.log('Submitting form:', formData)
      const response = await login(formData.email, formData.password);
      console.log('Login response:', response)
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem('token', response.data.token);
        userStore.setUser(formData.email, response.data.token);
        toast.init({ message: "You've successfully logged in", color: 'success' });
        router.push({ name: 'dashboard' }); // Redirect ke halaman dashboard
      } else {
        toast.init({ message: response.message, color: 'danger' });
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.init({ message: 'Login failed. Please try again.', color: 'danger' });
    }
  }
}
</script>
