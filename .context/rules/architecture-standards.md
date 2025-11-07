<metadata updated="2025-11-03" version="1.3.0" name="架构规范标准">
  <keywords>编码规范, 函数校验, 守卫语句, 层级优化, 架构分层, 命名约定, 高内聚, 低耦合, 组件设计</keywords>
</metadata>

## 核心设计原则

### 组件设计原则

项目遵循 **高内聚、低耦合** 的组件设计理念，确保组件职责清晰、维护性强：

#### 1. 高内聚原则
- **组件应实现完整业务功能**，避免将单个业务逻辑分散到多个组件
- **组件内部保持高度自治**，封装所有相关状态和操作
- **业务逻辑封装**：组件内部处理完整的业务流转，对外暴露简洁接口

#### 2. 低耦合原则
- **避免属性传递**：减少不必要的 props 传递，防止组件间过度依赖
- **通过 store 层解耦**：组件间通信优先通过状态管理库（如 zustand）
- **事件驱动通信**：跨组件交互使用事件机制而非直接引用

#### 3. 业务数据读写规范
- **组件内直接调用 store 接口**：涉及业务数据操作时，组件直接通过 store 层暴露的接口进行处理（如使用状态管理库）
- **避免中间层数据传递**：不通过父组件传递数据，直接通过 store 获取和更新
- **统一数据源**：所有业务数据统一通过 store 管理，确保数据一致性
- **灵活的状态管理**：可根据项目需要选择 zustand、Redux、Context API 等状态管理方案

**✅ 正确实践**

```typescript
// ✅ 组件内部直接调用 store
import { useLlmSampleStore } from '@/stores/llm-sample-store';

const SampleList: React.FC = () => {
  const { sampleSets, querySampleSets, deleteSampleSet } = useLlmSampleStore();

  // 直接通过 store 处理业务数据
  const handleDelete = async (id: string) => {
    await deleteSampleSet(id);
  };

  return (
    <div>
      <button onClick={() => querySampleSets()}>刷新数据</button>
      {sampleSets.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => handleDelete(item.id)}>删除</button>
        </div>
      ))}
    </div>
  );
};
```

**❌ 错误实践**

```typescript
// ❌ 通过 props 传递数据和回调
interface SampleListProps {
  sampleSets: SampleSet[];
  onRefresh: () => void;
  onDelete: (id: string) => void;
}

const SampleList: React.FC<SampleListProps> = ({ sampleSets, onRefresh, onDelete }) => {
  // 过度依赖 props 传递，导致组件耦合度高
  return (
    <div>
      <button onClick={onRefresh}>刷新数据</button>
      {sampleSets.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => onDelete(item.id)}>删除</button>
        </div>
      ))}
    </div>
  );
};
```

## 项目架构定义

### 架构分层原则

项目采用清晰的分层架构，各层职责明确分离，避免职责交叉: 

| 层级 | 目录位置 | 核心职责 | 禁止事项 |
| --- | --- | --- | --- |
| **应用层** | `src/pages/{页面名称}/` | 页面级业务逻辑组合、路由配置、权限控制 | ❌ 直接调用 API、❌ 处理 UI 状态、❌ |
| **视图层** | `src/components/` 或 `src/pages/{页面}/components/` | 组件渲染、用户交互、样式处理 | ❌ 包含业务逻辑、❌ 直接调用服务 |
| **状态层** | `src/stores/{业务名称}/` | 业务数据存储、数据变更、数据分发 | ❌ 存储 UI 状态、❌ 处理副作用 |
| **服务层** | `src/services/{业务名称}/` | API 接口定义、数据类型、错误处理 | ❌ 包含 UI 逻辑、❌ 处理业务状态 |

### 命名规范

项目统一采用**烤肉串命名法 (kebab-case)** 作为目录和文件的命名标准:

