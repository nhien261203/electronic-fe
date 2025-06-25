import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaEye, FaRedo } from 'react-icons/fa'
import debounce from 'lodash.debounce'
import { toast } from 'react-toastify'
import axios from 'axios'

import ConfirmModal from '../../../components/ConfirmModal'
import TableSkeleton from '../../../components/sketelons/TableSkeleton'
import { fetchProducts, deleteProduct, resetProductState } from '../../../features/product/productSlice'

const ProductList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { products, loading, error, success, pagination } = useSelector((state) => state.product)

    const perPage = 8
    const [searchParams, setSearchParams] = useSearchParams()
    const pageParam = parseInt(searchParams.get('page')) || 1
    const [currentPage, setCurrentPage] = useState(pageParam)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [brandFilter, setBrandFilter] = useState('')

    const [brands, setBrands] = useState([])

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [localProducts, setLocalProducts] = useState([])

    const firstLoadRef = useRef(true)
    const prevSearchRef = useRef(search)

    useEffect(() => {
        setLocalProducts(products)
    }, [products])

    useEffect(() => {
        axios.get('http://localhost:8000/api/brands?per_page=1000')
            .then(res => setBrands(res.data.data || []))
            .catch(() => toast.error('Lỗi tải thương hiệu'))
    }, [])

    const handleSearch = (e) => setSearch(e.target.value)
    const handleStatusChange = (e) => setStatusFilter(e.target.value)
    const handleBrandChange = (e) => setBrandFilter(e.target.value)

    const handleReset = () => {
        setSearch('')
        setStatusFilter('')
        setBrandFilter('')
        setCurrentPage(1)
    }

    const openDeleteModal = (id) => {
        setSelectedId(id)
        setConfirmOpen(true)
    }

    const confirmDelete = async () => {
        if (isProcessing) return
        setIsProcessing(true)
        const prevList = [...localProducts]
        setLocalProducts((list) => list.filter((p) => p.id !== selectedId))
        setConfirmOpen(false)

        try {
            await dispatch(deleteProduct(selectedId)).unwrap()
            toast.success('Đã xoá sản phẩm!')
        } catch (err) {
            toast.error('Lỗi xoá sản phẩm!')
            setLocalProducts(prevList)
        } finally {
            setIsProcessing(false)
        }
    }

    const debouncedFetch = useCallback(
        debounce((page, searchText, status, brand) => {
            dispatch(fetchProducts({ page, perPage, search: searchText, status, brand_id: brand }))
        }, 300),
        [dispatch]
    )

    useEffect(() => {
        if (prevSearchRef.current !== search) {
            setCurrentPage(1)
        }
        prevSearchRef.current = search
    }, [search])

    // Reset về trang 1 khi có thay đổi filter
    useEffect(() => {
        setCurrentPage(1)
        setSearchParams({ page: 1 })
    }, [search, brandFilter, statusFilter])

    // Gọi API khi thay đổi page hoặc filter
    useEffect(() => {
        setSearchParams({ page: currentPage })

        if (firstLoadRef.current) {
            dispatch(fetchProducts({ page: currentPage, perPage, search, status: statusFilter, brand_id: brandFilter }))
            firstLoadRef.current = false
        } else {
            debouncedFetch(currentPage, search, statusFilter, brandFilter)
        }

        return () => debouncedFetch.cancel()
    }, [currentPage, search, statusFilter, brandFilter, dispatch, perPage, setSearchParams])


    useEffect(() => {
        if (error) toast.error(error.message || 'Đã xảy ra lỗi!')
        if (success) dispatch(fetchProducts({ page: currentPage, perPage, search, status: statusFilter, brand_id: brandFilter }))
        return () => dispatch(resetProductState())
    }, [error, success, dispatch, currentPage, perPage, search, statusFilter, brandFilter])

    return (
        <div className="p-4 md:p-6 font-sans">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">📦 Danh sách Sản phẩm</h1>
                <button
                    onClick={() => navigate('/admin/products/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <FaPlus /> Thêm mới
                </button>
            </div>




            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 flex-wrap">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="🔍 Tìm theo tên sản phẩm..."
                    className="px-3 py-2 border rounded w-full md:w-1/3"
                />

                <select value={statusFilter} onChange={handleStatusChange} className="px-3 py-2 border rounded w-full md:w-1/4">
                    <option value="">-- Trạng thái --</option>
                    <option value="1">Hiển thị</option>
                    <option value="0">Ẩn</option>
                </select>

                <select value={brandFilter} onChange={handleBrandChange}
                    className="px-3 py-2 border rounded w-full md:w-1/5 max-h-20 overflow-y-auto"

                >
                    <option value="">-- Thương hiệu --</option>
                    {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                </select>

                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    🔄 Reset
                </button>

            </div>
            <div className="text-gray-600 mb-2">
                Tổng số sản phẩm: <strong>{pagination?.total || 0} sản phẩm</strong>
            </div>

            {/* {(search || statusFilter || brandFilter) && (
                <div className="text-gray-500 italic mb-2">
                    Kết quả tìm thấy: <strong>{pagination?.total || 0}</strong> sản phẩm
                </div>
            )} */}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Tên</th>
                            <th className="p-3 text-left">Giá bán</th>
                            <th className="p-3 text-left">Số lượng</th>
                            <th className="p-3 text-left">Đã bán</th>
                            <th className="p-3 text-left">Thương hiệu</th>
                            <th className="p-3 text-left">Trạng thái</th>
                            <th className="p-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && localProducts.length === 0 ? (
                            <TableSkeleton columns={6} rows={6} />
                        ) : localProducts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">
                                    Không có sản phẩm nào
                                </td>
                            </tr>
                        ) : (
                            localProducts.map((product) => (
                                <tr key={product.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-medium">{product.name}</td>
                                    <td className="p-3">{product.price.toLocaleString()}₫</td>
                                    <td className="p-3">{product.quantity}</td>
                                    <td className="p-3">{product.sold}</td>
                                    <td className="p-3">{product.brand?.name || 'N/A'}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${product.status === 1
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {product.status === 1 ? 'Hiển thị' : 'Ẩn'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-3 text-blue-600">
                                            <button
                                                onClick={() => navigate(`/admin/products/${product.id}`)}
                                                title="Chi tiết"
                                                className="hover:text-blue-700"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                title="Chỉnh sửa"
                                                className="text-yellow-500 hover:text-yellow-600"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(product.id)}
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

            {pagination.last_page > 1 && (
                <div className="flex justify-center mt-6 space-x-1 flex-wrap">
                    <button
                        onClick={() => setCurrentPage((p) => p - 1)}
                        disabled={pagination.current_page === 1}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >◀</button>
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
                    >▶</button>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title="Xác nhận xoá"
                message="Bạn có chắc muốn xoá sản phẩm này?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    if (!isProcessing) setConfirmOpen(false)
                }}
                disabled={isProcessing}
            />
        </div>
    )
}

export default ProductList
