import { useEffect } from 'react'
import { useNavigation } from 'react-router-dom'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false }) // tùy chỉnh nếu muốn

const NProgressBar = () => {
    const navigation = useNavigation()

    useEffect(() => {
        if (navigation.state === 'loading') {
            NProgress.start()
        } else {
            NProgress.done()
        }
    }, [navigation.state])

    return null
}

export default NProgressBar
