<template>
  <div>
    Logging out...
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui'
import { logout as logoutApi } from '../../services/api' // Gunakan jalur relatif ke services
import { useUserStore } from '../../stores/user-store' // Gunakan jalur relatif ke stores

const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const performLogout = async () => {
  try {
    console.log('Logging out user:', userStore.email)
    const email = userStore.email
    const password = userStore.password
    const response = await logoutApi(email, password)
    console.log('Logout response:', response)
    if (response.status === 200) {
      localStorage.removeItem('token')
      userStore.clearUser()
      toast.init({ message: "You've successfully logged out", color: 'success' })
      router.push({ name: 'login' }) // Redirect ke halaman login
    } else {
      toast.init({ message: response.message, color: 'danger' })
    }
  } catch (error) {
    console.error('Error during logout:', error)
    toast.init({ message: 'Logout failed. Please try again.', color: 'danger' })
  }
}

onMounted(() => {
  performLogout()
})
</script>
