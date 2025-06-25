import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createCategory, resetState } from '../../../features/category/categorySlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddCategory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { success, error, loading } = useSelector((state) => state.category)

  const [form, setForm] = useState({
    name: '',
    parent_id: '',
    status: '1' // ✅ mặc định là hoạt động
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:8001/api/categories?per_page=100')
      .then((res) => setCategories(res.data.data))
      .catch(() => {
        toast.error('Lỗi tải danh mục cha')
        setCategories([])
      })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      name: form.name,
      parent_id: form.parent_id || null,
      status: Number(form.status) // ✅ gửi đúng kiểu số
    }
    dispatch(createCategory(formData))
  }

  useEffect(() => {
    if (success) {
      toast.success('✅ Thêm danh mục thành công!')
      dispatch(resetState())
      navigate('/admin/categories')
    }

    if (error) {
      const errObj = error.errors ?? error
      if (typeof errObj === 'object') {
        Object.values(errObj).flat().forEach((msg) => toast.error(msg))
      } else {
        toast.error(errObj)
      }
      dispatch(resetState())
    }
  }, [success, error, dispatch, navigate])

  return (
    <div className="max-w-xl mx-auto bg-white shadow p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-700">➕ Thêm danh mục</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
            placeholder="Nhập tên danh mục"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
          <select
            name="parent_id"
            value={form.parent_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">-- Không chọn (Gốc) --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Thêm phần chọn trạng thái */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="1">Hoạt động</option>
            <option value="0">Tạm ẩn</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Đang lưu...' : 'Lưu danh mục'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCategory
