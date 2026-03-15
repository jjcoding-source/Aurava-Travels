import axiosInstance from './axiosInstance'

export const getAllLeads = async (params = {}) => {
  const response = await axiosInstance.get('/leads', { params })
  return response.data
}

export const createLead = async (leadData) => {
  const response = await axiosInstance.post('/leads', leadData)
  return response.data
}

export const updateLead = async (id, updateData) => {
  const response = await axiosInstance.put(`/leads/${id}`, updateData)
  return response.data
}

export const deleteLead = async (id) => {
  const response = await axiosInstance.delete(`/leads/${id}`)
  return response.data
}