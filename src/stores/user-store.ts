import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userName: 'Vasili Savitski',
    email: 'vasili@gmail.com',
    memberSince: '8/12/2020',
    pfp: 'https://picsum.photos/id/22/200/300',
    is2FAEnabled: false,
    password: '', // Tambahkan password ke state
  }),

  actions: {
    toggle2FA() {
      this.is2FAEnabled = !this.is2FAEnabled
    },

    changeUserName(userName: string) {
      this.userName = userName
    },

    setUser(email: string, password: string) {
      this.email = email
      this.password = password
    },

    clearUser() {
      this.email = ''
      this.password = ''
    },
  },
})
