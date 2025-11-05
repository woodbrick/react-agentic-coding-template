<metadata updated="2025-10-28" version="1.1.0" name="ProTable 组件模式">
  <keywords>ProTable, 表格组件, 数据管理, TypeScript, BigFish</keywords>
</metadata>

# 📊 ProTable 组件模式

> 基于 ProTable 的高效数据表格开发模式和最佳实践

## 🎯 概述

ProTable 是 Ant Design Pro Components 提供的强大表格组件，结合了表格展示、搜索、筛选、分页等常用功能，是 BigFish 框架中数据管理页面的核心组件。本模式基于实际项目应用经验，提供标准化的开发指导。

## 📖 核心概念

### 1. request 方法

`request` 是 ProTable 最重要的 API，会接收一个对象。对象中必须要有 `data` 和 `success`，如果需要手动分页 `total` 也是必需的。`request` 会接管 loading 的设置，同时在查询表单查询时和 params 参数发生修改时重新执行。同时查询表单的值和 params 参数也会带入。

```tsx
<ProTable<DataType, Params>
  // params 是需要自带的参数
  // 这个参数优先级更高，会覆盖查询表单的参数
  params={params}
  // 默认不要定制 pagination 属性
  request={async (
    // 第一个参数 params 查询表单和 params 参数的结合
    // 第一个参数中一定会有 pageSize 和 current，这两个参数是 antd 的规范
    params: T & {
      pageSize: number;
      current: number;
    },
    sort,

  // 默认用column自带搜索条件, 这里会获得查询参数filter,不要重复托管filter状态
    filter,
  ) => {
    // 这里需要返回一个 Promise，在返回之前你可以进行数据转化
    // 如果需要转化参数可以在这里进行修改
    const msg = await myQuery({
      page: params.current,
      pageSize: params.pageSize,
    });
    return {
      data: msg.result,
      // success 请返回 true
      // 不然 table 会停止解析数据，即使有数据
      success: boolean,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: number,
    };
  }}
/>
```

## 🔧 API 参考

### ProTable 组件属性

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `request` | 获取 dataSource 的方法 | `(params?: {pageSize,current},sort,filter) => {data,success,total}` | - |
| `params` | 用于 request 查询的额外参数，一旦变化会触发重新加载 | `object` | - |
| `postData` | 对通过 request 获取的数据进行处理 | `(data: T[]) => T[]` | - |
| `defaultData` | 默认的数据 | `T[]` | - |
| `dataSource` | Table 的数据，ProTable 推荐使用 request 来加载 | `T[]` | - |
| `onDataSourceChange` | Table 的数据发生改变时触发 | `(dataSource: T[]) => void` | - |
| `actionRef` | Table action 的引用，便于自定义触发 | `MutableRefObject<ActionType>` | - |
| `formRef` | 可以获取到查询表单的 form 实例，用于一些灵活的配置 | `MutableRefObject<FormInstance>` | - |
| `toolBarRender` | 渲染工具栏，支持返回一个 dom 数组，会自动增加 margin-right | `(action) => ReactNode[]` | - |
| `onLoad` | 数据加载完成后触发，会多次触发 | `(dataSource: T[]) => void` | - |
| `onLoadingChange` | loading 被修改时触发，一般是网络请求导致的 | `(loading:boolean)=>void` | - |
| `onRequestError` | 数据加载失败时触发 | `(error) => void` | - |
| `tableClassName` | 封装的 table 的 className | `string` | - |
| `tableStyle` | 封装的 table 的 style | `CSSProperties` | - |
| `options` | table 工具栏，设为 false 时不显示，传入 function 会点击时触发 | `{{ density?: boolean, fullScreen?: boolean, reload?: boolean, setting?: boolean }}` | `{ fullScreen: false, reload: true, density: true, setting: true }` |
| `search` | 是否显示搜索表单，传入对象时为搜索表单的配置 | `false | SearchConfig` | - |
| `defaultSize` | 默认的 size | `SizeType` | - |
| `dateFormatter` | 转化 moment 格式数据为特定类型，false 不做转化 | `"string" | "number" | ((value: Moment, valueType: string) => string, number) | false` | `"string"` |
| `beforeSearchSubmit` | 搜索之前进行一些修改 | `(params:T)=>T` | - |
| `onSizeChange` | table 尺寸发生改变 | `(size: 'default' | 'middle' | 'small') => void` | - |
| `type` | pro-table 类型 | `"form"` | - |
| `form` | antd form 的配置 | `FormProps` | - |
| `onSubmit` | 提交表单时触发 | `(params: U) => void` | - |
| `onReset` | 重置表单时触发 | `() => void` | - |
| `columnEmptyText` | 空值时的显示，不设置时显示 -，false 可以关闭此功能 | `string | false` | `false` |
| `tableRender` | 自定义渲染表格函数 | `(props,dom,domList:{ toolbar,alert,table}) => ReactNode` | - |
| `toolbar` | 透传 ListToolBar 配置项 | `ListToolBarProps` | - |
| `tableExtraRender` | 自定义表格的主体函数 | `(props: ProTableProps<T, U>, dataSource: T[]) => ReactNode;` | - |
| `manualRequest` | 是否需要手动触发首次请求，配置为 true 时不可隐藏搜索表单 | `boolean` | `false` |
| `editable` | 可编辑表格的相关配置 | `TableRowEditable` | - |
| `cardBordered` | Table 和 Search 外围 Card 组件的边框 | `boolean | {search?: boolean, table?: boolean}` | `false` |
| `ghost` | 幽灵模式，即是否取消表格区域的 padding | `boolean` | `false` |
| `debounceTime` | 防抖时间 | `number` | `10` |
| `revalidateOnFocus` | 窗口聚焦时自动重新请求 | `boolean` | `false` |
| `columnsState` | 受控的列状态，可以操作显示隐藏 | `ColumnStateType` | - |
| `ErrorBoundary` | 自带了错误处理功能，防止白屏，ErrorBoundary=false 关闭默认错误边界 | `ReactNode` | 内置 ErrorBoundary |

### RecordCreator 属性

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `record` | 需要新增的行数据，一般来说包含唯一 key | `T` | `{}` |
| `position` | 行增加在哪里，开始或者末尾 | `top | bottom` | `bottom` |
| `(...buttonProps)` | antd 的 ButtonProps | `ButtonProps` | - |

### ColumnStateType 属性

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `defaultValue` | 列状态的默认值，只有初次生效，并用于重置使用 | `Record<string, ColumnsState>` | - |
| `value` | 列状态的值，支持受控模式 | `Record<string, ColumnsState>` | - |
| `onChange` | 列状态的值发生改变之后触发 | `(value:Record<string, ColumnsState>)=>void` | - |
| `persistenceKey` | 持久化列的 key，用于判断是否是同一个 table | `string | number` | - |
| `persistenceType` | 持久化列的类型，localStorage 设置在关闭浏览器后也是存在的，sessionStorage 关闭浏览器后会丢失 | `localStorage | sessionStorage` | - |

### Search 搜索表单属性

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `filterType` | 过滤表单类型 | `'query' | 'light'` | `'query'` |
| `searchText` | 查询按钮的文本 | `string` | `查询` |
| `resetText` | 重置按钮的文本 | `string` | `重置` |
| `submitText` | 提交按钮的文本 | `string` | `提交` |
| `labelWidth` | 标签的宽度 | `'number' | 'auto'` | `80` |
| `span` | 配置查询表单的列数 | `'number' | 'ColConfig'` | `defaultColConfig` |
| `className` | 封装的搜索 Form 的 className | `string` | - |
| `collapseRender` | 收起按钮的 render | `((collapsed: boolean,showCollapseButton?: boolean) => ReactNode)|false` | - |
| `defaultCollapsed` | 默认是否收起 | `boolean` | `true` |
| `collapsed` | 是否收起 | `boolean` | - |
| `onCollapse` | 收起按钮的事件 | `(collapsed: boolean) => void;` | - |
| `optionRender` | 自定义操作栏 | `((searchConfig,formProps,dom) => ReactNode[])|false` | - |
| `showHiddenNum` | 是否显示收起之后显示隐藏个数 | `boolean` | `false` |

