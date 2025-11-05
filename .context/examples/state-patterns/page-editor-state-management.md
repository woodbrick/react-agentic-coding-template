# 页面编辑器状态管理案例

<metadata updated="2025-10-30" version="2.1.0" name="页面编辑器状态管理案例">
  <keywords>状态管理, Zustand, 业务状态, 不可变更新, Store层规范</keywords>
</metadata>

本案例展示页面编辑器场景下符合状态层规范的实现模式，重点演示**业务数据存储**、**不可变状态更新**和**异步操作规范**。

## 📁 目录结构

```
src/stores/pageConfigEditorStore/
└── index.ts          # 状态管理实现（类型定义内联）
```

<reference type="guidance">
完整规范参见 `.context/rules/state-layer-standards.md`
</reference>

## 🔧 状态管理实现

```typescript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// 复用Service层数据模型定义
type ModuleConfig = {
  spm: string;
  type: string;
  props: Record<string, any>;
  children?: ModuleConfig[];
};

type PageConfig = {
  pageId: string;
  pageName: string;
  components: ModuleConfig[];
  configVersion: number;
};

interface PageEditorState {
  pageConfig: PageConfig | null;
  modules: ModuleConfig[];
  currentEditingSpm?: string;
}

interface PageEditorActions {
  loadPageConfig: (config: PageConfig) => void;
  updateModule: (spm: string, data: Partial<ModuleConfig>) => void;
  addModule: (module: ModuleConfig) => void;
  removeModule: (spm: string) => void;
  reorderModules: (spmList: string[]) => void;
  setCurrentEditing: (spm?: string) => void;
  savePageData: (pageData: PageConfig) => Promise<void>;
}

export const usePageEditorStore = create<PageEditorState & PageEditorActions>()(
  immer((set, get) => ({
    pageConfig: null,
    modules: [],
    currentEditingSpm: undefined,

    loadPageConfig: (config) => {
      set((state) => {
        state.pageConfig = config;
        state.modules = config.components || [];
      });
    },

    updateModule: (spm, data) => {
      set((state) => {
        const moduleIndex = state.modules.findIndex((m) => m.spm === spm);
        if (moduleIndex >= 0) {
          Object.assign(state.modules[moduleIndex], data);
        }
      });
    },

    addModule: (module) => {
      set((state) => {
        state.modules.push(module);
      });
    },

    removeModule: (spm) => {
      set((state) => {
        state.modules = state.modules.filter((m) => m.spm !== spm);
      });
    },

    reorderModules: (spmList) => {
      set((state) => {
        state.modules = spmList
          .map((spm) => state.modules.find((m) => m.spm === spm))
          .filter(Boolean) as ModuleConfig[];
      });
    },

    setCurrentEditing: (spm) => {
      set((state) => {
        state.currentEditingSpm = spm;
      });
    },

    savePageData: (pageData) => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          try {
            set((state) => {
              state.pageConfig = pageData;
              state.modules = pageData.components || [];
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        }, 1000);
      });
    },
  }))
);
```

## 🔍 使用示例

```typescript
// 精确订阅派生数据
const PageEditorComponent = () => {
  const { modules, currentEditingSpm } = usePageEditorStore(
    (state) => ({
      modules: state.modules,
      currentEditingSpm: state.currentEditingSpm
    })
  );

  const moduleCount = modules.length;
  const publishedModules = useMemo(
    () => modules.filter((m) => m.status === 'published'),
    [modules]
  );

  const currentEditingModule = useMemo(
    () => modules.find((m) => m.spm === currentEditingSpm),
    [modules, currentEditingSpm]
  );

  return (
    <div>
      <div>模块总数：{moduleCount}</div>
      <div>已发布模块：{publishedModules.length}</div>
      {currentEditingModule && (
        <div>当前编辑：{currentEditingModule.type}</div>
      )}
    </div>
  );
};
```

<reference type="guidance">
完整实现模式参考 `.context/examples/antd-pro-patterns/pro-table.md`
</reference>

## 🎯 关键特性

- **业务数据存储**：仅存储服务端返回的核心数据
- **不可变更新**：使用Zustand Immer中间件进行状态变更
- **Promise异步**：遵循Store层规范
- **内联类型**：类型定义与实现一体化
