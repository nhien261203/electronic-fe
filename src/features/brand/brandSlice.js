// src/features/brand/brandSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBrandAPI, fetchBrandsAPI } from './brandAPI'

// Gửi API tạo thương hiệu
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

// Gọi API lấy danh sách thương hiệu có phân trang
export const fetchBrands = createAsyncThunk(
    'brand/fetchBrands',
    async ({ page, perPage }, { rejectWithValue }) => {
        try {
            return await fetchBrandsAPI(page, perPage)
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
        success: false,
        brands: [],
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 5,
            total: 0
        }
    },
    reducers: {
        resetState: (state) => {
            state.loading = false
            state.error = null
            state.success = false
        },
        resetBrandList: (state) => {
            state.brands = []
            state.pagination = {
                current_page: 1,
                last_page: 1,
                per_page: 5,
                total: 0
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Thêm brand
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

            // Lấy danh sách brand (có phân trang)
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false
                state.brands = action.payload.data
                state.pagination = {
                    current_page: action.payload.current_page,
                    last_page: action.payload.last_page,
                    per_page: action.payload.per_page,
                    total: action.payload.total
                }
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.errors || { message: action.payload?.message }
            })
    }
})

export const { resetState, resetBrandList } = brandSlice.actions
export default brandSlice.reducer
