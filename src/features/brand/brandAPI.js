import axios from 'axios'

const BASE_URL = 'http://localhost:8001/api/brands'

// Tạo thương hiệu mới (gửi kèm ảnh & status)
export const createBrandAPI = async (formData) => {
    const response = await axios.post(BASE_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

// Lấy danh sách brand phân trang + lọc
export const fetchBrandsAPI = async (page = 1, perPage = 10, search = '', country = '', status = '') => {
    const params = new URLSearchParams({
        page,
        per_page: perPage,
        ...(search && { search }),
        ...(country && { country }),
        ...(status !== '' && { status }), // status có thể là 0 hoặc 1
    });

    const response = await axios.get(`${BASE_URL}?${params}`);
    return response.data;
}

// Cập nhật thương hiệu
export const updateBrandAPI = async (id, formData) => {
    const response = await axios.post(`${BASE_URL}/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
}

// Xoá thương hiệu
export const deleteBrandAPI = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`)
    return response.data
}

// Lấy danh sách quốc gia
export const fetchCountriesAPI = async () => {
    const response = await axios.get(`${BASE_URL}/countries`)
    return response.data
}
