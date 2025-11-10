import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="space-y-6 w-full">
      <Card className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">欢迎使用 React Agentic 模板</CardTitle>
          <CardDescription className="text-white/100 font-medium tracking-tight">这是一个基于 React 19 + TypeScript + Vite + Tailwind CSS 的现代前端应用模板</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">技术栈</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• React 19</li>
              <li>• TypeScript</li>
              <li>• Vite</li>
              <li>• Tailwind CSS</li>
              <li>• React Router</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">功能特性</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• 现代组件架构</li>
              <li>• 响应式设计</li>
              <li>• TypeScript 支持</li>
              <li>• 模块化路由</li>
              <li>• Shadcn UI 组件</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">快速开始</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li>• 查看侧边栏导航</li>
              <li>• 浏览页面路由</li>
              <li>• 了解项目结构</li>
              <li>• 开始开发功能</li>
            </ul>
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">了解更多</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}