import { Ref, ref, unref, watch } from 'vue'
import { getUsers, updateUser, addUser, removeUser } from '../../../services/api'
import { User } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref({ sortBy: 'fullname', sortingOrder: null })
const makeFiltersRef = () => ref({ isActive: true, search: '' })

export const useUsers = (options?: {
  pagination?: Ref<{ page: number, perPage: number, total: number }>
  sorting?: Ref<{ sortBy: string | null, sortingOrder: string | null }>
  filters?: Ref<Partial<{ isActive: boolean, search: string }>>
}) => {
  const isLoading = ref(false)
  const users = ref<User[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    const { data, total } = await getUsers({
      ...unref(filters),
      sortBy: unref(sorting).sortBy,
      sortingOrder: unref(sorting).sortingOrder,
      page: unref(pagination).page,
      perPage: unref(pagination).perPage,
    })
    users.value = data

    ignoreUpdates(() => {
      pagination.value.total = total
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  watch(
    filters,
    () => {
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  fetch()

  return {
    isLoading,

    filters,
    sorting,
    pagination,

    users,

    fetch,

    async add(user: User) {
      isLoading.value = true
      await addUser(user)
      await fetch()
      isLoading.value = false
    },

    async update(user: User) {
      isLoading.value = true
      await updateUser(user.id, user)
      await fetch()
      isLoading.value = false
    },

    async remove(user: User) {
      isLoading.value = true
      await removeUser(user.id)
      await fetch()
      isLoading.value = false
    },
  }
}
