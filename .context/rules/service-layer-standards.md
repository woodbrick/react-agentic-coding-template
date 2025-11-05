# 服务层研发规范

服务层是应用的数据接口层，负责**接口定义、数据类型定义、业务逻辑封装**，为状态层提供统一的数据访问能力。

## 1. 服务层职责定义

### 1.1 核心职责

| 职责类别     | 具体内容                       | 示例                        |
| ------------ | ------------------------------ | --------------------------- |
| **接口定义** | 定义所有服务端接口调用         | `queryPageConfig()`         |
| **类型定义** | 定义接口参数和返回数据类型     | `interface ReqPageConfig interface ResPageConfig` |
| **接口隔离** | 原子化操作接口, 如果后端原始实现单个接口包含多个作用,服务层拆解成独立的接口 |           |

### 1.2 边界原则

- **纯接口封装**: 只处理数据请求和响应
- **无 UI 依赖**: 不包含任何 UI 相关逻辑
- **类型安全**: 完整的 TypeScript 类型定义
- **错误处理**: 统一的错误处理机制

## 2. 接口实现模式规范

### 2.1 实现模式要求

**文件名目录应为 xxxService**，所有服务函数导出为一个领域对象，比如 LlmSceneService，对象包含多个请求函数，但是自身是无状态的。


#### ✅ 正确的实现方式（推荐）
src/services/llmSceneService/index.ts
```typescript
// ✅ 导出无状态的领域对象
/**
 * 场景管理服务
 */
export const LlmSceneService = {
  /**
   * 查询场景列表
   */
  querySceneList: async (params: IReqQuerySceneList): Promise<IResQuerySceneList> => {
    return await requestSafe('/api/dataops/eval/querySceneList', {
      method: 'POST',
      params
    });
  },

  /**
   * 创建场景
   */
  createScene: async (params: IReqCreateScene): Promise<IResCreateScene> => {
    return await requestSafe('/api/dataops/eval/createScene', {
      method: 'POST',
      params
    });
  },
};
```

### 2.3 接口开发流程

1. **需求分析**: 明确接口功能范围和使用场景
2. **接口检索**: 检查现有接口，避免重复开发
3. **类型定义**: 定义完整的请求参数和响应类型
4. **接口实现**: 编写接口调用函数
5. **错误处理**: 实现统一的错误处理机制
6. **Mock 数据**: 创建对应的 Mock 数据

### 2.4 接口设计原则

- **接口隔离原则**: 不同功能定义不同接口，即使后端单个接口承担了多种职责
- **命名规范**: 动宾短语，动词使用 `get/query/update/add/delete/switch`
- **幂等性**: 读操作保持幂等，写操作明确标识
- **纯函数**: 接口实现必须是函数，禁止 UI 相关代码

### 2.5 接口分类与命名

| 接口类型 | 命名规范 | 示例 | HTTP 方法 | 幂等性 |
| --- | --- | --- | --- | --- |
| **查询类** | `query{资源名}` | `queryPageConfig` | POST | ✅ |
| **获取类** | `get{资源名}` | `getUserDetail` | POST | ✅ |
| **创建类** | `create{资源名}` | `createPageConfig` | POST | ❌ |
| **更新类** | `update{资源名}` | `updatePageConfig` | POST | ✅ |
| **删除类** | `delete{资源名}` | `deletePageConfig` | POST | ✅ |
| **批量操作** | `batch{操作}{资源名}` | `batchDeletePages` | POST | ❌ |

### 2.6 异常处理规范

- **默认返回**: 异常情况统一返回 `Error` 对象
- **错误分类**: 区分网络错误、业务错误、系统错误
- **错误信息**: 提供清晰的错误描述和调试信息

## 3. 目录结构规范

### 3.1 目录位置

```
src/services/{业务模块名称}/
├── index.ts          # API服务实现（直接导出独立函数）
├── interface.ts      # 接口类型定义（包含请求参数、响应数据、业务实体类型）
└── utils.ts          # 服务工具函数
```

