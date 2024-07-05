// src/pages/users/composables/useUsers.ts
import { Ref, ref, unref, watch } from 'vue';
import { getUsers as fetchUsersFromAPI, updateUser as updateUserAPI, addUser as addUserAPI, removeUser as removeUserAPI, type Filters, Pagination, Sorting } from '../../../data/pages/users';
import { User } from '../types';
import { watchIgnorable } from '@vueuse/core';

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 });
const makeSortingRef = () => ref<Sorting>({ sortBy: 'fullname', sortingOrder: 'asc' });
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' });

export const useUsers = (options?: {
  pagination?: Ref<Pagination>;
  sorting?: Ref<Sorting>;
  filters?: Ref<Partial<Filters>>;
}) => {
  const isLoading = ref(false);
  const users = ref<User[]>([]);

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {};

  const fetch = async () => {
    isLoading.value = true;
    try {
      const data = await fetchUsersFromAPI(unref(filters));
      console.log('Fetched users from API:', data); // Tambahkan log ini untuk debugging
      users.value = data.data;

      ignoreUpdates(() => {
        pagination.value = {
          page: 1,
          perPage: data.data.length,
          total: data.data.length,
        };
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true });

  watch(
    filters,
    () => {
      // Reset pagination to first page when filters changed
      pagination.value.page = 1;
      fetch();
    },
    { deep: true },
  );

  fetch();

  return {
    isLoading,
    filters,
    sorting,
    pagination,
    users,
    fetch,
    async add(user: User) {
      isLoading.value = true;
      await addUserAPI(user);
      await fetch();
      isLoading.value = false;
    },
    async update(user: User) {
      isLoading.value = true;
      await updateUserAPI(user);
      await fetch();
      isLoading.value = false;
    },
    async remove(user: User) {
      isLoading.value = true;
      await removeUserAPI(user);
      await fetch();
      isLoading.value = false;
    },
  };
};
