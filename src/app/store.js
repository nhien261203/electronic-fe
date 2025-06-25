// src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import brandReducer from '../features/brand/brandSlice'
import categoryReducer from '../features/category/categorySlice'
import productReducer from '../features/product/productSlice'


export const store = configureStore({
    reducer: {
        brand: brandReducer,
        category: categoryReducer,
        product: productReducer
    }
})
