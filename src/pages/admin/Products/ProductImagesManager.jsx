import React, { useEffect, useState } from 'react'
import { FaTrash, FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import {
    fetchImagesByProduct,
    uploadImages,
    deleteImage,
    setThumbnail
} from '../../../features/product/productImageAPI'
import ConfirmModal from '../../../components/ConfirmModal'

const ProductImagesManager = ({ productId }) => {
    const [images, setImages] = useState([])
    const [uploading, setUploading] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [imageToDelete, setImageToDelete] = useState(null)

    useEffect(() => {
        fetchImagesByProduct(productId)
            .then(data => setImages(data))
            .catch(() => toast.error('Lỗi tải ảnh sản phẩm'))
    }, [productId])

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files)
        const valid = files.filter(file => file.size <= 3 * 1024 * 1024)
        if (valid.length === 0) return

        setUploading(true)
        try {
            await uploadImages(productId, valid)
            const res = await fetchImagesByProduct(productId)
            setImages(res)
            toast.success('Tải ảnh lên thành công')
        } catch {
            toast.error('Lỗi khi tải ảnh lên')
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteConfirm = (id) => {
        setImageToDelete(id)
        setConfirmOpen(true)
    }

    const confirmDelete = async () => {
        if (!imageToDelete) return
        try {
            await deleteImage(imageToDelete)
            setImages((imgs) => imgs.filter((img) => img.id !== imageToDelete))
            toast.success('Đã xoá ảnh')
        } catch {
            toast.error('Không thể xoá ảnh')
        } finally {
            setImageToDelete(null)
            setConfirmOpen(false)
        }
    }

    const handleSetThumbnail = async (id) => {
        try {
            await setThumbnail(id)
            setImages((imgs) =>
                imgs.map((img) => ({
                    ...img,
                    is_thumbnail: img.id === id ? 1 : 0
                }))
            )
            toast.success('Đã đặt làm ảnh đại diện')
        } catch {
            toast.error('Không thể đặt ảnh đại diện')
        }
    }

    return (
        <div className="mt-6">
            <h3 className="font-semibold mb-2">📷 Quản lý ảnh sản phẩm</h3>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
            />
            <div className="flex flex-wrap gap-3 mt-4">
                {images.map((img) => (
                    <div key={img.id} className="relative w-28 h-28">
                        <img
                            src={`http://localhost:8000${img.image_url}`}
                            alt="product"
                            className="w-full h-full object-cover border rounded"
                        />
                        {Boolean(img.is_thumbnail) && (
                            <div className="absolute top-1 left-1 bg-yellow-400 text-white px-1 rounded text-xs font-bold">
                                Đại diện
                            </div>
                        )}
                        <div className="absolute top-1 right-1 flex gap-1">
                            {!img.is_thumbnail && (
                                <button
                                    type="button"
                                    onClick={() => handleSetThumbnail(img.id)}
                                    title="Đặt làm đại diện"
                                    className="text-yellow-500 hover:text-yellow-700"
                                >
                                    <FaStar />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => handleDeleteConfirm(img.id)}
                                title="Xoá ảnh"
                                className="text-red-500 hover:text-red-700"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                title="Xoá ảnh"
                message="Bạn có chắc muốn xoá ảnh này không?"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setConfirmOpen(false)
                    setImageToDelete(null)
                }}
            />
        </div>
    )
}

export default ProductImagesManager
