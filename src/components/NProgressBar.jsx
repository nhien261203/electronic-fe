import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, trickleSpeed: 70 })

const NProgressBar = () => {
    const { loading } = useSelector((state) => state.brand)
    const location = useLocation()
    const mounted = useRef(false)

    useEffect(() => {
        // Reset mounted flag mỗi khi route thay đổi
        mounted.current = false
    }, [location.pathname])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            return // ❌ Bỏ qua lần đầu mỗi khi vào route mới
        }

        if (loading) {
            NProgress.start()
        } else {
            NProgress.done()
        }
    }, [loading])

    return null
}

export default NProgressBar
