import axiosInstance from './axiosInstance'

export const createBooking = async (bookingData) => {
  const response = await axiosInstance.post('/bookings', bookingData)
  return response.data
}

export const getMyBookings = async () => {
  const response = await axiosInstance.get('/bookings/my')
  return response.data
}

export const getBookingById = async (id) => {
  const response = await axiosInstance.get(`/bookings/${id}`)
  return response.data
}

export const cancelBooking = async (id) => {
  const response = await axiosInstance.put(`/bookings/${id}/cancel`)
  return response.data
}

export const getAllBookingsAdmin = async (params = {}) => {
  const response = await axiosInstance.get('/bookings', { params })
  return response.data
}

export const markBookingAsPaid = async (id) => {
  const response = await axiosInstance.put(`/bookings/${id}/pay`)
  return response.data
}