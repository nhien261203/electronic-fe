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

export const fetchBrandsAPI = async (page = 1, perPage = 10, search = '', country = '') => {
    const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...(search && { search }),
        ...(country && { country }),
    });

    const response = await axios.get(`http://localhost:8000/api/brands?${params}`);
    return response.data;
};


export const updateBrandAPI = async (id, formData) => {
    const response = await axios.post(`http://localhost:8000/api/brands/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

// Xoá thương hiệu
export const deleteBrandAPI = async (id) => {
    const response = await axios.delete(`http://localhost:8000/api/brands/${id}`)
    return response.data
}

// lấy danh sách các quốc gia
// Dùng để lọc thương hiệu theo quốc gia
export const fetchCountriesAPI = async () => {
    const response = await axios.get('http://localhost:8000/api/brands/countries')
    return response.data
}

