// src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import brandReducer from '../features/brand/brandSlice'
import categoryReducer from '../features/category/categorySlice'
import productReducer from '../features/product/productSlice'
import metaReducer from '../features/meta/metaSlice'


export const store = configureStore({
    reducer: {
        brand: brandReducer,
        category: categoryReducer,
        product: productReducer,
        meta: metaReducer,
    }
})
