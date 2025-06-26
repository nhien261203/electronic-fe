import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    updateProduct,
    fetchProductDetail,
    clearCurrentProduct,
    resetProductState
} from '../../../features/product/productSlice'
import { fetchMetaData } from '../../../features/meta/metaSlice'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '../../../styles/nprogress.css'
import ProductImageManager from './ProductImagesManager'

const EditProduct = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const page = location.state?.page || 1

    const { currentProduct, loading, success, error } = useSelector((state) => state.product)
    const { categories, brands } = useSelector((state) => state.meta)

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        quantity: 0,
        category_id: '',
        brand_id: '',
        status: '1',
        images: [] // new uploaded images
    })

    useEffect(() => {
        NProgress.start()
        dispatch(fetchMetaData())
        dispatch(fetchProductDetail(id)).finally(() => NProgress.done())
        return () => dispatch(clearCurrentProduct())
    }, [dispatch, id])

    useEffect(() => {
        if (currentProduct) {
            setForm({
                name: currentProduct.name,
                description: currentProduct.description,
                price: currentProduct.price,
                original_price: currentProduct.original_price || '',
                quantity: currentProduct.quantity,
                category_id: currentProduct.category_id,
                brand_id: currentProduct.brand_id,
                status: String(currentProduct.status),
                images: []
            })
        }
    }, [currentProduct])

    useEffect(() => {
        if (success) {
            toast.success('Cập nhật sản phẩm thành công!')
            dispatch(resetProductState())
            navigate(`/admin/products?page=${page}`)
        }

        if (error) {
            const errObj = error.errors ?? error
            Object.values(errObj).flat().forEach((msg) => toast.error(msg))
            dispatch(resetProductState())
        }
    }, [success, error, dispatch, navigate, page])

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'images') {
            const validFiles = Array.from(files).filter(f => f.size <= 3 * 1024 * 1024)
            setForm((prev) => ({ ...prev, images: validFiles }))
        } else {
            setForm((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        Object.entries(form).forEach(([key, value]) => {
            if (key === 'images') {
                value.forEach(img => formData.append('images[]', img))
            } else {
                formData.append(key, value)
            }
        })
        dispatch(updateProduct({ id, formData }))
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded">
            <h2 className="text-xl font-bold mb-4 text-gray-700">✏️ Cập nhật sản phẩm</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" type="text" required placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" />
                <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
                <input name="price" type="number" required placeholder="Giá bán (VND)" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" />
                <input name="original_price" type="number" placeholder="Giá gốc (VND)" value={form.original_price} onChange={handleChange} className="w-full border p-2 rounded" />
                <input name="quantity" type="number" min="0" required placeholder="Tồn kho" value={form.quantity} onChange={handleChange} className="w-full border p-2 rounded" />

                <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full border p-2 rounded" required>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <select name="brand_id" value={form.brand_id} onChange={handleChange} className="w-full border p-2 rounded" required>
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                </select>

                <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
                    <option value="1">Hiển thị</option>
                    <option value="0">Ẩn</option>
                </select>

                {/* Upload thêm ảnh mới */}
                {/* <div>
                    <label className="block font-medium mb-1">📤 Ảnh mới (tối đa 3MB mỗi ảnh)</label>
                    <input type="file" name="images" accept="image/*" multiple onChange={handleChange} className="w-full border p-2 rounded" />
                </div> */}

                {/* Quản lý ảnh hiện có */}
                <ProductImageManager productId={id} />

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(`/admin/products?page=${page}`)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Huỷ
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditProduct
