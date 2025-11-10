import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">欢迎回来</CardTitle>
          <CardDescription className="text-center">登录您的账户继续</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址</Label>
            <Input id="email" type="email" placeholder="请输入邮箱" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" placeholder="请输入密码" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">记住我</Label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">忘记密码？</a>
          </div>
          
          <Button className="w-full">登录</Button>
          
          <div className="text-center text-sm text-gray-600">
            还没有账户？ 
            <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium">立即注册</a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}