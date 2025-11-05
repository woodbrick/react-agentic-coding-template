<metadata updated="2024-01-15" version="1.0" name="SchemaEditor 使用指南">
  <keywords>SchemaEditor, JSON Schema, 蚂蚁资产协议, 配置表单, 闪蝶搭建, 表单渲染, 蚂蚁UI, 组件配置</keywords>
</metadata>

# SchemaEditor 学习总结

## 概述

SchemaEditor (简称 SE) 是一套通过蚂蚁统一的资产描述协议 JSON Schema 驱动的配置类、表单类渲染方案，主要服务于闪蝶搭建与闪蝶应用配置。

## 核心特点

- **协议驱动**：基于蚂蚁统一的资产描述协议 JSON Schema
- **轻量级**：简洁易用的设计
- **简洁易用**：提供直观的配置和表单渲染体验

## 安装方式

通过 tnpm 命令安装：

```bash
tnpm install @alipay/schema-editor
```

## 基本使用

@alipay/schema-editor 默认导出的是一个 SchemaEditor 组件，包含三个核心 API：

### 核心 API

1. **schema**：基于蚂蚁协议扩展出来的闪蝶协议

   - 是蚂蚁协议的超集
   - 详细协议描述见官方文档

2. **value**：通过协议渲染出来的数据

   - JSON 格式
   - 存储表单配置结果

3. **onChange**：数据变化时触发的事件
   - 返回值是全量数据
   - React 受控模式

### 基本使用示例

```tsx
import SchemaEditor from '@alipay/schema-editor';

function Demo() {
  const [value, setValue] = useState({});

  return (
    <SchemaEditor
      schema={jsonSchema}
      value={value}
      onChange={(val) => setValue(val)}
    />
  );
}
```

## Schema DSL

核心属性参考 .context/knowledge/蚂蚁 UI 资产属性描述.md Schema 还可以通过闪蝶 DSL 描述，需要经过两个工具包进行协议解析与转换：

### 所需工具包

1. **@alipay/morpho-schema-util**：协议解析
2. **@alipay/shandie-schema-utils**：协议转换

### DSL 示例

原始 Morpho Schema DSL：

```json
Object(Demo) {
  title(标题): String [maxLength: 10, placeholder: "请输入标题，最多10个字符"]
}
```

### 完整使用流程

```tsx
import * as schemaUtil from '@alipay/morpho-schema-util';
import { transform } from '@alipay/shandie-schema-utils';

// 协议解析与转换
const morphoJsonSchema = schemaUtil.schema(rawMorphoSchema, undefined);
const jsonSchema = transform(morphoJsonSchema);

export default function Demo() {
  const [value, setValue] = useState({});

  return (
    <SchemaEditor
      schema={jsonSchema}
      value={value}
      onChange={(val) => setValue(val)}
    />
  );
}
```

## 案例

```
const schema = {
  type: 'object',
  properties: {
    string: {
      type: 'string',
      title: 'String 输入框',
      maxLength: 10,
      renderOptions: {
        placeholder: '请输入标题，最多10个字符',
      },
    },
    boolean: {
      type: 'boolean',
      title: 'Boolean 开关',
    },
    number: {
      type: 'number',
      title: 'Number 数字',
    },
    date: {
      type: 'number',
      title: 'Date 日期',
      format: 'dateTime',
    },
    image: {
      title: 'Image 图片',
      description: '建议尺寸：750*360',
      renderType: 'Image',
    },
    url: {
      type: 'string',
      title: 'URL 链接',
      format: 'url',
    },
    color: {
      type: 'string',
      title: 'Color 颜色选择器',
      format: 'color',
    },
    richText: {
      type: 'string',
      title: 'RichText 富文本',
      format: 'html',
    },
    enum: {
      type: 'string',
      title: 'Enum 枚举',
      renderType: 'EnumSingle',
      enum: ['apple', 'banana', 'orange'],
      enumNames: ['苹果', '香蕉', '橘子'],
    },
    enumSingleColor: {
      type: 'string',
      title: 'EnumSingleColor 颜色枚举',
      renderType: 'EnumSingleColor',
      enum: ['$FFF5E3$FF6B00', '$FFE6E6$FF4000', '$E7F1FF$1678FF', '$E7F1FF$00AAFF'],
      enumNames: ['橙色', '红色', '蓝色', '浅蓝'],
    },
  },
};
```

## 渲染效果

- 提供实时体验与编辑的在线链接
- 支持复杂案例的渲染展示
- 可通过链接实时体验不同配置效果

## 应用场景

- 闪蝶搭建平台
- 闪蝶应用配置
- 需要基于协议驱动的表单配置场景

原文档链接 https://yuque.antfin.com/shandie/open/schema-editor-intro
