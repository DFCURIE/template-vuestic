import { getUsers as fetchUsersFromAPI, addUser as addUserToAPI, updateUser as updateUserInAPI, removeUser as removeUserFromAPI, getLevels as fetchLevelsFromAPI } from '../../services/api';
import { User } from '../pages/users/types';

export type Pagination = {
  page: number;
  perPage: number;
  total: number;
};

export type Sorting = {
  sortBy: keyof User | undefined;
  sortingOrder: 'asc' | 'desc' | null;
};

export type Filters = {
  isActive: boolean;
  search: string;
};

export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  const response = await fetchUsersFromAPI(filters);
  const users = response.data;

  const { page = 1, perPage = 10 } = filters || {};
  return {
    data: users.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: users.length,
    },
  };
};

export const getLevels = async () => {
  const response = await fetchLevelsFromAPI();
  return response.data;
};

export const addUser = async (user: User) => {
  const formattedUser = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    level: {
      id: user.level,
    },
    password: user.password,
    notes: user.notes,
  };

  console.log('Data to be sent to API:', formattedUser);

  await addUserToAPI(formattedUser);
};

export const updateUser = async (user: Partial<User>) => {
  const updateData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    level: {
      id: user.level
    },
    notes: user.notes
  };
  await updateUserInAPI(updateData);
};

export const removeUser = async (userId: string) => {
  try {
    const response = await removeUserFromAPI(userId);
    return response.data;
  } catch (error) {
    console.error('Failed to remove user:', error);
    throw error;
  }
};