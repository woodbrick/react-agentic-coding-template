# TypeScript 高级类型系统示例

本文件展示 TypeScript 高级类型系统的各种模式和最佳实践，重点关注数组类型、泛型、实用工具类型等复杂用法。

## 基础数据模型

```typescript
export interface User {
  id: string;
  name: string;
  age: number;
  email?: string;
}
```

## 高级数组类型

### 基础数组类型

```typescript
export const names: string[] = ['张三', '李四', '王五'];
export const scores: number[] = [95, 87, 92, 88];
```

### 只读数组

```typescript
export const readonlyNames: readonly string[] = ['张三', '李四'];
export const readonlyScores: ReadonlyArray<number> = [95, 87, 92];
```

### 元组类型

```typescript
export const userInfo: [string, number, boolean] = ['张三', 25, true];
export type Point = [number, number];
export const point: Point = [10, 20];
```

### 可变长度元组

```typescript
export type StringNumberBooleans = [string, number, ...boolean[]];
export const mixed: StringNumberBooleans = ['hello', 1, true, false, true];
```

## 泛型类型

### 泛型函数

```typescript
export function identity<T>(arg: T): T {
  return arg;
}
```

### 泛型接口

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

### 泛型类

```typescript
export class DataContainer<T> {
  private data: T;

  constructor(data: T) {
    this.data = data;
  }

  getData(): T {
    return this.data;
  }
}
```

### 泛型约束

```typescript
export interface HasId {
  id: string | number;
}

export function getById<T extends HasId>(
  items: T[],
  id: T['id'],
): T | undefined {
  return items.find((item) => item.id === id);
}
```

## 实用工具类型

### TypeScript 内置工具类型示例

```typescript
export interface UserProfile {
  name: string;
  age: number;
  email: string;
}

export type PartialUser = Partial<UserProfile>;
export type RequiredUser = Required<PartialUser>;
export type UserNameAndAge = Pick<UserProfile, 'name' | 'age'>;
export type UserWithoutEmail = Omit<UserProfile, 'email'>;
export type UserMap = Record<string, User>;
```

## 高级类型组合

### 联合类型

```typescript
export type Status = 'pending' | 'success' | 'error';
```

### 交叉类型接口

```typescript
export interface TimeStamped {
  createdAt: Date;
  updatedAt: Date;
}

export type TimeStampedUser = User & TimeStamped;
```

### 类型保护

```typescript
export function isAdmin(role: string): role is 'admin' {
  return role === 'admin';
}
```

## 使用示例

### 泛型使用

```typescript
export const stringIdentity = identity<string>('hello');
export const userResponse: ApiResponse<User> = {
  success: true,
  data: { id: '1', name: '张三', age: 25 },
};

export const numberContainer = new DataContainer<number>(100);
```

### 数组类型验证

```typescript
export const users: User[] = [
  { id: '1', name: '张三', age: 25 },
  { id: '2', name: '李四', age: 30 },
];
```

### 函数示例

```typescript
export function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}
```

### 实用工具示例

```typescript
export const partialUser: PartialUser = { name: '张三' };
export const userWithoutEmail: UserWithoutEmail = { name: '张三', age: 25 };
```
