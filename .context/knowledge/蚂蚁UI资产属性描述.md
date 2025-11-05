<metadata updated="2024-01-15" version="1.0" name="蚂蚁 UI 资产属性描述规范">
  <keywords>蚂蚁UI, 资产属性, JSON Schema, 属性规范, 组件配置, 类型约束, UI协议, 属性描述</keywords>
</metadata>

# 蚂蚁 UI 资产属性描述规范

## 1. 概述

本文档定义了蚂蚁 UI 资产的属性描述协议规范，基于 JSON Schema 标准进行扩展，用于统一描述 UI 组件的属性结构、类型约束和依赖关系。

## 2. 基础规范

### 2.1 通用规则

- **协议基础**：遵循 JSON Schema 规范
- **扩展能力**：在 JSON Schema 基础上增加属性标签、依赖约束等扩展描述字段

### 2.2 关键字定义

| 关键字     | 类型    | 说明                 | 示例                          |
| ---------- | ------- | -------------------- | ----------------------------- |
| type       | string  | 属性类型             | "string", "boolean", "number" |
| format     | string  | 语义化类型描述       | "url", "color", "date"        |
| tags       | array   | 自定义语义化标签     | ["required", "advanced"]      |
| deprecated | boolean | 标记不推荐使用的属性 | true                          |
| ignore     | boolean | 标记忽略的属性       | true                          |

> ⚠️ **禁用说明**：`condition` 和 `dependOn` 属性已禁用，不再使用

## 3. 基础类型规范

### 3.1 布尔类型

- **type**: `boolean`
- **扩展参数**:
  - `default`: 默认值
  - `title`: 字段名称
  - `description`: 字段描述

**示例**：

```json
{
  "type": "boolean",
  "default": true,
  "title": "开关",
  "description": "这是开关"
}
```

### 3.2 数字类型

- **type**: `number`
- **扩展参数**:
  - `default`: 默认值
  - `title`: 字段名称
  - `description`: 字段描述
  - `minimum`: 最小值（包含）
  - `maximum`: 最大值（包含）
  - `deprecatedmin`: 最小值（向后兼容）
  - `deprecatedmax`: 最大值（向后兼容）

**示例**：

```json
{
  "type": "number",
  "default": 10,
  "title": "数量",
  "description": "这是数量",
  "minimum": 10,
  "maximum": 20
}
```

### 3.3 字符串类型

- **type**: `string`
- **扩展参数**:
  - `default`: 默认值
  - `title`: 字段名称
  - `description`: 字段描述
  - `minLength`: 最小长度
  - `maxLength`: 最大长度
  - `pattern`: 正则表达式约束

**示例**：

```json
{
  "type": "string",
  "title": "名称",
  "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
}
```

### 3.4 数组类型

- **type**: `array`
- **扩展参数**:
  - `default`: 默认值
  - `title`: 字段名称
  - `description`: 字段描述
  - `minItems`: 最小元素数量
  - `maxItems`: 最大元素数量
  - `items`: 数组元素类型定义

**示例**：

```json
{
  "type": "array",
  "items": {
    "type": "number"
  }
}
```

### 3.5 对象类型

- **type**: `object`
- **扩展参数**:
  - `default`: 默认值
  - `title`: 字段名称
  - `description`: 字段描述
  - `category`: 属性分类，用于组件面板布局
  - `properties`: 对象属性定义
  - `required`: 必填属性列表

**示例**：

```json
{
  "type": "object",
  "properties": {
    "number": { "type": "number" },
    "street_name": { "type": "string" },
    "street_type": { "enum": ["Street", "Avenue", "Boulevard"] }
  },
  "required": ["street_name"]
}
```

### 3.6 枚举类型

- **type**: `string | number | boolean`
- **枚举定义**:
  - `enum`: 枚举值数组
  - `enumNames`: 枚举值描述数组（与 enum 一一对应）

**示例**：

```json
{
  "type": "string",
  "enum": ["red", "green"],
  "enumNames": ["红色", "绿色"]
}
```

### 3.7 组件类型

- **type**: `element`
- **扩展参数**:
  - `whitelist`: 允许的组件类型白名单

**示例**：

```json
{
  "type": "element",
  "whitelist": ["MenuItem"]
}
```

### 3.8 函数类型

- **type**: `function`
- **扩展参数**:
  - `signature`: 函数签名定义
    - `isAsync`: 是否异步函数
    - `arguments`: 参数定义数组
    - `returnType`: 返回值类型

**示例**：

```json
{
  "type": "function",
  "signature": {
    "isAsync": false,
    "arguments": [
      {
        "key": "name",
        "schema": { "type": "string" },
        "isRequired": false
      }
    ],
    "returnType": "string"
  }
}
```

### 3.9 Any 类型

- **type**: `any`
- **说明**: 用于暂时无法确定类型的场景

**示例**：

```json
{
  "type": "any",
  "description": "用来表示无法确定的类型"
}
```

## 4. 格式约束规范

格式约束通过`format`属性对基础类型进行语义化描述。

### 4.1 支持的格式类型

| 格式类型 | 说明 | 示例值 | 渲染组件 |
| --- | --- | --- | --- |
| url | URL 链接 | "http://yuque.antfin-inc.com" | 链接输入框 |
| multiline | 多行文本 | "123\n456" | TextArea |
| html | HTML 内容 | "<p>标题</p>" | 富文本编辑器 |
| date | 日期 | "2018-11-13" | 日期选择器 |
| dateTime | 日期时间 | "2018-11-13T20:20:39+00:00" | 日期时间选择器 |
| dateRange | 日期区间 | ["2018-11-13", "2018-11-14"] | 日期区间选择器 |
| dateTimeRange | 日期时间区间 | ["2018-11-13T20:20:39+00:00", "2018-11-14T20:20:39+00:00"] | 日期时间区间选择器 |
| color | 颜色值 | "#000000" 或 "rgba(0,0,0,0.5)" | 颜色选择器 |

### 4.2 格式约束示例

```json
// URL格式
{
  "type": "string",
  "format": "url"
}

// 多行文本
{
  "type": "string",
  "format": "multiline"
}

// 颜色格式
{
  "type": "string",
  "format": "color"
}
```

## 5. 参考链接

- 原文档：https://yuque.antfin.com/hitu/assets-spec/props
