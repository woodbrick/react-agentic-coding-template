<metadata updated="2025-10-24" version="1.0.0" name="通用服务层模式示例">
  <keywords>服务层模式, CommonResult, 参数命名, TypeScript, API设计</keywords>
</metadata>

# 通用服务层模式示例

> 服务层开发的标准化模式和最佳实践示例

## 🎯 核心设计原则

- **统一参数命名**：所有接口参数统一命名为 `params`
- **类型安全响应**：使用泛型 `CommonResult<T>` 确保类型安全
- **错误处理一致**：统一的错误处理机制和响应格式

## 📝 通用接口定义

### CommonResult 响应格式

```typescript

import { CommonResult } from '@/interfaces';

/**
 * 分页响应格式
 */
export interface PaginatedResult<T> extends CommonResult<T[]> {
  total?: number;
  current?: number;
  pageSize?: number;
}

/**
 * 通用查询参数格式
 */
export interface CommonQueryParams {
  current?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
  [key: string]: any;
}
```

### 参数命名规范示例

```typescript
// ✅ 正确的接口定义示例
interface UserQueryParams {
  id: number;
  name?: string;
  status?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// 查询接口示例（使用统一的 params 参数名）
export const queryUser = async (params: UserQueryParams): Promise<CommonResult<User>> => {
  // 实现逻辑
};

// 创建接口示例
export const createUser = async (params: Partial<User>): Promise<CommonResult<User>> => {
  // 实现逻辑
};

// ❌ 错误的接口定义示例（参数名称不一致）
export const getUser = async (data: UserQueryParams): Promise<CommonResult<User>> => {
  // 不符合规范，参数名称应为 params
};
```

## 🔧 完整服务层实现示例

### 用户服务完整示例

**接口类型定义 (`src/services/user/interface.ts`)**

```typescript
export interface UserQueryParams {
  id: number;
  name?: string;
  email?: string;
  status?: 'active' | 'inactive';
}

export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}
```

**服务实现 (`src/services/user/index.ts`)**

```typescript
import { CommonResult } from '@/interfaces';
import type { User, UserQueryParams } from './interface';

/**
 * 查询用户信息
 * ✅ 使用统一的 params 参数名
 * ✅ 返回类型为 CommonResult<User>
 */
export const queryUser = async (params: UserQueryParams): Promise<CommonResult<User>> => {
  try {
    const response = await request('/api/user/query', {
      method: 'POST',
      data: params,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      data: {} as User,
      message: error.message,
      code: -1,
    };
  }
};

/**
 * 创建用户
 * ✅ 使用统一的 params 参数名
 * ✅ 返回类型为 CommonResult<User>
 */
export const createUser = async (params: Partial<User>): Promise<CommonResult<User>> => {
  try {
    const response = await request('/api/user/create', {
      method: 'POST',
      data: params,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      data: {} as User,
      message: error.message,
      code: -1,
    };
  }
};

/**
 * 分页查询用户列表
 * ✅ 使用统一的 params 参数名
 * ✅ 返回类型为 PaginatedResult<User>
 */
export const queryUserList = async (
  params: CommonQueryParams & { name?: string; status?: string }
): Promise<PaginatedResult<User>> => {
  try {
    const response = await request('/api/user/list', {
      method: 'POST',
      data: params,
    });
    return response;
  } catch (error) {
    return {
      success: false,
      data: [] as User[],
      message: error.message,
      code: -1,
    };
  }
};
```

### 业务服务示例

**页面配置服务 (`src/services/pageConfig/index.ts`)**

```typescript
import { CommonResult, PaginatedResult } from '@/services/common';

interface PageConfig {
  id: string;
  name: string;
  content: Record<string, any>;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

interface PageConfigQueryParams {
  id?: string;
  name?: string;
  status?: 'draft' | 'published';
}

/**
 * 查询页面配置
 */
export const queryPageConfig = async (
  params: PageConfigQueryParams
): Promise<CommonResult<PageConfig>> => {
  // 实现逻辑
};

/**
 * 创建页面配置
 */
export const createPageConfig = async (
  params: Partial<PageConfig>
): Promise<CommonResult<PageConfig>> => {
  // 实现逻辑
};
```

## 🚀 使用示例

### 在组件中使用服务

```tsx
import { useEffect, useState } from 'react';
import { queryUser } from '@/services/user';
import type { User } from '@/services/user/interface';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUser = async () => {
    setLoading(true);
    try {
      const result = await queryUser({ id: 123 }); // ✅ 统一使用 params
      if (result.success) {
        setUser(result.data);
      } else {
        console.error('加载用户失败:', result.message);
      }
    } catch (error) {
      console.error('请求异常:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div>
      {loading ? (
        <div>加载中...</div>
      ) : (
        <div>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
        </div>
      )}
    </div>
  );
};
```

### 在 Store 中使用服务

```typescript
import { create } from 'zustand';
import { queryUserList } from '@/services/user';
import type { User, CommonQueryParams } from '@/services/user/interface';

interface UserStore {
  users: User[];
  loading: boolean;
  total: number;
  queryUsers: (params: CommonQueryParams) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: false,
  total: 0,

  queryUsers: async (params) => {
    set({ loading: true });
    try {
      const result = await queryUserList(params);
      if (result.success) {
        set({
          users: result.data,
          total: result.total || 0,
          loading: false
        });
      }
    } catch (error) {
      set({ loading: false });
    }
  },
}));
```

## 🎯 最佳实践总结

### ✅ 必须遵循的原则

1. **参数命名统一**：所有接口参数必须命名为 `params`
2. **响应格式统一**：使用 `CommonResult<T>` 作为返回类型
3. **类型定义完整**：为每个业务实体定义完整的接口类型
4. **错误处理一致**：统一的错误处理机制

### ❌ 禁止的做法

1. 使用不一致的参数名称（如 `data`、`options`、`body`）
2. 直接返回原始数据，不使用通用响应格式
3. 在服务层混入 UI 相关逻辑
4. 使用 any 类型逃避类型检查

### 📋 质量检查清单

- [ ] 参数名称统一使用 `params`
- [ ] 返回类型使用 `CommonResult<T>`
- [ ] 完整的类型定义和接口文档
- [ ] 统一的错误处理机制
- [ ] 适当的异步错误捕获

## 🔗 相关资源

- [服务层开发规范](../rules/service-layer-standards.md)
- [类型定义最佳实践](../knowledge/typescript-patterns.md)
- [错误处理策略](../knowledge/error-handling.md)
