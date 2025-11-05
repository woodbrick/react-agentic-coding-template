# React Router 路由使用规范

> 本规范适用于基于React Router的前端路由配置，用于指导项目中路由的统一实现方式。

## 1. 路由配置基础

路由配置通过 `app/routes.ts` 文件进行，每个路由包含两个核心部分：

- **URL模式**: 匹配URL路径的模式
- **模块文件路径**: 定义路由行为的组件文件路径

### 基础路由配置示例

```typescript
import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("some/path", "./some/file.tsx"),
  // URL模式 ^           ^ 模块文件
] satisfies RouteConfig;
```

## 2. 路由模块（Route Modules）

路由模块是定义路由行为的组件文件，包含数据加载、渲染等逻辑。

### 路由模块示例

```typescript
// 提供类型安全和推断
import type { Route } from "./+types/team";

// 数据加载函数
export async function loader({ params }: Route.LoaderArgs) {
  let team = await fetchTeam(params.teamId);
  return { name: team.name };
}

// 渲染组件
export default function Component({
  loaderData,
}: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}
```

## 3. 嵌套路由（Nested Routes）

路由可以嵌套在父路由中，子路由会自动继承父路由的路径。

### 嵌套路由配置示例

```typescript
import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  // 父路由
  route("dashboard", "./dashboard.tsx", [
    // 子路由
    index("./home.tsx"),
    route("settings", "./settings.tsx"),
  ]),
] satisfies RouteConfig;
```

### 嵌套路由渲染

子路由通过父组件中的 `<Outlet />` 组件进行渲染：

```tsx
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* 将渲染 home.tsx 或 settings.tsx */}
      <Outlet />
    </div>
  );
}
```

## 4. 根路由（Root Route）

所有路由都嵌套在特殊的 `app/root.tsx` 模块中，它是应用程序的根组件。

## 5. 布局路由（Layout Routes）

布局路由创建子路由的嵌套结构，但不会在URL中添加新的路径段。

### 布局路由配置示例

```typescript
import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./marketing/layout.tsx", [
    index("./marketing/home.tsx"),
    route("contact", "./marketing/contact.tsx"),
  ]),
  ...prefix("projects", [
    index("./projects/home.tsx"),
    layout("./projects/project-layout.tsx", [
      route(":pid", "./projects/project.tsx"),
      route(":pid/edit", "./projects/edit-project.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
```

**注意**：
- `home.tsx` 和 `contact.tsx` 会被渲染到 `marketing/layout.tsx` 的 `<Outlet />` 中，URL路径保持不变
- `project.tsx` 和 `edit-project.tsx` 会被渲染到 `projects/project-layout.tsx` 的 `<Outlet />` 中，URL路径为 `/projects/:pid` 和 `/projects/:pid/edit`

## 6. 索引路由（Index Routes）

索引路由在父路由的URL路径下渲染，相当于默认子路由。

### 索引路由配置示例

```typescript
import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  // 渲染到根路由的 <Outlet /> 中，URL为 /
  index("./home.tsx"),
  route("dashboard", "./dashboard.tsx", [
    // 渲染到 dashboard.tsx 的 <Outlet /> 中，URL为 /dashboard
    index("./dashboard-home.tsx"),
    route("settings", "./dashboard-settings.tsx"),
  ]),
] satisfies RouteConfig;
```

**注意**：索引路由不能有子路由。

## 7. 路由前缀（Route Prefixes）

使用 `prefix` 可以为一组路由添加路径前缀，而不需要引入父路由。

### 路由前缀配置示例

```typescript
import {
  type RouteConfig,
  route,
  layout,
  index,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("./marketing/layout.tsx", [
    index("./marketing/home.tsx"),
    route("contact", "./marketing/contact.tsx"),
  ]),
  ...prefix("projects", [
    index("./projects/home.tsx"),
    layout("./projects/project-layout.tsx", [
      route(":pid", "./projects/project.tsx"),
      route(":pid/edit", "./projects/edit-project.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
```

**注意**：
- `prefix("parent", [route("child1", "./child1.tsx"), route("child2", "./child2.tsx"])`
- 等价于：`[route("parent/child1", "./child1.tsx"), route("parent/child2", "./child2.tsx")]`

## 8. 动态段（Dynamic Segments）

路径段以 `:` 开头时成为动态段，会从URL中解析并作为参数提供给其他路由API。

### 动态段配置示例

```typescript
route("teams/:teamId", "./team.tsx"),
```

```typescript
import type { Route } from "./+types/team";

export async function loader({ params }: Route.LoaderArgs) {
  // params: { teamId: string }
}

export default function Component({
  params,
}: Route.ComponentProps) {
  params.teamId; // string 类型
}
```

### 多个动态段示例

```typescript
route("c/:categoryId/p/:productId", "./product.tsx"),
```

```typescript
async function loader({ params }: Route.LoaderArgs) {
  // params: { categoryId: string; productId: string }
}
```

## 9. 可选段（Optional Segments）

通过在段末添加 `?` 可以使路由段变为可选。

### 可选段配置示例

```typescript
route(":lang?/categories", "./categories.tsx"),
```

```typescript
route("users/:userId/edit?", "./user.tsx"),
```

## 10. 通配符段（Splats）

通配符段（又称"catchall"或"star"段）以 `/*` 结尾，会匹配 `/` 之后的所有字符，包括其他 `/` 字符。

### 通配符段配置示例

```typescript
route("files/*", "./files.tsx"),
```

```typescript
export async function loader({ params }: Route.LoaderArgs) {
  // params["*"] 包含 files/ 之后的所有URL路径
}
```

### 解构通配符

```typescript
const { "*": splat } = params;
```

### 捕获所有未匹配路由

```typescript
route("*", "./catchall.tsx"); // 捕获所有未匹配的路由
```

```typescript
export function loader() {
  throw new Response("Page not found", { status: 404 });
}
```

## 11. 组件路由（Component Routes）

可以使用组件在组件树的任何位置匹配URL到元素：

```tsx
import { Routes, Route } from "react-router";

function Wizard() {
  return (
    <div>
      <h1>Some Wizard with Steps</h1>
      <Routes>
        <Route index element={<StepOne />} />
        <Route path="step-2" element={<StepTwo />} />
        <Route path="step-3" element={<StepThree />} />
      </Routes>
    </div>
  );
}
```

**注意**：这些路由不参与数据加载、动作、代码拆分或其他路由模块功能，适用场景有限。

## 12. 文件系统路由

如果希望使用文件命名约定而不是显式配置来定义路由，可以使用 `@react-router/fs-routes` 包：

```typescript
import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default [
  route("/", "./home.tsx"),
  ...(await flatRoutes()),
] satisfies RouteConfig;
```

> 甚至可以结合不同的路由约定方式。

<metadata updated="2025-11-05" version="2.0" name="React Router 路由使用规范">
  <keywords>React Router, 路由配置, 嵌套路由, 动态路由, 前缀路由, 文件系统路由, 路由模块, React</keywords>
</metadata>