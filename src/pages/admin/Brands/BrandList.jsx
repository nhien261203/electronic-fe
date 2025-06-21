import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands } from '../../../features/brand/brandSlice'
import { toast } from 'react-toastify'
import ClipLoader from 'react-spinners/ClipLoader'

const BrandList = () => {
    const dispatch = useDispatch()
    const { brands, loading, error, pagination } = useSelector((state) => state.brand)

    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 5

    // Fetch brands khi page thay đổi
    useEffect(() => {
        dispatch(fetchBrands({ page: currentPage, perPage }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [dispatch, currentPage])

    // Hiển thị lỗi
    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    // Render bảng hoặc loading
    const renderTableContent = () => {
        if (loading) {
            return (
                <div className="min-h-[200px] flex items-center justify-center">
                    <ClipLoader color="#3b82f6" size={40} />
                </div>
            )
        }

        if (brands.length === 0) {
            return (
                <div className="p-4 text-center text-gray-500">Không có thương hiệu nào</div>
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
                                />
                            </td>
                            <td className="p-3 font-medium">{brand.name}</td>
                            <td className="p-3">{brand.slug}</td>
                            <td className="p-3">{brand.country}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    // Render pagination
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏷️ Danh sách Thương hiệu</h2>

            <div className="overflow-x-auto bg-white rounded shadow">
                {renderTableContent()}
            </div>

            {renderPagination()}
        </div>
    )
}

export default BrandList
