import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createProduct, resetProductState } from '../../../features/product/productSlice'
import axios from 'axios'

const AddProduct = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, success, error } = useSelector((state) => state.product)

    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        quantity: 0,
        category_id: '',
        brand_id: '',
        status: '1',
        images: []
    })

    const [previewImages, setPreviewImages] = useState([])
    const [thumbnailIndex, setThumbnailIndex] = useState(0)

    const handleChange = (e) => {
        const { name, value, files } = e.target

        if (name === 'images') {
            const filesArray = Array.from(files).filter(file => file.size <= 3 * 1024 * 1024)
            setForm((prev) => ({ ...prev, images: filesArray }))
            setPreviewImages(filesArray.map((file) => URL.createObjectURL(file)))
            setThumbnailIndex(0) // reset về ảnh đầu tiên
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'images') {
                value.forEach((img) => formData.append('images[]', img))
            } else {
                formData.append(key, value)
            }
        })

        formData.append('thumbnail_index', thumbnailIndex)
        dispatch(createProduct(formData))
    }

    useEffect(() => {
        if (success) {
            toast.success('Thêm sản phẩm thành công!')
            dispatch(resetProductState())
            navigate('/admin/products')
        }

        if (error) {
            const errObj = error.errors ?? error
            Object.values(errObj).flat().forEach((msg) => toast.error(msg))
            dispatch(resetProductState())
        }
    }, [success, error, dispatch, navigate])

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/categories?per_page=1000'),
                    axios.get('http://localhost:8000/api/brands?per_page=1000')
                ])
                setCategories(catRes.data.data || [])
                setBrands(brandRes.data.data || [])
            } catch {
                toast.error('Lỗi tải dữ liệu danh mục hoặc thương hiệu')
            }
        }
        fetchMeta()
    }, [])

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
            <h2 className="text-xl font-bold mb-4 text-gray-700">➕ Thêm sản phẩm</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" type="text" required placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
                <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
                <input name="price" type="number" required placeholder="Giá bán (VND)" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" />
                <input name="original_price" type="number" placeholder="Giá gốc (VND)" value={form.original_price} onChange={handleChange} className="w-full border p-2 rounded" />
                <input name="quantity" type="number" min="0" required placeholder="Tồn kho (số lượng)" value={form.quantity} onChange={handleChange} className="w-full border p-2 rounded" />

                <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full border p-2 rounded" required>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <select name="brand_id" value={form.brand_id} onChange={handleChange} className="w-full border p-2 rounded" required>
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                </select>

                <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
                    <option value="1">Hiển thị</option>
                    <option value="0">Ẩn</option>
                </select>

                <div>
                    <label className="block font-medium mb-1">Hình ảnh sản phẩm (tối đa 3MB mỗi ảnh)</label>
                    <input type="file" name="images" accept="image/*" multiple onChange={handleChange} className="w-full border p-2 rounded" />
                    <div className="flex gap-3 mt-3 flex-wrap">
                        {previewImages.map((url, idx) => (
                            <div key={idx} className="relative">
                                <img
                                    src={url}
                                    alt="preview"
                                    className={`w-24 h-24 object-cover border-2 rounded ${thumbnailIndex === idx ? 'border-yellow-500' : 'border-gray-300'}`}
                                />
                                <div className="absolute bottom-1 left-1 text-xs bg-white bg-opacity-80 px-1 rounded">
                                    <label>
                                        <input
                                            type="radio"
                                            name="thumbnail"
                                            value={idx}
                                            checked={thumbnailIndex === idx}
                                            onChange={() => setThumbnailIndex(idx)}
                                            className="mr-1"
                                        />
                                        Đại diện
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
            </form>
        </div>
    )
}

export default AddProduct
