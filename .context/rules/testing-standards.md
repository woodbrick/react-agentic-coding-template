<metadata updated="2025-10-06" version="2.0.0" name="测试规范（纯逻辑层）">
  <keywords>单元测试,纯函数,状态逻辑,无UI,无异步,Node环境,数据驱动</keywords>
</metadata>

# 🧪 纯逻辑层测试规范（禁止UI/交互/异步）

> 本规范仅允许对**同步、纯函数、无副作用**的逻辑进行测试。严禁测试组件渲染、用户交互、网络请求或异步流程。

## ✅ 允许的测试范围

- 状态变更函数（如 `reducer`、`calculateState`）
- 数据转换函数（如 `normalizeData`、`formatValue`）
- 纯计算逻辑（如 `isValidInput`、`computeDiff`）
- 边界条件校验（如 `if (x < 0) throw Error`）
- 错误处理逻辑（如异常抛出、默认值回退）

## ❌ 禁止的测试内容

- **禁止**：组件渲染（`render()`、`screen.getByText()`）
- **禁止**：用户交互事件（`fireEvent.click()`、`userEvent.type()`）
- **禁止**：异步操作（`await waitFor()`、`fetch()`、`setTimeout()`）
- **禁止**：DOM 操作（`querySelector`、`innerHTML`）
- **禁止**：文件路径依赖（`__dirname`、`import('./xxx')`）
- **禁止**：使用 `@testing-library/react`、`jsdom`、`jest.mock()`

## 🛠️ 测试编写规范

### 1. 测试文件要求
- 文件后缀：**必须为 `.test.ts`**（禁止 `.tsx`）
- 文件内容：**仅包含函数调用与断言**，不得引入 React、JSX、React Hooks
- 文件位置：**无需遵循特定目录结构**（不强制与源文件同目录）

### 2. 测试模式
- 遵循 **Arrange-Act-Assert** 模式
- 使用 `describe` 和 `it` 分组测试
- 所有测试必须为**同步执行**
- 输入/输出必须为**纯 JavaScript 数据对象**（无组件实例）

### ✅ 正确示例
```ts
import { calculateState } from './stateMachine';

it('returns initial state when action is INIT', () => {
  const result = calculateState({ type: 'INIT' }, { count: 0 });
  expect(result).toEqual({ count: 0 });
});

it('increments count when action is INCREMENT', () => {
  const result = calculateState({ type: 'INCREMENT' }, { count: 5 });
  expect(result).toEqual({ count: 6 });
});

it('throws error when input is invalid', () => {
  expect(() => calculateState({ type: 'INVALID' }, {})).toThrow();
});
```

### ❌ 错误示例（禁止）
```ts
// ❌ 禁止：渲染组件
import { render } from '@testing-library/react';
render(<MyComponent />);

// ❌ 禁止：模拟点击
fireEvent.click(screen.getByText('Submit'));

// ❌ 禁止：等待异步
await waitFor(() => expect(fetch).toHaveBeenCalled());

// ❌ 禁止：使用 JSX
expect(screen.getByText(<b>Test</b>)).toBeInTheDocument();
```

## ⚙️ 运行环境要求

- **测试环境**：必须为 `node`（`vitest.config.ts` 中 `environment: 'node'`）
- **JSX 支持**：**禁止启用 JSX 解析**，所有测试文件不应涉及 React 组件
- **依赖模拟**：**禁止使用 `jest.mock()`** 或任何外部依赖模拟

## 📜 总结：测试黄金准则

> **测试的是“函数的返回值”，不是“组件的表现”。**
>
> 如果你不能用 `console.log()` 打印出输入输出数据来验证逻辑 —— 你就不能写测试。
