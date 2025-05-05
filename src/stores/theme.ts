import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const darkMode = ref<boolean>(false)

  function setTheme(set: boolean) {
    darkMode.value = set
  }

  return { darkMode, setTheme }
})
