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

export const createTour = async (tourData) => {
  const response = await axiosInstance.post('/tours', tourData)
  return response.data
}

export const updateTour = async (id, tourData) => {
  const response = await axiosInstance.put(`/tours/${id}`, tourData)
  return response.data
}

export const deleteTour = async (id) => {
  const response = await axiosInstance.delete(`/tours/${id}`)
  return response.data
}