<metadata updated="2025-10-07" version="1.0.0" name="story-dev">
  <keywords>PRP执行,工作流,代理协同,核心研发流程,代码质量,异常处理,执行约束,并行化,缓存机制,原子更新,依赖预检</keywords>
</metadata>

# 执行原则

- **IMPORTANT**: 你是 "master"，一个命令行工具执行者，专注高效执行所有阶段任务。
- **ALWAYS**: 完全按照指令执行，不多做不少做。
- **ALWAYS**: 每次执行一个阶段任务，完成后直接执行下一个阶段。
- **NEVER**: 不要因非系统故障中断任务推进.
- **NEVER**: 询问是否执行下个阶段,或者等待用户反馈.

## 📋 分阶段执行流程

<system-reminder>

- 每个阶段结束前要需要参考 公共操作定义 严格执行 附加操作。
- 各阶段必须严格按顺序执行，前阶段完成状态为后阶段开始的前置条件
- 立刻将所有阶段用TodoWrite添加到任务列表中
- 不允许生成临时文件、截图、HTML 报告或 PNG 图像
- 所有输出必须是可提交到版本控制的代码或文档（如 .ts, .less, .md）
- 涉及 .context 目录的文件，可以使用Grep工具搜索 <keywords> 关键词，提高搜索效率

</system-reminder>

### 阶段 1: 任务规划和恢复

**代理**: `master`

<system-reminder>

1. 根据模版 `.context/templates/task-template-detailed.md` 创建 `.context/tasks/[需求Story名称]/task.md` 文档，如果文档已经存在则跳过
2. 根据任务ID占位符生成ID，如果已经存在则跳过
3. 依次检查每个阶段，如果该阶段已经完成，在任务列表中标记为已完成

</system-reminder>

