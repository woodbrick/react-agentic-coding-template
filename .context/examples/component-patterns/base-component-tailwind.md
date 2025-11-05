# Tailwind CSS 基础组件示例

## 功能描述

基础组件示例展示了如何使用 Tailwind CSS 创建一个标准的 React 组件，完全遵循 Tailwind 优先的样式方案。

## 特点

- ✅ 纯 Tailwind CSS 样式，无 CSS Module 依赖
- ✅ 类型安全的数据模型（移除 any 类型）
- ✅ 语义化的类名命名
- ✅ 响应式布局支持
- ✅ 符合 UI 标准的最佳实践

## 数据模型

```typescript
// 数据项接口
interface DataItem {
  id?: string | number;
  name?: string;
  value?: string | number;
  [key: string]: unknown; // 扩展属性
}

// 动作数据接口
interface ActionData {
  count: number;
  timestamp: string;
  items: DataItem[];
  [key: string]: unknown; // 扩展属性
}
```

## API 说明

| 属性名      | 类型                       | 默认值     | 说明         |
| ----------- | -------------------------- | ---------- | ------------ |
| title       | string                     | -          | 组件标题     |
| description | string                     | '默认描述' | 组件描述     |
| onAction    | (data: ActionData) => void | -          | 动作回调函数 |
| loading     | boolean                    | false      | 加载状态     |
| data        | DataItem[]                 | []         | 数据列表     |

## 使用示例

```tsx
import BaseComponent from '../components/base/base-component';

// 基础使用
<BaseComponent
  title="用户统计"
  description="这是一个使用Tailwind CSS的组件示例"
  onAction={(data) => console.log('动作触发:', data)}
/>

// 带数据的完整示例
<BaseComponent
  title="数据展示"
  description="展示类型化的数据结构"
  data={[
    { id: 1, name: '项目A', value: '100', category: '类型1' },
    { id: 2, name: '项目B', value: '200', category: '类型2' }
  ]}
  onAction={(data) => {
    console.log('计数:', data.count);
    console.log('时间戳:', data.timestamp);
    console.log('数据项:', data.items);
  }}
/>

// 加载状态
<BaseComponent
  title="加载示例"
  loading={true}
  onAction={(data) => handleAction(data)}
/>
```

## Tailwind CSS 特性

- 使用语义化的间距和颜色类名
- 避免硬编码样式，使用设计系统
- 保持样式一致性
- 便于主题切换和维护

## 最佳实践

1. **类型安全**: 使用明确的接口定义，避免`any`类型
2. **扩展性**: 保留`[key: string]: unknown`支持动态属性
3. **语义化命名**: 使用有意义的变量名和类名
4. **Tailwind 优先**: 优先使用 Tailwind 工具类而非自定义样式
5. **组件纯净**: 不包含业务逻辑，专注展示和交互
