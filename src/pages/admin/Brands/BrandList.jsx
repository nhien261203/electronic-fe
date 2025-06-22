import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands, deleteBrand, resetState } from '../../../features/brand/brandSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'
import ClipLoader from 'react-spinners/ClipLoader'
import ConfirmModal from '../../../components/ConfirmModal'
import debounce from 'lodash.debounce'
import { fetchCountriesAPI } from '../../../features/brand/brandAPI'

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
    const [filteredTotal, setFilteredTotal] = useState(null)
    const [countries, setCountries] = useState([])

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    const firstLoadRef = useRef(true)

    const handleSearch = (e) => setSearch(e.target.value)
    const handleFilter = (e) => setCountry(e.target.value)
    const resetFilters = () => {
        setSearch('')
        setCountry('')
        setCurrentPage(1)
    }

    useEffect(() => {
        fetchCountriesAPI()
            .then(setCountries)
            .catch(() => toast.error('Không thể lấy danh sách quốc gia'))
    }, [])

    // Reset page về 1 khi lọc hoặc tìm kiếm thay đổi
    useEffect(() => {
        setCurrentPage(1)
    }, [search, country])

    // Debounced fetch khi có tìm kiếm/lọc
    const debouncedFetch = useCallback(
        debounce((page, searchText, selectedCountry) => {
            dispatch(fetchBrands({
                page,
                perPage,
                search: searchText || '',
                country: selectedCountry || ''
            }))
                .unwrap()
                .then(res => setFilteredTotal(res.total))
        }, 500),
        []
    )

    useEffect(() => {
        setSearchParams({ page: currentPage })

        if (firstLoadRef.current) {
            dispatch(fetchBrands({
                page: currentPage,
                perPage,
                search: search || '',
                country: country || ''
            }))
                .unwrap()
                .then(res => setFilteredTotal(res.total))
            firstLoadRef.current = false
        } else {
            debouncedFetch(currentPage, search, country)
        }

        return () => debouncedFetch.cancel()
    }, [currentPage, search, country])

    useEffect(() => {
        if (error) toast.error(error.message || 'Lỗi xảy ra!')
        if (success) {
            dispatch(fetchBrands({
                page: currentPage,
                perPage,
                search: search || '',
                country: country || ''
            }))
        }
        return () => dispatch(resetState())
    }, [error, success, dispatch, currentPage])

    const openDeleteModal = (id) => {
        setSelectedId(id)
        setConfirmOpen(true)
    }

    const confirmDelete = () => {
        dispatch(deleteBrand(selectedId)).then(() => {
            toast.success('Đã xoá thương hiệu!')
        })
        setConfirmOpen(false)
    }

    return (
        <div className="p-4 md:p-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🏷️ Danh sách Thương hiệu</h1>
                <button
                    onClick={() => navigate('/admin/add-brand')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <FaPlus /> Thêm mới
                </button>
            </div>

            {/* Bộ lọc */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
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
                        <option key={idx} value={c}>{c}</option>
                    ))}
                </select>
                <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    🔄 Reset
                </button>
            </div>

            {/* Tổng số bản ghi */}
            <div className="text-sm text-gray-600 mb-2">
                Tổng cộng: <strong>{pagination.total}</strong> thương hiệu
                {filteredTotal !== null && filteredTotal !== pagination.total && (
                    <> | Kết quả: <strong>{filteredTotal}</strong></>
                )}
            </div>

            {/* Bảng danh sách */}
            <div className="overflow-x-auto bg-white rounded shadow">
                {loading && brands.length === 0 ? (
                    <div className="min-h-[200px] flex items-center justify-center">
                        <ClipLoader color="#3b82f6" size={40} />
                    </div>
                ) : (
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
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
                                            className="w-16 h-16 object-contain border rounded"
                                        />
                                    </td>
                                    <td className="p-3 font-semibold">{brand.name}</td>
                                    <td className="p-3">{brand.slug}</td>
                                    <td className="p-3">{brand.country}</td>
                                    <td className="p-3 flex gap-3 text-blue-600">
                                        <button
                                            onClick={() => navigate(`/admin/brands/${brand.id}?page=${currentPage}`, { state: { brand } })}
                                            title="Chi tiết"
                                            className="hover:text-blue-700"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/brands/edit/${brand.id}?page=${currentPage}`, { state: { brand } })}
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

            {/* Modal xoá */}
            <ConfirmModal
                isOpen={confirmOpen}
                title="Xác nhận xoá"
                message="Bạn có chắc muốn xoá thương hiệu này?"
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    )
}

export default BrandList
