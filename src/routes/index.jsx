import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import UserLayout from '../layouts/UserLayout'

// Pages
// import HomePage from '../pages/user/HomePage'
// import ProductDetailPage from '../pages/user/ProductDetailPage'
// import Dashboard from '../pages/admin/Dashboard'
// import UserListPage from '../pages/admin/UserListPage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <UserLayout />,
        children: [
            // { index: true, element: <HomePage /> },
            // { path: 'product/:id', element: <ProductDetailPage /> }
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            // { index: true, element: <Dashboard /> },
            // { path: 'users', element: <UserListPage /> }
        ]
    }
])

export default router
