import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    // Fallback lấy trang từ state hoặc URL
    const searchParams = new URLSearchParams(location.search)
    const fallbackPage = searchParams.get('page') || 1
    const page = location.state?.page || fallbackPage

    // Lấy product từ state nếu có (để không gọi lại API)
    const initialProduct = location.state?.product || null
    const [product, setProduct] = useState(initialProduct)
    const [loading, setLoading] = useState(!initialProduct)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (product) return // Đã có sẵn thì không fetch lại

        axios
            .get(`http://localhost:8000/api/products/${id}`)
            .then((res) => {
                setProduct(res.data.data)
                setLoading(false)
            })
            .catch(() => {
                setError('Không tìm thấy sản phẩm')
                setLoading(false)
            })
    }, [id, product])

    // if (loading) return <div className="p-6 text-blue-600 text-center">Đang tải...</div>
    if (error || !product)
        return <div className="p-6 text-red-600 text-center">{error || 'Lỗi không xác định'}</div>

    const statusLabel = product.status === 1 ? 'Hiển thị' : 'Ẩn'
    const statusColor = product.status === 1 ? 'text-green-600' : 'text-gray-500'

    return (
        <div className="p-6 font-sans">
            <button
                onClick={() => navigate(`/admin/products?page=${page}`)}
                className="mb-4 inline-flex items-center text-blue-600 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Quay lại danh sách
            </button>

            <div className="bg-white p-6 shadow rounded max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">📦 Chi tiết sản phẩm</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div><strong>Tên:</strong> {product.name}</div>
                    <div><strong>Giá bán:</strong> {Number(product.price).toLocaleString()}₫</div>
                    <div><strong>Giá gốc:</strong> {Number(product.original_price).toLocaleString()}₫</div>
                    <div><strong>Kho hàng:</strong> {product.quantity}</div>
                    <div><strong>Đã bán:</strong> {product.sold}</div>
                    <div><strong>Danh mục:</strong> {product.category?.name || '---'}</div>
                    <div><strong>Thương hiệu:</strong> {product.brand?.name || '---'}</div>
                    <div>
                        <strong>Trạng thái:</strong>{' '}
                        <span className={`font-semibold ${statusColor}`}>{statusLabel}</span>
                    </div>
                </div>

                <div className="mt-6">
                    <strong className="block mb-2">Mô tả:</strong>
                    <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {product.images && product.images.length > 0 ? (
                        product.images.map((img, idx) => (
                            <div key={idx} className="relative w-28 h-28">
                                <img
                                    src={`http://localhost:8000${img.image_url}`}
                                    loading="lazy"
                                    alt={`product-${idx}`}
                                    className="w-full h-full object-cover border rounded shadow"
                                />
                                {img.is_thumbnail === 1 && (
                                    <div className="absolute top-1 left-1 bg-yellow-400 text-white text-xs font-semibold px-1 rounded">
                                        Đại diện
                                    </div>
                                )}
                            </div>
                        ))

                    ) : (
                        <span className="text-gray-500">Không có hình ảnh</span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