- **目录命名**: 使用小写字母和连字符的组合，如 `page-config`、`user-profile`
- **页面命名**: 使用小写字母和连字符的组合，如 `dashboard`、`page-editor`
- **组件命名**: 使用小写字母和连字符的组合，如 `base-component`、`data-table`
- **文件命名**: 使用小写字母和连字符的组合，如 `page-service.ts`、`user-interface.ts`

### 详细命名约定

为了确保代码的精确性和可维护性，所有命名必须遵循**领域-功能-类型**的精确命名模式，避免使用如 `data-management` 这样笼统、模糊的命名:

#### 命名场景区分

不同场景采用不同的命名规范，需严格区分：

- **文件和目录路径**: 使用 `kebab-case`，如 `llm-sample-manage/index.tsx`
- **React 组件名**: 使用 `PascalCase`，如 `const SampleList: React.FC`
- **TypeScript 接口/类型**: 使用 `PascalCase`，如 `interface SampleSet`、`type QueryResult`
- **React Hook**: 使用 `camelCase` + `use` 前缀，如 `useLlmSampleStore`
- **函数/变量名**: 使用 `camelCase`，如 `querySampleSets`、`deleteSampleSet`
- **CSS 类名**: 使用 Tailwind 原子类，如 `className="flex items-center justify-between"` 

#### 1. 文件命名规范
- **页面组件文件**: 使用 `kebab-case`，采用 `领域-功能` 结构，例如 `llm-sample-manage`（LLM领域-样本管理）而不是 `data-management`
- **服务文件**: 使用 `kebab-case`，采用 `领域-功能-service` 结构，例如 `llm-sample-service`
- **状态文件**: 使用 `kebab-case`，采用 `领域-功能-store` 结构，例如 `llm-sample-store`
- **类型定义文件**: 使用小写，例如 `interfaces.ts`、`types.ts`

#### 2. 页面路径规范
- **访问路径**: 使用 RESTful 风格的 **小写+连字符** 格式，如 `/llm/sample/manage`，注册在 config/routes.ts
- **文件路径**: 使用 `kebab-case`，例如 `/src/pages/llm-sample-manage`，体现领域-功能
- **路由配置**: 使用 `kebab-case`，例如 `llm-sample-manage`，与文件路径保持一致

> 📌 **路由映射说明**: 访问路径 `/llm/sample/manage` 对应路由配置 `llm-sample-manage`，在 `src/config/routes.ts` 中通过配置实现映射，前端路由地址为 RESTful 格式，后端代码标识为 kebab-case，两者保持语义一致。

#### 3. 接口定义规范
- **服务接口**: 使用业务语义，采用 `功能-service` 结构，例如 `llm-sample-service` 而不是 `i-data-service`
- **请求/响应类型**: 使用 `Request`/`Response` 后缀，采用 `功能-request/response` 结构，例如 `query-sample-sets-request`
- **业务实体**: 使用清晰业务名称，采用 `领域-实体` 结构，例如 `sample-set`、`sample-tag`

#### 4. 组件命名规范
- **页面组件**: 采用 `领域-功能` 结构，例如 `llm-sample-manage`
- **业务组件**: 采用 `功能-组件` 结构，例如 `sample-list`、`sample-upload`、`sample-tag-editor`
- **UI组件**: 保持所选UI库的命名规范，例如 `table`、`form`、`button`

#### 5. 方法命名规范
- **查询操作**: `query` 前缀，采用 `query-功能` 结构，例如 `query-sample-sets`
- **创建操作**: `create` 前缀，采用 `create-功能` 结构，例如 `create-sample-set`
- **更新操作**: `update` 前缀，采用 `update-功能` 结构，例如 `update-sample-set`
- **删除操作**: `delete` 前缀，采用 `delete-功能` 结构，例如 `delete-sample-set`

### 目录结构规范

