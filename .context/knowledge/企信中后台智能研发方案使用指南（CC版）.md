# 基础使用
### 基本交互模式
Claude Code 支持自然语言交互，可以直接描述你的需求：

```plain
# 示例：查找特定功能
请帮我找到用户管理相关的代码文件

# 示例：修改代码
帮我修复这个组件的类型错误

# 示例：执行命令
请运行项目的代码检查
```

### 专用命令
项目基于上下文工程配置了完整的PRP工作流：

+ `/cmt` - 提交代码
+ `/story-create` - 根据PRD创建多个连续用户故事
+ `/story-dev` - 开发用户故事

 生成技术方案/generate-prp .context/prps/{PRD名称}.md 执行技术方案/execute-prp .context/stories/{PRD名称}/技术方案文档.md 

### 子代理系统
| 代理类型 | 职责范围 | 适用场景 |
| --- | --- | --- |
| **frontend-developer** | 前端开发 | 编写符合项目规范的前端代码 |
| **codebase-researcher** | 代码库研究 | 探索代码库、技术可行性研究 |
| **test-case-designer** | 测试设计 | 基于 PRP 需求创建单元测试 |
| **tech-article-writer** | 技术文档 | 编写技术文档、架构方案 |
| **tech-article-reviewer** | 质量检查 | 审查文档或者代码质量 |
| **frontend-debugger** | 前端调试 | 运行时异常、浏览器性能评估 |


### 上下文工程
项目上下文工程通过 .context/ 目录结构提供：

+ 项目需求文档（prds/）
+ 需求开发文档（stories/）
+ 开发规范（rules/）
+ 每次开发执行进度和报告（tasks/）
+ 最佳实践示例（examples/）
+ 技术知识库（knowledge/）
+ 各种文档编写模板（templates/）
+ 常见陷阱警示（traps/）

项目配置通过 .claude/ 目录管理：

+ `commands/` - 项目专用命令定义（如 /generate-prp, /execute-prp）
+ `agents/` - 专业代理配置（如 frontend-developer, tech-article-writer）
+ `output-styles/` - 输出样式配置（workflow, professional-detailed）
+ `settings.json` - 全局配置文件，定义Hooks和权限
+ `settings.local.json` - 本地个性化配置，定义MCP服务器和权限
+ `end.mp3` - 任务完成提示音文件
+ CLAUDE.md - 代理的行为规范，

所有 .claude/ 配置与 .context/ 上下文工程共同构成完整的AI助手工作环境。



### 开发流程报告说明
![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/109660/1760067391399-b53e107a-11f8-4f1e-93f8-3aae48f40d50.png)

案例参考

[https://yuque.antfin.com/zhefeng.yf/ekpvsh/whe8p13ri2pl2gse?singleDoc#](https://yuque.antfin.com/zhefeng.yf/ekpvsh/whe8p13ri2pl2gse?singleDoc#) 《中后台 CC 复杂任务执行记录》



# Claude Code快速入门
### 什么是 Claude Code？
Claude Code 是 Anthropic 官方推出的交互式 CLI 工具，基于 AI 技术帮助开发者完成各种研发任务。在 ZMEP 技术管理平台项目中，Claude Code 已经配置了专门的工作流和工具集。

## 安装指南
本指南提供最简洁的 Claude Code + Claude Code Route 安装步骤，5分钟内即可完成配置。

## 前置条件检查
```bash
# 检查 Node.js 版本（需要 18+）
node --version

# 检查 npm
npm --version
```

## 第一步：安装 Claude Code
```bash
# 全局安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

### 修改环境配置
~/.claude/setting.json

```bash
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:3456"
  },
  "permissions": {
    "allow": [
      "Edit",
      "Write"
    ],
    "deny": []
  },
  "alwaysThinkingEnabled": true,
}

```



### VSCode 插件（可选）
VSCode 插件市场下载

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/109660/1760088589318-303b248b-a097-446f-be52-f69fc0539274.png)



VS Code ctrl + shift + p 打开配置，添加以下内容

```plain
"claude-code.environmentVariables": [
        {
            "name": "ANTHROPIC_BASE_URL",
            "value": "http://localhost:3456"
        },
        {
            "name": "ANTHROPIC_AUTH_TOKEN",
            "value": "YOUR_API_KEY"
        },
    ],
