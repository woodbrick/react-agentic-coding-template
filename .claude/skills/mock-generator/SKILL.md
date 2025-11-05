---
name: Mock数据
description: "生成Mock数据，重点保证可靠性和类型安全。当需要为前端开发创建API模拟数据时使用，特别是处理/mock目录下的数据生成任务。"
allowed-tools: [Read, Grep, Glob, Write, Edit, Bash]
---

# Mock数据生成技能

## 指令

当您需要为前端开发创建API模拟数据时，使用此技能生成符合BigFish框架规范的Mock数据。此技能遵循"可靠性和简单性优先"原则：

1. 分析现有接口定义和TypeScript类型，确保100%类型一致性
2. 生成静态JSON响应数据，避免复杂动态逻辑
3. 尊重实际服务实现（非臆测RESTful规范）
4. 确保Mock数据与真实接口完全匹配
5. 优先简单实现，仅在必要时添加复杂逻辑

## 使用步骤

1. **接口分析**：使用Read工具检查`src/services/[模块]/interface.ts`文件
2. **模式识别**：使用Grep工具搜索现有Mock文件，理解项目Mock模式
3. **服务验证**：检查`src/services/[模块]/index.ts`确认实际HTTP方法（非臆测）
4. **数据生成**：使用Write工具创建/更新`/mock/[模块名称]/index.ts`文件
5. **类型验证**：运行`tnpm run tsc`确保无类型错误
6. **功能测试**：验证Mock端点返回预期数据

## 最佳实践示例

### 场景管理模块Mock实现（推荐方案）

```typescript
import { defineMock } from '@alipay/bigfish';

// ===== 直接返回静态JSON数据，确保可靠性 =====

// 场景列表查询的Mock响应（遵循CommonResult<T>格式）
const mockQueryListResponse = {
  success: true,
  data: {
    total: 3,
    list: [
      {
        id: 1,
        name: '生产环境监控',
        description: '用于监控生产环境的设备状态和性能指标',
        creator: '张三',
        creatorId: 'user-001',
        createTime: '2025-01-15T08:30:00Z',
        admins: [/* 管理员列表 */],
        status: 'active'
      }
    ],
    page: 1,
    pageSize: 10
  },
  message: '获取场景列表成功'
};

// ===== 使用defineMock定义简单的Mock服务 =====
export default defineMock({
  // 尊重实际服务实现：POST而非GET
  'POST /api/scene/queryList': (req, res) => {
    // 直接返回静态响应，不进行任何复杂处理
    return res.status(200).json(mockQueryListResponse);
  },

  // 所有端点保持相同的简单模式
  'POST /api/scene/getDetail': (req, res) => {
    return res.status(200).json(mockGetDetailResponse);
  }
});
```

### 不推荐的复杂实现（避免使用）

```typescript
// ❌ 避免：过度工程化，引入复杂性和错误
'POST /api/scene/queryList': async (req, res) => {
  try {
    // 复杂的参数解析和验证
    const params = req.data;
    if (!params) throw new Error('参数缺失');

    // 模拟网络延迟（开发阶段不需要）
    await new Promise(resolve => setTimeout(resolve, 300));

    // 动态数据生成逻辑
    const data = generateDynamicData(params);

    res.status(200).json(data);
  } catch (error) {
    // 多层异常处理
    res.status(500).json({ error: 'Mock错误' });
  }
}
```

### 错误场景模拟（仅在必要时使用）

```typescript
// ✅ 仅在需要测试错误处理时添加
'POST /api/scene/error-test': (req, res) => {
  const { errorType } = req.data || {};

  if (errorType === 'permission') {
    return res.status(403).json({
      success: false,
      message: '权限不足'
    });
  }

  // 默认返回成功响应
  return res.status(200).json({
    success: true,
    data: { /* 正常数据 */ },
    message: '操作成功'
  });
}
```

## 核心原则

### ✅ 优先采用的原则
- **类型一致性**：Mock响应结构与`interface.ts`定义100%匹配
- **静态数据优先**：开发阶段使用静态JSON，简单可靠
- **服务真实性**：遵循实际服务实现，非臆测RESTful规范
- **无复杂逻辑**：避免参数解析、网络延迟、动态数据生成

### ❌ 避免的做法
- 使用`setTimeout`模拟网络延迟
- 复杂的参数验证和错误处理逻辑
- 臆测HTTP方法（如使用GET代替实际服务的POST）
- 使用`any`类型或非标准字段名称

### ⚠️ 注意事项
- 定期运行`npm run tsc`验证类型正确性
- 确保所有字段名称与接口定义完全一致
- Mock端点应独立工作，不依赖外部状态
- 开发完成后及时切换到真实API

### 🛠️ 验证清单
- [ ] 响应结构符合`CommonResult<T>`格式
- [ ] 所有字段与`interface.ts`定义完全匹配
- [ ] HTTP方法与实际服务一致
- [ ] 无TypeScript类型错误
- [ ] Mock数据在浏览器中正常显示

## 实际案例参考

### 近期成功实现
- **场景管理模块**：`/mock/scene-management/index.ts`
  - 实现了5个POST端点的静态Mock数据
  - 100%类型安全，无任何类型错误
  - 遵循实际服务实现（非臆测）

### 技术规范参考
- BigFish Mock功能规范: `.context/knowledge/mock-guide.md`
- TypeScript接口定义: `src/services/[模块]/interface.ts`
- 服务实现参考: `src/services/[模块]/index.ts`

### 最佳实践文件
- 场景管理Mock示例: `mock/scene-management/index.ts`
- 页面配置编辑器Mock: `mock/pageConfigEditor/index.ts`

## 支持的工具

此技能允许使用以下工具：
- Read: 查看接口定义和现有Mock文件
- Grep: 搜索项目中的相关文件和代码模式
- Glob: 查找mock目录下的所有Mock文件
- Write: 创建新的Mock文件
- Edit: 修改现有的Mock文件
- Bash: 执行类型检查`tnpm run tsc`

## 版本历史

- **v2.0.0** (2025-10-21): 重大更新，强调"静态JSON优先"原则
  - 移除网络延迟模拟建议
  - 强调类型一致性和服务真实性
  - 添加验证清单和核心原则
  - 基于实际场景管理模块经验优化

- **v1.0.0** (初始版本): 基础Mock生成功能

此技能专注于生成和维护Mock数据，帮助前端团队在后端API开发完成前进行独立开发和测试，重点保证数据的可靠性和一致性。