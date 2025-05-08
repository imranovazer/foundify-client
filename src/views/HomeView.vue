<script lang="ts" setup>
import { ref } from 'vue'
import img1 from '@/assets/whyUs/1.jpg'
import img2 from '@/assets/whyUs/2.jpg'
import img3 from '@/assets/whyUs/3.jpg'
import Footer from '@/components/Footer.vue'

const whytoChooseUs = ref([
  {
    title: 'Fast Recovery',
    description:
      'We help reunite owners with their lost items quickly using real-time reports and smart notifications.',
    image: img1,
  },
  {
    title: 'Secure and Verified',
    description:
      'All listings are verified to ensure safety and authenticity. Your personal data stays protected.',
    image: img2,
  },
  {
    title: 'Community-Driven',
    description:
      'Our platform is powered by users helping each other. Be part of a caring, trustworthy community.',
    image: img3,
  },
])
</script>

<template>
  <header
    class="h-[100vh] max-h-[900px] relative flex flex-col gap-[50px] p-[30px] justify-end items-center bg-[url(/banner1.webp)] bg-cover bg-center bg-no-repeat"
  >
    <div class="flex justify-center flex-col items-center">
      <h2 class="text-blue-600 font-bold text-3xl font-sans">Lost something?</h2>
      <span class="font-mono text-blue-600 font-bold">Let the community help you find it</span>
    </div>
    <i
      class="pi pi-angle-double-down dark:text-black shadow-xl text-white animate-pulse-shadow"
    ></i>
  </header>

  <div class="w-full h-[700px] bg-slate-200 dark:bg-slate-900">
    <div class="container mx-auto h-[400px] py-10">
      <h2 class="font-bold text-2xl mb-[100px]">Why to choose us</h2>
      <div class="flex justify-between items-center">
        <div
          v-for="item in whytoChooseUs"
          class="w-full max-w-[270px] bg-white dark:bg-slate-800 mx-auto h-full border border-gray-300/50 rounded-lg shadow-lg flex flex-col justify-between p-3 items-center gap-[20px]"
        >
          <h3 class="font-bold">{{ item.title }}</h3>
          <img
            :src="item.image"
            alt="illustration"
            class="object-cover object-center rounded-2xl w-[210px] h-[200px]"
          />
          <p>
            {{ item.description }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<style>
@keyframes pulse-shadow {
  0% {
    box-shadow: 0 0 0 0 rgba(36, 251, 251, 0.7);
  }
  70% {
    box-shadow: 0 0 20px 10px rgba(251, 191, 36, 0); /* fades out */
  }
  100% {
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
  }
}

.animate-pulse-shadow {
  animation: pulse-shadow 1.5s infinite;
  border-radius: 9999px; /* optional for smoother glow */
}
</style>
