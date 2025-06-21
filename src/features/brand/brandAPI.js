// src/features/brand/brandAPI.js
import axios from 'axios'

const API_URL = 'http://localhost:8000/api/brands'

// Gọi API tạo thương hiệu
export const createBrandAPI = async (formData) => {
    const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

export const fetchBrandsAPI = async (page = 1, perPage = 5) => {
    const response = await axios.get(`http://localhost:8000/api/brands?page=${page}&per_page=${perPage}`)
    return response.data // Trả về object: { current_page, data, total, per_page, last_page, ... }
}



