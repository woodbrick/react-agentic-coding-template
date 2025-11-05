# 📂 Examples 目录索引与使用指南

<metadata updated="2025-11-03" version="1.1.0" name="Examples目录索引指南">
  <keywords>示例索引, 最佳实践, 维护规范, 案例管理, 开发指南</keywords>
</metadata>

> 本目录包含项目中的最佳实践示例，供开发人员参考和复用。所有示例均遵循项目规范，是项目架构、组件、服务和状态管理的规范化实现范本。

## 📁 目录结构

```
.examples/
├── component-patterns/          # 组件模式示例
├── service-patterns/            # 服务模式示例
├── state-patterns/              # 状态管理示例
├── types-patterns/              # 类型定义示例
├── layout-patterns/             # 布局模式示例
└── antd-pro-patterns/           # Ant Design Pro 模式示例
```

## 📚 分类说明

### 1. 组件模式 (component-patterns)
- 提供标准组件的实现范本
- 包括基础组件、业务组件和封装组件
- 遵循 Ant Design 5.x 规范
- 所有组件都使用 TypeScript 和 Less + Tailwind 样式
- 示例：
  - `base-component.md`：基础组件结构规范
  - `base-button.md`：标准按钮组件实现
  - `business-user-card.md`：业务场景用户卡片组件

### 2. 服务模式 (service-patterns)
- 提供 API 服务层的最佳实现
- 遵循 BigFish 框架服务规范
- 包含错误处理、数据包装和统一接口
- 示例：
  - `common-service.md`：通用服务模式
  - `error-handling-best-practices.md`：错误处理最佳实践
  - `mock-data-configuration.md`：Mock 数据配置规范

### 3. 状态模式 (state-patterns)
- 提供 Zustand 状态管理的最佳实践
- 遵循切片模式和类型安全规范
- 包含复杂状态管理方案
- 示例：
  - `page-editor-state-management.md`：页面编辑器状态管理

### 4. 类型模式 (types-patterns)
- 提供类型定义的最佳实践
- 包含接口、类型别名和泛型使用
- 示例：
  - `types-patterns.md`：类型定义指南
  - `index.ts`：类型导出入口

### 5. 布局模式 (layout-patterns)
- 提供页面布局的标准化解决方案
- 包含响应式设计和常见布局模式
- 示例：
  - `page-common-patterns.md`：页面基础模板（整合 PageContainer、面包屑导航和业务组件状态管理）
  - `grid-layout.md`：网格布局实现

### 6. Ant Design Pro 模式 (antd-pro-patterns)
- 提供 Ant Design Pro 组件的规范使用
- 包含 ProTable、ProForm 等组件的最佳实践
- 示例：
  - `pro-table.md`：ProTable 组件使用规范
  - `pro-form.md`：ProForm 组件使用规范

## 🚀 使用规范

### 使用原则
- **ALWAYS** 参考对应示例作为开发起点
- **ALWAYS** 遵循示例中的命名规范和结构
- **NEVER** 在生产代码中直接复制示例代码而不理解其原理
- **ALWAYS** 保持示例与项目规范同步更新

### 文件命名规范
- 使用小写+连字符格式（kebab-case）
- 所有文件使用英文标点符号
- 文件扩展名为 `.md`

### 贡献规范
- 新增示例时，确保其符合项目架构规范
- 保持示例的简洁性和代表性
- 遵循 CLAUDE.md 中的标签系统

### 维护规范
<system-reminder>本章节用于规范案例的增删维护流程</system-reminder>

**新增案例流程**
- 新增案例文件后，**必须**同步更新本索引文件中的对应分类说明
- 在对应分类的示例列表中添加新案例的简要说明
- 确保文件路径和文件名保持一致
- 更新本文件的更新时间戳

**删除案例流程**
- 删除案例文件前，**必须**先确认无其他代码或文档引用该案例
- 删除后立即更新本索引文件，移除相关说明
- 检查并清理相关的引用链接和交叉引用
- 更新本文件的更新时间戳

**修改案例流程**
- 修改案例内容后，检查是否需要更新本索引文件中的说明
- 如涉及重大变更，需同步更新本文件中的描述信息
- 保持示例内容与索引说明的一致性

## 📌 重要提醒

- 本目录中的所有示例均经过项目团队审核，代表最佳实践
- 任何新功能开发都应首先查阅此目录中的相关示例
- 示例内容将随项目演进而更新，请定期检查
- 若发现示例与当前规范不符，请立即提出修正
- **关键**：新增或删除案例时，**必须**按照"维护规范"同步更新本索引文件
- 违反维护规范将导致索引失效，影响团队开发效率

> 本指南由项目团队维护，最终解释权归项目架构组所有。