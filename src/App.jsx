import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error('Lỗi:', err));
  }, []);

  return (
    <div className="text-center mt-10 text-2xl text-blue-600">
      {message || 'Đang tải...'}
    </div>
  );
}

export default App;
