# 基础按钮组件示例

## 功能描述

Button 组件是一个基础的按钮组件，支持多种样式和状态。

## 使用场景

- 表单提交按钮
- 操作按钮
- 链接按钮

## API 说明

| 属性名   | 类型                               | 默认值    | 说明         |
| -------- | ---------------------------------- | --------- | ------------ |
| type     | `primary` | `secondary` | `text`  | `primary` | 按钮类型     |
| size     | `small` | `medium` | `large`      | `medium`  | 按钮大小     |
| disabled | boolean                            | false     | 是否禁用     |
| onClick  | () => void                         | -         | 点击事件回调 |
| children | ReactNode                          | -         | 按钮内容     |

## 使用示例

```tsx
import Button from '../components/base/Button';

// 主要按钮
<Button type="primary" onClick={handleSubmit}>
  提交
</Button>

// 次要按钮
<Button type="secondary" size="small" disabled>
  取消
</Button>

// 文本按钮
<Button type="text" onClick={handleReset}>
  重置
</Button>
```
