import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userName: '',
      email: '',
      token: '',
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

    setToken(token: string) {
      this.token = token
    },

    setUser(email: string, token: string) {
      this.email = email
      this.token = token
    },

    clearUser() {
      this.userName = ''
      this.email = ''
      this.token = ''
      this.memberSince = ''
      this.pfp = ''
      this.is2FAEnabled = false
    }
  },
})
