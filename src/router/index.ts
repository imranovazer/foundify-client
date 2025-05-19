import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ReportItem from '@/views/ReportItem.vue'
import ProfileView from '@/views/ProfileView.vue'
import FoundItemDetails from '@/views/FoundItemDetails.vue'
import LostItemDetails from '@/views/LostItemDetails.vue'
import ReviewView from '@/views/ReviewView.vue'
import ReviewDetails from '@/views/ReviewDetails.vue'
import { getTokenFromLocalStorage } from '@/utils/localStorageUtils'
import ChatView from '@/views/ChatView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/report-item',
      name: 'report-item',
      component: ReportItem,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/found-item/:id',
      name: 'found-item',
      component: FoundItemDetails,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/lost-item/:id',
      name: 'lost-item',
      component: LostItemDetails,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/review',
      name: 'review',
      component: ReviewView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/review/:id',
      name: 'reviewDetails',
      component: ReviewDetails,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: `/chat/:with`,
      name: 'chat',
      component: ChatView,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userIsLoggedIn = getTokenFromLocalStorage()
  if (to.meta.requiresAuth && !userIsLoggedIn) {
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'register') && userIsLoggedIn) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
