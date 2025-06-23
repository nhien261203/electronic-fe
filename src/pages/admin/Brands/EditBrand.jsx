import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { updateBrand } from '../../../features/brand/brandSlice'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'

const EditBrand = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const brandFromState = location.state?.brand
    const page = new URLSearchParams(location.search).get('page') || 1

    const [form, setForm] = useState({ name: '', country: '', logo: null })
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (brandFromState) {
            setForm(brandFromState)
            setPreview(`http://localhost:8000${brandFromState.logo}`)
        } else {
            axios.get(`http://localhost:8000/api/brands/${id}`)
                .then(res => {
                    setForm(res.data.data)
                    setPreview(`http://localhost:8000${res.data.data.logo}`)
                })
                .catch(() => toast.error('Không tìm thấy thương hiệu'))
        }
    }, [id, brandFromState])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('country', form.country || '')
        if (form.logo instanceof File) {
            formData.append('logo', form.logo)
        }

        try {
            setLoading(true)
            await dispatch(updateBrand({ id, formData })).unwrap()
            toast.success('Cập nhật thương hiệu thành công!')
            navigate(`/admin/brands?page=${page}`)
        } catch (err) {
            toast.error(err?.message || 'Lỗi khi cập nhật!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-xl mx-auto font-sans">
            {/* <button
                onClick={() => navigate(`/admin/brands?page=${page}`)}
                className="mb-4 text-blue-600 hover:underline flex items-center"
            >
                <FaArrowLeft className="mr-2" /> Quay lại danh sách
            </button> */}

            <div className="bg-white shadow rounded p-6">
                <h2 className="text-2xl font-bold mb-4">✏️ Cập nhật Thương hiệu</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">
                            Tên thương hiệu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Quốc gia</label>
                        <input
                            type="text"
                            value={form.country || ''}
                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0]
                                setForm({ ...form, logo: file })
                                setPreview(URL.createObjectURL(file))
                            }}
                            className="w-full border px-2 py-1"
                        />
                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="mt-3 w-32 h-32 object-contain border rounded shadow-sm"
                                loading="lazy"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditBrand
