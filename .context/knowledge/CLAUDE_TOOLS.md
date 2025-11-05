<metadata updated="2025-10-04" version="2.0" name="可用工具清单">
  <keywords>Claude Code工具, 非MCP工具, Task工具, Bash工具, Glob工具, Grep工具, Read工具, Edit工具, Write工具, 文件操作, 任务管理</keywords>
</metadata>

# 🛠️ 可用工具清单

本文件记录了当前环境中可用的非MCP工具名称、定义和参数信息。

---

## 📋 工具总览

| 序号 | 工具名称 | 类别 | 主要功能 |
|------|----------|------|----------|
| 1 | Task | 代理管理 | 启动专业代理处理复杂任务 |
| 2 | Bash | 系统命令 | 执行bash命令 |
| 3 | Glob | 文件操作 | 文件模式匹配 |
| 4 | Grep | 内容搜索 | 强大的正则表达式搜索 |
| 5 | ExitPlanMode | 模式管理 | 退出计划模式 |
| 6 | Read | 文件操作 | 读取本地文件 |
| 7 | Edit | 文件操作 | 文件编辑工具 |
| 8 | Write | 文件操作 | 文件创建工具 |
| 9 | NotebookEdit | 文件操作 | Jupyter笔记本编辑 |
| 10 | WebFetch | 网络操作 | 网页内容获取 |
| 11 | TodoWrite | 任务管理 | 任务列表管理 |
| 12 | WebSearch | 网络操作 | 网络搜索 |
| 13 | BashOutput | 系统命令 | 后台命令输出监控 |
| 14 | KillShell | 系统命令 | 终止后台shell |
| 15 | SlashCommand | 命令执行 | 执行斜杠命令 |

---

## 🔧 详细工具说明

### 1. Task
**描述**: 启动新的代理来处理复杂的多步骤任务

**参数**:
- `subagent_type` (required) - 要使用的专业代理类型
- `description` (required) - 任务的简短描述（3-5个单词）
- `prompt` (required) - 代理要执行的任务

**使用场景**: 需要专业代理处理复杂研究、代码编写或特定任务的场景

---

### 2. Bash
**描述**: 在持久化shell会话中执行给定的bash命令

**参数**:
- `command` (required) - 要执行的命令
- `timeout` (optional) - 超时时间（毫秒，最多600000）
- `description` (optional) - 命令描述（5-10个单词）
- `run_in_background` (optional) - 是否在后台运行

**注意事项**: 避免使用find、grep、cat等命令，优先使用专用工具

---

### 3. Glob
**描述**: 快速文件模式匹配工具

**参数**:
- `pattern` (required) - 要匹配的glob模式
- `path` (optional) - 搜索目录（默认当前目录）

**支持的格式**: "**/*.js"、"src/**/*.ts"等

---

### 4. Grep
**描述**: 基于ripgrep的强大搜索工具

**参数**:
- `pattern` (required) - 正则表达式模式
- `path` (optional) - 搜索的文件或目录
- `glob` (optional) - 文件过滤模式
- `output_mode` (optional) - 输出模式："content"、"files_with_matches"、"count"
- `-A/-B/-C` (optional) - 上下文行数
- `-n` (optional) - 显示行号
- `-i` (optional) - 忽略大小写

---

### 5. ExitPlanMode
**描述**: 退出计划模式

**参数**:
- `plan` (required) - 要运行的实现步骤计划

**使用条件**: 仅当任务需要编写代码的实现步骤规划时使用

---

### 6. Read
**描述**: 从本地文件系统读取文件

**参数**:
- `file_path` (required) - 文件的绝对路径
- `offset` (optional) - 起始行号
- `limit` (optional) - 读取行数限制

**支持格式**: 文本文件、图片、PDF、Jupyter笔记本等

---

### 7. Edit
**描述**: 在文件中执行精确字符串替换

**参数**:
- `file_path` (required) - 要修改的文件路径
- `old_string` (required) - 要替换的文本
- `new_string` (required) - 替换后的文本
- `replace_all` (optional) - 是否替换所有匹配项

**要求**: 使用前必须先用Read工具读取文件

---

### 8. Write
**描述**: 将文件写入本地文件系统

**参数**:
- `file_path` (required) - 要写入的文件绝对路径
- `content` (required) - 要写入的内容

**注意事项**: 如果是现有文件，必须先使用Read工具读取

---

### 9. NotebookEdit
**描述**: 完全替换Jupyter笔记本特定单元格的内容

**参数**:
- `notebook_path` (required) - Jupyter笔记本文件的绝对路径
- `cell_id` (optional) - 要编辑的单元格ID
- `new_source` (required) - 单元格的新源内容
- `cell_type` (optional) - 单元格类型："code"、"markdown"
- `edit_mode` (optional) - 编辑模式："replace"、"insert"、"delete"

---

### 10. WebFetch
**描述**: 从指定URL获取内容并使用AI模型处理

**参数**:
- `url` (required) - 要获取内容的URL
- `prompt` (required) - 要在获取内容上运行的提示

**功能**: 获取URL内容，将HTML转换为markdown，使用小型快速模型处理内容

---

### 11. TodoWrite
**描述**: 为当前编码会话创建和管理结构化任务列表

**参数**:
- `todos` (required) - 更新的任务列表

**任务状态**:
- pending: 未开始
- in_progress: 进行中（一次只能有一个）
- completed: 已完成

---

### 12. WebSearch
**描述**: 允许Claude搜索网络并使用结果来通知响应

**参数**:
- `query` (required) - 搜索查询
- `allowed_domains` (optional) - 只包含这些域名的搜索结果
- `blocked_domains` (optional) - 永不包含这些域名的搜索结果

**特点**: 提供当前事件和最新数据的更新信息

---

### 13. BashOutput
**描述**: 从运行中或已完成的背景bash shell检索输出

**参数**:
- `bash_id` (required) - 要检索输出的背景shell ID
- `filter` (optional) - 可选的正则表达式过滤输出行

**功能**: 监控长时间运行的shell的输出

---

### 14. KillShell
**描述**: 通过ID终止运行中的背景bash shell

**参数**:
- `shell_id` (required) - 要终止的背景shell ID

**使用场景**: 需要终止长时间运行的shell时

---

### 15. SlashCommand
**描述**: 在主对话中执行斜杠命令

**参数**:
- `command` (required) - 要执行的斜杠命令及其参数

**要求**: 只能执行可用的斜杠命令

---

## 📝 使用说明

### 批量工具调用
当多个独立的工具调用可能成功时，可以在单个响应中批量调用工具以获得最佳性能。

### 文件操作优先级
- 优先使用专用工具进行文件操作
- 避免使用Bash命令进行文件读取、搜索、编辑
- 保持当前工作目录，优先使用绝对路径

### 任务管理最佳实践
- 对于3个或更多不同步骤的复杂任务，使用TodoWrite
- 实时更新任务状态
- 任何时候只能有一个任务处于in_progress状态

---

*最后更新: 2025-10-04*
*文档版本: 2.0*