**附加操作**:
- `update_time_placeholder "{{开始时间}}" ".context/tasks/[需求Story名称]/task.md"
- `update_time_placeholder "{{阶段1结束}}" ".context/tasks/[需求Story名称]/task.md"
- `update_text_placeholder "{{阶段1状态}}" "已完成" ".context/tasks/[需求Story名称]/task.md"

### 阶段 2: 代码仓库调研

**代理**: `master` + `codebase-researcher`

<system-reminder>
1. 根据需求文件提取关键词，调研本次需求直接相关的信息
2. 按照模版文件编写调研报告，本次任务不涉及的部分可以写无
3. 如果涉及外部依赖或者框架，可以查看 .context/knowledge 目录相关文档
4. 涉及 .context 目录的文件，优先使用Grep工具搜索 <keywords> 关键词，提高搜索效率
</system-reminder>

**输入文档**:
<reference type="guidance">
- `.context/stories/[方案]/` # 开发计划文件
- `.context/rules/application-layer-standards.md/` # 架构拆分决策
- `.context/templates/architecture-research-report.md` # 调研报告模版
</reference>

**输出文档**:
<reference type="guidance">
- `.context/tasks/[需求Story名称]/analysis/codebase-analysis.md` # 代码库分析报告
- `.context/tasks/[需求Story名称]/analysis/` # 支撑文件目录
</reference>

**缓存机制**:
- 如果存在 `.context/tasks/[需求Story名称]/analysis/codebase-analysis.md` → 复用调研结果，跳过调研阶段
- 如果文件不存在 → 执行完整调研，生成报告文件

**附加操作**:
- `update_time_placeholder "{{阶段2结束}}" ".context/tasks/[需求Story名称]/task.md"
- `update_text_placeholder "{{阶段2状态}}" "已完成" ".context/tasks/[需求Story名称]/task.md"

### 阶段 3: 测试用例和接口定义

**代理**: `test-case-designer`

<system-reminder>

1. 根据技术方案谨慎判断是否需要创建Store层进行跨组件数据管理，如果不需要可以直接跳过本阶段
2. 按照模版文件编写测试用例，本次任务不涉及的部分可以写 无
3. 设计测试用例时，仅考虑核心业务流程, 不要集成测试，不要边界条件测试，不要权限测试，除非需求中有明确且强烈的诉求
4. 涉及测试框架，可以查看 .context/knowledge 目录相关文档
5. 按照测试用例和架构规范编写相关接口定义和类型定义，不实现任何业务逻辑
6. 绝不测试视图层和应用层代码，绝不编造测试需求

</system-reminder>

**输入文档**:
<reference type="guidance">
- `.context/rules/state-layer-standards.md` 状态层职责规范
- `.context/stories/[方案]/` # PRP需求文件
- `.context/tasks/[需求Story名称]/analysis/codebase-analysis.md` # 代码库分析报告
- `.context/templates/store-test-cases-template.md` # 测试设计模板
- `.context/examples/test-patterns/store-test-template.test.ts` # 测试代码模板
</reference>

**输出文档**:
<reference type="code">
- `.context/tasks/[需求Story名称]/test-cases/[store]-test-cases.md` # 测试设计文档
- `src/stores/[模块]/__tests__/[store].test.ts` # 可执行测试代码
- `src/stores/[模块]/[store].ts` # 状态层(仅定义对象和函数)
- `src/services/[service].ts` # 服务层(仅定义接口和数据模型)
</reference>

**附加操作**:
- `lint_check`
- `type_check`
- `update_time_placeholder "{{阶段3结束}}" ".context/tasks/[需求Story名称]/task.md"
- `update_text_placeholder "{{阶段3状态}}" "已完成" ".context/tasks/[需求Story名称]/task.md"

### 阶段 4: 状态层和服务层接口实现

**代理**: `frontend-developer`

<system-reminder>

1. 基于阶段3完成的测试用例和接口定义，实现状态层和服务层的具体业务逻辑
2. 如果技术方案中不涉及状态层，可以跳过状态层实现，仅实现服务层功能
3. 实现时必须确保所有新增的测试用例通过，实现都必须以测试为驱动
4. 按照架构规范编写代码，确保符合状态层和服务层的代码标准

</system-reminder>

**输入文档**:
<reference type="guidance">
- `.context/tasks/[需求Story名称]/analysis/codebase-analysis.md` # 代码库分析报告
- `src/stores/[模块]/__tests__/[store].test.ts` # 可执行测试代码
- `.context/rules/service-layer-standards.md` # 服务层规范
- `.context/rules/state-layer-standards.md` # 状态层规范
- `.context/tasks/[需求Story名称]/test-cases/[store]-test-cases.md` # 测试设计文档
- `src/stores/[模块]/[store].ts` # 状态层(仅定义对象和函数)
- `src/services/[service].ts` # 服务层(仅定义接口和数据模型)
</reference>

**输出文档**:
<reference type="code">
- `src/stores/[模块]/[store].ts` # 状态层代码（如果涉及状态层）
- `src/services/[service].ts` # 服务层代码
</reference>

**附加操作**:
- `lint_check`
- `type_check`
- `test_check`
- `update_time_placeholder "{{阶段4结束}}" ".context/tasks/[需求Story名称]/task.md"
- `update_text_placeholder "{{阶段4状态}}" "已完成" ".context/tasks/[需求Story名称]/task.md"

### 阶段 5: 视图层与应用层实现

**代理**: `frontend-developer`

<system-reminder>

1. 按照应用开发规范和用户故事，确认需要开发的页面，逐一编写
2. 按照组件规范，设计公共组件（如必要），并实现视觉组件
3. 按照状态层实现，为交互事件绑定对应的功能函数（如无状态层则跳过）
4. 检查页面加载流程，根据路由参数初始化状态数据

**开发原则**：
- 不修改已有工具函数、公共组件或类型定义，评估后可谨慎新增

**功能实现原则**：
- 不假设复杂前端功能（如文件导出、CSV生成等），优先依赖后端接口
- 接口未提供时，保留 `// TODO: 后端接口待支持` 注释

**样式实现原则**：
- 不定制 Ant Design 组件样式，禁止使用自定义类名或 `.less` 样式覆盖
- 仅使用 Tailwind 原子类（如 `transition`, `hover:bg-blue-700`）实现基础交互动画
- 复杂动画或主题切换需求，标注 `// TODO: 复杂动画待统一实现`

</system-reminder>

**输入文档**:
<reference type="guidance">
- `.context/rules/application-layer-standards.md` # 应用开发规范
- `src/stores/[模块]/[store].ts` # 已实现的状态层(可能没有)
- `src/services/[service].ts` # 已实现的服务层
- `.context/tasks/[需求Story名称]/analysis/codebase-analysis.md` # 代码库分析报告
- `.context/stories/[方案]/` # 用户故事
- `.context/rules/component-standards.md` # 组件开发规范
</reference>

**输出文档**:
<reference type="code">
- `src/pages/[页面]/index.tsx` # 应用代码
- `src/pages/components/[组件]/index.tsx` # 组件代码
- `src/styles/[模块].less` # 样式文件(可选)
- `src/pages/[页面]/index.less` # 样式文件(可选)
- `src/layouts/` # 布局文件目录 (可选)
</reference>

**服务状态复用机制**:
- 检查是否存在运行中的 dev server
- 如果服务运行中 → 监听日志，跳过启动
- 如果服务未运行 → 启动并记录 bash_id

**附加操作**:
- `lint_check`
- `type_check`
- `update_time_placeholder "{{阶段5结束}}" ".context/tasks/[需求Story名称]/task.md"
- `update_text_placeholder "{{阶段5状态}}" "已完成" ".context/tasks/[需求Story名称]/task.md"

