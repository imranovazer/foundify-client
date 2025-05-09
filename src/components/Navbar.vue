<template>
  <!-- <div class="card p-4 fixed top-0 left-[50%] transform-[left:50%] z-50 w-full max-w-[1200px]"> -->
  <div class="card p-4 fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[1200px]">
    <Menubar :model="items" class="rounded-2xl" style="border-radius: 3rem">
      <template #start>
        <div class="flex items-center justify-center cursor-pointer">
          <Avatar image="/images.jpeg" shape="circle" />
          <span class="mx-2 font-bold">Foundify</span>
        </div>
      </template>
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
        </a>
      </template>
      <template #end>
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
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

import { Avatar, Button, Menu, Menubar } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const themeStore = useThemeStore()

const store = useUserStore()

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
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => {
      router.push('/')
    },
  },
  {
    label: 'Report item',
    icon: 'pi pi-flag',
    command: () => {
      router.push('/report-item')
    },
  },
  {
    label: 'Review',
    icon: 'pi pi-pen-to-square',
    command: () => {
      router.push('/review')
    },
  },
])
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
