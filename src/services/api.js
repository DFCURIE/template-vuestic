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
    if (response.data.status === 200 && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/logout', { token });
    localStorage.removeItem('token');
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const getUsers = async (filters) => {
  try {
    console.log('Sending request to API with filters:', filters);
    const response = await api.get('/user', { params: filters });
    console.log('Response from API:', response.data);
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

export const updateUser = async (userId, userData) => {
  try {
    if (!userId) {
      throw new Error('User ID is required for update');
    }
    const response = await api.put(`/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const removeUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required for deletion');
    }
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
    if (!level.id) {
      throw new Error('Level ID is required for update');
    }
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

export const getPermission = async () => {
  try {
    const response = await api.get('/permission')
    return response.data
  } catch (error) {
    console.error('Error fetching permissions:', error)
    throw error
  }
};

export const newPermission = async (permissionData) => {
  try {
    const response = await api.post('/permission', permissionData)
    return response.data
  } catch (error) {
    console.error('Error adding new permission:', error)
    throw error
  }
};

export const updatePermission = async (permissionData) => {
  try {
    const response = await api.put('/permission', permissionData)
    return response.data
  } catch (error) {
    console.error('Error updating permission:', error)
    throw error
  }
};