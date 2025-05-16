import { getTokenFromLocalStorage } from '@/utils/localStorageUtils'
import axios from 'axios'

export const Axios = axios.create({
  baseURL: 'http://localhost:8080',
})
Axios.interceptors.request.use(
  (config) => {
    // Exclude auth endpoints
    if (config?.url?.includes('/auth/login')) {
      return config
    }

    // Get token from localStorage (or however you store it)
    const token = getTokenFromLocalStorage()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
