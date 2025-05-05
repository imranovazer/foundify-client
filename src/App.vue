<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import { onMounted } from 'vue'
import { getUser } from './api'
import { getUserFromLocalStorage } from './utils/localStorageUtils'
import { useUserStore } from './stores/user'
const user = useUserStore()
onMounted(async () => {
  //temporary cheking if aut
  const router = useRouter()
  try {
    const res = await getUser(getUserFromLocalStorage() || '')
    user.authUser(res.data)
  } catch {
    router.push('/register')
  }
})
</script>

<template>
  <Navbar />
  <RouterView />
</template>
