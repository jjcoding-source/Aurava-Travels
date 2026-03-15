import axiosInstance from './axiosInstance'

export const getDashboardAnalytics = async () => {
  const response = await axiosInstance.get('/analytics/dashboard')
  return response.data
}

export const getReports = async () => {
  const response = await axiosInstance.get('/analytics/reports')
  return response.data
}