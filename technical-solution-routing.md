# 路由与SSR技术方案

<metadata updated="2025-11-07" version="1.0.0" name="路由与SSR技术方案">
  <keywords>React Router, SSR, Vite, TypeScript, 路由架构, 服务器端渲染</keywords>
</metadata>

## 1. 方案概述

本技术方案基于图片中的注册页面UI需求，设计并实现了一套完整的路由架构和SSR方案。该方案采用React Router + Vite SSR的技术栈，支持服务器端渲染以提高SEO和首屏加载性能。

### 1.1 技术选型
- **路由库**: React Router (v6)
- **构建工具**: Vite
- **渲染模式**: CSR + SSR混合模式
- **样式框架**: Tailwind CSS
- **类型检查**: TypeScript

### 1.2 架构设计

```
├── 客户端渲染 (CSR)
│   ├── 主应用入口 (main.tsx)
│   ├── 路由配置 (router.tsx)
│   └── 页面组件 (pages/)
├── 服务器端渲染 (SSR)
│   ├── 服务端入口 (ssr/entry-server.tsx)
│   ├── 客户端入口 (ssr/entry-client.tsx)
│   └── Express服务器 (server/index.js)
└── 构建配置
    ├── Vite配置 (vite.config.ts)
    └── 构建脚本 (package.json)
```

## 2. 路由架构设计

### 2.1 路由配置结构

路由采用嵌套结构设计，支持基于文件的路由管理：

```tsx
// src/router.tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,  // 主应用布局
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'dashboard', element: <DashboardPage /> }
    ]
  }
])
```

### 2.2 页面组件设计

每个页面都是独立的组件模块，具有以下特点：
- **类型安全**: 完整的TypeScript支持
- **响应式设计**: Tailwind CSS实现
- **模块化**: 独立的样式和逻辑封装

#### 2.2.1 登录页面实现

```tsx
// src/pages/LoginPage.tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full p-6">
        {/* 登录表单实现 */}
        <form className="space-y-4">
          {/* 邮箱和密码输入框 */}
          {/* 记住我和忘记密码选项 */}
          {/* 登录按钮 */}
        </form>
      </div>
    </div>
  )
}
```

### 2.3 导航组件集成

侧边栏导航集成React Router的`Link`组件，支持客户端路由跳转：

```tsx
// src/components/app-sidebar.tsx
<SidebarMenuButton asChild>
  <Link to={item.url}>
    <item.icon />
    <span>{item.title}</span>
  </Link>
</SidebarMenuButton>
```

## 3. SSR实现方案

### 3.1 服务器端渲染流程

SSR采用Vite + Express的架构模式：

1. **请求处理**: Express服务器接收HTTP请求
2. **路由匹配**: 根据URL确定渲染的页面
3. **组件渲染**: 使用`renderToString`渲染React组件
4. **模板注入**: 将HTML注入到基础模板中
5. **响应返回**: 返回完整的HTML页面

### 3.2 关键代码实现

#### 3.2.1 服务器入口

```tsx
// src/ssr/entry-server.tsx
export function render(url: string, context = {}) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  )
  
  return { html }
}
```

#### 3.2.2 客户端Hydration

```tsx
// src/ssr/entry-client.tsx
function hydrate() {
  hydrateRoot(
    document.getElementById('root')!,
    <RouterProvider router={router} />
  )
}
```

### 3.3 SSR服务器配置

#### 3.3.1 Express服务器

```javascript
// server/index.js
app.use('*', async (req, res, next) => {
  const { render } = await vite.ssrLoadModule('/src/ssr/entry-server.tsx')
  const { html } = render(req.originalUrl)
  
  // 注入HTML模板
  const template = `...${html}...`
  res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
})
```

#### 3.3.2 Vite配置

```ts
// vite.config.ts
export default defineConfig({
  build: {
    ssrManifest: true,
    rollupOptions: {
      input: {
        main: "./index.html",
        "ssr-client": "./src/ssr/entry-client.tsx",
      },
    },
  },
  ssr: {
    noExternal: ["react", "react-dom", "react-router"],
  },
})
```

## 4. 性能优化

### 4.1 构建优化

- **代码分割**: 按页面路由进行代码分割
- **预加载**: 关键资源预加载优化
- **压缩**: 生产环境代码压缩

### 4.2 运行时优化

- **缓存策略**: SSR结果缓存
- **CDN加速**: 静态资源CDN分发
- **流式渲染**: 支持流式SSR（可选）

### 4.3 SEO优化

- **服务端渲染**: 确保搜索引擎抓取内容
- **Meta标签**: 动态生成页面meta信息
- **结构化数据**: 支持JSON-LD等结构化数据

## 5. 部署方案

### 5.1 开发环境

```bash
# 开发模式启动
npm run dev

# SSR开发模式
npm run build:ssr && npm run serve
```

### 5.2 生产环境

```bash
# 构建客户端资源
npm run build

# 构建SSR资源
npm run build:ssr

# 启动生产服务器
npm run serve
```

### 5.3 部署架构

```
负载均衡器
    ↓
多个Node.js服务器 (SSR)
    ↓
CDN (静态资源)
    ↓
后端API服务
```

## 6. 测试策略

### 6.1 单元测试

- **路由测试**: 验证路由配置正确性
- **组件测试**: 页面组件功能测试
- **SSR测试**: 服务端渲染正确性验证

### 6.2 E2E测试

- **页面导航**: 验证路由跳转功能
- **用户交互**: 登录流程端到端测试
- **SSR验证**: 检查首屏渲染效果

## 7. 监控与维护

### 7.1 性能监控

- **页面加载时间**: 监控各页面加载性能
- **SSR性能**: 服务端渲染时长监控
- **错误追踪**: 运行时错误收集

### 7.2 日志管理

- **访问日志**: 记录用户访问行为
- **错误日志**: 记录SSR渲染错误
- **性能日志**: 监控系统运行状态

## 8. 扩展性考虑

### 8.1 路由扩展

- **动态路由**: 支持参数化路由
- **嵌套路由**: 深度嵌套路由支持
- **路由守卫**: 权限控制路由访问

### 8.2 SSR扩展

- **数据预取**: 服务端数据预取支持
- **流式渲染**: 增量流式渲染支持
- **边缘计算**: 边缘节点SSR部署

<reference type="guidance">
- `.context/knowledge/react-router.md` # React Router最佳实践
- `vite.config.ts` # Vite SSR配置参考
- `src/router.tsx` # 路由配置实现
</reference>

---

**最后更新时间**: 2025-11-07  
**版本**: 1.0.0  
**负责人**: AI助手  
**状态**: ✅ 已完成技术方案设计