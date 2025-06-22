import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    createBrandAPI,
    fetchBrandsAPI,
    updateBrandAPI,
    deleteBrandAPI
} from './brandAPI'

// Tạo brand
export const createBrand = createAsyncThunk(
    'brand/create',
    async (formData, { rejectWithValue }) => {
        try {
            return await createBrandAPI(formData)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi tạo thương hiệu' })
        }
    }
)

// Lấy danh sách brand
export const fetchBrands = createAsyncThunk(
    'brand/fetchAll',
    async ({ page, perPage, search = '', country = '' }, { rejectWithValue }) => {
        try {
            return await fetchBrandsAPI(page, perPage, search, country)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi tải danh sách' })
        }
    }
)


// Cập nhật brand
export const updateBrand = createAsyncThunk(
    'brand/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            return await updateBrandAPI(id, formData)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi cập nhật' })
        }
    }
)

// Xoá brand
export const deleteBrand = createAsyncThunk(
    'brand/delete',
    async (id, { rejectWithValue }) => {
        try {
            return await deleteBrandAPI(id)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi xoá' })
        }
    }
)

const initialState = {
    brands: [],
    pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 5,
        total: 0
    },
    loading: false,
    success: false,
    error: null
}

const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {
        resetState: (state) => {
            state.loading = false
            state.success = false
            state.error = null
        },
        resetBrandList: (state) => {
            state.brands = []
            state.pagination = initialState.pagination
        }
    },
    extraReducers: (builder) => {
        builder

            // Create brand
            .addCase(createBrand.pending, (state) => {
                state.loading = true
                state.success = false
                state.error = null
            })
            .addCase(createBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(createBrand.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.errors || { message: action.payload?.message }
            })

            // Fetch brands
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

            // Update brand
            .addCase(updateBrand.pending, (state) => {
                state.loading = true
                state.success = false
                state.error = null
            })
            .addCase(updateBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.errors || { message: action.payload?.message }
            })

            // Delete brand
            .addCase(deleteBrand.pending, (state) => {
                state.loading = true
                state.success = false
                state.error = null
            })
            .addCase(deleteBrand.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(deleteBrand.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload?.errors || { message: action.payload?.message }
            })
    }
})

export const { resetState, resetBrandList } = brandSlice.actions
export default brandSlice.reducer
