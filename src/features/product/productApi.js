// src/features/product/productAPI.js
import axios from 'axios'

const BASE_URL = 'http://localhost:8001/api/products'

// Tạo sản phẩm mới (gửi kèm ảnh)
export const createProductAPI = async (formData) => {
    const response = await axios.post(BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

// Lấy danh sách sản phẩm có phân trang và lọc
export const fetchProductsAPI = async ({ page = 1, perPage = 10, search = '', brand_id = '', category = '', status = '' }) => {
    const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...(search && { search }),
        ...(brand_id && { brand_id }),   //loc thuong hieu
        ...(category && { category }),
        ...(status !== '' && { status }),
    })

    const response = await axios.get(`${BASE_URL}?${params}`)
    return response.data
}

// Cập nhật sản phẩm
export const updateProductAPI = async (id, formData) => {
    const response = await axios.post(`${BASE_URL}/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

// Xoá sản phẩm
export const deleteProductAPI = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`)
    return response.data
}

// Lấy chi tiết 1 sản phẩm
export const fetchProductDetailAPI = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`)
    return response.data
}
