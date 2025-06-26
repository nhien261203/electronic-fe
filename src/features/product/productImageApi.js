import axios from 'axios'

const BASE = 'http://localhost:8000/api/product-images'

export const fetchImagesByProduct = async (productId) => {
    const res = await axios.get(`${BASE}/product/${productId}`)
    return res.data
}

export const uploadImages = async (productId, images) => {
    const formData = new FormData()
    images.forEach(img => formData.append('images[]', img))
    const res = await axios.post(`${BASE}/product/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
}

export const deleteImage = async (id) => {
    const res = await axios.delete(`${BASE}/${id}`)
    return res.data
}

export const setThumbnail = async (id) => {
    const res = await axios.put(`${BASE}/${id}/thumbnail`)
    return res.data
}
