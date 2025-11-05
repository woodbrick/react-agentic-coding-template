<metadata updated="2025-10-28" version="1.0.0" name="ProForm 组件模式">
  <keywords>ProForm, 表单组件, 数据绑定, TypeScript, BigFish</keywords>
</metadata>

# 📝 ProForm 组件模式

> 基于 ProForm 的高效表单开发模式和最佳实践

## 🎯 概述

ProForm 是 Ant Design Pro Components 提供的增强表单组件，在原有的 Form 基础上增加了语法糖和更多布局设置，帮助我们快速开发表单。ProForm 添加了默认行为，让表单开箱即用。

支持分步表单、Modal 表单、Drawer 表单、查询表单、轻量筛选等多种布局，可以覆盖大部分使用场景，让我们脱离复杂繁琐的表单布局工作。

## 💡 核心特性

- **设置默认值**：使用 `initialValues`，避免直接使用组件 `value` 和 `onChange`
- **表单联动**：使用 `ProFormDependency` 处理依赖关系
- **异步提交**：`onFinish` 支持 Promise，自动设置按钮加载效果
- **值监听**：使用 `onValuesChange` 保持单向数据流
- **兼容性**：完全兼容 antd Form，支持自定义组件混用
## 🏗️ 基础用法模式

### 1. 设置默认值

```tsx
// 设置整体默认值
<ProForm initialValues={obj} />

// 设置单个控件默认值
<ProForm>
  <ProFormText initialValue="prop"/>
</ProForm>
```

### 2. 值变化监听

```tsx
<ProForm onValuesChange={(changeValues) => console.log(changeValues)}>
  {/* 表单控件 */}
</ProForm>
```

### 3. 组件联动

```tsx
<ProForm>
  <Form.Item noStyle shouldUpdate>
    {(form) => {
      return (
        <ProFormSelect
          options={[
            { value: "chapter", label: "盖章后生效" },
          ]}
          width="md"
          name="useMode"
          label={`与${form.getFieldValue("name")}合同约定生效方式`}
        />
      );
    }}
  </Form.Item>
</ProForm>
```

### 4. 使用自定义组件

```tsx
<ProForm>
  <Form.Item name="switch" label="Switch" valuePropName="checked">
    <Switch />
  </Form.Item>
</ProForm>
```

## 🎯 使用场景

### 何时使用 ProForm？

当你想快速实现一个表单但不想花太多时间去布局时，ProForm 是最佳选择。ProForm 是基于 antd Form 的可降级封装，与 antd 功能完全对齐，但增加了预设行为和多种布局。

| 布局类型 | 使用场景 | 核心功能 |
|----------|----------|----------|
| **ProForm** | 标准表单 | 增加了 onFinish 自动 loading 和根据 request 获取默认值 |
| **ModalForm / DrawerForm** | 弹窗表单 | 增加 trigger，无需维护 visible 状态 |
| **QueryFilter** | 筛选表单 | 配合其他数据展示组件使用 |
| **LightFilter** | 行内筛选 | 用于卡片操作栏和表格操作栏 |
| **StepsForm** | 分步表单 | 需要配置 StepForm 使用 |

## 🔄 数据转化

很多时候组件需要的数据和后端需要的数据之间不能完全匹配，ProForm 为了解决这个问题提供了 `transform` 和 `convertValue` 两个 API 来处理这种情况。

### 1. convertValue 前置转化

`convertValue` 发生在组件获得数据之前，一般是后端直接给前端的数据，有时需要精加工一下。

```tsx
export type SearchConvertKeyFn =
  (value: any, field: NamePath) => string | boolean | Record<string, any>;

interface ProFormFieldProps {
  /**
   * @name 获取时转化值，一般用于将数据格式化为组件接收的格式
   * @param value 字段的值
   * @param namePath 字段的name
   * @returns 字段新的值
   *
   * @example a,b => [a,b]
   * convertValue:(value,namePath)=>value.split(",")
   * @example string => json
   * convertValue:(value,namePath)=>JSON.parse(value)
   * @example number => date
   * convertValue:(value,namePath)=>Moment(value)
   * @example YYYY-MM-DD => date
   * convertValue:(value,namePath)=>Moment(value,"YYYY-MM-DD")
   * @example string => object
   * convertValue:(value,namePath)=>({value,label:value})
   */
  convertValue?: SearchConvertKeyFn;
}
```
### 2. transform 提交时转化

