import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import debounce from 'lodash.debounce'
import { toast } from 'react-toastify'

import ConfirmModal from '../../../components/ConfirmModal'
import TableSkeleton from '../../../components/sketelons/TableSkeleton'
import {
    fetchCategories,
    deleteCategory,
    resetState,
} from '../../../features/category/categorySlice'

const CategoryList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { categories, loading, error, success, pagination } = useSelector(
        (state) => state.category
    )

    const perPage = 8
    const [searchParams, setSearchParams] = useSearchParams()
    const queryPage = parseInt(searchParams.get('page')) || 1
    const [currentPage, setCurrentPage] = useState(queryPage)

    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('')
    const [filteredTotal, setFilteredTotal] = useState(null)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    // Giữ local danh sách category để update UI nhanh khi xoá
    const [localCategories, setLocalCategories] = useState([])

    const firstLoad = useRef(true)
    const prevSearch = useRef('')
    const prevStatus = useRef('')

    // Sync redux categories -> localCategories mỗi khi thay đổi từ redux (fetch mới)
    useEffect(() => {
        setLocalCategories(categories)
    }, [categories])

    const handleSearch = (e) => setSearch(e.target.value)
    const handleStatusChange = (e) => setStatus(e.target.value)
    const resetFilters = () => {
        setSearch('')
        setStatus('')
        setCurrentPage(1)
    }

    const openDeleteModal = (id) => {
        setSelectedId(id)
        setConfirmOpen(true)
    }

    const confirmDelete = async () => {
        if (isProcessing) return
        setIsProcessing(true)

        // Lưu tạm danh sách cũ để phục hồi nếu lỗi
        const prevList = [...localCategories]

        // Xoá nhanh khỏi UI
        setLocalCategories((list) => list.filter((cat) => cat.id !== selectedId))
        setFilteredTotal((total) => (total !== null ? total - 1 : null))
        setConfirmOpen(false)

        try {
            await dispatch(deleteCategory(selectedId)).unwrap()
            toast.success('Đã xoá danh mục!')
            // Không fetch lại toàn bộ danh sách, đã update local rồi
        } catch (err) {
            toast.error('Xoá danh mục thất bại!')
            setLocalCategories(prevList) // Phục hồi
        } finally {
            setIsProcessing(false)
        }
    }

    const debouncedFetch = useCallback(
        debounce((page, keyword, filterStatus) => {
            dispatch(fetchCategories({ page, perPage, search: keyword, status: filterStatus }))
                .unwrap()
                .then((res) => setFilteredTotal(res.total))
                .catch(() => setFilteredTotal(null))
        }, 300),
        [dispatch]
    )

    useEffect(() => {
        if (firstLoad.current) return

        if (prevSearch.current !== search || prevStatus.current !== status) {
            setCurrentPage(1)
        }

        prevSearch.current = search
        prevStatus.current = status
    }, [search, status])

    useEffect(() => {
        const statePage = location.state?.page
        const effectivePage = statePage || currentPage

        setSearchParams({ page: effectivePage })

        if (firstLoad.current) {
            dispatch(fetchCategories({ page: effectivePage, perPage, search, status }))
                .unwrap()
                .then((res) => setFilteredTotal(res.total))
            firstLoad.current = false
        } else {
            debouncedFetch(effectivePage, search, status)
        }

        return () => debouncedFetch.cancel()
    }, [currentPage, search, status, location.state, debouncedFetch, dispatch, setSearchParams, perPage])

    useEffect(() => {
        if (error) toast.error(error.message || '❌ Lỗi xảy ra!')
        if (success) {
            dispatch(fetchCategories({ page: currentPage, perPage, search, status }))
        }
        return () => dispatch(resetState())
    }, [error, success, dispatch, currentPage, perPage, search, status])

    return (
        <div className="p-4 md:p-6 font-sans">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📂 Danh sách Danh mục</h1>
                <button
                    onClick={() => navigate('/admin/categories/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <FaPlus /> Thêm mới
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="🔍 Tìm theo tên..."
                    value={search}
                    onChange={handleSearch}
                    className="px-3 py-2 border rounded w-full md:w-1/3"
                />
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="px-3 py-2 border rounded w-full md:w-1/5"
                >
                    <option value="">-- Trạng thái --</option>
                    <option value="1">Hoạt động</option>
                    <option value="0">Tạm ẩn</option>
                </select>
                <button onClick={resetFilters} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    🔄 Reset
                </button>
                
            </div>

            <div className="text-sm text-gray-600 mb-2">
                Tổng cộng: <strong>{pagination.total}</strong> danh mục
                {filteredTotal !== null && filteredTotal !== pagination.total && (
                    <> | Kết quả: <strong>{filteredTotal}</strong></>
                )}
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Tên</th>
                            <th className="p-3 text-left">Slug</th>
                            <th className="p-3 text-left">Danh mục cha</th>
                            <th className="p-3 text-left">Trạng thái</th>
                            <th className="p-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && localCategories.length === 0 ? (
                            <TableSkeleton columns={5} rows={6} />
                        ) : localCategories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">
                                    Không có danh mục nào
                                </td>
                            </tr>
                        ) : (
                            localCategories.map((category) => (
                                <tr key={category.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{category.name}</td>
                                    <td className="p-3">{category.slug}</td>
                                    <td className="p-3">{category.parent?.name || 'Gốc'}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${category.status === 1
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {category.status === 1 ? 'Hoạt động' : 'Tạm ẩn'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3 text-blue-600">
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/categories/${category.id}?page=${currentPage}`, {
                                                        state: { category, page: currentPage },
                                                    })
                                                }
                                                title="Chi tiết"
                                                className="hover:text-blue-700"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/categories/edit/${category.id}?page=${currentPage}`, {
                                                        state: { category, page: currentPage },
                                                    })
                                                }
                                                title="Chỉnh sửa"
                                                className="text-yellow-500 hover:text-yellow-600"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(category.id)}
                                                title="Xoá"
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination?.last_page > 1 && (
                <div className="flex justify-center mt-6 space-x-1 flex-wrap">
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

            <ConfirmModal
                isOpen={confirmOpen}
                title="Xác nhận xoá"
                message="Bạn có chắc muốn xoá danh mục này?"
                onConfirm={confirmDelete}
                onCancel={() => !isProcessing && setConfirmOpen(false)}
                disabled={isProcessing}
            />
        </div>
    )
}

export default CategoryList
