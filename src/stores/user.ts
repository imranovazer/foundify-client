import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import {
  removeUserFromLocalStoreage,
  getUserFromLocalStorage,
  saveUserToLocalStorage,
} from '@/utils/localStorageUtils'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  function authUser(userarg: User) {
    user.value = userarg
    saveUserToLocalStorage(userarg.id)
  }

  function logOut() {
    user.value = null
    removeUserFromLocalStoreage()
  }

  return { user, isAuthenticated, authUser, logOut }
})
