import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tours: [],
  selectedTour: null,
  isLoading: false,
  error: null,
  filters: {
    destination: '',
    minPrice: '',
    maxPrice: '',
    duration: '',
  },
}

const tourSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    fetchToursStart(state) {
      state.isLoading = true
      state.error = null
    },
    fetchToursSuccess(state, action) {
      state.isLoading = false
      state.tours = action.payload
    },
    fetchToursFailure(state, action) {
      state.isLoading = false
      state.error = action.payload
    },
    setSelectedTour(state, action) {
      state.selectedTour = action.payload
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters(state) {
      state.filters = initialState.filters
    },
  },
})

export const {
  fetchToursStart, fetchToursSuccess, fetchToursFailure,
  setSelectedTour, setFilters, clearFilters,
} = tourSlice.actions
export default tourSlice.reducer