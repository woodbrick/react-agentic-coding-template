<metadata updated="2025-10-08" version="1.0.0" name="YAML关键字指导说明">
  <keywords>YAML关键字, 代理配置, 规范说明, 配置指导</keywords>
</metadata>

# 📋 YAML关键字指导说明

> 基于BMAD Master架构的代理配置和工作流YAML关键字详细说明

## 🎯 配置结构说明

<system-reminder>
以下内容为配置文件的结构性说明，不是YAML关键字。
这些内容用于理解代理配置的总体框架和执行流程。
所有实际的YAML关键字定义请见下文各章节。
</system-reminder>

## 👤 代理身份关键字

### agent（代理基础信息）

**YAML字段定义**:
- name: 代理的显示名称，用于用户界面标识（必填）
- id: 代理的唯一标识符，用于系统内部引用（必填）
- title: 代理的职位/角色标题，描述其专业职能（必填）
- icon: 代表代理的emoji图标，用于视觉识别（必填）
- whenToUse: 代理的使用时机说明，用单引号包裹的描述文本（必填）
- customization: 可选的自定义配置字段，用于覆盖默认行为

**配置要求**:
- **ALWAYS** 所有字段必须使用正确的中英文描述
- **NEVER** 省略name、id、title等关键字段
- **IMPORTANT** whenToUse字段必须使用单引号包裹描述内容

### persona（角色定义）

**YAML字段定义**:
- role: 代理的主要角色，定义其核心职责（必填）
- identity: 代理的身份说明，描述其专业背景和特点（必填）
- core_principles: 核心操作原则列表，定义代理的行为准则（必填）

**核心原则示例**:
- 严格遵循技术标准和最佳实践
- 客观评估，避免主观偏好
- 提供建设性改进建议
- 保持代码质量和可维护性

## 🔄 工作流关键字

### workflow（工作流定义）

**YAML关键字定义**:
- id: 工作流唯一标识符，使用小写-分隔格式（如 brownfield-ui）
- name: 工作流的可读名称，用于界面显示
- description: 工作流的完整描述，使用 >- 或 | 语法支持多行
- type: 工作流类型，必须为 brownfield（现有系统改造）或 greenfield（新系统建设）
- project_types: 适用的项目类型列表，使用项目标准术语（如 ui-modernization）
- sequence: 工作流步骤序列，定义代理执行顺序和依赖关系
- decision_guidance: 工作流适用场景和决策依据，指导何时使用该工作流
- handoff_prompts: 代理间交接的标准化提示语，确保信息传递一致性

**sequence子字段定义**:
- step: 步骤标识符，用于引用和工作流阶段识别（可选）
- agent: 执行该步骤的代理名称（必填）
- action: 该步骤的具体操作描述（必填）
- creates: 该步骤创建的工件或文件（必填）
- uses: 该步骤使用的模板或配置文件（可选）
- requires: 该步骤的前置依赖项，可为单个或多个（可选）
- validates: 用于验证的检查清单或标准（可选）
- updates: 该步骤修改的现有工件（可选）
- condition: 条件判断字段，用于控制可选步骤的执行（可选）
- optional: 是否为可选步骤（默认 false）
- repeats: 循环执行条件（如 for_each_epic）
- notes: 详细的执行说明和注意事项，使用 | 语法支持多行（必填）

**条件标识符定义**:
- po_checklist_issues: 产品负责人发现检查清单问题
- user_wants_story_review: 用户请求审查故事
- qa_left_unchecked_items: QA留下未检查项
- epic_complete: 史诗任务完成
- all_artifacts_in_project: 所有工件都已创建
- any_flagged_documents: 任何文档被标记需要更新

**工作流类型定义**:
- brownfield: 适用于现有系统改造、功能增强、技术债务偿还
- greenfield: 适用于全新系统建设、从零开始开发

## ⚡ 命令系统关键字

### commands（可执行命令）