```

~/.claude/config.json

```bash
{
  "primaryApiKey": "anyKey"
}
```

注意这里只是跳过登陆检查，任何值都是可以的，配置好重启VSCode

## 第二步：安装 Claude Code Route（国内必须）
Claude Code Route 支持更多模型提供商和企业级部署：

```bash
# 安装 Claude Code Router
npm install -g @musistudio/claude-code-router

# 验证安装
ccr --help
```

## 第三步：基本配置
### 路由配置（支持多种模型）
```bash
# 创建配置目录
mkdir -p ~/.claude-code-router

# 创建配置文件
cat > ~/.claude-code-router/config.json << 'EOF'
{
  "LOG": true,
  "LOG_LEVEL": "warn",
  "CLAUDE_PATH": "",
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "APIKEY": "",
  "API_TIMEOUT_MS": "600000",
  "PROXY_URL": "",
  "transformers": [],
  "Providers": [
    {
      "name": "Theta",
      "api_base_url": "https://antchat.alipay.com/v1/chat/completions",
      "api_key": "YOUR_API_KEY",
      "models": [
        "DeepSeek-V3.1-Terminus",
        "Qwen3-Coder-480B-A35B-Instruct",
        "Qwen3-Next-80B-A3B-Instruct",
        "Qwen3-Next-80B-A3B-Thinking",
        "Qwen3-VL-235B-A22B-Instruct",
        "GLM-4.6"
      ],
      "transformer": {
        "use": [],
        "GLM-4.6": {
          "use": [
            "chutes-glm"
          ]
        },
        "DeepSeek-V3.1-Terminus": {
          "use": [
            "deepseek"
          ]
        },
        "Qwen3-Coder-480B-A35B-Instruct": {
          "use": [
            [
              "maxtoken",
              {
                "max_tokens": 65536
              }
            ],
            "enhancetool"
          ]
        },
        "Qwen3-Next-80B-A3B-Instruct": {
          "use": [
            [
              "maxtoken",
              {
                "max_tokens": 32768
              }
            ],
            "enhancetool"
          ]
        },
        "Qwen3-VL-235B-A22B-Instruct": {
          "use": [
            [
              "maxtoken",
              {
                "max_tokens": 65536
              }
            ],
            "enhancetool"
          ]
        },
        "Qwen3-Next-80B-A3B-Thinking": {
          "use": [
            [
              "maxtoken",
              {
                "max_tokens": 65536
              }
            ],
            "enhancetool"
          ]
        }
      }
    }
  ],
  "Router": {
    "default": "Theta,DeepSeek-V3.1-Terminus",
    "background": "Theta,DeepSeek-V3.1-Terminus",
    "think": "Theta,DeepSeek-V3.1-Terminus",
    "longContext": "Theta,Qwen3-Next-80B-A3B-Instruct",
    "longContextThreshold": 60000,
    "webSearch": "Theta,Qwen3-Next-80B-A3B-Instruct",
    "image": ""
  },
  "CUSTOM_ROUTER_PATH": ""
}
EOF
```

**替换说明**：

+ `YOUR_API_KEY`：替换为你的  API Key
+ API 可以通过 [https://agent.alipay.com/api/apiKey](https://agent.alipay.com/api/apiKey) 申请
+ 模型编程能力参考 [https://zhuanlan.zhihu.com/p/1959618879102915831](https://zhuanlan.zhihu.com/p/1959618879102915831)

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/109660/1760067167389-064ddc56-e311-492d-a224-587e69d1868a.png)

## 第四步：启动和使用
### 标准模式（直接使用 Claude Code）
```bash
# 在项目目录中启动
cd your-project
claude
```

### 路由模式（使用 Claude Code Router）
```bash
# 启动路由服务（推荐）
ccr code
```



### 检查模型可访问性
替换key

```bash
curl -X POST https://antchat.alipay.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${YOUR_KEY}" \
  -d '{
    "model": "GLM-4.6",
    "messages": [
      {
        "role": "user",
        "content": "你好"
      }
    ]
  }'
```

### 检查代理可访问
[http://localhost:3456](http://localhost:3456)

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/109660/1760088335271-126f829b-24ed-45db-b9bd-1eeec03a188f.png)

## 🛠️ 常用命令
```bash
# 查看帮助
claude --help
ccr --help

# 检查安装状态
claude doctor

# 更新到最新版本
claude update

# 查看配置
claude config list
```

