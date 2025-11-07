import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      }
    ]
  }
])

// 路由提供者组件
export function Router() {
  return <RouterProvider router={router} />
}