```
src/
├── pages/                 # 应用层 - 页面级组件（可选）
│   ├── llm-sample-manage/   # 应用层 - LLM领域-样本管理（文件路径: kebab-case）
│   │   ├── index.tsx      # 页面主组件
│   │   └── components/    # 页面私有组件（可选）
├── components/           # 视图层 - 公共组件
│   ├── base-component/
│   │   ├── index.tsx     # 组件实现
│   │   ├── index.md      # 组件文档（可选）
│   │   └── index.test.tsx # 组件测试（可选）
├── stores/              # 状态层 - 业务状态管理（可选）
│   ├── llm-sample-store/  # 状态层 - LLM领域-样本管理（文件路径: kebab-case）
│   │   ├── index.ts      # 状态实现
│   │   └── interfaces.ts # 类型定义
├── services/            # 服务层 - 数据接口（可选）
│   ├── llm-sample-service/  # 服务层 - LLM领域-样本管理（文件路径: kebab-case）
│   │   ├── index.ts      # 服务实现
│   │   └── interface.ts  # 类型定义
├── hooks/               # 自定义Hooks（可选）
├── utils/               # 工具函数（可选）
└── types/               # 全局类型定义（可选）
```


### 编码风格规范

- **缩进**: 2个空格，禁止使用Tab
- **导入导出**: 使用ES6模块语法，避免默认导出
- **类型定义**: 类型定义单独文件, 避免使用 as 关联类型
- **文件控制**: 单个文件不超过300行，复杂模块独立封装
- **变量声明**: 必要才声明，避免无用中间变量
- **流程处理**: 简化业务逻辑，避免复杂嵌套和状态
- **设计模式**: 仅在解决复杂问题时引入设计模式，默认保持代码直白
- **异步事务**: 优先使用promise串联事务,避免使用async await 以及 try catch
- **性能优化**: 不预先优化，按需实现性能改进

#### 空值安全操作

> 为避免冗余的 `if (arr)` 或 `if (str)` 判断，所有可能为 `null`/`undefined` 的值，在进行数组/字符串操作前，必须使用安全默认值进行预处理，实现链式调用，提升代码简洁性和可读性。

✅ **正确做法**

```typescript
// ✅ 数组安全映射：确保返回数组，避免 null/undefined 导致错误
const targetArr = (someArray || []).map(item => item.value).filter(item => item.id === myId);

// ✅ 字符串安全替换：确保操作目标为字符串，避免空值错误
const targetStr = (fromStr || '').replace('$placeholder', value);

// ✅ 多级嵌套场景
const displayName = (user?.profile?.name || '未知用户').trim();
```

❌ **禁止做法**

```typescript
// ❌ 冗余判断：增加代码复杂度
let targetArr = [];
if (someArray) {
  targetArr = someArray.map(item => item.value).filter(item => item.id === myId);
}

// ❌ 直接操作可能为空的值，运行时崩溃风险
const targetStr = fromStr.replace('$placeholder', value); // 如果 fromStr 为 null，直接报错

// ❌ 多层空值检查，破坏可读性
if (user && user.profile && user.profile.name) {
  const displayName = user.profile.name.trim();
}
```

#### 函数校验与层级优化原则

**核心原则**: 函数需要校验时，优先处理异常状态并立即返回，避免深度嵌套的if-else结构。

**✅ 正确做法** - 守卫语句模式 (Guard Clauses)

```typescript
// ✅ 示例: 业务逻辑处理 - 分层返回
function processOrder(order: Order): ProcessResult {
  // 第一层: 状态校验
  if (order.status !== OrderStatus.PENDING) {
    return { success: false, error: `订单状态${order.status}无法处理` };
  }

  // 第二层: 库存校验
  const inventoryCheck = validateInventory(order.items);
  if (!inventoryCheck.valid) {
    return { success: false, error: inventoryCheck.error };
  }

  // 第三层: 支付校验
  const paymentResult = processPayment(order);
  if (!paymentResult.success) {
    return { success: false, error: paymentResult.error };
  }

  // 所有检查通过，执行业务逻辑
  const result = executeOrderProcessing(order);
  return { success: true, data: result };
}
```

