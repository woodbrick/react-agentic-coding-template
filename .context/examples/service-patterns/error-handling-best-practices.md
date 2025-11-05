# 错误处理最佳实践案例

本案例展示服务层中错误处理的最佳实践。

## 统一错误处理

```typescript
// 错误类型定义
export class ApiError extends Error {
  constructor(message: string, public code: number, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

// 带错误处理的接口封装
export async function safeQueryPageDetail(pageId: string) {
  try {
    const response = await request<ResponseData<IPageConfig>>(
      `/api/page-config/${pageId}`,
    );

    if (response.code !== 200) {
      throw new ApiError(response.message || '查询失败', response.code);
    }

    return response.data;
  } catch (error) {
    console.error('查询页面配置失败:', error);

    // 网络错误处理
    if (error instanceof TypeError && error.message.includes('Network')) {
      throw new ApiError('网络连接失败，请检查网络', 0);
    }

    // 其他错误处理
    throw error;
  }
}
```
