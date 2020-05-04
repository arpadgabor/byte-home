export const setAuthHeader = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
