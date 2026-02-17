import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import 'antd/dist/reset.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<div style={{ padding: 48 }}>Loading...</div>}>
    <RouterProvider router={router} />
  </Suspense>
)