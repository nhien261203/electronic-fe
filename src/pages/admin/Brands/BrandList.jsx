// 👉 phần import không đổi
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import debounce from 'lodash.debounce'
import { toast } from 'react-toastify'

import ConfirmModal from '../../../components/ConfirmModal'
import TableSkeleton from '../../../components/sketelons/TableSkeleton'
import { fetchCountriesAPI } from '../../../features/brand/brandAPI'
import { fetchBrands, deleteBrand, resetState } from '../../../features/brand/brandSlice'

const BrandList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { brands, loading, error, success, pagination } = useSelector((state) => state.brand)

    const perPage = 8
    const [searchParams, setSearchParams] = useSearchParams()
    const pageParam = parseInt(searchParams.get('page')) || 1
    const [currentPage, setCurrentPage] = useState(pageParam)
    const [search, setSearch] = useState('')
    const [country, setCountry] = useState('')
    const [status, setStatus] = useState('')
    const [filteredTotal, setFilteredTotal] = useState(null)
    const [countries, setCountries] = useState([])

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const firstLoadRef = useRef(true)

    const prevSearchRef = useRef(search)
    const prevCountryRef = useRef(country)
    const prevStatusRef = useRef(status)

    // ** Local state quản lý brands hiển thị để update UI nhanh khi xoá **
    const [localBrands, setLocalBrands] = useState([])

    // Sync redux brands -> localBrands khi redux thay đổi (fetch mới)
    useEffect(() => {
        setLocalBrands(brands)
    }, [brands])

    const handleSearch = (e) => setSearch(e.target.value)
    const handleFilter = (e) => setCountry(e.target.value)
    const handleStatusChange = (e) => setStatus(e.target.value)

    const resetFilters = () => {
        setSearch('')
        setCountry('')
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

        // Lưu lại danh sách cũ để phục hồi nếu lỗi
        const prevList = [...localBrands]

        // Xoá ngay khỏi UI
        setLocalBrands((list) => list.filter((brand) => brand.id !== selectedId))
        setFilteredTotal((total) => (total !== null ? total - 1 : null))
        setConfirmOpen(false)

        try {
            await dispatch(deleteBrand(selectedId)).unwrap()
            toast.success('Đã xoá thương hiệu!')
            // Không fetch lại vì đã xoá trên UI rồi
        } catch (err) {
            toast.error('Lỗi xoá thương hiệu!')
            // Phục hồi danh sách nếu lỗi
            setLocalBrands(prevList)
        } finally {
            setIsProcessing(false)
        }
    }

    const debouncedFetch = useCallback(
        debounce((page, searchText, selectedCountry, selectedStatus) => {
            dispatch(
                fetchBrands({
                    page,
                    perPage,
                    search: searchText,
                    country: selectedCountry,
                    status: selectedStatus,
                })
            )
                .unwrap()
                .then((res) => setFilteredTotal(res.total))
                .catch(() => setFilteredTotal(null))
        }, 300),
        [dispatch]
    )

    useEffect(() => {
        fetchCountriesAPI()
            .then(setCountries)
            .catch(() => toast.error('Không thể lấy danh sách quốc gia'))
    }, [])

    useEffect(() => {
        const searchChanged = prevSearchRef.current !== search
        const countryChanged = prevCountryRef.current !== country
        const statusChanged = prevStatusRef.current !== status

        if (!firstLoadRef.current && (searchChanged || countryChanged || statusChanged)) {
            setCurrentPage(1)
        }

        prevSearchRef.current = search
        prevCountryRef.current = country
        prevStatusRef.current = status
    }, [search, country, status])

    useEffect(() => {
        setSearchParams({ page: currentPage })

        if (firstLoadRef.current) {
            dispatch(fetchBrands({ page: currentPage, perPage, search, country, status }))
                .unwrap()
                .then((res) => setFilteredTotal(res.total))
            firstLoadRef.current = false
        } else {
            debouncedFetch(currentPage, search, country, status)
        }

        return () => debouncedFetch.cancel()
    }, [currentPage, search, country, status, debouncedFetch, dispatch, perPage, setSearchParams])

    useEffect(() => {
        if (error) toast.error(error.message || 'Lỗi xảy ra!')
        if (success) {
            dispatch(fetchBrands({ page: currentPage, perPage, search, country, status }))
        }
        return () => dispatch(resetState())
    }, [error, success, dispatch, currentPage, perPage, search, country, status])

    return (
        <div className="p-4 md:p-6 font-sans">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🏷️ Danh sách Thương hiệu</h1>
                <button
                    onClick={() => navigate('/admin/add-brand')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <FaPlus /> Thêm mới
                </button>
            </div>

            {/* Filter section */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="🔍 Tìm theo tên..."
                    value={search}
                    onChange={handleSearch}
                    className="px-3 py-2 border rounded w-full md:w-1/3"
                />
                <select
                    value={country}
                    onChange={handleFilter}
                    className="px-3 py-2 border rounded w-full md:w-1/4"
                >
                    <option value="">-- Lọc theo quốc gia --</option>
                    {countries.map((c, idx) => (
                        <option key={idx} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
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
                Tổng cộng: <strong>{pagination.total}</strong> thương hiệu
                {filteredTotal !== null && filteredTotal !== pagination.total && (
                    <> | Kết quả: <strong>{filteredTotal}</strong></>
                )}
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="p-3 text-left">Logo</th>
                            <th className="p-3 text-left">Tên</th>
                            <th className="p-3 text-left">Slug</th>
                            <th className="p-3 text-left">Quốc gia</th>
                            <th className="p-3 text-left">Trạng thái</th>
                            <th className="p-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && localBrands.length === 0 ? (
                            <TableSkeleton columns={5} rows={6} />
                        ) : localBrands.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500">
                                    Không có thương hiệu nào
                                </td>
                            </tr>
                        ) : (
                            localBrands.map((brand) => (
                                <tr key={brand.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 min-w-[90px] w-[90px] md:min-w-[120px] md:w-[120px]">
                                        <img
                                            src={`http://localhost:8000${brand.logo}`}
                                            alt={brand.name}
                                            className="w-16 h-16 object-contain border rounded"
                                            loading="lazy"
                                        />
                                    </td>
                                    <td className="p-3 font-semibold">{brand.name}</td>
                                    <td className="p-3">{brand.slug}</td>
                                    <td className="p-3">{brand.country}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-semibold ${brand.status === 1
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {brand.status === 1 ? 'Hoạt động' : 'Tạm ẩn'}
                                        </span>
                                    </td>

                                    <td className="p-3">
                                        <div className="flex gap-3 text-blue-600">
                                            <button
                                                onClick={() =>
                                                    navigate(`/admin/brands/${brand.id}?page=${currentPage}`, {
                                                        state: { brand, page: currentPage },
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
                                                        state: { brand },
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
                message="Bạn có chắc muốn xoá thương hiệu này?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    if (!isProcessing) setConfirmOpen(false)
                }}
                disabled={isProcessing}
            />
        </div>
    )
}


export default BrandList
