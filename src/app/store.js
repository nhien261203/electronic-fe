// src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import brandReducer from '../features/brand/brandSlice'
import categoryReducer from '../features/category/categorySlice'

export const store = configureStore({
    reducer: {
        brand: brandReducer,
        category: categoryReducer
    }
})
