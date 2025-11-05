# 基础组件 (BaseComponent)

## 组件功能

基础组件示例展示了如何使用 Tailwind CSS 创建一个标准的 React 组件。该组件包含以下特性：

- 计数器功能：点击按钮增加计数
- 可见性切换：可以隐藏/显示组件内容
- 数据展示：显示传入的数据列表
- 响应式设计：适配不同屏幕尺寸

## 使用案例

### 基本使用

```jsx
import BaseComponent from './index';

<BaseComponent description="这是一个基础组件的使用示例" />;
```

### 带数据列表的使用

```jsx
import BaseComponent from './index';

// Mock 数据示例
const mockData = [
  { id: 1, name: '项目1', value: '100' },
  { id: 2, name: '项目2', value: '200' },
  { id: 3, name: '项目3', value: '300' },
];

<BaseComponent description="展示数据列表的组件" data={mockData} />;
```

### 带回调函数的使用

```jsx
import BaseComponent from './index';

// 回调函数示例
const handleAction = (data) => {
  console.log('组件操作数据:', data);
  // 处理组件回调数据
  // data 包含:
  // - count: 当前计数值
  // - timestamp: 操作时间戳
  // - items: 当前数据列表
};

<BaseComponent description="带操作回调的组件" onAction={handleAction} />;
```

### 带加载状态的使用

```jsx
import BaseComponent from './index';

<BaseComponent description="展示加载状态的组件" loading={true} />;
```

## API 说明

### Props

| 属性名 | 类型 | 是否必需 | 默认值 | 描述 |
| --- | --- | --- | --- | --- |
| description | string | 否 | '默认描述' | 组件描述 |
| data | DataItem[] | 否 | [] | 要展示的数据列表 |
| onAction | (data: ActionData) => void | 否 | - | 操作回调函数 |
| loading | boolean | 否 | false | 加载状态 |

### 数据模型

#### DataItem

```ts
interface DataItem {
  id?: string | number;
  name?: string;
  value?: string | number;
  [key: string]: unknown; // 扩展属性
}
```

#### ActionData

```ts
interface ActionData {
  count: number;
  timestamp: number;
  items: DataItem[];
  [key: string]: unknown; // 扩展属性
}
```

## 注意事项

1. 组件使用 Tailwind CSS 进行样式设计，请确保项目中已正确配置 Tailwind CSS
2. 数据列表会根据传入的 data 属性自动渲染
3. 回调函数会在用户点击按钮时触发，返回当前计数值和相关数据
4. 组件支持响应式设计，在移动设备上会有相应的样式调整
