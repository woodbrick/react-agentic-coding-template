<metadata updated="2025-10-29" version="2.1" name="Zustand TypeScript 状态管理最佳实践">
  <keywords>Zustand, TypeScript, 状态管理, React状态, 类型安全, 中间件, 切片模式, Immer, 嵌套状态更新, 最佳实践, Zustand, TypeScript, State Management, React State, Type Safety, Middleware, Slice Pattern, Best Practices</keywords>
</metadata>

# 🚀 Zustand TypeScript 最佳实践指南

> 本文档提供 Zustand 状态管理库在 TypeScript 项目中的完整使用指南，涵盖从基础用法到高级模式的最佳实践。

原文地址： https://zustand.docs.pmnd.rs/guides/typescript

## 📋 目录

- [基础用法](#基础用法)
- [中间件使用](#中间件使用)
- [高级类型模式](#高级类型模式)
- [切片模式](#切片模式)
- [Vanilla Store Hook](#vanilla-store-hook)
- [常见问题和解决方案](#常见问题和解决方案)
- [深度嵌套状态更新](#深度嵌套状态更新)

## 🎯 基础用法

### 标准 TypeScript 使用方式

**IMPORTANT**: 在 TypeScript 中必须使用柯里化语法 `create<T>()(...)` 来正确推断类型。

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

// ✅ 正确用法：使用柯里化语法
const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```

```ts
// ❌ 错误用法：直接调用将导致类型推断问题
const useBearStore = create<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))
```


柯里化语法 `create<T>()(...)` 是 TypeScript 的必要约定，它通过两个函数调用的方式确保了类型参数的上下文推断能够正常工作。这是 Zustand 官方推荐的 TypeScript 使用方式。

### Selecting multiple state slices

It detects changes with strict-equality (old === new) by default, this is efficient for atomic state picks.


```ts
const nuts = useBearStore((state) => state.nuts)
const honey = useBearStore((state) => state.honey)
```

If you want to construct a single object with multiple state-picks inside, similar to redux's mapStateToProps, you can use useShallow to prevent unnecessary rerenders when the selector output does not change according to shallow equal.

```ts
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

const useBearStore = create((set) => ({
  nuts: 0,
  honey: 0,
  treats: {},
  // ...
}))

// Object pick, re-renders the component when either state.nuts or state.honey change
const { nuts, honey } = useBearStore(
  useShallow((state) => ({ nuts: state.nuts, honey: state.honey })),
)

// Array pick, re-renders the component when either state.nuts or state.honey change
const [nuts, honey] = useBearStore(
  useShallow((state) => [state.nuts, state.honey]),
)

// Mapped picks, re-renders the component when state.treats changes in order, count or keys
const treats = useBearStore(useShallow((state) => Object.keys(state.treats)))
```

For more control over re-rendering, you may provide any custom equality function (this example requires the use of createWithEqualityFn).

```ts
const treats = useBearStore(
  (state) => state.treats,
  (oldTreats, newTreats) => compare(oldTreats, newTreats),
)
```

### combine 中间件的使用

当使用 `combine` 中间件时，可以直接使用非柯里化语法，因为 `combine` 会自动创建状态类型。

```ts
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

// ✅ combine 中间件支持类型推断
const useBearStore = create(
  combine({ bears: 0 }, (set) => ({
    increase: (by: number) => set((state) => ({ bears: state.bears + by })),
  })),
)
```

## 🔧 中间件使用

### 标准中间件组合

**IMPORTANT**: 中间件必须在 `create` 函数内部立即使用，以确保类型推断正常工作。

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BearState {
  bears: number
  increase: (by: number) => void
}

// ✅ 正确：中间件在 create 内部立即使用
const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      { name: 'bearStore' },
    ),
  ),
)
```

```ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// ❌ 错误：自定义中间件函数会破坏类型推断
const myMiddlewares = (f) => devtools(persist(f, { name: 'bearStore' }))

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(
  myMiddlewares((set) => ({
    bears: 0,
    increase: (by) => set((state) => ({ bears: state.bears + by })),
  })),
)
```

### 中间件顺序的重要性

**NEVER**: 不要改变 devtools 中间件的相对位置，它应该作为最后一个中间件使用。

```ts
// ✅ 正确：devtools 作为最外层中间件
const useBearStore = create<BearState>()(
  devtools(
    immer(
      persist(
        (set) => ({
          bears: 0,
          increase: (by) => set((state) => ({ bears: state.bears + by })),
        }),
        { name: 'bearStore' }
      )
    )
  )
)
```

```ts
// ❌ 错误：devtools 在内部，可能丢失类型参数
const useBearStore = create<BearState>()(
  immer(
    devtools(
      persist(
        (set) => ({
          bears: 0,
          increase: (by) => set((state) => ({ bears: state.bears + by })),
        }),
        { name: 'bearStore' }
      )
    )
  )
)
```

## 🔬 高级类型模式

### 不使用柯里化语法的替代方案

**IMPORTANT**: 官方不推荐使用非柯里化语法，因为这会变成类型断言而非类型注解。

<limitation>
在极少数情况下，如果您确实需要使用非柯里化语法，可以这样实现，但这会在某些情况下导致类型检查的弱化。
</limitation>

```ts
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface BearState {
  bears: number
  increase: (by: number) => void
}

// ❌ 不推荐：使用非柯里化语法
const useBearStore = create<
  BearState,
  [
    ['zustand/persist', BearState],
    ['zustand/devtools', never]
  ]
>(devtools(persist((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}), { name: 'bearStore' })))
```

## 🧩 切片模式

切片模式允许将大型 store 拆分成更小的、可维护的模块。

<method name="切片模式实现">
1. 为每个领域定义独立的切片接口
2. 创建对应的切片创建函数
3. 使用 StateCreator 类型确保类型安全
4. 在最终 store 中组合所有切片
</method>

```ts
import { create, StateCreator } from 'zustand'

// 1. 定义切片接口
interface BearSlice {
  bears: number
  addBear: () => void
  eatFish: () => void
}

interface FishSlice {
  fishes: number
  addFish: () => void
}

interface SharedSlice {
  addBoth: () => void
  getBoth: () => number
}

// 2. 创建切片函数
const createBearSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  BearSlice
> = (set) => ({
  bears: 0,
  addBear: () => set((state) => ({ bears: state.bears + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
})

const createFishSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  FishSlice
> = (set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
})

const createSharedSlice: StateCreator<
  BearSlice & FishSlice,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  addBoth: () => {
    // 重用已存在的方法
    get().addBear()
    get().addFish()
  },
  getBoth: () => get().bears + get().fishes,
})

// 3. 组合切片创建 store
const useBoundStore = create<BearSlice & FishSlice & SharedSlice>()((...a) => ({
  ...createBearSlice(...a),
  ...createFishSlice(...a),
  ...createSharedSlice(...a),
}))
```

## 🪝 Vanilla Store Hook

### 创建有界 Hook

当使用 Vanilla store 时，可以创建类型安全的包装 hook。

```ts
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface BearState {
  bears: number
  increase: (by: number) => void
}

// 创建 Vanilla store
const bearStore = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

// 创建有界 hook
function useBearStore(): BearState
function useBearStore<T>(selector: (state: BearState) => T): T
function useBearStore<T>(selector?: (state: BearState) => T) {
  return useStore(bearStore, selector!)
}
```

### 通用有界 Hook 工厂函数

如果需要创建多个有界 hook，可以使用工厂函数。

```ts
import { useStore, StoreApi } from 'zustand'
import { createStore } from 'zustand/vanilla'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const bearStore = createStore<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

// 通用有界 hook 工厂函数
const createBoundedUseStore = ((store) => (selector) =>
  useStore(store, selector)) as <S extends StoreApi<unknown>>(
  store: S,
) => {
  (): ExtractState<S>
  <T>(selector: (state: ExtractState<S>) => T): T
}

type ExtractState<S> = S extends { getState: () => infer X } ? X : never

// 使用工厂函数创建 hook
const useBearStore = createBoundedUseStore(bearStore)
```

## 📚 中间件类型引用表

<reference type="code">
| 中间件 | 类型签名 | 说明 |
|--------|----------|------|
| `devtools` | `["zustand/devtools", never]` | 开发工具集成，无额外类型 |
| `persist` | `["zustand/persist", YourPersistedState]` | 持久化中间件，需要指定持久化状态类型 |
| `immer` | `["zustand/immer", never]` | 不可变状态更新，无额外类型 |
| `subscribeWithSelector` | `["zustand/subscribeWithSelector", never]` | 选择器订阅，无额外类型 |
| `redux` | `["zustand/redux", YourAction]` | Redux 模式，需要指定 Action 类型 |
| `combine` | 无类型修改器 | 状态组合，无需额外类型 |
</reference>

**关于 persist 中间件的重要说明**：`YourPersistedState` 是您要持久化的状态类型，通常是 `options.partialize` 的返回类型。如果不传递 `partialize` 选项，则 `YourPersistedState` 变为 `Partial<YourState>`。

## ❓ 常见问题和解决方案

### 处理动态 replace 参数

当 `replace` 参数的值在编译时未知时（动态决定），可能会出现类型问题。可以使用 `Parameters` 类型来解决：

```ts
import { create } from 'zustand'

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}))

// ✅ 正确：使用 Parameters 类型解决动态 replace 问题
const replaceFlag = Math.random() > 0.5
const args = [{ bears: 5 }, replaceFlag] as Parameters<
  typeof useBearStore.setState
>
useBearStore.setState(...args)
```

**关键技巧**：通过将参数数组转换为 `Parameters<typeof useBearStore.setState>` 类型，可以确保类型安全地处理动态 `replace` 标志。

## 🔄 深度嵌套状态更新

### 常规方法（Spread Operator）

与 React 或 Redux 类似，常规方法是复制状态对象的每一层。这需要使用展开运算符 `...` 并手动与新的状态值合并。

```ts
interface State {
  deep: {
    nested: {
      obj: {
        count: number
      }
    }
  }
  normalInc: () => void
}

// 常规方法：逐层展开复制
const useStore = create<State>()((set) => ({
  deep: {
    nested: {
      obj: {
        count: 0
      }
    }
  },
  normalInc: () =>
    set((state) => ({
      deep: {
        ...state.deep,
        nested: {
          ...state.deep.nested,
          obj: {
            ...state.deep.nested.obj,
            count: state.deep.nested.obj.count + 1
          }
        }
      }
    })),
}))
```

这非常冗长！让我们探索一些让生活更轻松的替代方案。

### 使用 Immer

许多人使用 Immer 来更新嵌套值。Immer 可以用于任何时候需要更新嵌套状态的情况，例如在 React、Redux 中，当然也包括 Zustand！

您可以使用 Immer 来缩短对深度嵌套对象的状态更新。让我们看一个例子：

```ts
import { produce } from 'immer'

interface State {
  deep: {
    nested: {
      obj: {
        count: number
      }
    }
  }
  immerInc: () => void
}

// 使用 Immer：简洁的状态更新
const useStore = create<State>()((set) => ({
  deep: {
    nested: {
      obj: {
        count: 0
      }
    }
  },
  immerInc: () =>
    set(produce((state: State) => { ++state.deep.nested.obj.count })),
}))
```

<system-reminder>
**重要提示**：请务必注意使用 Immer 时的注意事项。在更新前需要确保正确安装和配置 immer 中间件。
</system-reminder>

**显著简化**！相比常规方法，使用 Immer 可以大大减少代码量并提高可读性。

## 📖 总结

本文档涵盖了 Zustand 在 TypeScript 项目中的完整最佳实践：

1. **ALWAYS** 使用柯里化语法 `create<T>()(...)` 确保类型安全
2. **NEVER** 将 `devtools` 中间件放在其他中间件内部
3. **IMPORTANT** 中间件必须在 `create` 函数内部立即使用
4. **推荐** 使用切片模式来组织大型 store
5. **注意** 正确处理动态 `replace` 参数以避免类型错误
6. **选择** 使用 Immer 简化深度嵌套状态更新，提高代码可读性

遵循这些最佳实践将确保您的 Zustand 状态管理代码具有最佳的类型安全性和可维护性。

---

<metadata updated="2025-10-29" version="2.1" name="Zustand TypeScript 状态管理最佳实践">
  <keywords>Zustand, TypeScript, 状态管理, React状态, 类型安全, 中间件, 切片模式, 深度嵌套状态更新, Immer, 最佳实践</keywords>
</metadata>
