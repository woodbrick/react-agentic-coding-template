<metadata updated="2025-11-03" version="3.0.0" name="页面基础示例">
  <keywords>PageContainer, 页面基础模板, 面包屑, 业务组件, 状态管理, 标准模板</keywords>
</metadata>

# 📦 页面基础示例

> 一个完整的页面基础模板，整合了 PageContainer、面包屑导航和业务组件状态管理的最佳实践

## 📋 标准页面模板

<method name="页面基础模板">

```tsx
// src/pages/ExamplePage/index.tsx
import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import BusinessTable from './components/BusinessTable';
import BusinessModal from './components/BusinessModal';

// 面包屑导航常量定义
const BREADCRUMB_ITEMS = [
  {
    title: (
      <>
        <HomeOutlined />
        <span>首页</span>
      </>
    ),
  },
  {
    title: '示例页面',
  },
];

const ExamplePage: React.FC = () => {
  return (
    <PageContainer
      header={{
        title: '示例页面',
        breadcrumb: {
          items: BREADCRUMB_ITEMS,
        },
      }}
    >
      {/* 业务组件自管理状态，不依赖 props 传递数据 */}
      <BusinessTable />
      <BusinessModal />
    </PageContainer>
  );
};

export default ExamplePage;
```
</method>

## 📌 关键规范

### 1. 页面容器 (PageContainer)
- 使用 `header={{ title: '...', breadcrumb: {...} }}` 集成标题和面包屑
- 禁止手动添加 `<div>` 容器嵌套
- 禁止添加额外的排版样式
- 保持简洁的容器结构

### 2. 面包屑导航
- 使用 `<HomeOutlined />` 等图标作为首页标识
- 使用 `<span>` 包裹文本确保样式一致
- 保持层级清晰，不超过 3-4 级
- 当前页面不添加链接

### 3. 业务组件状态管理
- 业务组件直接访问 `zustand store` 和 `service`
- 禁止从页面层传递 `data`, `loading`, `onUpdate` 等属性
- 业务组件自主管理数据加载和状态更新
- 页面层仅负责组件组合和布局控制

## ✅ 推荐实践

### 页面层职责
- 组合业务组件
- 控制页面结构
- 执行权限校验

### 业务组件职责
- 直接访问 store 和 service
- 管理数据加载和状态
- 处理业务逻辑

## ⚠️ 禁止行为

<bad-example>

```tsx
// ❌ 错误：页面层过度传递数据
const ExamplePage: React.FC = () => {
  const { data, loading, fetchData } = useExampleStore();

  return (
    <PageContainer>
      <BusinessTable
        data={data}
        loading={loading}
        onUpdate={fetchData}
      />
    </PageContainer>
  );
};

// ❌ 错误：页面容器嵌套
<PageContainer>
  <div className="wrapper">
    <div className="content">
      <BusinessTable />
    </div>
  </div>
</PageContainer>

// ❌ 错误：手动创建页头
<PageContainer>
  <div className="page-header">
    <h1>页面标题</h1>
    <div className="actions">
      <Button>操作</Button>
    </div>
  </div>
  <BusinessTable />
</PageContainer>
```
</bad-example>