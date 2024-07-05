// src/stores/user-store.ts
import { defineStore } from 'pinia';
import { getUsers, addUser, updateUser, removeUser, login, logout } from '../services/api';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userName: '',
      email: '',
      token: '',
      memberSince: '',
      pfp: '',
      is2FAEnabled: false,
      users: [],
      isLoading: false,
    };
  },

  actions: {
    async login(email, password) {
      try {
        const response = await login(email, password);
        this.token = response.token;
        localStorage.setItem('token', response.token); // Simpan token di localStorage
        this.setUser(response.email, response.token);
      } catch (error) {
        console.error('Failed to login:', error);
      }
    },

    async logout() {
      try {
        await logout(this.token);
        this.clearUser();
        localStorage.removeItem('token'); // Hapus token dari localStorage
      } catch (error) {
        console.error('Failed to logout:', error);
      }
    },

    toggle2FA() {
      this.is2FAEnabled = !this.is2FAEnabled;
    },

    changeUserName(userName: string) {
      this.userName = userName;
    },

    setToken(token: string) {
      this.token = token;
    },

    setUser(email: string, token: string) {
      this.email = email;
      this.token = token;
    },

    clearUser() {
      this.userName = '';
      this.email = '';
      this.token = '';
      this.memberSince = '';
      this.pfp = '';
      this.is2FAEnabled = false;
    },

    async fetchUsers() {
      this.isLoading = true;
      try {
        const response = await getUsers();
        this.users = response.data;
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async addUser(user) {
      try {
        await addUser(user);
        await this.fetchUsers();
      } catch (error) {
        console.error('Failed to add user:', error);
      }
    },

    async updateUser(user) {
      try {
        await updateUser(user);
        await this.fetchUsers();
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    },

    async removeUser(userId) {
      try {
        await removeUser(userId);
        await this.fetchUsers();
      } catch (error) {
        console.error('Failed to remove user:', error);
      }
    }
  },
});
