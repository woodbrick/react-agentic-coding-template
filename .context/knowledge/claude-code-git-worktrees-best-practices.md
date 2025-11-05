<metadata updated="2025-10-05" version="1.0" name="Git Worktrees 最佳实践">
  <keywords>Claude Code, Git Worktrees, 并行开发, 任务隔离, 开发环境管理, 分支管理, 工作目录, 开发效率</keywords>
</metadata>

# Claude Code 与 Git Worktrees 结合使用的最佳实践

## 核心理念

Claude Code 与 Git worktree 的结合使用可以显著提高并行开发效率，每个 worktree 运行独立的 Claude 实例，实现任务隔离和并行处理。

## 目录结构规范

1. **工作区位置**：

   - 在项目主目录旁创建专门存放 worktree 的目录
   - 避免在主项目目录内创建 worktree
   - 示例结构：
     ```
     project/
     project-worktrees/
       feature-auth/
       feature-payment/
       hotfix-bugfix/
     ```

2. **命名规范**：
   - 使用描述性目录名称标识具体任务
   - 命名应清晰表达 worktree 的用途
   - 示例：`feature-user-authentication`、`hotfix-login-error`、`refactor-api-client`

## 创建与配置流程

1. **创建 worktree**：

   ```bash
   # 为新功能创建 worktree
   git worktree add -b feature-auth ../project-worktrees/feature-auth

   # 为紧急修复创建 worktree
   git worktree add -b hotfix-bugfix ../project-worktrees/hotfix-bugfix main
   ```

2. **初始化开发环境**：

   ```bash
   # 进入 worktree 目录
   cd ../project-worktrees/feature-auth

   # 根据项目技术栈初始化环境
   # JavaScript 项目
   npm install

   # Python 项目
   # pip install -r requirements.txt

   # 启动 Claude Code
   claude
   ```

## 并行开发策略

1. **任务隔离**：

   - 每个 worktree 处理独立的功能分支
   - 避免不同 Claude 实例修改相同文件
   - 一个 worktree 处理长时间运行的任务，同时在另一个 worktree 中继续开发

2. **实例管理**：

   ```bash
   # 在不同终端中分别启动不同的 Claude 实例
   # 终端 1
   cd ../project-worktrees/feature-auth
   claude -resume

   # 终端 2
   cd ../project-worktrees/feature-payment
   claude -resume
   ```

## 环境与配置

1. **独立环境**：

   - 每个 worktree 需要独立初始化开发环境
   - 包括依赖安装、环境变量配置等
   - Claude 实例间文件状态相互隔离，防止相互干扰

2. **共享资源**：
   - 所有 worktree 共享相同的 Git 历史和远程连接
   - 可以独立推送更改到远程分支
   - 便于团队协作和代码审查

## 工作流程

1. **任务分配**：
   - 主 worktree 处理主要开发任务
   - 创建独立 worktree 处理紧急修复或并行功能
2. **开发过程**：

   - 在各自 worktree 中运行独立的 Claude 实例
   - 利用 Claude 的上下文工程能力处理特定任务
   - 通过 CLAUDE.md 文件为每个 worktree 定制上下文

3. **合并与清理**：

   ```bash
   # 完成任务后推送更改
   cd ../project-worktrees/feature-auth
   git push origin feature-auth

   # 创建 PR 并合并后清理 worktree
   git worktree remove ../project-worktrees/feature-auth
   ```

## 注意事项

1. **分支管理**：
   - 为每个 worktree 创建独立的功能分支
   - 避免多个 worktree 检出同一分支
2. **环境同步**：

   - 定期同步主分支更改到各 worktree
   - 使用 `git merge main` 或 `git rebase main` 保持更新

3. **资源管理**：

   - 及时清理已完成任务的 worktree
   - 使用 `git worktree list` 检查当前 worktree 状态
   - 定期运行 `git worktree prune` 清理无效记录

4. **上下文隔离**：
   - 每个 worktree 可以有独立的 CLAUDE.md 配置
   - 利用 worktree 的独立性为不同任务定制 Claude 上下文
