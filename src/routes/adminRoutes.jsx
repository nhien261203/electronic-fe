// src/routes/adminRoutes.jsx
import { lazy, Suspense } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import PageLoader from '../components/loaders/PageLoader'

// Lazy load các trang
const Dashboard = lazy(() => import('../pages/admin/Dashboard'))

const UserList = lazy(() => import('../pages/admin/UserList'))
const AddBrand = lazy(() => import('../pages/admin/Brands/AddBrand'))
const BrandList = lazy(() => import('../pages/admin/Brands/BrandList'))
const BrandDetail = lazy(() => import('../pages/admin/Brands/BrandDetail'))
const EditBrand = lazy(() => import('../pages/admin/Brands/EditBrand'))


const CategoryList = lazy(() => import('../pages/admin/Categories/CategoryList'))
const AddCategory = lazy(() => import('../pages/admin/Categories/AddCategory'))
const EditCategory = lazy(() => import('../pages/admin/Categories/EditCategory')) //  bổ sung
const CategoryDetail = lazy(() => import('../pages/admin/Categories/CategoryDetail')) //  bổ sung

const ProductList = lazy(() => import('../pages/admin/Products/ProductList'))
const AddProduct = lazy(() => import('../pages/admin/Products/AddProduct')) 
const EditProduct = lazy(() => import('../pages/admin/Products/EditProduct')) 
const ProductDetail = lazy(() => import('../pages/admin/Products/ProductDetail')) 


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
    { path: 'brands/edit/:id', element: <Suspense fallback={<PageLoader />}><EditBrand /></Suspense> },


    { path: 'categories', element: (<Suspense fallback={<PageLoader />}><CategoryList /></Suspense>) },
    { path: 'categories/add', element: <Suspense fallback={<PageLoader />}><AddCategory /></Suspense> },

    {
      path: 'categories/edit/:id',
      element: (
        <Suspense fallback={<PageLoader />}>
          <EditCategory />
        </Suspense>
      )
    },
    {
      path: 'categories/:id',
      element: (
        <Suspense fallback={<PageLoader />}>
          <CategoryDetail />
        </Suspense>
      )
    },


    {
      path: 'products',
      element: <Suspense fallback={<PageLoader />}><ProductList /></Suspense>
    },
    {
      path: 'products/add',
      element: <Suspense fallback={<PageLoader />}><AddProduct /></Suspense>
    },
    {
      path: 'products/edit/:id',
      element: <Suspense fallback={<PageLoader />}><EditProduct /></Suspense> // nếu có
    },
    {
      path: 'products/:id',
      element: <Suspense fallback={<PageLoader />}><ProductDetail /></Suspense> // nếu có
    },

  ]
}

export default adminRoutes
