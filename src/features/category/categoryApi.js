// src/features/category/categoryAPI.js
import axios from 'axios'

const API_URL = 'http://localhost:8000/api/categories'

const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
}

export const fetchCategoriesAPI = async ({ page = 1, perPage = 10, search = '' }) => {
    const res = await axios.get(API_URL, {
        params: { page, per_page: perPage, search },
        headers,
    })
    return res.data
}

export const fetchCategoryAPI = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`, { headers })
    return res.data.data
}

export const createCategoryAPI = async (data) => {
    const res = await axios.post(API_URL, data, { headers })
    return res.data.data
}

export const updateCategoryAPI = async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, data, { headers })
    return res.data.data
}

export const deleteCategoryAPI = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, { headers })
    return res.data
}
