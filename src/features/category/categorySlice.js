import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    fetchCategoriesAPI,
    fetchCategoryAPI,
    createCategoryAPI,
    updateCategoryAPI,
    deleteCategoryAPI
} from './categoryAPI'

// Thunks
export const fetchCategories = createAsyncThunk(
    'category/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            return await fetchCategoriesAPI(params) // ✅ params có thể chứa search + status
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const fetchCategory = createAsyncThunk(
    'category/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchCategoryAPI(id)
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const createCategory = createAsyncThunk(
    'category/create',
    async (data, { rejectWithValue }) => {
        try {
            return await createCategoryAPI(data) // ✅ data có thể chứa status
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const updateCategory = createAsyncThunk(
    'category/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await updateCategoryAPI(id, data) // ✅ data có thể chứa status
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'category/delete',
    async (id, { rejectWithValue }) => {
        try {
            return await deleteCategoryAPI(id)
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message)
        }
    }
)

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        category: null,
        loading: false,
        error: null,
        success: false,
        pagination: {}
    },
    reducers: {
        resetState: (state) => {
            state.success = false
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            // 🔄 Fetch all
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload.data
                state.pagination = {
                    current_page: action.payload.current_page,
                    last_page: action.payload.last_page,
                    total: action.payload.total
                }
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // 🔍 Fetch one
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.category = action.payload
            })

            // ➕ Create
            .addCase(createCategory.pending, (state) => {
                state.success = false
            })
            .addCase(createCategory.fulfilled, (state) => {
                state.success = true
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.error = action.payload
                state.success = false
            })

            // ✏️ Update
            .addCase(updateCategory.pending, (state) => {
                state.success = false
            })
            .addCase(updateCategory.fulfilled, (state) => {
                state.success = true
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.error = action.payload
                state.success = false
            })

            // ❌ Delete
            .addCase(deleteCategory.fulfilled, (state) => {
                state.success = true
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.error = action.payload
                state.success = false
            })
    }
})

export const { resetState } = categorySlice.actions
export default categorySlice.reducer
