import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const EditCategory = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const categoryFromState = location.state?.category
    const page = new URLSearchParams(location.search).get('page') || 1

    const [form, setForm] = useState({
        name: '',
        parent_id: '',
        status: '1'
    })

    const [categories, setCategories] = useState([])
    const [loadingForm, setLoadingForm] = useState(!categoryFromState)
    const [loadingCategories, setLoadingCategories] = useState(true)

    // Load danh mục cha song song (không chặn form)
    useEffect(() => {
        axios.get('http://localhost:8000/api/categories?per_page=100')
            .then(res => setCategories(res.data.data || []))
            .catch(() => toast.error('❌ Lỗi tải danh mục cha'))
            .finally(() => setLoadingCategories(false))
    }, [])

    // Load dữ liệu danh mục nếu không có sẵn
    useEffect(() => {
        if (categoryFromState) {
            setForm({
                name: categoryFromState.name,
                parent_id: categoryFromState.parent_id || '',
                status: String(categoryFromState.status)
            })
            setLoadingForm(false)
        } else {
            axios.get(`http://localhost:8000/api/categories/${id}`)
                .then(res => {
                    const c = res.data.data
                    setForm({
                        name: c.name,
                        parent_id: c.parent_id || '',
                        status: String(c.status)
                    })
                })
                .catch(() => toast.error('❌ Không tìm thấy danh mục'))
                .finally(() => setLoadingForm(false))
        }
    }, [id, categoryFromState])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                name: form.name,
                parent_id: form.parent_id || null,
                status: Number(form.status)
            }

            // Gọi API và lấy lại dữ liệu cập nhật (tùy backend)
            const res = await axios.put(`http://localhost:8000/api/categories/${id}`, payload)

            toast.success('✅ Cập nhật danh mục thành công!')

            // Chuyển về danh sách ngay, không cần đợi re-fetch
            navigate(`/admin/categories?page=${page}`, {
                replace: true,
                state: {
                    updated: true, // Tuỳ bạn bắt tại CategoryList để toast
                    updatedId: id
                }
            })
        } catch {
            toast.error('❌ Lỗi khi cập nhật danh mục!')
        }
    }


    if (loadingForm) return null // hoặc spinner nhỏ

    return (
        <div className="p-6 max-w-xl mx-auto font-sans">
            <div className="bg-white shadow p-6 rounded">
                <h2 className="text-xl font-bold mb-4">✏️ Cập nhật Danh mục</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Tên danh mục</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Danh mục cha</label>
                        <select
                            value={form.parent_id}
                            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
                            disabled={loadingCategories}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="">-- Không chọn (Gốc) --</option>
                            {categories
                                .filter(c => c.id !== parseInt(id))
                                .map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Trạng thái</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="1">Hoạt động</option>
                            <option value="0">Tạm ẩn</option>
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
