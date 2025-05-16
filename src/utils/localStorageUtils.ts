export const saveUserToLocalStorage = (userId: string) => {
  localStorage.setItem('user', userId)
}

export const getUserFromLocalStorage = () => {
  return localStorage.getItem('user')
}

export const removeUserFromLocalStoreage = () => {
  localStorage.removeItem('user')
}

export const saveToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token')
}

export const removeTokenFromLocalStoreage = () => {
  localStorage.removeItem('token')
}
