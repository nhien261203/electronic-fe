import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands, deleteBrand, resetState } from '../../../features/brand/brandSlice'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa'
import ClipLoader from 'react-spinners/ClipLoader'
import ConfirmModal from '../../../components/ConfirmModal'

const BrandList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { brands, loading, error, success, pagination } = useSelector((state) => state.brand)

    const perPage = 10
    const [searchParams, setSearchParams] = useSearchParams()
    const pageParam = parseInt(searchParams.get('page')) || 1
    const [currentPage, setCurrentPage] = useState(pageParam)

    // Confirm popup state
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    // Fetch khi page thay đổi
    useEffect(() => {
        setSearchParams({ page: currentPage })
        dispatch(fetchBrands({ page: currentPage, perPage }))
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [currentPage, dispatch])

    // Xử lý lỗi/thành công
    useEffect(() => {
        if (error) toast.error(error.message || 'Lỗi xảy ra.')
        if (success) dispatch(fetchBrands({ page: currentPage, perPage }))

        return () => dispatch(resetState())
    }, [error, success, dispatch, currentPage])

    const openDeleteModal = (id) => {
        setSelectedId(id)
        setConfirmOpen(true)
    }

    const confirmDelete = () => {
        if (selectedId) {
            dispatch(deleteBrand(selectedId)).then(() => {
                toast.success('Xoá thương hiệu thành công!')
            })
        }
        setConfirmOpen(false)
    }


    return (
        <div className="p-6 font-sans">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">🏷️ Danh sách Thương hiệu</h2>
                <button
                    onClick={() => navigate('/admin/add-brand')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <FaPlus /> Thêm mới
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
                {loading && brands.length === 0 ? (
                    <div className="min-h-[200px] flex items-center justify-center">
                        <ClipLoader color="#3b82f6" size={40} />
                    </div>
                ) : (
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
                                            className="w-20 h-20 object-contain border rounded"
                                            loading="lazy"
                                        />
                                    </td>
                                    <td className="p-3 font-medium">{brand.name}</td>
                                    <td className="p-3">{brand.slug}</td>
                                    <td className="p-3">{brand.country}</td>
                                    <td className="p-3 flex gap-3 mt-6 text-blue-600">
                                        <button
                                            onClick={() =>
                                                navigate(`/admin/brands/${brand.id}?page=${currentPage}`, {
                                                    state: { brand }
                                                })
                                            }
                                            title="Chi tiết"
                                            className="hover:text-blue-700"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() =>
                                                navigate(`/admin/brands/edit/${brand.id}?page=${currentPage}`, {
                                                    state: { brand }
                                                })
                                            }
                                            title="Chỉnh sửa"
                                            className="text-yellow-500 hover:text-yellow-600"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(brand.id)}
                                            title="Xoá"
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Phân trang */}
            {pagination?.last_page > 1 && (
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
            )}

            {/* Modal xác nhận xoá */}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Xác nhận xoá"
                message="Bạn có chắc chắn muốn xoá thương hiệu này?"
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}

            />
        </div>
    )
}

export default BrandList
