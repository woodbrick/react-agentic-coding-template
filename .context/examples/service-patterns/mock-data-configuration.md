# Mock数据配置案例

本案例展示服务层中Mock数据的配置方式。

## Mock文件示例

```typescript
// mock/page-config.ts
export default {
  // 查询页面列表
  'POST /api/page-config/list': {
    code: 200,
    data: {
      list: [
        {
          pageId: 'home-001',
          pageName: '首页配置',
          components: [],
          configVersion: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ],
      total: 1,
    },
  },

  // 查询页面详情
  'GET /api/page-config/:pageId': (req: any, res: any) => {
    const { pageId } = req.params;
    res.json({
      code: 200,
      data: {
        pageId,
        pageName: `页面-${pageId}`,
        components: [],
        configVersion: 1,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    });
  },

  // 创建页面配置
  'POST /api/page-config': (req: any, res: any) => {
    const data = req.body;
    res.json({
      code: 200,
      data: {
        ...data,
        pageId: `page-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  },
};
```
