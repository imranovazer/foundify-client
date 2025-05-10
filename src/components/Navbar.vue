<template>
  <div class="card p-4 fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[1200px]">
    <div
      class="rounded-4xl bg-slate-100 dark:bg-slate-900 shadow-lg border border-gray-200 flex justify-between py-2 px-4"
    >
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center cursor-pointer">
          <Avatar image="/images.jpeg" shape="circle" />
          <span class="mx-2 font-bold">Foundify</span>
        </div>
        <ul class="flex items-center gap-3">
          <li>
            <RouterLink
              active-class="py-1 px-3 bg-slate-300 dark:bg-slate-800 rounded-lg "
              class="py-1 px-3 hover:bg-slate-300 hover:dark:bg-slate-800 rounded-lg transition-colors delay-30"
              to="/"
              >Home</RouterLink
            >
          </li>
          <li>
            <RouterLink
              active-class="py-1 px-3 bg-slate-300 dark:bg-slate-800 rounded-lg "
              class="py-1 px-3 hover:bg-slate-300 hover:dark:bg-slate-800 rounded-lg transition-colors delay-30"
              to="/report-item"
              >Report Item</RouterLink
            >
          </li>

          <li>
            <OverlayBadge :value="review.reviewAmount">
              <RouterLink
                active-class="py-1 px-3 bg-slate-300 dark:bg-slate-800 rounded-lg "
                class="py-1 px-3 hover:bg-slate-300 hover:dark:bg-slate-800 rounded-lg transition-colors delay-30"
                to="/review"
                >Review</RouterLink
              >
            </OverlayBadge>
          </li>
        </ul>
      </div>

      <div class="flex items-center gap-2">
        <Avatar
          v-if="store.isAuthenticated"
          icon="pi pi-user"
          shape="circle"
          aria-controls="overlay_menu"
          @click="toggle"
          class="cursor-pointer"
        />
        <RouterLink v-else to="/register">
          <Button icon="pi pi-sign-in" rounded />
        </RouterLink>
        <Menu ref="menu" id="overlay_menu" :model="avaItems" :popup="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReviewStore } from '@/stores/counter'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

import { Avatar, Button, Menu, OverlayBadge } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const themeStore = useThemeStore()

const store = useUserStore()
const review = useReviewStore()

const menu = ref()
const toggle = (event: any) => {
  menu.value.toggle(event)
}

const avaItems = computed(() => [
  {
    label: 'Options',
    items: [
      {
        label: store.user?.username,
        icon: 'pi pi-user',
        command: () => {
          router.push('/profile')
        },
      },
      {
        label: 'Theme',
        icon: themeStore.darkMode ? 'pi pi-moon' : 'pi pi-sun',
        command: () => {
          toggleDarkMode()
        },
      },
      {
        label: 'Log out',
        icon: 'pi pi-sign-out',
        command: () => {
          store.logOut()
          router.push('/register')
        },
      },
    ],
  },
])
function toggleDarkMode() {
  if (themeStore.darkMode) {
    themeStore.setTheme(false)
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light') // Save theme in localStorage
  } else {
    themeStore.setTheme(true)
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark') // Save theme in localStorage
  }
}

// On mounted, check if there's a saved theme in localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark')
    themeStore.setTheme(true)
  } else {
    document.documentElement.classList.remove('dark')
    themeStore.setTheme(false)
  }
})
</script>
