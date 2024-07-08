import { Ref, ref, unref, watch } from 'vue';
import { getUsers as fetchUsersFromAPI, updateUser as updateUserAPI, addUser as addUserAPI, removeUser as removeUserAPI, getLevels as fetchLevelsFromAPI, type Filters, Pagination, Sorting } from '../../../data/pages/users';
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
  const levels = ref<{ text: string; value: string }[]>([]);

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {};

  const fetch = async () => {
    isLoading.value = true;
    try {
      console.log('Fetching users with filters:', {
        page: pagination.value.page,
        perPage: pagination.value.perPage,
        sortBy: sorting.value.sortBy,
        sortingOrder: sorting.value.sortingOrder,
        search: filters.value.search,
      });
      const data = await fetchUsersFromAPI({
        page: pagination.value.page,
        perPage: pagination.value.perPage,
        sortBy: sorting.value.sortBy,
        sortingOrder: sorting.value.sortingOrder,
        search: filters.value.search,
      });
      console.log('Data received from API:', data);
      users.value = data.data;
  
      ignoreUpdates(() => {
        pagination.value.total = data.pagination.total;
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  
  const fetchLevels = async () => {
    try {
      const data = await fetchLevelsFromAPI();
      levels.value = data.map((level: any) => ({
        text: level.name,
        value: level.id,
      }));
    } catch (error) {
      console.error('Failed to fetch levels:', error);
    }
  };

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true });

  watch(
    filters,
    () => {
      console.log('Filters changed:', filters.value);
      pagination.value.page = 1;
      fetch();
    },
    { deep: true },
  );
  
  fetch();
  fetchLevels();

  return {
    isLoading,
    filters,
    sorting,
    pagination,
    users,
    levels,
    fetch,
    async add(user: User) {
      isLoading.value = true;
      try {
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
        const userId = user.id || user.userId; // Gunakan userId jika id tidak ada
        if (!userId) {
          throw new Error('User ID is required for update');
        }
        console.log('Updating user with ID:', userId); // Tambahkan log untuk debugging
        await updateUserAPI({ id: userId, level: user.level }); // Asumsikan `user.level` adalah `level.id`
        await fetch();
      } catch (error) {
        console.error('Failed to update user:', error);
      } finally {
        isLoading.value = false;
      }
    },
    
    async remove(userId: string) { // Memperbaiki argumen untuk menerima userId
      isLoading.value = true;
      console.log('Removing user with ID:', userId);
      if (userId) {
        try {
          await removeUserAPI(userId);
          await fetch();
        } catch (error) {
          console.error('Failed to remove user:', error);
        }
      } else {
        console.error('Invalid user ID for delete in useUsers:', userId);
      }
      isLoading.value = false;
    },    
  };
};
