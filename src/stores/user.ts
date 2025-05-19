import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { removeTokenFromLocalStoreage } from '@/utils/localStorageUtils'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  function authUser(userarg: User) {
    user.value = userarg
  }

  function logOut() {
    user.value = null
    removeTokenFromLocalStoreage()
  }

  return { user, isAuthenticated, authUser, logOut }
})
