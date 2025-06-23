// src/routes/adminRoutes.jsx
import { lazy, Suspense } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import PageLoader from '../components/loaders/PageLoader'

// Lazy load các trang
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))
const ProductList = lazy(() => import('../pages/admin/ProductList'))
const UserList = lazy(() => import('../pages/admin/UserList'))
const AddBrand = lazy(() => import('../pages/admin/Brands/AddBrand'))
const BrandList = lazy(() => import('../pages/admin/Brands/BrandList'))
const BrandDetail = lazy(() => import('../pages/admin/Brands/BrandDetail'))
const EditBrand = lazy(() => import('../pages/admin/Brands/EditBrand'))

const adminRoutes = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <Suspense fallback={<PageLoader />}><Dashboard /></Suspense> },
    { path: 'products', element: <Suspense fallback={<PageLoader />}><ProductList /></Suspense> },
    { path: 'users', element: <Suspense fallback={<PageLoader />}><UserList /></Suspense> },
    { path: 'add-brand', element: <Suspense fallback={<PageLoader />}><AddBrand /></Suspense> },
    { path: 'brands', element: <Suspense fallback={<PageLoader />}><BrandList /></Suspense> },
    { path: 'brands/:id', element: <Suspense fallback={<PageLoader />}><BrandDetail /></Suspense> },
    { path: 'brands/edit/:id', element: <Suspense fallback={<PageLoader />}><EditBrand /></Suspense> }
  ]
}

export default adminRoutes
