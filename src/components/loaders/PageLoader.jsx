// src/components/loaders/PageLoader.jsx
import React from 'react'

const PageLoader = () => {
    return (
        <div className="min-h-[300px] flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
}

export default PageLoader
