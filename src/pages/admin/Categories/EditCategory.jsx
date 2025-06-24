import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FaArrowLeft } from 'react-icons/fa'

const EditCategory = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const categoryFromState = location.state?.category
    const page = new URLSearchParams(location.search).get('page') || 1

    const [form, setForm] = useState({ name: '', parent_id: '' })
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(!categoryFromState) // ⏳ Chỉ loading nếu chưa có sẵn

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                // Nếu chưa có category trong state thì gọi API
                if (!categoryFromState) {
                    const res = await axios.get(`http://localhost:8000/api/categories/${id}`)
                    const data = res.data?.data
                    setForm({
                        name: data.name,
                        parent_id: data.parent_id || '',
                    })
                } else {
                    // Có sẵn trong state thì set luôn
                    setForm({
                        name: categoryFromState.name,
                        parent_id: categoryFromState.parent_id || '',
                    })
                }

                // Lấy danh sách categories (dù có hay không)
                const resList = await axios.get(`http://localhost:8000/api/categories?per_page=100`)
                setCategories(resList.data?.data || [])
            } catch (err) {
                toast.error('❌ Không tìm thấy danh mục hoặc lỗi khi tải!')
            } finally {
                setLoading(false)
            }
        }

        fetchCategory()
    }, [id, categoryFromState])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.put(`http://localhost:8000/api/categories/${id}`, {
                name: form.name,
                parent_id: form.parent_id || null,
            })

            toast.success('✅ Cập nhật danh mục thành công!')
            navigate(`/admin/categories?page=${page}`)
        } catch (err) {
            toast.error('❌ Lỗi khi cập nhật danh mục!')
        }
    }

    // if (loading) {
    //     return <div className="p-6 text-blue-600">⏳ Đang tải dữ liệu...</div>
    // }

    return (
        <div className="p-6 max-w-xl mx-auto font-sans">
            <div className="bg-white shadow p-6 rounded">
                <h2 className="text-xl font-bold mb-4">✏️ Cập nhật Danh mục</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Tên danh mục</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Danh mục cha</label>
                        <select
                            value={form.parent_id}
                            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="">-- Không chọn (Gốc) --</option>
                            {categories
                                .filter((c) => c.id !== parseInt(id))
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Cập nhật
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/admin/categories?page=${page}`)}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCategory
