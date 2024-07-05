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
      const data = await fetchUsersFromAPI({
        ...unref(filters),
        page: pagination.value.page,
        perPage: pagination.value.perPage,
        sortBy: sorting.value.sortBy,
        sortingOrder: sorting.value.sortingOrder,
      });
      console.log('Fetched users from API:', data); // Tambahkan log ini untuk debugging
      users.value = data.data;

      ignoreUpdates(() => {
        pagination.value = {
          page: data.pagination.page,
          perPage: data.pagination.perPage,
          total: data.pagination.total,
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
      try {
        console.log('Adding user:', user); // Tambahkan log ini untuk debugging
        await addUserAPI(user);
        await fetch(); // Pastikan fetch dipanggil untuk memperbarui tabel
      } catch (error) {
        console.error('Failed to add user:', error);
      } finally {
        isLoading.value = false;
      }
    },
    async update(user: User) {
      isLoading.value = true;
      try {
        await updateUserAPI(user);
        await fetch();
      } catch (error) {
        console.error('Failed to update user:', error);
      } finally {
        isLoading.value = false;
      }
    },
    async remove(user: User) {
      isLoading.value = true;
      try {
        await removeUserAPI(user);
        await fetch();
      } catch (error) {
        console.error('Failed to remove user:', error);
      } finally {
        isLoading.value = false;
      }
    },
  };
};
