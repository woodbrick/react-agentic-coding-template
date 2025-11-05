<metadata updated="2025-10-04" version="1.0" name="Vitest 使用规范与最佳实践">
  <keywords>Vitest, 单元测试, JavaScript测试, TypeScript测试, Vite测试, 测试框架, 代码覆盖率, 测试规范</keywords>
</metadata>

# Vitest 使用规范与最佳实践

## 概述

Vitest 是一个基于 Vite 的轻量级、快速的测试框架，专为现代 JavaScript 和 TypeScript 项目设计，提供与 Jest 兼容的 API。

## 安装与配置

### 基础安装

```bash
npm install -D vitest
```

### 配置文件

创建 `vitest.config.ts`：

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### TypeScript 配置

在 `tsconfig.json` 中添加：

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

## 测试文件规范

### 文件命名

- 测试文件：`*.test.ts` 或 `*.spec.ts`
- 测试目录：`__tests__/` 或 `tests/`

### 基本结构

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('组件名/函数名', () => {
  beforeEach(() => {
    // 测试前置准备
  });

  afterEach(() => {
    // 测试后清理
  });

  it('应该描述具体的行为预期', () => {
    // Arrange - 准备测试数据
    // Act - 执行被测试的代码
    // Assert - 验证结果
  });
});
```

## 断言规范

### 常用断言

```typescript
// 值相等
expect(actual).toBe(expected); // 严格相等
expect(actual).toEqual(expected); // 深相等
expect(actual).toBeTruthy(); // 真值
expect(actual).toBeFalsy(); // 假值

// 数字
expect(number).toBeGreaterThan(0);
expect(number).toBeLessThan(100);
expect(number).toBeCloseTo(3.14, 2); // 小数比较

// 字符串/数组
expect(string).toContain('substring');
expect(array).toHaveLength(3);
expect(array).toContain(item);

// 对象
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });

// 错误
expect(() => {
  throwFunction();
}).toThrow('错误消息');
```

## 测试模式

### 单元测试

```typescript
import { sum } from './math';

describe('sum', () => {
  it('应该正确计算两个数的和', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('应该处理负数', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
```

## Mock 使用规范

### 函数 Mock

```typescript
const mockFn = vi.fn();
mockFn.mockReturnValue('mocked value');
mockFn.mockResolvedValue('async mocked value');

// 验证调用
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(1);
```

### 模块 Mock

```typescript
vi.mock('axios');
import axios from 'axios';

const mockedAxios = vi.mocked(axios);
mockedAxios.get.mockResolvedValue({ data: 'mocked response' });
```

### 定时器 Mock

```typescript
vi.useFakeTimers();

// 快进时间
vi.advanceTimersByTime(1000);

// 恢复真实定时器
vi.useRealTimers();
```

## 运行配置

### 脚本命令

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch"
  }
}
```

### 运行特定测试

```bash
# 运行特定文件
vitest math.test.ts

# 运行包含特定描述
vitest -t "should calculate"

# 运行特定目录
vitest src/components/
```

## 代码覆盖率

### 配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

## 调试技巧

### VS Code 调试配置

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Current Test",
  "program": "${workspaceFolder}/node_modules/.bin/vitest",
  "args": ["run", "${relativeFile}"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### 调试单个测试

```typescript
it.only('debug this test', () => {
  // 只运行这个测试
});

it.skip('skip this test', () => {
  // 跳过这个测试
});
```

## 最佳实践

### 1. 测试结构

- 使用清晰的描述性测试名称
- 遵循 AAA 模式（Arrange, Act, Assert）
- 保持测试独立，不依赖执行顺序

### 2. Mock 策略

- 只 mock 外部依赖（API、数据库等）
- 避免过度 mock，保持测试的真实性
- 使用工厂函数创建复杂的 mock 数据

### 3. 数据准备

```typescript
const createTestUser = (overrides = {}) => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  ...overrides,
});

// 使用
const user = createTestUser({ name: 'Custom Name' });
```

### 4. 错误处理测试

```typescript
it('应该处理 API 错误', async () => {
  mockedAxios.get.mockRejectedValue(new Error('Network Error'));

  await expect(fetchUser(1)).rejects.toThrow('Network Error');
});
```

### 5. 性能考虑

- 避免在测试中执行真实的 I/O 操作
- 使用合适的测试环境（node vs jsdom）
- 合理设置超时时间

## 常见问题解决

### 1. ESM 模块问题

```typescript
// 确保 package.json 设置
{
  "type": "module"
}
```

### 2. 路径别名配置

```typescript
// vitest.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3. 环境变量

```typescript
// 在测试文件中
vi.stubEnv('NODE_ENV', 'test');
```

## 相关资源

- [官方文档](https://cn.vitest.dev/)
- [GitHub 仓库](https://github.com/vitest-dev/vitest)
- [Testing Library](https://testing-library.com/)