**❌ 禁止做法** - 深层嵌套模式

```typescript
// ❌ 错误示例: 多重状态耦合
function processComplexOrder(order: Order): ProcessResult {
  if (order.status === OrderStatus.PENDING) {
    const inventoryCheck = validateInventory(order.items);
    if (inventoryCheck.valid) {
      const paymentResult = processPayment(order);
      if (paymentResult.success) {
        const result = executeOrderProcessing(order);
        return { success: true, data: result };
      } else {
        return { success: false, error: paymentResult.error };
      }
    } else {
      return { success: false, error: inventoryCheck.error };
    }
  } else {
    return { success: false, error: `订单状态${order.status}无法处理` };
  }
}
```

#### 层级优化技术要点

1. **守卫语句优先**: 将异常状态和边界条件处理放在函数开头
2. **单一职责原则**: 每个函数只负责一个层次的校验或处理
3. **提前返回**: 发现无效状态立即返回，避免进入深层逻辑
4. **明确返回值**: 每个分支都有明确的返回值，避免状态累积
5. **可读性优先**: 代码应该从上到下清晰展示逻辑流程

### 跨层调用规范

- **单向依赖**: 应用层 → 状态层 → 服务层
- **禁止反向调用**: 下层不能依赖上层
- **事件传递**: 通过回调函数或事件总线进行跨层通信

## 接口研发

### 接口设计和开发

1. 接口应该放在 src/services 目录下。
2. 接口新增前，检索当前项目的类似接口，如果功能重合度高，给出复用建议。
3. 接口新增时，需要明确功能范围，入参出参类型，异常情况默认返回 Error 对像。
4. 接口功能应当符合接口隔离原则，不同功能应该定义不同的接口，即使后端调用实现的代码相似，也应该独立封装。
5. 接口命名应该是动宾短语，动词使用 get/update/add/switch 来进行数据读写操作，读操作保持幂等。
6. 接口功能实现，必须是函数，不能有 UI 相关的实现。

### 数据类型置信度优先级规范

为了保证数据类型的一致性和准确性，项目采用以下数据类型置信度优先级体系: 

#### 置信度优先级（从高到低）

1. **后端技术文档** 〖最高置信度〗
   - 后端 API 接口文档中的类型定义
   - 数据模型设计文档中的类型描述
   - 数据库表结构定义

2. **服务层代码定义** 〖高置信度〗
   - `src/services/{模块}/interface.ts` 中的类型定义
   - 服务层接口请求/响应类型
   - 服务层数据转换逻辑

3. **状态层数据定义** 〖中置信度〗
   - `src/stores/{模块}/interfaces.ts` 中的类型定义
   - 状态层内部使用的数据类型
   - 状态更新逻辑中的类型断言

4. **应用层类型定义** 〖低置信度〗
   - 页面组件中的临时类型定义
   - UI 组件的数据适配类型

#### 类型使用规范

**✅ 正确做法**

- 数据模型应该直接使用服务层导出的类型
- 状态层应导入服务层的类型定义
- 应用层应使用状态层定义的数据类型

```typescript
// ✅ 正确示例 - 直接使用服务层导出类型
import type { SampleSet } from '@/services/llm-sample-manage/interface';
import type { QueryResult } from '@/services/llm-sample-manage/interface';

// ✅ 状态层使用服务层类型
export interface LlmSampleManageState {
  sampleSets: SampleSet[];
  queryResult: QueryResult;
}
```

**❌ 禁止做法**

- 避免使用 `as` 进行类型断言，除非必要情况
- 避免在不同层级重复定义相同的数据类型
- 禁止在应用层定义与后端数据结构不符的类型

```typescript
// ❌ 错误示例 - 重复定义类型
interface LocalSampleSet {  // 应该直接使用服务层的SampleSet
  id: string;
  name: string;
}

// ❌ 错误示例 - 不必要的类型断言
const data = response.data as unknown as SampleSet;  // 避免这种用法
```

