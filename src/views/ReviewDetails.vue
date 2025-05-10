<script setup lang="ts">
import {
  deleteFoundItem,
  getFoundItem,
  getFoundItemImage,
  getLostItem,
  getLostItemImage,
  getReview,
  updateReview,
} from '@/api'
import { useUserStore } from '@/stores/user'
import { type Review, Status, type FoundItem, type LostItem, ApprovalType } from '@/types'
import type { AxiosResponse } from 'axios'
import { Button, Divider, Galleria, Tag, useConfirm, useToast } from 'primevue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const confirm = useConfirm()
const router = useRouter()
const user = useUserStore()
const foundItem = ref<FoundItem>()
const lostItem = ref<LostItem>()
const review = ref<Review>()

const confirmPosition = () => {
  confirm.require({
    group: 'positioned',
    message: 'Do you want to reject or approve this review?',
    header: 'Review',
    icon: 'pi pi-info-circle',
    position: 'bottom',
    rejectProps: {
      label: 'Reject',
      severity: 'danger',
      text: true,
    },
    acceptProps: {
      label: 'Approve',
      severity: 'success',
      text: true,
    },
    accept: async () => {
      try {
        await updateReview(review.value?.id as string, {
          userId: user.user?.id as string,
          approvalType: ApprovalType.APPROVE,
        })
        toast.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Review approved',
          life: 3000,
        })
      } catch (error) {}
    },
    reject: async () => {
      try {
        await updateReview(review.value?.id as string, {
          userId: user.user?.id as string,
          approvalType: ApprovalType.REJECT,
        })
        toast.add({
          severity: 'info',
          summary: 'Rejected',
          detail: 'Review rejected',
          life: 3000,
        })
      } catch (error) {}
    },
  })
}

const toast = useToast()
const route = useRoute()
const foundItemImages = ref<string[]>([])
const lostItemImages = ref<string[]>([])

const fetchFoundItem = async (foundItemId: string) => {
  try {
    const res: AxiosResponse<FoundItem> = await getFoundItem(foundItemId)
    foundItem.value = res.data

    const imagePromises = res.data.imageUrls.map((url: string) =>
      getFoundItemImage(url).then((res) => URL.createObjectURL(res.data)),
    )

    foundItemImages.value = await Promise.all(imagePromises)
  } catch (error) {
    console.error('Error fetching found item or images:', error)
  }
}

const fetchLostItem = async (lostItemId: string) => {
  try {
    const res: AxiosResponse<LostItem> = await getLostItem(lostItemId)
    lostItem.value = res.data

    const imagePromises = res.data.imageUrls.map((url: string) =>
      getLostItemImage(url).then((res) => URL.createObjectURL(res.data)),
    )
    lostItemImages.value = await Promise.all(imagePromises)
  } catch (error) {
    console.error('Error fetching found item or images:', error)
  }
}

const fetchReviewDetails = async () => {
  try {
    const res: AxiosResponse<Review> = await getReview(route.params.id as string)
    review.value = res.data
    await fetchFoundItem(res.data.foundItemId)
    await fetchLostItem(res.data.lostItemId)
  } catch (error) {
    console.error('Error fetching found item or images:', error)
  }
}

onMounted(() => {
  fetchReviewDetails()
})
</script>

