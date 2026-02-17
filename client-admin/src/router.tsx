import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthGuard from './components/AuthGuard'

// 懒加载页面
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Home = lazy(() => import('./pages/Home'))
const MerchantHotels = lazy(() => import('./pages/merchant/Hotels'))
const MerchantCreate = lazy(() => import('./pages/merchant/Create'))
const MerchantEdit = lazy(() => import('./pages/merchant/Edit'))
const AdminAudit = lazy(() => import('./pages/admin/Audit'))
const AdminHotels = lazy(() => import('./pages/admin/Hotels'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          // 商户路由
          { path: 'merchant/hotels', element: <MerchantHotels /> },
          { path: 'merchant/create', element: <MerchantCreate /> },
          { path: 'merchant/edit/:id', element: <MerchantEdit /> },
          // 管理员路由
          { path: 'admin/audit', element: <AdminAudit /> },
          { path: 'admin/hotels', element: <AdminHotels /> }
        ]
      }
    ]
  },
  { path: '*', element: <Navigate to="/" /> }
])