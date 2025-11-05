
# 创建下个Story任务

## 目的

根据项目进度和PRD定义确定下一个逻辑Story,然后使用`Story模板`准备一个全面,自包含且可执行的Story文件.此任务确保Story包含所有必要的技术上下文,需求和验收标准,使其准备好由开发代理高效实施,最大限度地减少额外研究或自行查找上下文的需求.

## 概念说明
Story AC 指(Acceptance Criteria,验收标准)是衡量用户故事是否成功完成的客观,可验证的标准清单,确保开发团队和产品团队对"完成"有共同的理解.

## 顺序任务执行(当前任务完成前请勿继续)

### 1. 确定要准备的下一个Story

#### 1.1 定位PRD文件并审查现有Story

- 基于 `prd`,定位PRD文件
- 如果 `.context/stories/` 中有Story文件,加载最新的 `{PRD名称}.{storyNum}.story.md` 文件
- **如果最新Story存在:**
  - 验证状态是否为'完成'.如果不是,提醒用户:"警报:发现未完成的Story文件:{PRD名称}.{lastStoryNum}.story.md 状态:[当前状态] 您应该先修复此Story,但您是否愿意接受风险并覆盖以创建下一个草稿Story？"
  - 如果继续,在当前PRD中选择下一个顺序Story
  - 如果PRD完成,提示用户:"PRD {PRD名称} 完成: 需求 {PRD名称} 中的所有Story都已完成.您希望: 1) 选择特定Story进行处理 2) 取消Story创建"
  - **关键**:永远不要自动跳到另一个PRD.用户必须明确指示要创建哪个Story.
- **如果不存在Story文件:** 下一个Story始终是 {PRD名称}.1(第一个Story)
- 向用户宣布识别到的Story:"已确定下一个要准备的Story:{PRD名称}.{storyNum} - {Story标题}"

### 2. 收集Story需求和上一个Story上下文

#### 2.1 收集Story需求和历史上下文

- 从识别的PRD文件中提取Story需求
- 如果上一个Story存在,审查开发代理记录部分以获取:
  - 完成说明和调试日志引用
  - 实施偏差和技术决策
  - 遇到的挑战和经验教训
- 提取对当前Story准备有影响的相关见解

#### 2.2 收集实现参考案例

- **搜索匹配的实现案例**：在 `.context/examples/` 中寻找与当前需求相似的实现
- **记录参考信息**：
  - 文件路径和行号 (如：`src/components/SceneManage/index.tsx:45-78`)
  - 核心实现思路和技术方案
  - 可复用的组件结构和模式
- **避免重复拷贝代码**：仅记录位置信息，不复制具体代码实现
- **分析实现差异**：对比参考案例与当前需求的差异，明确需要调整的部分

#### 2.3 记录待澄清需求

- 识别PRD中表述模糊或存在歧义的需求点
- 记录需要与产品负责人进一步确认的技术细节
- 汇总开发时需要提出的技术疑问
- 将待澄清项整理为明确的问题列表，便于后续沟通

### 3. 收集架构上下文

#### 3.1 确定架构阅读策略

- 阅读 `.context/rules/application-layer-standards.md`, `.context/rules/architecture-standards.md` 然后按照下面的结构化阅读顺序


#### 3.2 架构设计和复杂度评估

**3.2.1 项目复杂度判断**
- 分析Story需求，判断功能复杂度：
  - **简单增删改查**：单一数据源操作，无跨组件状态传递，基础表单/表格展示
  - **复杂功能**：跨多层组件联动、状态管理、复杂业务逻辑、多数据源交互
- **架构方案决策**：
  - 简单功能：直接使用 AntD Table/Form 方案，避免过度设计
  - 复杂功能：仅当需要跨组件共享状态数据时, 谨慎考虑 Store 层职责和状态管理方案

**3.2.2 根据Story类型阅读架构文档**

**适用于所有Story:**
.context/rules/architecture-standards.md,
.context/rules/testing-standards.md

**对于 业务功能变更,额外阅读:**
.context/rules/service-layer-standards.md,
.context/rules/state-layer-standards.md,

**对于 UI交互变更,额外阅读:**
.context/rules/component-standards.md,

#### 3.3 提取Story特定技术细节

**ALWAYS**: 仅提取与实施当前Story直接相关的信息.
**NEVER**: 发明源文档中不存在的新库,模式或标准.

提取:

- Story将使用的特定数据模型,模式或结构
- Story设计的页面名称和相对路径
- Story必须实现或消费的API接口
- Story中 UI 元素的组件规范
- 新代码的文件路径和命名约定
- Story功能特定的测试要求
- 影响Story的安全或性能考虑

始终引用源文档:`[来源:.context/rules/{文件名}.md#{部分}]`

#### 3.4 服务层接口类型定义规范

**重要原则**: 不要主动设计服务层接口类型定义，除非找到相关的后端接口文档，有准确可靠的参考依据时才编写到文档中

**参考依据**: 接口文档参考案例 `.context/prds/自动化评测接口文档.md`

**服务层接口类型定义标准流程**:

1. **验证接口文档存在性**:
   - 确保有可靠的后端接口文档（如`.context/prds/自动化评测接口文档.md`）
   - 接口文档必须包含完整的请求/响应类型定义

2. **提取准确接口信息**:
   - **路径映射**: 将API路径映射到服务方法名称（如`/api/dataops/eval/querySceneList` → `querySceneList`）
   - **类型继承**: 遵循接口文档中的类型定义（如`CommonResult<T>`, `DataOpsPageResponse<T>`）
   - **字段一致性**: 确保请求参数和响应字段名称与接口文档完全一致

