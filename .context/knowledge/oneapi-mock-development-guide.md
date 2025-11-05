<metadata updated="2025-10-04" version="1.0" name="OneAPI Mock 开发指南">
  <keywords>OneAPI, Mock, 自动生成, 接口模拟, 服务文件, 前端开发, 后端联调, 开发流程</keywords>
</metadata>

# OneAPI 本地使用 Mock 数据开发指南

## 概述

OneAPI 是基于 API 描述信息的 API 开发整体解决方案，它可以通过解析后端的代码自动生成前端的 services 文件和 mock 数据。

## 核心功能

### 1. 自动生成代码

- **Services 文件**: 接口调用代码的一层封装
- **Mock 数据**: 当后端接口还未就绪时，前端可以构建假数据来开发

### 2. 接入方式

虽然理论上接入 OneAPI 不是必须的（services 和 mock 都可以自己编写），但是**强烈推荐接入**。

## 接入步骤

### 1. 创建 OneAPI 应用

- 参考 [OneAPI 的文档](https://yuque.antfin-inc.com/oneapi/doc/bigfish)
- 配合后端一起创建 OneAPI 的应用
- 创建完成后会得到一个 OneAPI 的应用名

### 2. 配置应用名

替换脚手架中默认内置的测试应用名：

```javascript
oneApi: {
  apps: [
    {
      name: 'afs2demo', // 这里替换为你的应用名
    },
  ],
},
```

### 3. 生成代码

在项目中执行：

```bash
tnpm run oneapi
```

即可自动生成 mock 数据和 service 代码。

## 开发模式

### 本地 Mock 数据开发

- 执行 `tnpm run dev`（背后是 `bigfish dev`）
- Bigfish 会启动本地调试服务，如 `http://127.0.0.1:8000`
- 页面中发出类似 `/api/xxx` 的请求时，请求实际会到达本地的调试服务器
- Bigfish 调试服务器会优先返回定义的 mock 数据

### 前后端联调

- 执行 `tnpm run devs`（背后是 `MOCK=none bigfish dev`）
- 本地调试服务器会忽略 mock 数据
- 读取 `proxy` 配置，把请求转发到配置的后端服务器
- 实现前后端联调

## 相关文档

- [Mock 数据配置文档](/docs/guides/mock)
- [Proxy 配置文档](/docs/api/config#proxy)
- [请求库使用文档](/docs/guides/request)

## 最佳实践

1. **优先接入 OneAPI**：虽然可以手动编写，但自动生成的代码更规范
2. **合理使用 Mock**：在后端接口未就绪时使用 mock 数据并行开发
3. **及时联调**：接口就绪后及时切换到联调模式验证功能