#### 最佳实践

1. **统一源头**: 所有数据类型应基于服务层定义
2. **类型传播**: 从服务层 → 状态层 → 应用层单向传播
3. **避免重复**: 同一个业务实体不应有多个类型定义
4. **类型一致性**: 确保前端类型与后端数据结构严格对应

## 组件研发

### 组件拆分原则

项目组件拆分遵循以下三个核心原则，确保组件职责清晰、高内聚：

#### 1. 跨场景复用业务组件原则

**适用场景**：针对可以跨场景复用的业务组件
**实施方式**：
- 优先复用现有组件，其次创建公共组件
- 放入 `src/components` 目录，确保高内聚和数据读写能力
- 必须编写详细的使用文档和示例
**案例**：用户选择器、地理位置选择器等通用业务组件

#### 2. 高内聚独立业务模块原则

**适用场景**：针对可以高内聚独立运行的业务模块
**实施方式**：
- 提取成独立的业务模块
- 直接引用相关 store 能力进行操作，避免过度传递 props
- 模块内部保持完整的数据处理能力
**案例**：业务数据的新增、编辑弹窗等独立功能模块

#### 3. 应用层布局控制原则

**适用场景**：针对整体布局和生命周期控制的内容
**实施方式**：
- 放在应用层页面主入口进行统一管理
- 尽可能避免传递组件属性，优先组件内读写 store
- 保持页面级别的整体控制能力
**案例**：整体布局、主要模块、简单页面的 ProTable 渲染

### 组件复用和维护

1. 组件目录中 index.md 是对组件的功能，职责边界，上游依赖
2. 开发新业务功能时，检索所有 src/components 公共组件目录，以及当前页面目录下 components 私有组件目录中的 index.md，根据描述判断是否复用组件
3. 当复用某个组件时，检索组件的 index.md index.test.ts 文件，参考测试用例的方式，调用对应代码
4. 组件目录中的 index.tsx 是组件的主体，根据组件参数的语义描述，判断应该传递什么参数

### 组件设计和开发

1. 公共组件新增时，需要检索当前项目的类似组件，如果功能重合度高，暂停开发并且给出复用建议
2. 公共组件开发和更新时，需要检查更新 index.md 描述组件的功能，职责边界，上游依赖
3. 公共组件开发和更新时，需要检查更新 index.tsx 组件属性的类型定义和属性的语义描述
4. 公共组件开发和更新时，需要检查更新 index.test.ts 枚举不同参数组合的调用案例

## 样式研发

样式实现完全遵循 Tailwind CSS 方案，所有样式通过 Tailwind 类名实现

### 样式实现规范:

1. **强制使用 Tailwind CSS**: 所有样式通过 Tailwind 原子类实现，禁止使用 CSS Modules 或 CSS-in-JS 方案
2. **样式定义**: 直接在组件中使用 className 属性，通过 Tailwind 类名定义样式
3. **主题支持**:
   - 使用 Tailwind 内置的主题系统进行配置
   - 通过 tailwind.config.js 文件扩展自定义主题
   - 利用 Tailwind 的 variant 前缀实现状态样式
4. **响应式设计**: 使用 Tailwind 响应式前缀实现，如 `md:`, `lg:`, `xl:`
5. **自定义样式**: 仅有在 Tailwind 无法满足的特殊需求时，才考虑扩展 Tailwind 配置

---

## 路由和导航规范

### 路由相关导入

✅ **正确做法**

根据项目使用的路由系统选择相应的获取方式：

- 使用声明式路由配置的参数获取方式：`import type { Route } from "./+types/team";` 和 `loader({ params }: Route.LoaderArgs)`
- 使用文件系统路由的参数获取方式
- 其他路由实现方式：参考相应文档

❌ **禁止做法**

- 混用不同路由库的API
- 直接操作浏览器历史记录而不使用路由系统提供的API
- 使用 `react-router-dom` 相关的导入和 Hook（项目不使用该库）
