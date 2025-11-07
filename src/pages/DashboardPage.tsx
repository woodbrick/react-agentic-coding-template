export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">1,248</div>
          <div className="text-blue-100">总用户数</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">5,672</div>
          <div className="text-green-100">今日访问</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">89.5%</div>
          <div className="text-purple-100">转化率</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="text-3xl font-bold mb-2">3.2s</div>
          <div className="text-orange-100">平均响应时间</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">最近活动</h2>
          <div className="space-y-3">
            {[
              { user: '张三', action: '创建了新项目', time: '5分钟前' },
              { user: '李四', action: '更新了配置', time: '12分钟前' },
              { user: '王五', action: '提交了代码', time: '25分钟前' },
              { user: '赵六', action: '完成了任务', time: '1小时前' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.user} {activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">系统状态</h2>
          <div className="space-y-4">
            {[
              { name: '服务器 CPU', value: 45, max: 100 },
              { name: '内存使用', value: 32, max: 64 },
              { name: '磁盘空间', value: 128, max: 256 },
              { name: '网络带宽', value: 78, max: 100 }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}