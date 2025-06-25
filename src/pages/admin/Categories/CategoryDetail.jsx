import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import axios from 'axios'
import dayjs from 'dayjs'

const CategoryDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const [category, setCategory] = useState(location.state?.category || null)
    const [loading, setLoading] = useState(!category)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (category) return

        setLoading(true)
        axios
            .get(`http://localhost:8001/api/categories/${id}`)
            .then((res) => {
                setCategory(res.data.data)
            })
            .catch(() => {
                setError('❌ Không tìm thấy danh mục.')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [id, category])

    if (loading) return <div className="p-6 text-blue-600">⏳ Đang tải dữ liệu...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>

    return (
        <div className="p-6 font-sans">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:underline flex items-center"
            >
                <FaArrowLeft className="mr-2" />
                Quay lại danh sách
            </button>

            <div className="bg-white shadow rounded p-6 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">📄 Chi tiết Danh mục</h2>

                <div className="space-y-3 text-gray-700 text-sm">
                    <div><strong>ID:</strong> {category.id}</div>
                    <div><strong>Tên:</strong> {category.name}</div>
                    <div><strong>Slug:</strong> {category.slug}</div>
                    <div><strong>Danh mục cha:</strong> {category.parent?.name || 'Gốc'}</div>
                    <div>
                        <strong>Trạng thái:</strong>{' '}
                        <span className={category.status === 1 ? 'text-green-600' : 'text-gray-500'}>
                            {category.status === 1 ? 'Hoạt động' : 'Tạm ẩn'}
                        </span>
                    </div>
                    <div>
                        <strong>Ngày tạo:</strong>{' '}
                        {dayjs(category.created_at).format('DD/MM/YYYY HH:mm')}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CategoryDetail
