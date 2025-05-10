import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { AxiosResponse } from 'axios'
import { ReviewStatus, type Review } from '@/types'
import { getAllReviews } from '@/api'
import { useUserStore } from './user'

export const useReviewStore = defineStore('review', () => {
  const user = useUserStore()
  const myReviews = ref<Review[]>([])
  const reviewAmount = computed(() => myReviews.value.length)
  async function getReviews() {
    try {
      const reviewResponse: AxiosResponse<Review[]> = await getAllReviews()
      const myReviewsFiltered = reviewResponse.data.filter(
        (item) =>
          (item.foundItemOwnerId === user.user?.id || item.lostItemOwnerId === user.user?.id) &&
          item.status === ReviewStatus.IN_REVIEW,
      )
      myReviews.value = myReviewsFiltered
    } catch (error) {}
  }

  return { myReviews, reviewAmount, getReviews }
})
