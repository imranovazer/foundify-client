import { Axios } from '@/axios'
import type { ApprovalType, AuthDto, FoundItem, LostItem, MessageDto, User } from '@/types'

//---------------auth ms--------------------------

export const loginUser = async (data: AuthDto) => {
  try {
    const res = await Axios.post('/auth/auth/login', data)
    return res
  } catch (error) {
    throw error
  }
}

//----------------user ms---------------------------
export const getMyInfo = async () => {
  try {
    const res = await Axios.get(`/user/user/info`)
    return res
  } catch (error) {
    throw error
  }
}

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

export const updateUser = async (id: string, body: Omit<User, 'id'>) => {
  try {
    const res = await Axios.put(`/user/user/${id}`, body)
    return res
  } catch (error) {
    throw error
  }
}
export const deleteUser = async (id: string) => {
  try {
    const res = await Axios.delete(`/user/user/${id}`)
    return res
  } catch (error) {
    throw error
  }
}
//----------------found item ms---------------------------
export const getFoundItemsByUser = async (id: string) => {
  try {
    const res = await Axios.get('/found-item/found-item/by-user', { params: { userId: id } })
    return res
  } catch (error) {
    throw error
  }
}

export const getFoundItems = async () => {
  try {
    const res = await Axios.get('/found-item/found-item')
    return res
  } catch (error) {
    throw error
  }
}
export const getFoundItem = async (id: string) => {
  try {
    const res = await Axios.get(`/found-item/found-item/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export const createFoundItem = async (data: FormData) => {
  try {
    const res = await Axios.post('/found-item/found-item', data)
    return res
  } catch (error) {
    throw error
  }
}
export const addFoundItemImages = async (data: FormData) => {
  try {
    const res = await Axios.post('/found-item/found-item/images', data)
    return res
  } catch (error) {
    throw error
  }
}
export const editFoundItem = async (id: string, data: FoundItem) => {
  try {
    const res = await Axios.put(`/found-item/found-item/${id}`, data)
    return res
  } catch (error) {
    throw error
  }
}
export const getFoundItemImage = async (id: string) => {
  try {
    const res = await Axios.get(`/found-item/image/${id}`, {
      responseType: 'blob', // 👈 This is the key part
    })
    return res
  } catch (error) {
    throw error
  }
}

export const deleteFoundItem = async (id: string, userId: string) => {
  try {
    const res = await Axios.delete(`/found-item/found-item/${id}`, { params: { userId } })
    return res
  } catch (error) {
    throw error
  }
}
export const deleteFoundItemImage = async (id: string, userId: string, imageId: string) => {
  try {
    const res = await Axios.delete(`/found-item/found-item/${id}/images/${imageId}`, {
      params: { userId },
    })
    return res
  } catch (error) {
    throw error
  }
}
//----------------lost item ms---------------------------
export const getLostItemsByUser = async (id: string) => {
  try {
    const res = await Axios.get('/lost-item/lost-item/by-user', { params: { userId: id } })
    return res
  } catch (error) {
    throw error
  }
}

export const getLostItems = async () => {
  try {
    const res = await Axios.get('/lost-item/lost-item')
    return res
  } catch (error) {
    throw error
  }
}
export const getLostItem = async (id: string) => {
  try {
    const res = await Axios.get(`/lost-item/lost-item/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export const createLostItem = async (data: FormData) => {
  try {
    const res = await Axios.post('/lost-item/lost-item', data)
    return res
  } catch (error) {
    throw error
  }
}
export const addLostItemImages = async (data: FormData) => {
  try {
    const res = await Axios.post('/lost-item/lost-item/images', data)
    return res
  } catch (error) {
    throw error
  }
}
export const editLostdItem = async (id: string, data: LostItem) => {
  try {
    const res = await Axios.put(`/lost-item/lost-item/${id}`, data)
    return res
  } catch (error) {
    throw error
  }
}

export const getLostItemImage = async (id: string) => {
  try {
    const res = await Axios.get(`/lost-item/image/${id}`, {
      responseType: 'blob', // 👈 This is the key part
    })
    return res
  } catch (error) {
    throw error
  }
}

export const deleteLostItem = async (id: string, userId: string) => {
  try {
    const res = await Axios.delete(`/lost-item/lost-item/${id}`, { params: { userId } })
    return res
  } catch (error) {
    throw error
  }
}

export const deleteLostItemImage = async (id: string, userId: string, imageId: string) => {
  try {
    const res = await Axios.delete(`/lost-item/lost-item/${id}/images/${imageId}`, {
      params: { userId },
    })
    return res
  } catch (error) {
    throw error
  }
}

//----------------Review ms---------------------------

export const getAllReviews = async () => {
  try {
    const res = await Axios.get('/review/review')
    return res
  } catch (error) {
    throw error
  }
}

export const getReview = async (id: string) => {
  try {
    const res = await Axios.get(`/review/review/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export const updateReview = async (
  id: string,
  params: { userId: string; approvalType: ApprovalType },
) => {
  try {
    const res = await Axios.put(`/review/review/${id}/approve`, {}, { params })
    return res
  } catch (error) {
    throw error
  }
}

//----------------chat-ms --------------
export const sendMessage = async (sessionId: string, data: MessageDto) => {
  try {
    const res = await Axios.post(`/chat/${sessionId}/send`, data)
    return res
  } catch (error) {
    throw error
  }
}
export const closeChatSession = async (
  sessionId: string,
  params: { userId1: string; userId2: string },
) => {
  try {
    const res = await Axios.post(`/chat/${sessionId}/close`, {}, { params })
    return res
  } catch (error) {
    throw error
  }
}
export const getCachedChatHistory = async (sessionId: string) => {
  try {
    const res = await Axios.get(`/chat/${sessionId}/history`)
    return res
  } catch (error) {
    throw error
  }
}

export const getDbChatHistory = async (params: { userId1: string; userId2: string }) => {
  try {
    const res = await Axios.get(`/chat/history/db`, { params })
    return res
  } catch (error) {
    throw error
  }
}
