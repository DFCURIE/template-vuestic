<template>
  <div>
    Logging out...
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui'
import { logout as logoutApi } from '../../services/api'
import { useUserStore } from '../../stores/user-store'

const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const performLogout = async () => {
  try {
    const email = userStore.email
    const password = userStore.password // Get the stored password
    const response = await logoutApi(email, password)
    if (response.status === 200) {
      userStore.clearUser()
      toast.init({ message: "You've successfully logged out", color: 'success' })
      router.push({ name: 'login' }) // Redirect to the login page
    } else {
      toast.init({ message: response.message, color: 'danger' })
    }
  } catch (error) {
    toast.init({ message: 'Logout failed. Please try again.', color: 'danger' })
  }
}

onMounted(() => {
  performLogout()
})
</script>
