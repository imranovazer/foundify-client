export const saveUserToLocalStorage = (userId: string) => {
  localStorage.setItem('user', userId)
}

export const getUserFromLocalStorage = () => {
  return localStorage.getItem('user')
}

export const removeUserFromLocalStoreage = () => {
  localStorage.removeItem('user')
}
