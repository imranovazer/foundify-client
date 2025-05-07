import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ReportItem from '@/views/ReportItem.vue'

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
  ],
})

router.beforeEach((to, from, next) => {
  const userIsLoggedIn = localStorage.getItem('user')

  if (to.meta.requiresAuth && !userIsLoggedIn) {
    next({ name: 'login' })
  } else if ((to.name === 'login' || to.name === 'register') && userIsLoggedIn) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
