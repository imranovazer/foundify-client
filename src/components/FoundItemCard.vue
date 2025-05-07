<script setup lang="ts">
import { getFoundItemImage } from '@/api'
import { Status, type FoundItem } from '@/types'
import { Tag } from 'primevue'
import { onMounted, ref } from 'vue'

const imageUrl = ref()

const { item } = defineProps<{ item: FoundItem }>()

onMounted(async () => {
  try {
    if (item.imageUrls.length > 0) {
      const res = await getFoundItemImage(item.imageUrls[0])
      imageUrl.value = URL.createObjectURL(res.data)
    }
  } catch (error) {}
})
</script>

<template>
  <div
    class="cursor-pointer w-full min-h-[100px] p-5 bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200 shadow-md rounded-2xl hover:shadow-xl transition-shadow duration-300 flex items-center justify-between"
  >
    <div class="flex gap-4 items-center">
      <img
        :src="imageUrl"
        alt="found item"
        class="w-full max-w-[80px] h-[80px] rounded-xl overflow-hidden object-cover"
      />
      <div class="flex flex-col gap-2 w-full">
        <div>
          <h2 class="text-lg font-semibold text-gray-800">{{ item.title }}</h2>
          <p class="text-sm text-gray-500">{{ item.category }}</p>
        </div>
        <div class="flex items-center gap-2">
          <Tag icon="pi pi-calendar-clock" severity="secondary">
            {{ item.dateFound }}
          </Tag>
          <Tag icon="pi pi-map-marker" severity="secondary">
            {{ item.location }}
          </Tag>
        </div>
      </div>
    </div>

    <Tag :severity="item.status === Status.PENDING ? 'info' : 'danger'">{{ item.status }}</Tag>
  </div>
</template>