## 🔧 Columns 列定义参考

> 请求远程数据比较复杂，详细可以看官方文档。

### Column 基本属性

| 属性 | 描述 | 类型 | 默认值 |
|------|------|------|--------|
| `title` | 与 antd 中基本相同，但是支持通过传入一个方法 | `ReactNode | ((config: ProColumnType<T>, type: ProTableTypes) => ReactNode)` | - |
| `tooltip` | 会在 title 之后展示一个 icon，hover 之后提示一些信息 | `string` | - |
| `ellipsis` | 是否自动缩略 | `boolean | {showTitle?: boolean}` | - |
| `copyable` | 是否支持复制 | `boolean` | - |
| `valueEnum` | 值的枚举，会自动转化把值当成 key 来取出要显示的内容 | `valueEnum` | - |
| `valueType` | 值的类型，会生成不同的渲染器 | `valueType` | `text` |
| `order` | 查询表单中的权重，权重大排序靠前 | `number` | - |
| `fieldProps` | 查询表单的 props，会透传给表单项，如果渲染出来是 Input，就支持 Input 的所有 props，同理如果是 select，也支持 select 的所有 props。也支持方法传入 | `(form,config)=>Record | Record` | - |
| `formItemProps` | 传递给 Form.Item 的配置，可以配置 rules，但是默认的查询表单 rules 是不生效的。需要配置 ignoreRules | `(form,config)=>formItemProps | formItemProps` | - |
| `renderText` | 类似 table 的 render，但是必须返回 string，如果只是希望转化枚举，可以使用 valueEnum | `(text: any,record: T,index: number,action: UseFetchDataAction<T>) => string` | - |
| `render` | 类似 table 的 render，第一个参数变成了 dom，增加了第四个参数 action | `(text: ReactNode,record: T,index: number,action: UseFetchDataAction<T>) => ReactNode | ReactNode[]` | - |
| `renderFormItem` | 渲染查询表单的输入组件 | `(item,{ type, defaultRender, formItemProps, fieldProps, ...rest },form) => ReactNode` | - |
| `search` | 配置列的搜索相关，false 为隐藏 | `false | { transform: (value: any) => any }` | `true` |
| `search.transform` | 转化值的 key, 一般用于时间区间的转化 | `(value: any) => any` | - |
| `editable` | 在编辑表格中是否可编辑的，函数的参数和 table 的 render 一样 | `false | (text: any, record: T,index: number) => boolean` | `true` |
| `colSize` | 一个表单项占用的格子数量，占比= colSize*span，colSize 默认为 1 ，span 为 8，span是form={{span:8}} 全局设置的 | `number` | - |
| `hideInSearch` | 在查询表单中不展示此项 | `boolean` | - |
| `hideInTable` | 在 Table 中不展示此列 | `boolean` | - |
| `hideInForm` | 在 Form 中不展示此列 | `boolean` | - |
| `hideInDescriptions` | 在 Descriptions 中不展示此列 | `boolean` | - |
| `filters` | 表头的筛选菜单项，当值为 true 时，自动使用 valueEnum 生成 | `boolean | object[]` | `false` |
| `onFilter` | 筛选表单，为 true 时使用 ProTable 自带的，为 false 时关闭本地筛选 | `(value, record) => boolean | false` | `false` |
| `request` | 从服务器请求枚举 | `request` | - |
| `initialValue` | 查询表单项初始值 | `any` | - |
| `disable` | 列设置中disabled的状态 | `boolean | { checkbox: boolean; }` | - |

