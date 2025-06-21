import { useLocation, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'

const BrandDetail = () => {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [brand, setBrand] = useState(location.state?.brand || null)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Nếu đã có brand (từ danh sách truyền qua), không gọi lại API
        if (brand) return

        axios
            .get(`http://localhost:8000/api/brands/${id}`)
            .then((res) => setBrand(res.data.data))
            .catch(() => setError('Không tìm thấy thương hiệu.'))
    }, [id, brand])

    if (error) {
        return <div className="p-6 text-center text-red-600">{error}</div>
    }

    if (!brand) {
        return <div className="p-6 text-center text-blue-600">Đang tải...</div>
    }

    return (
        <div className="p-6 font-sans">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800 transition"
            >
                <FaArrowLeft className="mr-2" /> Quay lại
            </button>

            <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    🧾 Chi tiết Thương hiệu
                </h2>

                <div className="flex items-center justify-center mb-6">
                    <img
                        src={`http://localhost:8000${brand.logo}`}
                        alt={brand.name}
                        className="w-40 h-40 object-contain border rounded shadow"
                    />
                </div>

                <div className="space-y-3 text-gray-700">
                    <div><strong>Tên:</strong> {brand.name}</div>
                    <div><strong>Slug:</strong> {brand.slug}</div>
                    <div><strong>Quốc gia:</strong> {brand.country || 'Không có'}</div>
                </div>
            </div>
        </div>
    )
}

export default BrandDetail
