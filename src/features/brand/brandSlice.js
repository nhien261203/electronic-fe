// src/features/brand/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Gửi API tạo brand
export const createBrand = createAsyncThunk(
    'brand/createBrand',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:8000/api/brands', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return response.data
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi không xác định' })
        }
    }
)

const brandSlice = createSlice({
    name: 'brand',
    initialState: {
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetState: (state) => {
            state.loading = false
            state.error = null
            state.success = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBrand.pending, (state) => {
                state.loading = true
                state.error = null
                state.success = false
            })
            .addCase(createBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(createBrand.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.errors || { message: action.payload?.message }
            })
    }
})

export const { resetState } = brandSlice.actions
export default brandSlice.reducer
