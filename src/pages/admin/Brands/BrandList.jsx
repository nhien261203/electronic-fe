import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands, resetBrandState } from '../../../features/brand/brandSlice'
import { toast } from 'react-toastify'

const BrandList = () => {
    const dispatch = useDispatch()
    const { brands, loading, error } = useSelector((state) => state.brand)

    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 5

    const paginated = brands.slice((currentPage - 1) * perPage, currentPage * perPage)
    const totalPages = Math.ceil(brands.length / perPage)

    useEffect(() => {
        dispatch(fetchBrands())
        return () => {
            dispatch(resetBrandState())
        }
    }, [dispatch])

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    return (
        <div className="p-6 font-sans">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏷️ Danh sách Thương hiệu</h2>

            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <div className="overflow-x-auto bg-white rounded shadow">
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
                            {paginated.map((brand) => (
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
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">
                                        Không có thương hiệu nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                    Trang {currentPage} / {totalPages || 1}
                </span>
                <div className="space-x-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                        ◀️ Trước
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                    >
                        Tiếp ▶️
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BrandList
