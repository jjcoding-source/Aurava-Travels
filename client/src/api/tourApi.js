import axiosInstance from './axiosInstance'

export const getAllTours = async (params = {}) => {
  const response = await axiosInstance.get('/tours', { params })
  return response.data
}

export const getTourById = async (id) => {
  const response = await axiosInstance.get(`/tours/${id}`)
  return response.data
}

export const getFeaturedTours = async () => {
  const response = await axiosInstance.get('/tours/featured')
  return response.data
}