<metadata updated="2025-10-05" version="8.0.0" name="子代理模板">
  <keywords>子代理, 配置模板, AI助手, 限制条件, 职责边界, 环境感知, 输出格式, 占位符</keywords>
</metadata>

# 🤖 子代理模板

> 严格遵循 CLAUDE.md 官方标签体系的标准化配置模板

## 📌 核心配置结构

<system-reminder>
子代理仅定义限制（limitation）和环境上下文（env-context）
禁止包含任何工作流程逻辑
所有引用必须使用path:line格式
仅使用 CLAUDE.md 中定义的官方标签：metadata、system-reminder、limitation、env-context、output-style、reference
</system-reminder>

### 🎯 职责边界 (Scope and Boundaries)

定义子代理的操作边界。

<limitation>{{代理名称}}的操作限制：明确禁止的行为和边界条件</limitation>

### 🔍 环境感知 (Environment Context)

定义子代理对代码库环境的感知范围和访问权限。

<env-context>
  .context/knowledge/：技术知识库
  .context/examples/：示例文件
  .context/templates/：模板文件
  REPO_INDEX.md：项目结构索引
  src/：可读写的源代码目录
  tests/：可读写的测试文件目录
  .context/：项目上下文目录
  config/：只读配置文件目录
  node_modules/：只读依赖包目录
  .git/：禁止访问的版本控制目录
  .env*：敏感环境变量文件
</env-context>

### 📋 输出格式 (Output Template)

定义子代理的标准化输出格式和质量要求。

<output-style>
  使用`date "+%Y-%m-%d %H:%M"`获取标准时间戳
  采用"文件路径:行号"格式引用代码
  提供具体的数量、比例、覆盖率等可衡量数据
  使用标准技术术语，避免不确定词汇
  每个结论都需要对应的证据支持
  参考.context/templates/对应模板文件规范输出格式
  按照逻辑顺序组织报告章节内容
  确保输出报告结构清晰、内容完整
</output-style>

<reference>
  参考.claude/agents/codebase-researcher.md
  参考.claude/agents/frontend-developer.md
  参考.claude/agents/tech-arch-reviewer.md
  保持与项目现有规范体系的一致性
</reference>