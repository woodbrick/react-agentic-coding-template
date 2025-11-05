# 用户卡片业务组件示例

## 功能描述

UserCard 组件用于展示用户基本信息的业务组件。

## 使用场景

- 用户列表项
- 用户详情展示
- 用户信息预览

## API 说明

| 属性名     | 类型                     | 默认值 | 说明         |
| ---------- | ------------------------ | ------ | ------------ |
| user       | User                     | -      | 用户信息对象 |
| showAvatar | boolean                  | true   | 是否显示头像 |
| onEdit     | (user: User) => void     | -      | 编辑回调     |
| onDelete   | (userId: string) => void | -      | 删除回调     |

## User 类型定义

```ts
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
}
```

## 使用示例

```tsx
import UserCard from '../components/business/UserCard';

const user = {
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
  role: 'admin',
  createdAt: '2023-01-01',
};

<UserCard user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />;
```