3. **类型引用规范**:
   - **数据模型**: 使用接口文档中定义的完整类型（如`EvalSceneModel`, `UserInfo`）
   - **响应类型**: 统一使用`CommonResult<T>`包装响应数据
   - **分页类型**: 使用`DataOpsPageResponse<T>`进行分页查询

4. **服务接口定义示例**:
   ```typescript
   /**
    * 场景管理服务接口定义
    * [来源:.context/prds/自动化评测接口文档.md#1-评测场景管理]
    */
   export interface LlmSceneManageService {
     // 查询场景列表 - /api/dataops/eval/querySceneList
     querySceneList(request: QuerySceneListRequest): Promise<CommonResult<QuerySceneListResponse>>;

     // 创建场景 - /api/dataops/eval/createScene
     createScene(request: CreateSceneRequest): Promise<CommonResult<CreateSceneResponse>>;
   }
   ```

5. **类型定义准确性验证**:
   - 检查字段命名是否与接口文档一致
   - 验证数据类型是否匹配后端接口
   - 确保分页参数格式正确（如`pageNum`, `pageSize`而非`page`, `size`）
   - 添加必要的接口文档来源引用

### 4. 验证项目结构对齐

- 将Story需求与 `.context/rules/architecture-standards.md` 中的项目结构指南进行交叉引用
- 确保文件路径,组件位置或模块名称与定义的结构对齐
- 在Story草稿中的"项目结构说明"部分记录任何结构冲突

### 5. 使用完整上下文填充Story模板

- 使用Story模板创建新Story文件:`.context/stories/{PRD名称}.{storyNum}.story.md`
- 填写基本Story信息:标题,状态(草稿),Story说明,PRD中的验收标准
- **`开发说明`部分(关键):**
  - **IMPORTANT**: 此部分必须仅包含从架构文档中提取的信息.永远不要发明或假设技术细节.
  - **服务层接口类型定义限制**: 不要主动设计服务层接口类型定义，除非找到相关的后端接口文档，有准确可靠的参考依据时才编写到文档中。接口文档参考案例 `.context/prds/自动化评测接口文档.md`
  - **架构设计方案**: 根据复杂度评估结果明确架构选择
    - 简单功能：采用 AntD Table 原生方案，无需 Store 层
    - 复杂功能：详细说明 Store 层职责和状态管理设计
  - 包括来自步骤 2-3 的所有相关技术细节,按类别组织:
    - **上一个Story见解**:来自上一个Story的关键学习
    - **实现参考案例**:来自 `.context/examples/` 的匹配实现参考
    - **复杂度评估**:功能复杂度判断和架构决策依据
    - **数据模型**:特定模式,验证规则,关系[带来源引用]
    - **API 规范**:端点详情,请求/响应格式,认证要求[带来源引用]
    - **组件规范**:UI 组件详情,属性,状态管理[带来源引用]
    - **文件位置**:基于项目结构创建新代码的确切路径
    - **测试要求**:来自 .context/rules/testing-standards.md 的特定测试用例或策略
    - **技术约束**:版本要求,性能考虑,安全规则
  - 每个技术细节必须包含其来源引用:`[来源:.context/rules/{文件名}.md#{部分}]`
  - 如果在架构文档中找不到某个类别的信息,请明确说明:"在架构文档中未找到特定指导"
  - **服务层接口类型特殊处理**: 如果接口文档不存在或不完整，在Story中明确说明"服务层接口类型需与后端开发同步确定"
- **`任务/子任务`部分:**
  - 基于仅以下内容生成详细的,顺序的技术任务列表:PRD需求,Story AC,审查的架构信息
  - 每个任务必须引用相关的架构文档
  - **服务层开发任务要求**: 如果涉及服务层接口定义，任务必须明确要求基于接口文档进行类型定义，禁止自行发明接口类型
  - **接口验证任务**: 对于关键API接口，添加接口定义验证子任务，确保类型与接口文档完全一致
  - 基于测试策略包括明确的单元测试子任务
  - 在适用时链接任务到 AC(例如,`任务 1 (AC: 1, 3)`)
- 添加在步骤 4 中发现的关于项目结构对齐或差异的说明

### 6. Story草稿完成和审查

- 审查所有部分的完整性和准确性
- 验证所有技术细节都包含来源引用
- **接口定义准确性验证**: 确保服务层接口类型定义完全基于接口文档，验证字段名称、类型、分页参数等细节与文档一致
- 确保任务与PRD需求和架构约束对齐
- **服务层接口完整性检查**: 确认如果接口文档存在，Story中包含完整的服务接口定义；如果不存在，Story中明确说明待开发状态
- 将状态更新为"草稿"并保存Story文件
- 执行 `.context/tasks/execute-checklist` `.context/checklists/story-draft-checklist`
- 向用户提供摘要,包括:
  - 创建的Story:`.context/stories/{PRD名称}.{storyNum}.story.md`
  - 状态:草稿
  - 从架构文档中包含的关键技术组件
  - **接口文档使用情况**: 是否基于接口文档定义服务层类型，或者说明待开发状态
  - PRD和架构之间注意到的任何偏差或冲突
  - 检查清单结果
  - 后续步骤:对于复杂Story,建议用户仔细审查Story草稿,并可选地让产品负责人运行任务 `.context/tasks/validate-next-story`

