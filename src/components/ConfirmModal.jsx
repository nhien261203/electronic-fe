import React from 'react'
import ReactDOM from 'react-dom'

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-3 text-gray-800">{title || 'Xác nhận'}</h2>
                <p className="mb-4 text-gray-700">{message || 'Bạn có chắc chắn không?'}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                        Hủy
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmModal
