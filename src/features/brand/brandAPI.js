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

// Gọi API lấy danh sách thương hiệu
export const fetchBrandsAPI = async () => {
    const response = await axios.get(API_URL)
    return response.data.data // Laravel trả về { data: [...] }
}
