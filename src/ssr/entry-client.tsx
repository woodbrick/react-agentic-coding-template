import { hydrateRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from '../router'

/**
 * SSR客户端入口 - 用于hydration
 */
function hydrate() {
  hydrateRoot(
    document.getElementById('root')!,
    <RouterProvider router={router} />
  )
}

// 等待DOM加载完成后进行hydration
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', hydrate)
} else {
  hydrate()
}