<template>
  <div class="container mx-auto px-3 mt-[100px] flex flex-col gap-[50px] mb-[50px]">
    <div class="flex w-full gap-2 justify-between">
      <div class="w-full flex flex-col gap-3 items-center">
        <div
          class="w-full max-w-[500px] bg-slate-100 dark:bg-gray-800 shadow-lg border-gray-300 font-bold text-2xl rounded-4xl px-4 py-2"
        >
          Found item details
        </div>
        <Galleria
          key="1"
          :showItemNavigatorsOnHover="true"
          :value="foundItemImages"
          :numVisible="5"
          :circular="true"
          :showItemNavigators="true"
          containerStyle="max-width: 500px; width:100%; border-radius: 25px"
          :showThumbnails="false"
        >
          <template #item="slotProps">
            <img :src="slotProps.item" class="w-full h-[400px] object-cover object-center" />
          </template>
        </Galleria>
        <div class="w-full flex flex-col gap-3 items-stretch max-w-[500px]">
          <h2 class="font-bold text-xl py-2">{{ foundItem?.title }}</h2>
          <div class="w-full flex gap-2">
            <div class="flex flex-col gap-2">
              <span>Date: </span>
              <span>{{ foundItem?.dateFound }}</span>
            </div>
            <Divider layout="vertical" />
            <div class="flex flex-col gap-2">
              <span>Address: </span>
              <span>{{ foundItem?.location }}</span>
            </div>
          </div>
          <div class="rounded-lg bg-gray-300 dark:bg-gray-800 p-3">
            {{ foundItem?.description }}
          </div>
          <div class="rounded-lg bg-gray-300 dark:bg-gray-800 p-3">
            <p class="flex item-center gap-2">
              <span class="font-bold"> Category: </span>
              <span>
                {{ foundItem?.category }}
              </span>
            </p>
            <Divider />
            <p class="flex item-center gap-2">
              <span class="font-bold"> Color: </span>
              <span>
                {{ foundItem?.color }}
              </span>
            </p>
            <Divider />
            <p class="flex item-center gap-2">
              <span class="font-bold"> Status: </span>
              <Tag :severity="foundItem?.status === Status.PENDING ? 'info' : 'danger'">{{
                foundItem?.status
              }}</Tag>
            </p>
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col gap-3 items-center">
        <div
          class="w-full max-w-[500px] bg-slate-100 dark:bg-gray-800 shadow-lg border-gray-300 font-bold text-2xl rounded-4xl px-4 py-2"
        >
          Lost item details
        </div>
        <Galleria
          key="2"
          :showItemNavigatorsOnHover="true"
          :value="lostItemImages"
          :numVisible="5"
          :circular="true"
          :showItemNavigators="true"
          containerStyle="max-width: 500px; width:100%; border-radius: 25px"
          :showThumbnails="false"
        >
          <template #item="slotProps">
            <img :src="slotProps.item" class="w-full h-[400px] object-cover object-center" />
          </template>
        </Galleria>
        <div class="w-full flex flex-col gap-3 items-stretch max-w-[500px]">
          <h2 class="font-bold text-xl py-2">{{ lostItem?.title }}</h2>
          <div class="w-full flex gap-2">
            <div class="flex flex-col gap-2">
              <span>Date: </span>
              <span>{{ lostItem?.dateLost }}</span>
            </div>
            <Divider layout="vertical" />
            <div class="flex flex-col gap-2">
              <span>Address: </span>
              <span>{{ lostItem?.location }}</span>
            </div>
          </div>
          <div class="rounded-lg bg-gray-300 dark:bg-gray-800 p-3">
            {{ lostItem?.description }}
          </div>
          <div class="rounded-lg bg-gray-300 dark:bg-gray-800 p-3">
            <p class="flex item-center gap-2">
              <span class="font-bold"> Category: </span>
              <span>
                {{ lostItem?.category }}
              </span>
            </p>
            <Divider />
            <p class="flex item-center gap-2">
              <span class="font-bold"> Color: </span>
              <span>
                {{ lostItem?.color }}
              </span>
            </p>
            <Divider />
            <p class="flex item-center gap-2">
              <span class="font-bold"> Status: </span>
              <Tag :severity="lostItem?.status === Status.PENDING ? 'info' : 'danger'">{{
                lostItem?.status
              }}</Tag>
            </p>
          </div>
        </div>
      </div>
    </div>
    <Button label="Review" class="mx-auto w-full max-w-[1100px]" rounded @click="confirmPosition" />
  </div>
</template>