`transform` 发生在提交的时候，一般来说都是需要传递给后端存入数据库的数据。

为了方便使用，`ProFormDependency` 和 `formRef` 都支持 `transform`，可以获取到被转化后的值。

```tsx
<ProFormDependency>
  {(value, form) => {
    // value: 被 transform 转化之后的值
    // form: 当前的 formRef，可以获取未转化的值
    return ReactNode;
  }}
</ProFormDependency>
```

### 3. formRef 方法

`formRef` 内置了几个方法来获取转化之后的值，这也是相比 antd 的 Form 新增的功能：

```tsx
interface ProFormInstance<T> {
  /** 获取被 ProForm 格式化后的所有数据 */
  getFieldsFormatValue?: (nameList?: true) => T;
  /** 获取格式化之后的单个数据 */
  getFieldFormatValue?: (nameList?: NamePath) => T;
  /** 获取格式化之后的单个数据 */
  getFieldFormatValueObject?: (nameList?: NamePath) => T;
  /** 验证字段后返回格式化之后的所有数据 */
  validateFieldsReturnFormatValue?: (nameList?: NamePath[]) => Promise<T>;
}
```
### 4. transform 函数定义

```tsx
export type SearchTransformKeyFn = (
  value: any,
  namePath: string,
  allValues: any,
) => string | Record<string, any>;

interface ProFormFieldProps {
  /**
   * @name 提交时转化值，一般用于将值转化为提交的数据
   * @param value 字段的值
   * @param namePath 字段的name
   * @param allValues 所有的字段
   * @returns 字段新的值，如果返回对象，会和所有值深度 merge 一次
   *
   * @example {name:[a,b] => {name:a,b }
   * transform: (value,namePath,allValues)=> value.join(",")
   * @example {name: string => { newName:string }
   * transform: (value,namePath,allValues)=> { newName:value }
   * @example {name:moment} => {name:string
   * transform: (value,namePath,allValues)=> value.format("YYYY-MM-DD")
   * @example {name:moment}=> {name:时间戳}
   * transform: (value,namePath,allValues)=> value.valueOf()
   * @example {name:{value,label}} => { name:string}
   * transform: (value,namePath,allValues)=> value.value
   * @example {name:{value,label}} => { valueName,labelName  }
   * transform: (value)=>{valueName:value.value,labelName:value.name}
   */
  transform?: SearchTransformKeyFn;
}
```

## 💡 完整示例

### 综合应用示例

```tsx
import {
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  return (
    <ProForm
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values);
        message.success('提交成功');
      }}
      initialValues={{
        name: '蚂蚁设计有限公司',
        name2: '蚂蚁设计集团',
        useMode: 'chapter',
      }}
    >
      <ProFormText
        width="md"
        name="name"
        label="签约客户名称"
        tooltip="最长为 24 位"
        placeholder="请输入名称"
      />
      <ProFormText
        width="md"
        name={['name2', 'text']}
        label="签约客户名称"
        tooltip="最长为 24 位"
        placeholder="请输入名称"
      />
      {/* ProFormDependency 会自动注入并进行 shouldUpdate 比对 */}
      <ProFormDependency name={['name', ['name2', 'text']]}>
        {({ name, name2 }) => {
          return (
            <ProFormSelect
              options={[
                {
                  value: 'chapter',
                  label: '盖章后生效',
                },
              ]}
              width="md"
              name="useMode"
              label={`与《${name || ''}》 与 《${
                name2?.text || ''
              }》合同约定生效方式`}
            />
          );
        }}
      </ProFormDependency>
      {/* noStyle shouldUpdate 是必选的，写了 name 就会失效 */}
      <ProForm.Item noStyle shouldUpdate>
        {(form) => {
          return (
            <ProFormSelect
              options={[
                {
                  value: 'chapter',
                  label: '盖章后生效',
                },
              ]}
              width="md"
              name="useMode"
              label={`与《${form.getFieldValue('name')}》合同约定生效方式`}
            />
          );
        }}
      </ProForm.Item>
    </ProForm>
  );
};
```