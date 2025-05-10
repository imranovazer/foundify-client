<script lang="ts" setup>
import { useReviewStore } from '@/stores/counter'
import { RouterLink, useRoute } from 'vue-router'

const review = useReviewStore()
</script>

<template>
  <div class="mt-[100px] px-4 container mx-auto">
    <h1 class="font-bold text-3xl">Items to be reviewed</h1>
    <div class="flex flex-col gap-2 mt-[50px]">
      <RouterLink
        v-for="item in review.myReviews"
        :to="`/review/${item.id}`"
        class="rounded-xl py-2 px-4 shadow-lg border border-gray-200"
      >
        <P> Click to go to review </P>
        <P>Match id : {{ item.id }}</P>
        <p>Match date : {{ item.matchedAt }}</p>
      </RouterLink>
    </div>
  </div>
</template>
