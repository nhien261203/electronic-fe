// src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import brandReducer from '../features/brand/brandSlice'

export const store = configureStore({
    reducer: {
        brand: brandReducer
    }
})
