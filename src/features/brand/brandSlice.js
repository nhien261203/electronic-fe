// src/features/brand/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBrandAPI, fetchBrandsAPI } from './brandAPI'

// Gửi API tạo brand
export const createBrand = createAsyncThunk(
    'brand/createBrand',
    async (formData, { rejectWithValue }) => {
        try {
            return await createBrandAPI(formData)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi không xác định' })
        }
    }
)

// Lấy danh sách brands
export const fetchBrands = createAsyncThunk(
    'brand/fetchBrands',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchBrandsAPI()
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Lỗi không xác định')
        }
    }
)

// Slice
const brandSlice = createSlice({
    name: 'brand',
    initialState: {
        loading: false,
        error: null,
        success: false,
        brands: []
    },
    reducers: {
        resetState: (state) => {
            state.loading = false
            state.error = null
            state.success = false
        },
        resetBrandState: (state) => {
            state.brands = []
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
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false
                state.brands = action.payload
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { resetState, resetBrandState } = brandSlice.actions
export default brandSlice.reducer
