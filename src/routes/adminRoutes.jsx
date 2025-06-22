import AdminLayout from '../layouts/AdminLayout'
import AddBrand from '../pages/admin/Brands/AddBrand'
import BrandDetail from '../pages/admin/Brands/BrandDetail'
import BrandList from '../pages/admin/Brands/BrandList'
import EditBrand from '../pages/admin/Brands/EditBrand'
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
        { path: 'brands/:id', element: <BrandDetail /> },
        { path: 'brands/edit/:id', element: <EditBrand /> }


    ]
}

export default adminRoutes
