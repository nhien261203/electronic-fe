import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    createProductAPI,
    fetchProductsAPI,
    updateProductAPI,
    deleteProductAPI,
    fetchProductDetailAPI
} from './productAPI'

// Tạo sản phẩm
export const createProduct = createAsyncThunk(
    'product/create',
    async (formData, { rejectWithValue }) => {
        try {
            return await createProductAPI(formData)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi tạo sản phẩm' })
        }
    }
)

// Lấy danh sách sản phẩm
export const fetchProducts = createAsyncThunk(
    'product/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            return await fetchProductsAPI(params)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi tải danh sách sản phẩm' })
        }
    }
)

// Cập nhật sản phẩm
export const updateProduct = createAsyncThunk(
    'product/update',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            return await updateProductAPI(id, formData)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi cập nhật sản phẩm' })
        }
    }
)

// Xoá sản phẩm
export const deleteProduct = createAsyncThunk(
    'product/delete',
    async (id, { rejectWithValue }) => {
        try {
            return await deleteProductAPI(id)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Lỗi xoá sản phẩm' })
        }
    }
)

// Lấy chi tiết sản phẩm
export const fetchProductDetail = createAsyncThunk(
    'product/detail',
    async (id, { getState, rejectWithValue }) => {
        const productFromList = getState().product.products.find(p => p.id === Number(id))
        if (productFromList) {
            return { data: productFromList } // Dùng luôn nếu đã có
        }

        try {
            return await fetchProductDetailAPI(id)
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Không tìm thấy sản phẩm' })
        }
    }
)

const initialState = {
    products: [],
    pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
    },
    loading: false,
    success: false,
    error: null,
    currentProduct: null
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        resetProductState: (state) => {
            state.loading = false
            state.success = false
            state.error = null
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null
        }
    },
    extraReducers: (builder) => {
        builder
            // Tạo
            .addCase(createProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Lấy danh sách
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.data
                state.pagination = {
                    current_page: action.payload.current_page,
                    last_page: action.payload.last_page,
                    per_page: action.payload.per_page,
                    total: action.payload.total
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Cập nhật
            .addCase(updateProduct.pending, (state) => {
                state.loading = true
                state.success = false
                state.error = null
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Xoá
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.loading = false
                state.success = true
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // Chi tiết sản phẩm
            .addCase(fetchProductDetail.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.loading = false
                state.currentProduct = action.payload.data
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { resetProductState, clearCurrentProduct } = productSlice.actions

export default productSlice.reducer
