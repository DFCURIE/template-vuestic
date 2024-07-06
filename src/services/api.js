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
    config.headers['token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
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

export const getUsers = async (filters) => {
  try {
    const response = await api.get('/user', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const addUser = async (user) => {
  try {
    const response = await api.post('/user', user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    if (!user.id) {
      throw new Error('User ID is required for update');
    }
    console.log('Updating user with ID:', user.id); // Tambahkan log untuk debugging
    const response = await api.put(`/user/${user.id}`, {
      level: {
        id: user.level // Asumsikan `user.level` adalah `level.id`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};


export const removeUser = async (userId) => {
  try {
    const response = await api.delete(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getLevels = async () => {
  try {
    const response = await api.get('/level');
    return response.data;
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
};

export const addLevel = async (level) => {
  try {
    const response = await api.post('/level', level);
    return response.data;
  } catch (error) {
    console.error('Error adding level:', error);
    throw error;
  }
};

export const updateLevel = async (level) => {
  try {
    const response = await api.put(`/level/${level.id}`, level);
    return response.data;
  } catch (error) {
    console.error('Error updating level:', error);
    throw error;
  }
};

export const removeLevel = async (levelId) => {
  try {
    const response = await api.delete(`/level/${levelId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting level:', error);
    throw error;
  }
};

export const getLevelById = async (levelId) => {
  try {
    const response = await api.get(`/level/${levelId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching level by ID:', error);
    throw error;
  }
};
