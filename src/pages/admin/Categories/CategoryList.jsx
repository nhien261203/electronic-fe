import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
    const { categories, loading, error, success, pagination } = useSelector(
        (state) => state.category
    )

    const perPage = 8
    const [searchParams, setSearchParams] = useSearchParams()
    const pageParam = parseInt(searchParams.get('page')) || 1
    const [currentPage, setCurrentPage] = useState(pageParam)
    const [search, setSearch] = useState('')
    const [filteredTotal, setFilteredTotal] = useState(null)

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const firstLoadRef = useRef(true)
    const prevSearchRef = useRef(search)

    const handleSearch = (e) => setSearch(e.target.value)
    const resetFilters = () => {
        setSearch('')
        setCurrentPage(1)
    }

    const openDeleteModal = (id) => {
        setSelectedId(id)
        setConfirmOpen(true)
    }

    const confirmDelete = async () => {
        if (isProcessing) return
        setIsProcessing(true)
        try {
            await dispatch(deleteCategory(selectedId)).unwrap()
            toast.success('🗑️ Đã xoá danh mục!')

            const res = await dispatch(fetchCategories({ page: currentPage, perPage, search })).unwrap()
            setFilteredTotal(res.total)
        } catch (err) {
            toast.error('❌ Lỗi khi xoá danh mục!')
        } finally {
            setConfirmOpen(false)
            setIsProcessing(false)
        }
    }

    const debouncedFetch = useCallback(
        debounce((page, searchText) => {
            dispatch(fetchCategories({ page, perPage, search: searchText }))
                .unwrap()
                .then((res) => setFilteredTotal(res.total))
        }, 300),
        []
    )

    useEffect(() => {
        const searchChanged = prevSearchRef.current !== search
        if (!firstLoadRef.current && searchChanged) {
            setCurrentPage(1)
        }
        prevSearchRef.current = search
    }, [search])

    useEffect(() => {
        setSearchParams({ page: currentPage })

        if (firstLoadRef.current) {
            dispatch(fetchCategories({ page: currentPage, perPage, search }))
                .unwrap()
                .then((res) => setFilteredTotal(res.total))
            firstLoadRef.current = false
        } else {
            debouncedFetch(currentPage, search)
        }

        return () => debouncedFetch.cancel()
    }, [currentPage, search])

    useEffect(() => {
        if (error) toast.error(error.message || '❌ Lỗi xảy ra!')
        if (success) {
            dispatch(fetchCategories({ page: currentPage, perPage, search }))
        }
        return () => dispatch(resetState())
    }, [error, success, dispatch, currentPage])

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

            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <input
                    type="text"
                    placeholder="🔍 Tìm theo tên..."
                    value={search}
                    onChange={handleSearch}
                    className="px-3 py-2 border rounded w-full md:w-1/3"
                />
                <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
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
                            <th className="p-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && categories.length === 0 ? (
                            <TableSkeleton columns={4} rows={6} />
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{category.name}</td>
                                    <td className="p-3">{category.slug}</td>
                                    <td className="p-3">{category.parent?.name || 'Gốc'}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3 text-blue-600">
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/categories/${category.id}?page=${currentPage}`, {
                                                        state: { category, page: currentPage }
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
                                                        state: { category, page: currentPage }
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
