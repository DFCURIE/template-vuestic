import axios from 'axios';

const API_URL = 'http://localhost:62024/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const login = async (email, password) => {
  try {
    console.log('Sending login request:', { email, password })
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response)
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async (token) => {
  try {
    const response = await api.post('/logout', { token });
    localStorage.removeItem('token'); // Remove the token
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};
