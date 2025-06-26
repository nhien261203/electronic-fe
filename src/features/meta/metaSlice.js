// src/features/meta/metaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchMetaData = createAsyncThunk(
    'meta/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const [catRes, brandRes] = await Promise.all([
                axios.get('http://localhost:8000/api/categories?per_page=1000'),
                axios.get('http://localhost:8000/api/brands?per_page=1000'),
            ])
            return {
                categories: catRes.data.data, // chứa cả image nếu có
                brands: brandRes.data.data,   // chứa cả image nếu có
            }
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi tải danh mục hoặc thương hiệu' })
        }
    }
)

const metaSlice = createSlice({
    name: 'meta',
    initialState: {
        categories: [],
        brands: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMetaData.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMetaData.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload.categories
                state.brands = action.payload.brands
            })
            .addCase(fetchMetaData.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export default metaSlice.reducer
