import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false, trickleSpeed: 40 })

const NProgressBar = () => {
    const brandLoading = useSelector((state) => state.brand.loading)
    const categoryLoading = useSelector((state) => state.category.loading)
    const productLoading = useSelector((state) => state.product.loading)
    const loading = brandLoading || categoryLoading || productLoading

    const location = useLocation()
    const mounted = useRef(false)

    useEffect(() => {
        mounted.current = false
    }, [location.pathname])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            return
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