**YAML定义**:
- help: 显示编号列表中的可用命令以供选择
- task {task}: 执行指定的任务，如果未指定任务则列出所有可用任务
- execute-checklist {checklist}: 运行指定的检查清单，无参数时列出所有可用清单
- create-doc {template}: 基于指定模板创建文档，无模板时列出所有可用模板
- exit: 退出当前代理会话（需要确认）

**命令规则**:
- **CRITICAL**: 所有命令必须加`*`前缀（例如，`*help`）
- **ALWAYS**: 参数使用`{}`包裹，如`{task}`、`{template}`
- **NEVER**: 省略命令描述，必须明确说明命令功能

## 📚 依赖管理关键字

### dependencies（依赖资源配置）

**YAML结构定义**:
- checklists: 检查清单文件列表，用于质量保证和验证
- tasks: 任务执行文件列表，包含具体的工作流程
- templates: 模板文件列表，用于文档生成和标准化
- workflows: 工作流文件列表，定义复杂的工作流程
- data: 数据文件列表，包含参考信息和知识库

**依赖分类说明**:
- **checklists**: 检查清单文件，用于质量保证和验证
- **tasks**: 任务执行文件，包含具体的工作流程
- **templates**: 模板文件，用于文档生成和标准化
- **workflows**: 工作流文件，定义复杂的工作流程
- **data**: 数据文件，包含参考信息和知识库

## 🎨 自定义配置说明

### 路径映射规则

<system-reminder>
所有依赖文件必须遵循标准路径映射：
{root}/{type}/{name}
- root: 项目根目录
- type: 资源类型文件夹（tasks/templates/checklists等）
- name: 文件名（包含扩展名）
</system-reminder>

### customization字段（自定义配置）

**功能**: 提供代理级别的自定义配置选项

```yaml
agent:
  name: 自定义代理
  # ...其他基础配置
  customization:
    # 可在此添加特定于该代理的自定义配置
    # 此字段始终优先于任何冲突的指令
```

**使用场景**:
- 代理特定的行为调整
- 项目特定的配置覆盖
- 环境相关的参数设置

## ⚠️ 关键限制和约束

<limitation>
**BMAD代理的关键限制条件：**
- 严格遵循"按需加载"原则，不预加载任何资源
- 交互时必须提供编号列表供用户选择
- 不得自动进行文件系统扫描或资源发现
- 不得修改或删除任何依赖文件
- 仅在用户明确请求时加载依赖文件
- 所有命令必须包含*前缀，保持标准格式
</limitation>

## 🔧 配置最佳实践

<good-example language="yaml">
# ✅ 正确配置示例
agent:
  name: 技术审查员
  id: tech-reviewer
  title: 技术方案审查专家
  icon: 🔍
  whenToUse: '用于技术文档审查、架构评估和代码质量检查'
  customization:
    # 可选的代理特定配置

persona:
  role: 技术架构审查专家
  identity: 系统性分析技术方案和代码质量的专家
  core_principles:
    - 严格遵循技术标准和最佳实践
    - 客观评估，避免主观偏好
    - 提供建设性改进建议
</good-example>

<bad-example language="yaml">
# ❌ 错误配置示例
agent_name: 审查员  # 错误：应该使用agent结构
resources:  # 错误：应该使用dependencies结构
  - some-file.md
</bad-example>

## 📖 参考资源

<reference type="guidance">
- `.context/templates/agents-template.md` - BMAD代理配置模板
- `.claude/agents/bmad-master.md` - BMAD Master标准架构
- `.claude/agents/dev-zh.md` - 开发代理实现示例
- `.context/CLAUDE.md` - 上下文工程配置规范
- `.context/templates/workflow-brownfield-ui.md` - Brownfield UI工作流模板
</reference>

---

**维护说明**: 此指导文档基于BMAD代理配置模板提取的关键字信息，为代理配置和工作流定义提供标准化的参考依据。