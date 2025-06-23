import React from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './routes'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NProgressBar from './components/NProgressBar'

const App = () => {
  const element = useRoutes(routes)

  return (
    <>
      {/* <NProgressBar /> */}
      {/* Hiển thị thông báo toast */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Render nội dung từ routes */}
      {element}
    </>
  )
}

export default App
