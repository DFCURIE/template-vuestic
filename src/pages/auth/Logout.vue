<template>
  <div>
    Logging out...
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui'
import { logout } from '../../services/api'
import { useUserStore } from '../../stores/user-store'

const router = useRouter()
const toast = useToast()
const userStore = useUserStore()

const performLogout = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await logout(token)
    if (response.status === 200) {
      localStorage.removeItem('token')
      userStore.clearUser()
      console.log('User has been successfully logged out')
      toast.init({ message: "You've successfully logged out", color: 'success' })
      router.push({ name: 'login' })
    } else {
      toast.init({ message: response.message, color: 'danger' })
    }
  } catch (error) {
    console.error('Logout error:', error)
    toast.init({ message: 'Logout failed. Please try again.', color: 'danger' })
  }
}

onMounted(() => {
  performLogout()
})
</script>
