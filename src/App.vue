<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { ConfirmDialog, Toast } from 'primevue'
import type { AxiosResponse } from 'axios'
import Navbar from './components/Navbar.vue'
import { getUser } from './api'
import { getUserFromLocalStorage } from './utils/localStorageUtils'
import { useUserStore } from './stores/user'
import { useReviewStore } from './stores/counter'
import { type User } from './types'
const user = useUserStore()
const review = useReviewStore()
onMounted(async () => {
  //temporary cheking if auth
  const router = useRouter()
  try {
    const res: AxiosResponse<User> = await getUser(getUserFromLocalStorage() || '')
    user.authUser(res.data)
    review.getReviews()
  } catch {
    user.logOut()
    router.push('/register')
  }
})
</script>

<template>
  <Toast />
  <ConfirmDialog group="positioned" />
  <Navbar />
  <RouterView />
</template>
