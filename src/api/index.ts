import { Axios } from '@/axios'
import type { FoundItem, User } from '@/types'

//----------------user ms---------------------------
export const getUser = async (id: string) => {
  try {
    const res = await Axios.get(`/user/user/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export const createUser = async (user: Omit<User, 'id'>) => {
  try {
    const res = await Axios.post('/user/user', user)
    return res
  } catch (error) {
    throw error
  }
}
//----------------found item ms---------------------------

export const getFoundItems = async () => {
  try {
    const res = await Axios.get('/found-item/found-item')
    return res
  } catch (error) {
    throw error
  }
}

export const createFoundItem = async (data: FoundItem) => {
  try {
    const res = await Axios.post('/found-item/found-item', data)
    return res
  } catch (error) {
    throw error
  }
}

//----------------lost item ms---------------------------

export const getLostItems = async () => {
  try {
    const res = await Axios.get('/lost-item/lost-item')
    return res
  } catch (error) {
    throw error
  }
}
