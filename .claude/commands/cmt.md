提交代码到远程仓库

## 提交规则

### 1. 检查变更
```bash
git status && git diff --name-only
```

### 2. 提交格式
```
<type>(<scope>): <描述> [AI]
```

### 3. 分批策略（>6文件）
| 批次 | 内容 | 示例 |
|---|---|---|
| 1 | 代理/配置 | `refactor(agents): 更新代理规范` |
| 2 | 文档规则 | `docs(project): 更新项目文档` |
| 3 | 源码 | `feat(page-config): 实现功能` |
| 4 | 测试 | `test(page-config): 添加测试` |

### 4. 一键命令
```bash
git add . && git commit -m "feat(scope): 描述"
```
