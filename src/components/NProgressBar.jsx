import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const NProgressBar = () => {
    const location = useLocation()

    useEffect(() => {
        NProgress.start()

        // Tạo một timeout nhỏ để tránh nhấp nháy nếu route quá nhanh
        const timeout = setTimeout(() => {
            NProgress.done()
        }, 300)

        return () => {
            clearTimeout(timeout)
        }
    }, [location.pathname])

    return null
}

export default NProgressBar
