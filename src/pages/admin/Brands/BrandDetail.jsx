import { useLocation, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'

const BrandDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    
    console.log('🔍 location.state:', location.state) // Thêm dòng này


    const page = location.state?.page || 1
    

    const [brand, setBrand] = useState(location.state?.brand || null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(!brand)

    useEffect(() => {
        if (brand) return

        axios
            .get(`http://localhost:8000/api/brands/${id}`)
            .then((res) => {
                setBrand(res.data.data)
                setLoading(false)
            })
            .catch(() => {
                setError('Không tìm thấy thương hiệu.')
                setLoading(false)
            })
    }, [id, brand])

    if (loading) {
        return <div className="p-6 text-center text-blue-600">Đang tải dữ liệu...</div>
    }

    if (error) {
        return <div className="p-6 text-center text-red-600">{error}</div>
    }

    return (
        <div className="p-6 font-sans">
            <button
                onClick={() => navigate(`/admin/brands?page=${page}`)}
                className="mb-4 inline-flex items-center text-blue-600 hover:underline"
            >
                <FaArrowLeft className="mr-2" />
                Quay lại danh sách
            </button>

            <div className="bg-white shadow rounded p-6 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    🧾 Chi tiết Thương hiệu
                </h2>

                <div className="flex justify-center mb-6">
                    <img
                        src={`http://localhost:8000${brand.logo}`}
                        alt={brand.name}
                        className="w-40 h-40 object-contain border rounded shadow"
                        loading="lazy"
                    />
                </div>

                <div className="space-y-3 text-gray-700 text-sm">
                    <div><strong>Tên thương hiệu:</strong> {brand.name}</div>
                    <div><strong>Slug:</strong> {brand.slug}</div>
                    <div><strong>Quốc gia:</strong> {brand.country || 'Không có'}</div>
                </div>
            </div>
        </div>
    )
}

export default BrandDetail
