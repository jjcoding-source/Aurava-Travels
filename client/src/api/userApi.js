import axiosInstance from './axiosInstance'

export const getAllUsers = async (params = {}) => {
  const response = await axiosInstance.get('/auth/users', { params })
  return response.data
}

export const toggleUserStatus = async (id) => {
  const response = await axiosInstance.put(`/auth/users/${id}/toggle`)
  return response.data
}