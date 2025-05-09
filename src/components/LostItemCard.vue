<script setup lang="ts">
import { getLostItemImage } from '@/api'
import { Status, type LostItem } from '@/types'
import { Tag } from 'primevue'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const imageUrl = ref()

const { item } = defineProps<{ item: LostItem }>()

onMounted(async () => {
  try {
    if (item.imageUrls.length > 0) {
      const res = await getLostItemImage(item.imageUrls[0])
      imageUrl.value = URL.createObjectURL(res.data)
    }
  } catch (error) {}
})
</script>

<template>
  <RouterLink
    :to="`lost-item/${item.id}`"
    class="cursor-pointer w-full min-h-[100px] px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md dark:shadow dark:shadow-black/20 rounded-2xl hover:shadow-xl transition-shadow duration-300 flex items-center justify-between text-gray-800 dark:text-gray-100"
  >
    <div class="flex gap-4 items-center">
      <img
        :src="imageUrl"
        alt="found item"
        class="w-[80px] h-[80px] rounded-xl overflow-hidden object-cover"
      />
      <div class="flex flex-col gap-2">
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-blue-200">{{ item.title }}</h2>
          <p class="text-sm text-gray-500">{{ item.category }}</p>
        </div>
        <div class="flex items-center gap-2">
          <Tag icon="pi pi-calendar-clock" severity="secondary">
            {{ item.dateLost }}
          </Tag>
          <Tag icon="pi pi-map-marker" severity="secondary">
            {{ item.location }}
          </Tag>
        </div>
      </div>
    </div>

    <Tag :severity="item.status === Status.PENDING ? 'info' : 'danger'">{{ item.status }}</Tag>
  </RouterLink>
</template>
