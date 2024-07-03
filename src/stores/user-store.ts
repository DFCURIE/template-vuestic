import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userName: '',
      email: '',
      password: '', // Add password to the store
      memberSince: '',
      pfp: '',
      is2FAEnabled: false,
    }
  },

  actions: {
    toggle2FA() {
      this.is2FAEnabled = !this.is2FAEnabled
    },

    changeUserName(userName: string) {
      this.userName = userName
    },

    setUser(email: string, password: string) {
      this.email = email;
      this.password = password; // Store the password
    },

    clearUser() {
      this.userName = ''
      this.email = ''
      this.password = '' // Clear the password
      this.memberSince = ''
      this.pfp = ''
      this.is2FAEnabled = false
    }
  },
})
