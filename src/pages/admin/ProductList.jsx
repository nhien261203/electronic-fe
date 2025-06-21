import React, { useEffect, useState } from 'react'
import axios from 'axios'

const ProductList = () => {
  const [message, setMessage] = useState('Đang tải...')

  useEffect(() => {
    axios.get('http://localhost:8000/api/hello')
      .then((res) => {
        setMessage(res.data.message)
      })
      .catch((err) => {
        setMessage('Lỗi gọi API')
        console.error(err)
      })
  }, [])
  return (
    <div> ProductList
      {message}
    </div>
    
  )
}

export default ProductList