Mock 数据目录应独立于服务层，位于项目根目录: 

```
mock/
├── {业务模块名称}/
│   └── index.ts      # Mock 接口定义
└── ...
```

### 3.2 命名规范

- **目录名**: PascalCase，如 `PageConfigEditor`
- **文件名**: PascalCase，如 `PageService.ts`
- **函数名**: 动宾短语，如 `queryPageConfig`、`savePageData`
- **类型名**: PascalCase，如 `PageQueryParams`

## 4. 接口设计规范

### 4.1 接口分类

| 接口类型   | 命名规范  | 示例               | 幂等性 |
| ---------- | --------- | ------------------ | ------ |
| **查询类** | `query*`  | `queryPageConfig`  | ✅     |
| **创建类** | `create*` | `createPageConfig` | ❌     |
| **更新类** | `update*` | `updatePageConfig` | ✅     |
| **删除类** | `delete*` | `deletePageConfig` | ✅     |

### 4.2 接口设计原则

- **查询接口**: 使用 POST 方法，支持复杂查询参数
- **保存接口**: 包含时间戳等元数据
- **批量操作**: 支持数组参数，返回操作结果
- **函数式实现**: 所有接口必须为独立函数，禁止使用类和工厂模式

## 5. 类型定义规范

### 5.1 类型定义要求

- **请求参数**: 定义完整的请求参数接口，使用 `IReq` 前缀
- **返回数据**: 定义完整的响应数据接口，使用 `IRes` 前缀
- **业务数据**: 定义清晰的业务实体类型
- **接口隔离**: 每个服务接口应有独立的请求和响应类型
- **无异常处理**: 服务层接口**不包含任何异常处理逻辑**，所有错误由调用方处理

### 5.2 命名规范与参数约定

**函数参数命名规范**:
- **ALWAYS** 使用统一的参数名称为 `params`，保持参数命名一致性
- **NEVER** 使用其他名称如 `options`、`data`、`body` 等

**接口命名规范**:
所有服务层接口必须使用以下命名规范：
- **请求参数接口**: `IReq{接口名}` (如 `IReqCreateScene`)
- **响应数据接口**: `IRes{接口名}` (如 `IResCreateScene`)
- **业务实体类型**: 使用 PascalCase (如 `EvalSceneModel`)

**请求/响应接口设计原则**:
- 每个接口独立定义请求和响应类型，禁止复用
- 响应类型只包含业务数据，不包含通用包装结构（即返回类型是 T，而非 CommonResult<T>）
- 请求和响应接口必须精确对应后端接口定义

**服务层与状态层边界**:
- 服务层**仅负责**数据请求和响应
- 服务层**不包含**任何业务逻辑、错误处理、状态管理
- 服务层**直接依赖**`requestSafe`工具函数，不直接使用`request`或其他HTTP客户端

**服务层调用规范**:
- 状态层通过调用服务层函数获取数据
- 服务层函数返回值即为业务数据，不包含`success`、`message`等包装属性
- 所有异常处理在状态层或组件层进行
- 服务层函数实现必须是纯函数，无副作用


## 6. 错误处理规范

### 6.1 错误处理原则

- **服务层无异常处理**: 服务层接口**禁止**包含任何异常处理逻辑（try-catch、错误转换、日志记录等）
- **接口暴露原始错误**: 所有错误直接从`requestSafe`抛出，保持错误原始形态
- **错误信息保留**: 保留`requestSafe`抛出的原始错误信息，禁止在服务层进行任何错误信息修改或包装
- **调用方负责**: 服务层调用方（状态层/组件层）负责处理所有错误情况并提供用户友好的错误提示

## 7. Mock 方案

### 7.1 Mock 目录结构

Mock 数据目录应独立于服务层，位于项目根目录:

```
mock/
├── {业务模块名称}/     # 按业务模块组织Mock数据
│   └── index.ts        # Mock接口定义文件
└── ...
```
