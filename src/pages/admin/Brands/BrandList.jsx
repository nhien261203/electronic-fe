import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands } from '../../../features/brand/brandSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'

const BrandList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { brands, loading, error, pagination } = useSelector((state) => state.brand)

    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 10

    useEffect(() => {
        dispatch(fetchBrands({ page: currentPage, perPage }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [dispatch, currentPage])

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    const renderTableContent = () => {
        if (loading && brands.length === 0) {
            return (
                <div className="min-h-[200px] flex items-center justify-center">
                    <ClipLoader color="#3b82f6" size={40} />
                </div>
            )
        }

        return (
            <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Logo</th>
                        <th className="p-3 text-left">Tên</th>
                        <th className="p-3 text-left">Slug</th>
                        <th className="p-3 text-left">Quốc gia</th>
                        <th className="p-3 text-left">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((brand) => (
                        <tr key={brand.id} className="border-t hover:bg-gray-50">
                            <td className="p-3">
                                <img
                                    src={`http://localhost:8000${brand.logo}`}
                                    alt={brand.name}
                                    className="w-20 h-20 object-contain"
                                    loading="lazy"
                                />
                            </td>
                            <td className="p-3 font-medium">{brand.name}</td>
                            <td className="p-3">{brand.slug}</td>
                            <td className="p-3">{brand.country}</td>
                            <td className="p-3 space-x-3 text-sm">
                                <button
                                    onClick={() => navigate(`/admin/brands/${brand.id}`, { state: { brand } })}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Chi tiết"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    onClick={() => toast.info('Chức năng sửa đang phát triển')}
                                    className="text-green-600 hover:text-green-800"
                                    title="Sửa"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => toast.info('Chức năng xoá đang phát triển')}
                                    className="text-red-600 hover:text-red-800"
                                    title="Xoá"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    const renderPagination = () => {
        if (!pagination || pagination.last_page <= 1) return null

        return (
            <div className="flex justify-center mt-6 space-x-1">
                <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    ◀
                </button>

                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${page === pagination.current_page
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    ▶
                </button>
            </div>
        )
    }

    return (
        <div className="p-6 font-sans">
            {/* Tiêu đề và nút thêm */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">🏷️ Danh sách Thương hiệu</h2>
                <button
                    onClick={() => navigate('/admin/add-brand')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <FaPlus /> Thêm mới
                </button>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto bg-white rounded shadow">
                {renderTableContent()}
            </div>

            {/* Phân trang */}
            {renderPagination()}
        </div>
    )
}

export default BrandList
