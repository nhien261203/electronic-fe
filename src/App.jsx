// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'

// Admin pages
import Dashboard from './pages/admin/Dashboard'
import UserList from './pages/admin/UserList'
import ProductList from './pages/admin/ProductList'

import { useRoutes } from 'react-router-dom'
import routes from './routes'

const App = () => {
  return (
    // <Routes>
    //   <Route path="/admin" element={<AdminLayout />}>
    //     <Route index element={<Dashboard />} />
    //     <Route path="users" element={<UserList />} />
    //     <Route path="products" element={<ProductList />} />
    //   </Route>
    // </Routes>

    useRoutes(routes)
  )
}

export default App
