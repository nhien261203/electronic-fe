import AdminLayout from '../layouts/AdminLayout'
import AddBrand from '../pages/admin/Brands/AddBrand'
import BrandList from '../pages/admin/Brands/BrandList'
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
        { path: 'add-brand', element: <AddBrand /> },
        { path: 'brands', element: <BrandList /> },
    ]
}

export default adminRoutes