### 阶段 6: 应用层整合与构建验证

**代理**: `frontend-developer`

<system-reminder>
1. 按照演示流程，检查各层级代码的完整性和准确性，并串联整体链路
2. 使用 Mock数据生成 技能, 构造当前需求的演示数据
2. 执行各项检查，并修复问题
3. 构建项目，并修复问题
</system-reminder>

**输入文档**:
<reference type="guidance">
- `src/stores/[模块]/[store].ts` # 已实现的各层代码
- `src/services/[service].ts` # 已实现的各层代码
- `src/pages/[页面]/index.tsx` # 已实现的各层代码
- `src/components/[组件]/index.tsx` # 已实现的各层代码
- `.context/tasks/[需求Story名称]/task.md` # 本任务文档
- `.context/stories/[方案]/` # 使用流程说明
</reference>

**输出文档**:
<reference type="code">
- `src/pages/[页面]/index.tsx` # 路由配置
- `src/components/[组件]/[交互逻辑].ts` # 事件处理代码
</reference>

**附加操作**:
- `lint_check`
- `type_check`
- `build_check`
- `update_time_placeholder "{{阶段6结束}}" ".context/tasks/[需求Story名称]/task.md"
- `update_text_placeholder "{{阶段6状态}}" "已完成" ".context/tasks/[需求Story名称]/task.md"

### 阶段 7: 质量评估与优化

**代理**: `tech-arch-reviewer`

<system-reminder>

1. 提取 task.md 的 任务ID，作为创建报告的文件名
2. 阶段根据方案设计和改动代码(git diff查看)，收集真实的信息
3. 严肃并客观的评估本次代码实现的一致性和准确性
4. 绝不修改任何代码，按照模版编写评估报告
5. 根据项目实际情况，替换 /task.md 中 所有占位符变量
6. 执行以下检查命令，记录错误数量，但不修复
  - `lint_check`
  - `type_check`
  - `build_check`

</system-reminder>

**输入文档**:
<reference type="guidance">
- `.context/tasks/[需求Story名称]/` # 研发全过程数据
- `.context/templates/task-eval-template.md` # 评估报告模板
- `.context/tasks/[需求Story名称]/task.md` # 本任务文档
</reference>

**输出文档**:
<reference type="guidance">
- `.context/tasks/[需求Story名称]/eval_[任务ID].md` # 质量评估报告
</reference>

**附加操作**:
- `update_time_placeholder "{{阶段7结束}}" ".context/tasks/[需求Story名称]/task.md"
- `update_time_placeholder "{{结束时间}}" ".context/tasks/[需求Story名称]/task.md"
- `update_text_placeholder "{{阶段7状态}}" "已完成" ".context/tasks/[需求Story名称]/task.md"
- `.context/tasks/[需求Story名称]/task.md 提取开始和结束时间,计算总耗时,并替换 {{总耗时}} 占位符`


## 🔧 公共操作定义

所有质量检查操作必须符合以下标准，严格执行零容忍策略

<command name="lint_check">git diff --name-only | grep -E '\.(ts|tsx|js|jsx)$' | xargs -I {} tnpm run lint {}</command>
- **标准**: **零error级别错误**
- **处理**: 修复error，记录warning

<command name="type_check">git diff --name-only | grep -E '\.(ts|tsx)$' | xargs -I {} tnpm run tsc --noEmit {}</command>
- **标准**: **零类型错误（增量代码）**
- **处理**: 修复增量代码类型错误，第三方错误记录

<command name="test_check">git diff --name-only | grep -E 'test\.(ts|js)$' | xargs -I {} tnpm run test {}</command>
- **标准**: **增量测试用例通过**
- **处理**: 修复新增测试，记录跳过原因

<command name="build_check">tnpm run build</command>
- **标准**: **构建成功**
- **处理**: 修复构建错误

<command name="update_text_placeholder">sed -i "" "s/$1/$2/g" "$3"</command>

<command name="update_time_placeholder">current_time=$(date "+%Y-%m-%d %H:%M") && sed -i "" "s/$1/$current_time/g" "$2"</command>

## ⚠️ 异常处理机制

采用分级重试策略，区分异常类型并指定处理方式:

- **代码级异常**（高）: 语法/类型错误 → 重试2次（10秒间隔），失败后人工介入
- **依赖级异常**（中）: 包/配置错误 → 重试1次，失败后终止
- **环境级异常**（低）: 网络/权限问题 → 重试3次（30秒间隔）
- **资源级异常**（关键）: 内存/磁盘不足 → 立即终止，人工处理
- **代理级异常**（中）: 执行失败/超时 → 重试1次，切换代理

异常报告路径: `.context/tasks/[需求Story名称]/error-reports/[异常类型]-report.md`
异常报告模版: `.context/templates/error-report-template.md`