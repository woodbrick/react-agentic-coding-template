<metadata updated="2025-10-21" version="1.4.0" name="Grid 布局模式">
  <keywords>Grid 布局, Tailwind CSS, 网格布局, 响应式设计</keywords>
</metadata>

# 📐 Grid 布局模式

> 使用 Tailwind CSS 的 Grid 系统实现灵活的栅格布局

## 🎯 概述

Grid 布局是一种基于 CSS Grid 的现代布局模式，提供强大的二维布局能力，适用于复杂的内容组织和响应式设计。Tailwind 的 Grid 实现严格遵循官方定义，优先使用 `grid-cols-*` 配合 `grid-rows-*` 实现复杂布局。

## 🏗️ 基础布局模式

### 1. 三栏布局（标准网格）

```typescript
<div className="grid grid-cols-12 min-h-screen">
  <aside className="col-span-3 bg-gray-50 p-4">
    {/* 左侧边栏 */}
  </aside>
  <main className="col-span-6 bg-white p-4">
    {/* 主内容区 */}
  </main>
  <aside className="col-span-3 bg-gray-50 p-4">
    {/* 右侧边栏 */}
  </aside>
</div>
```

### 2. 响应式布局（推荐模式）

```typescript
<div className="grid grid-cols-1 md:grid-cols-12 min-h-screen">
  <header className="col-span-12 bg-white p-4">
    {/* 页头 */}
  </header>

  <aside className="col-span-1 md:col-span-3 order-2 md:order-1 bg-gray-50 p-4">
    {/* 侧边栏 - 移动端在主内容后，桌面端在左侧 */}
  </aside>

  <main className="col-span-1 md:col-span-6 order-1 md:order-2 bg-white p-4">
    {/* 主内容区 */}
  </main>

  <aside className="col-span-1 md:col-span-3 order-3 bg-gray-50 p-4">
    {/* 右侧边栏 */}
  </aside>

  <footer className="col-span-12 bg-white p-4">
    {/* 页脚 */}
  </footer>
</div>
```

### 3. 定义行高（进阶用法）

#### 使用固定行数

```typescript
<div className="grid grid-cols-12 grid-rows-3 min-h-screen">
  <header className="col-span-12 bg-white p-4">
    {/* 页头 */}
  </header>
  <main className="col-span-12 bg-white p-4 overflow-auto">
    {/* 主内容区 */}
  </main>
  <footer className="col-span-12 bg-white p-4">
    {/* 页脚 */}
  </footer>
</div>
```

#### 使用自定义行高（正确语法）

```typescript
<div className="grid grid-cols-12 grid-rows-[100px_1fr_100px] min-h-screen">
  <header className="col-span-12 bg-white p-4">
    {/* 固定高度页头 */}
  </header>

  <main className="col-span-12 bg-white p-4 overflow-auto">
    {/* 自适应高度主内容区 */}
  </main>

  <footer className="col-span-12 bg-white p-4">
    {/* 固定高度页脚 */}
  </footer>
</div>
```

#### 响应式行高

```typescript
<div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 md:grid-rows-3 min-h-screen">
  <header className="col-span-12 bg-white p-4">
    {/* 页头 */}
  </header>

  <aside className="col-span-1 md:col-span-3 bg-gray-50 p-4">
    {/* 侧边栏 */}
  </aside>

  <main className="col-span-1 md:col-span-9 bg-white p-4 overflow-auto">
    {/* 主内容区 */}
  </main>

  <footer className="col-span-12 bg-white p-4">
    {/* 页脚 */}
  </footer>
</div>
```

#### 使用 none 和 subgrid（高级用法）

```typescript
// 使用 grid-rows-none 隐藏行定义
<div className="grid grid-cols-12 grid-rows-none">
  {/* 所有子元素将按默认流式布局排列 */}
</div>

// 使用 grid-rows-subgrid 继承父级行定义
<div className="grid grid-cols-12 grid-rows-3">
  <div className="col-span-12">
    <div className="grid grid-cols-6 grid-rows-subgrid">
      {/* 子网格完全继承父级的 3 行定义 */}
    </div>
  </div>
</div>
```

## 🔧 核心类名指南

| 类名 | 作用 | 样式定义 | 示例 |
|------|------|----------|------|
| `grid` | 创建网格容器 | `display: grid` | `grid` |
| `grid-cols-{n}` | 定义列数 | `grid-template-columns: repeat(<n>, minmax(0, 1fr))` | `grid-cols-12` |
| `col-span-{n}` | 跨越列数 | `grid-column: span <n> / span <n>` | `col-span-6` |
| `grid-rows-{n}` | 定义等高行数 | `grid-template-rows: repeat(<n>, minmax(0, 1fr))` | `grid-rows-3` |
| `grid-rows-[<value>]` | 定义自定义行高 | `grid-template-rows: <value>` | `grid-rows-[100px_1fr_100px]` |
| `grid-rows-none` | 隐藏行定义 | `grid-template-rows: none` | `grid-rows-none` |
| `grid-rows-subgrid` | 继承父级行定义 | `grid-template-rows: subgrid` | `grid-rows-subgrid` |
| `gap-{size}` | 网格间距 | `gap: <size>` | `gap-4` |

## 💡 最佳实践

1. **保持一致性**：整个应用使用统一的网格系统（推荐12列）
2. **内容优先**：移动端优先设计，确保核心内容可读
3. **避免过度嵌套**：用一层网格替代多层嵌套布局
4. **响应式设计**：使用 `md:`, `lg:` 前缀处理不同屏幕尺寸
5. **行高控制**：
   - 使用 `grid-rows-{n}` 实现等高行布局（推荐）
   - 使用 `grid-rows-[<value>]` 实现弹性高度布局，例如 `grid-rows-[100px_1fr_100px]`
   - 使用 `grid-rows-none` 重置行定义
   - 使用 `grid-rows-subgrid` 实现嵌套网格行继承
   - 避免使用固定像素高度，优先使用 `auto` 和 `1fr`

---

<reference type="guidance">
- [Tailwind CSS Grid Documentation](https://tailwindcss.com/docs/grid-template-rows)
</reference>