## 💡 最佳实践

### 1. 性能优化

- **分页大小控制**：合理设置 `pageSize`，避免一次性加载过多数据
- **列定义优化**：使用 `width` 固定列宽，减少表格重排
- **虚拟滚动**：大数据量时启用 `virtual` 属性
- **懒加载**：复杂渲染内容使用 `React.lazy`

### 2. 代码组织

- **类型安全**：为所有数据定义 TypeScript 接口
- **列定义分离**：复杂表格将列定义提取到单独文件
- **业务逻辑封装**：表格操作逻辑封装为独立函数
- **错误处理**：统一的错误处理机制

### 3. 用户体验

- **搜索优化**：合理设置默认搜索条件
- **操作反馈**：所有操作提供明确的成功/失败反馈
- **加载状态**：数据加载时显示加载指示器
- **空状态**：无数据时提供友好的空状态提示

### 4. 项目规范

- **统一参数命名**：分页参数统一使用 `current` 和 `pageSize`
- **响应格式标准化**：统一使用 `CommonResult<T>` 接口
- **错误码处理**：统一的错误码映射和提示
- **权限控制**：按钮操作基于用户权限动态显示
- **request 方法规范**：
  - **参数结构**：必须包含 `pageSize` 和 `current` 参数
  - **参数转换**：在 request 方法内进行后端接口参数格式转换
  - **错误处理**：确保返回正确的 success 状态和数据格式
  - **空值处理**：为 data 和 total 设置默认值，避免 undefined 错误
  - **类型安全**：明确声明 params 参数的类型定义

## 📚 实际应用示例

### 完整的 ProTable 组件示例

```tsx
import React, { useRef } from 'react';
import { ProTable } from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';

interface UserItem {
  id: number;
  name: string;
  email: string;
  status: string;
}

const UserTable: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      // 启用搜索功能（简洁形式）
      search: true,
      // 自定义渲染函数
      render: (text, record, index, action) => (
        <div>
          <strong>{text}</strong>
          <br />
          <small style={{ color: '#999' }}>Code: {record.id}</small>
        </div>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      search: false,  // 禁用搜索
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // 启用搜索功能（完整形式）
      search: {
        transform: (value) => ({ status: value }),
      },
      valueEnum: {
        active: { text: '活跃', status: 'Success' },
        inactive: { text: '非活跃', status: 'Default' },
      },
      render: (text, record, index, action) => (
        <span style={{
          color: text === 'active' ? '#52c41a' : '#999'
        }}>
          {text === 'active' ? '✓ 活跃' : '○ 非活跃'}
        </span>
      )
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      search: false,
      render: (text, record, index, action) => [
        <a key="edit" onClick={() => console.log('编辑', record)}>编辑</a>,
        <a key="delete" onClick={() => console.log('删除', record)}>删除</a>,
      ],
    },
  ];

  return (
    <ProTable<UserItem>
      headerTitle="用户列表"
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: 120,
        defaultCollapsed: false,
      }}
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined />} type="primary">
          新建用户
        </Button>,
      ]}
      request={async (params: {
        current: number;
        pageSize: number;
        name?: string;    // 来自 search: true 的字段
        status?: string;  // 来自 search.transform 的字段
      }) => {
        // 直接使用 params 中的搜索参数，ProTable 自动传入
        const response = await fetchUsers({
          page: params.current,
          pageSize: params.pageSize,
          name: params.name,      // 搜索参数自动传入
          status: params.status,  // 搜索参数自动传入
        });

        return {
          data: response.data,
          success: response.success,
          total: response.total,
        };
      }}
      columns={columns}
      options={{
        density: true,
        fullScreen: true,
        reload: true,
        setting: true,
      }}
    />
  );
};

export default UserTable;
```

---

<reference type="guidance">
- [Ant Design Pro Components - ProTable](https://procomponents.ant.design/components/table)
</reference>