import axios from 'axios';

const API_URL = 'http://localhost:62024/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async (email, password) => {
  try {
    const response = await api.post('/logout', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};
