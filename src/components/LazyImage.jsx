// src/components/LazyImage.jsx
import React, { useRef, useState, useEffect } from 'react'

const LazyImage = ({ src, alt, className }) => {
    const imgRef = useRef()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        if (imgRef.current) {
            observer.observe(imgRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <img
            ref={imgRef}
            src={visible ? src : undefined}
            alt={alt}
            className={className}
            loading="lazy"
        />
    )
}

export default LazyImage
