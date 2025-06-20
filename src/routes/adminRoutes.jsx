import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'
import ProductList from '../pages/admin/ProductList'
import UserList from '../pages/admin/UserList'

const adminRoutes = {
    path: '/admin',
    element: <AdminLayout />,
    children: [
        { index: true, element: <Dashboard /> },
        { path: 'products', element: <ProductList /> },
        { path: 'users', element: <UserList /> },
    ]
}

export default adminRoutes
