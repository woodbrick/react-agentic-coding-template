export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">欢迎使用 React Agentic 模板</h1>
        <p className="text-blue-100">这是一个基于 React 19 + TypeScript + Vite + Tailwind CSS 的现代前端应用模板</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">技术栈</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• React 19</li>
            <li>• TypeScript</li>
            <li>• Vite</li>
            <li>• Tailwind CSS</li>
            <li>• React Router</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">功能特性</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• 现代组件架构</li>
            <li>• 响应式设计</li>
            <li>• TypeScript 支持</li>
            <li>• 模块化路由</li>
            <li>• Shadcn UI 组件</li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">快速开始</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• 查看侧边栏导航</li>
            <li>• 浏览页面路由</li>
            <li>• 了解项目结构</li>
            <li>• 开始开发功能</li>
          </ul>
        </div>
      </div>
    </div>
  )
}