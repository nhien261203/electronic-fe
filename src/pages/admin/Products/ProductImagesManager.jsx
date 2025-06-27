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
import { useSelector } from 'react-redux'

const ProductImagesManager = ({ productId }) => {
    const currentProduct = useSelector(state => state.product.currentProduct)
    const initialImages = currentProduct?.images || []

    const [images, setImages] = useState(initialImages)
    const [loadingImages, setLoadingImages] = useState(initialImages.length === 0)
    const [uploading, setUploading] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [imageToDelete, setImageToDelete] = useState(null)

    useEffect(() => {
        let didCancel = false

        const loadImages = async () => {
            if (initialImages.length > 0) {
                //console.log('⚡ Dùng ảnh từ Redux cache')
                setImages(initialImages)
                setLoadingImages(false)
                return
            }

            //console.log('📡 Fetch ảnh từ API')
            setLoadingImages(true)
            try {
                const data = await fetchImagesByProduct(productId)
                if (!didCancel) setImages(data)
            } catch {
                if (!didCancel) toast.error('Lỗi tải ảnh sản phẩm')
            } finally {
                if (!didCancel) setLoadingImages(false)
            }
        }

        loadImages()
        return () => {
            didCancel = true
        }
    }, [productId, initialImages])

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files)
        const valid = files.filter(file => file.size <= 3 * 1024 * 1024)
        if (valid.length === 0) return

        setUploading(true)
        try {
            const uploaded = await uploadImages(productId, valid)
            if (Array.isArray(uploaded)) {
                setImages((prev) => [...prev, ...uploaded])
            } else {
                const res = await fetchImagesByProduct(productId)
                setImages(res)
            }
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

            {loadingImages ? (
                <p className="text-gray-500 italic mt-3">Đang tải ảnh...</p>
            ) : images.length === 0 ? (
                <p className="text-gray-500 italic mt-3">Chưa có ảnh nào</p>
            ) : (
                <div className="flex flex-wrap gap-3 mt-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative w-28 h-28">
                            <img
                                src={`http://localhost:8000${img.image_url}`}
                                alt="product"
                                // loading="lazy"
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
            )}

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
