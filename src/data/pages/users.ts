import { getUsers as fetchUsersFromAPI, addUser as addUserToAPI, updateUser as updateUserInAPI, removeUser as removeUserFromAPI } from '../../services/api';

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

export const addUser = async (user: User) => {
  const formattedUser = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    level: {
      id: user.role,
    },
    password: user.password,
  };

  console.log('Data to be sent to API:', formattedUser); // Tambahkan log ini untuk debugging

  await addUserToAPI(formattedUser);
};

export const updateUser = async (user: User) => {
  await updateUserInAPI(user);
};

export const removeUser = async (user: User) => {
  await removeUserFromAPI(user.id);
};
