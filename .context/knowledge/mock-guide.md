<metadata updated="2025-10-04" version="1.0" name="BigFish Mock 功能使用方案">
  <keywords>BigFish, Mock, 模拟数据, 接口模拟, 前端开发, 并行开发, 开发效率, API模拟</keywords>
</metadata>

# BigFish Mock 功能使用方案

## 1. 概述

本方案基于 BigFish 框架的 Mock 功能，为前端开发提供本地开发环境下的模拟数据和接口。通过 Mock 数据，前端开发可以独立于后端进行开发和测试，提高开发效率。

### 什么是 Mock 数据

在前后端约定好 API 接口以后，前端可以使用 Mock 数据来在本地模拟出 API 应该要返回的数据，这样一来前后端开发就可以同时进行，不会因为后端 API 还在开发而导致前端的工作被阻塞。

## 2. 目录约定

BigFish 约定 `/mock` 目录下的所有文件为 Mock 文件，例如这样的目录结构：

```
.
├── mock
│   ├── todos.ts
│   ├── items.ts
│   └── users.ts
└── src
    └── pages
        └── index.tsx
```

则 `/mock` 目录中的 `todos.ts`, `items.ts` 和 `users.ts` 就会被 Bigfish 视为 Mock 文件来处理。

## 3. Mock 文件

### 3.1 基本格式

Mock 文件默认导出一个对象，而对象的每个 Key 对应了一个 Mock 接口，值则是这个接口所对应的返回数据，例如这样的 Mock 文件：

```typescript
// ./mock/users.ts
export default {
  // 返回值可以是数组形式
  'GET /api/users': [
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' },
  ],
  // 返回值也可以是对象形式
  'GET /api/users/1': { id: 1, name: 'foo' },
};
```

就声明了两个 Mock 接口，透过 `GET /api/users` 可以拿到一个带有两个用户数据的数组，透过 `GET /api/users/1` 可以拿到某个用户的模拟数据。

在页面配置编辑器项目中，我们创建了 `mock/pageConfigEditor/index.ts` 文件来定义所有与页面配置相关的 Mock 接口，该文件遵循 ES6 模块规范，使用 export default 导出 Mock 配置。

### 3.2 请求方法

当 HTTP 的请求方法是 GET 时，可以省略方法部分，只需要路径即可，例如：

```typescript
// ./mock/users.ts
export default {
  '/api/users': [
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' },
  ],
  '/api/users/1': { id: 1, name: 'foo' },
};
```

也可以用不同的请求方法，例如 `POST`，`PUT`，`DELETE`：

```typescript
// ./mock/users.ts
export default {
  'POST /api/users': { result: 'true' },
  'PUT /api/users/1': { id: 1, name: 'new-foo' },
  'DELETE /api/users/1': { result: 'true' },
};
```

### 3.3 自定义函数

除了直接静态声明返回值，也可以用函数的方式来声明如何计算返回值，例如：

```typescript
export default {
  'POST /api/users/create': (req, res) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('ok');
  },
};
```

关于 `req` 和 `res` 的 API 可参考 [Express@4 官方文档](https://expressjs.com/en/api.html) 来进一步了解。

### 3.4 defineMock

另外，也可以使用 `defineMock` 类型帮助函数来提供编写 mock 对象的代码提示，如：

```typescript
import { defineMock } from '@alipay/bigfish';

export default defineMock({
  '/api/users': [
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' },
  ],
  '/api/users/1': { id: 1, name: 'foo' },
  'GET /api/users/2': (req, res) => {
    res.status(200).json({ id: 2, name: 'bar' });
  },
});
```

`defineMock` 仅仅提供类型提示，入参与出参完全一致。

## 4. 关闭 Mock

Bigfish 默认开启 Mock 功能，如果不需要的话可以从配置文件关闭：

```typescript
// config/config.ts
export default {
  mock: false,
};
```

或是用环境变量的方式关闭：

```bash
MOCK=none bigfish dev
```

## 5. 引入 Mock.js

现在技术规范已经禁止使用 Mock.js，不要引入

## 6. 最佳实践

### 6.1 数据一致性

确保 Mock 数据与实际接口返回的数据结构保持一致，包括：

- 字段名称
- 数据类型
- 嵌套结构

### 6.2 CommonResult 类型包装

**重要**: 所有 Mock API 响应必须使用 `CommonResult<T>` 类型包装，确保与真实 API 接口格式一致。

#### CommonResult 接口定义

```typescript
export interface CommonResult<T> {
  success: boolean;
  code: string;
  resultContent: T;
  message: string;
}
```

#### 标准 Mock 响应格式

```typescript
import { defineMock } from '@alipay/bigfish';
import { CommonResult } from '../../src/interfaces/service';

function wrapCommonResult<T>(data: T): CommonResult<T> {
  return {
    success: true,
    code: '00000',
    resultContent: data,
    message: 'success',
  };
}

export default defineMock({
  'POST /api/users': (req, res) => {
    return res.status(200).json(wrapCommonResult({ id: 1, name: 'foo' }));
  },

  'GET /api/users/list': (req, res) => {
    return res.status(200).json(wrapCommonResult([
      { id: 1, name: 'foo' },
      { id: 2, name: 'bar' }
    ]));
  },
});
```

#### 错误响应格式

```typescript
'POST /api/users/create': (req, res) => {
  return res.status(400).json({
    success: false,
    code: 'VALIDATION_ERROR',
    resultContent: null,
    message: '用户名不能为空'
  });
},
```

#### 注意事项

- **必须导入** `CommonResult` 类型从 `src/interfaces/service.ts`
- **统一使用** `wrapCommonResult` 辅助函数进行包装
- **保持一致** 的错误码和错误信息格式
- **所有接口** 无论成功或失败都必须使用 CommonResult 包装

### 6.3 错误场景模拟

在 Mock 数据中包含错误场景的模拟，如：

- 网络超时
- 权限不足
- 数据不存在

### 6.4 性能考虑

使用适当的延迟模拟网络请求：

```javascript
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 模拟300ms网络延迟
await delay(300);
```

## 7. 其他配置

关于 Mock 功能完整的其他配置项，请在文档的配置章节中查看。

## 8. 注意事项

1. Mock 文件仅在开发环境中使用，不会影响生产环境
2. 当后端接口开发完成后，应及时切换到真实接口
3. 保持 Mock 数据的更新，确保与接口文档一致
4. 避免在 Mock 数据中包含敏感信息
