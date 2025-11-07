<metadata updated="2025-11-07" version="1.0.0" name="React Router 配置指南中文版">
  <keywords>React Router, 路由配置, 嵌套路由, 动态段, 索引路由, 布局路由</keywords>
</metadata>

# React Router 配置指南

## 配置路由

路由在 `app/routes.ts` 中配置。每个路由有两个必需部分：用于匹配 URL 的 URL 模式，以及定义其行为的路由模块的文件路径。

```tsx
import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("some/path", "./some/file.tsx"),
  // 模式 ^           ^ 模块文件
] satisfies RouteConfig;
```

以下是一个更大的路由配置示例：

```tsx
import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("./home.tsx"),
  route("about", "./about.tsx"),

  layout("./auth/layout.tsx", [
    route("login", "./auth/login.tsx"),
    route("register", "./auth/register.tsx"),
  ]),

  ...prefix("concerts", [
    index("./concerts/home.tsx"),
    route(":city", "./concerts/city.tsx"),
    route("trending", "./concerts/trending.tsx"),
  ]),
] satisfies RouteConfig;
```

如果您希望通过文件命名约定而不是配置来定义路由，`@react-router/fs-routes` 包提供了文件系统路由约定。您甚至可以组合不同的路由约定：

```tsx
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

## 路由模块

`routes.ts` 中引用的文件定义了每个路由的行为：

```tsx
route("teams/:teamId", "./team.tsx"),
//           路由模块 ^^^^^^^^
```

以下是示例路由模块：

```tsx
// 提供类型安全/推断
import type { Route } from "./+types/team";

// 向组件提供 `loaderData`
export async function loader({ params }: Route.LoaderArgs) {
  let team = await fetchTeam(params.teamId);
  return { name: team.name };
}

// 在加载器完成后渲染
export default function Component({
  loaderData,
}: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}
```

路由模块具有更多功能，如 actions、headers 和错误边界，但这些将在下一个指南中介绍：路由模块

## 嵌套路由

路由可以嵌套在父路由内部。

```tsx
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

父路由的路径自动包含在子路由中，因此此配置创建了 "/dashboard" 和 "/dashboard/settings" URL。

子路由通过父路由中的 `<Outlet/>` 渲染。

```tsx
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* 将是 home.tsx 或 settings.tsx */}
      <Outlet />
    </div>
  );
}
```

## 根路由

`routes.ts` 中的每个路由都嵌套在特殊的 `app/root.tsx` 模块内。

## 布局路由

使用 `layout`，布局路由为其子路由创建新的嵌套，但不向 URL 添加任何段。这类似于根路由，但可以在任何级别添加。

```tsx
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

请注意：

- `home.tsx` 和 `contact.tsx` 将在不创建任何新 URL 路径的情况下渲染到 `marketing/layout.tsx` 的 outlet 中
- `project.tsx` 和 `edit-project.tsx` 将在 `/projects/:pid` 和 `/projects/:pid/edit` 处渲染到 `projects/project-layout.tsx` 的 outlet 中，而 `projects/home.tsx` 不会。

## 索引路由

```tsx
index(componentFile),
```

索引路由在其父路由的 URL 处渲染到其父路由的 Outlet 中（类似于默认子路由）。

```tsx
import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  // 在 / 处渲染到 root.tsx 的 Outlet 中
  index("./home.tsx"),
  route("dashboard", "./dashboard.tsx", [
    // 在 /dashboard 处渲染到 dashboard.tsx 的 Outlet 中
    index("./dashboard-home.tsx"),
    route("settings", "./dashboard-settings.tsx"),
  ]),
] satisfies RouteConfig;
```

请注意索引路由不能有子路由。

## 路由前缀

使用 `prefix`，您可以为一组路由添加路径前缀，而无需引入父路由。

```tsx
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

请注意，这不向路由树引入新路由。而是仅修改其子路由的路径。

例如，这两组路由是等效的：

```tsx
// 这种使用 `prefix` 的方式...
prefix("parent", [
  route("child1", "./child1.tsx"),
  route("child2", "./child2.tsx"),
])

// ...等同于：
[
  route("parent/child1", "./child1.tsx"),
  route("parent/child2", "./child2.tsx"),
]
```

## 动态段

如果路径段以 `:` 开头，则它成为"动态段"。当路由匹配 URL 时，动态段将从 URL 解析，并作为参数提供给其他路由器 API。

```tsx
route("teams/:teamId", "./team.tsx"),
```

```tsx
import type { Route } from "./+types/team";

export async function loader({ params }: Route.LoaderArgs) {
  //                           ^? { teamId: string }
}

export default function Component({
  params,
}: Route.ComponentProps) {
  params.teamId;
  //        ^ string
}
```

您可以在一个路由路径中有多个动态段：

```tsx
route("c/:categoryId/p/:productId", "./product.tsx"),
```

```tsx
import type { Route } from "./+types/product";

async function loader({ params }: LoaderArgs) {
  //                    ^? { categoryId: string; productId: string }
}
```

## 可选段

您可以通过在段末尾添加 `?` 来使路由段变为可选。

```tsx
route(":lang?/categories", "./categories.tsx"),
```

您也可以有可选的静态段：

```tsx
route("users/:userId/edit?", "./user.tsx");
```

## 通配符段

也称为"catchall"和"star"段。如果路由路径模式以 `/*` 结尾，它将匹配 `/` 后的任何字符，包括其他 `/` 字符。

```tsx
route("files/*", "./files.tsx"),
```

```tsx
export async function loader({ params }: Route.LoaderArgs) {
  // params["*"] 将包含 files/ 后剩余的 URL
}
```

您可以解构 `*`，只需为其分配一个新名称。一个常见的名称是 `splat`：

```tsx
const { "*": splat } = params;
```

您也可以使用通配符来捕获不匹配任何路由的请求：

```tsx
route("*", "./catchall.tsx"); // catchall 路由
```

```tsx
export function loader() {
  throw new Response("Page not found", { status: 404 });
}
```

## 组件路由

您也可以使用匹配 URL 的组件在组件树中的任何位置渲染元素：

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

请注意，这些路由不参与数据加载、actions、代码分割或任何其他路由模块功能，因此它们的使用场景比路由模块的使用场景更有限。

下一步：路由模块

<reference type="guidance">
- `.context/knowledge/react-router.md` # 英文原文
- `technical-solution-routing.md` # 基于此文档的技术方案
</reference>