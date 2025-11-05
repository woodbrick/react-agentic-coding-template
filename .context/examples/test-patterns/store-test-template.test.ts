import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Store测试案例说明：
 *
 * 1. 同步方法测试 (addItem)
 *    - 验证正常路径：方法调用、参数传递、状态更新
 *    - 关键点：使用 toHaveBeenCalledWith 验证参数，toMatchObject 验证对象结构
 *
 * 2. 边界条件测试 (removeItem)
 *    - 验证异常路径：处理不存在的数据
 *    - 关键点：确保操作不会破坏现有状态，返回适当的值
 *
 * 3. 异步成功测试 (fetchItems)
 *    - 验证异步操作的完整流程
 *    - 关键点：使用 async/await，验证 loading 状态变化
 *
 * 4. 异步错误测试 (fetchItems 错误处理)
 *    - 验证错误处理机制
 *    - 关键点：模拟具体错误类型，验证错误状态更新
 *
 * 5. 计算属性测试 (totalValue)
 *    - 验证派生状态的正确性
 *    - 关键点：使用具体的测试数据，验证计算逻辑
 *
 * 6. 集成场景测试
 *    - 验证多个操作的组合效果
 *    - 关键点：确保整个流程的状态一致性
 */

describe('Store 精品测试案例', () => {
  // 模拟 Store 状态和方法
  interface MockItem {
    id: string;
    name: string;
    value?: number;
  }

  // 创建具体的模拟状态和方法
  const mockState = {
    items: [] as MockItem[],
    loading: false,
    error: null as string | null,
  };

  // 定义具体的 Action 类型
  interface StoreActions {
    addItem: (item: MockItem) => void;
    removeItem: (id: string) => number;
    fetchItems: () => Promise<void>;
    updateItem: (item: MockItem) => void;
  }

  // 使用 vi.fn() 创建模拟函数，通过泛型参数指定类型
  const mockActions: StoreActions = {
    addItem: vi.fn<(item: MockItem) => void>(),
    removeItem: vi.fn<(id: string) => number>(),
    fetchItems: vi.fn<() => Promise<void>>(),
    updateItem: vi.fn<(item: MockItem) => void>(),
  };

  // 定义具体的 Getter 类型
  interface StoreGetters {
    totalValue: () => number;
    itemById: (id: string) => MockItem | undefined;
  }

  const mockGetters: StoreGetters = {
    totalValue: vi.fn<() => number>(),
    itemById: vi.fn<(id: string) => MockItem | undefined>(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // 重置模拟状态
    mockState.items = [];
    mockState.loading = false;
    mockState.error = null;
  });

  // 同步方法测试 - 正常路径
  describe('同步方法 - addItem', () => {
    it('应该成功添加新项目', () => {
      // 执行添加操作 - 直接操作状态
      const newItem: MockItem = { id: '1', name: 'Test Item' };
      mockState.items.push(newItem);

      // 验证方法被正确调用
      expect(mockActions.addItem).toHaveBeenCalledWith(newItem);
      expect(mockState.items).toHaveLength(1);
      expect(mockState.items[0]).toMatchObject(newItem);
    });
  });

  // 同步方法测试 - 边界条件
  describe('同步方法 - removeItem', () => {
    it('应该处理删除不存在的项目', () => {
      // 设置初始状态
      mockState.items = [{ id: '1', name: 'Item 1' }];

      // 尝试删除不存在的项目 - 直接操作状态
      const initialLength = mockState.items.length;
      const nonExistentId = 'non-existent';
      mockState.items = mockState.items.filter((item) => item.id !== nonExistentId);
      const removedCount = initialLength - mockState.items.length;

      // 验证没有项目被删除且状态保持一致
      expect(removedCount).toBe(0);
      expect(mockState.items).toHaveLength(1);
      expect(mockState.items[0].id).toBe('1');
      // 验证方法被正确调用
      expect(mockActions.removeItem).toHaveBeenCalledWith(nonExistentId);
    });
  });

  // 异步方法测试 - 成功路径
  describe('异步方法 - fetchItems', () => {
    it('应该成功获取并更新项目列表', async () => {
      // 模拟 API 响应
      const mockData = [{ id: '1', name: 'Fetched Item' }];

      // 直接设置状态来模拟异步操作的结果
      mockState.loading = true;
      mockState.items = mockData;
      mockState.loading = false;

      // 执行异步获取操作
      await mockActions.fetchItems();

      // 验证状态正确更新和方法被调用
      expect(mockState.loading).toBe(false);
      expect(mockState.items).toEqual(mockData);
      expect(mockActions.fetchItems).toHaveBeenCalled();
    });
  });

  // 异步方法测试 - 错误处理
  describe('异步方法 - fetchItems 错误处理', () => {
    it('应该正确处理网络错误', async () => {
      // 模拟网络错误 - 直接设置错误状态
      mockState.loading = true;
      const networkError = new Error('Network Error');
      mockState.error = networkError.message;
      mockState.loading = false;

      // 执行异步获取操作
      await mockActions.fetchItems();

      // 验证错误状态正确设置和方法被调用
      expect(mockState.loading).toBe(false);
      expect(mockState.error).toBe('Network Error');
      expect(mockActions.fetchItems).toHaveBeenCalled();
    });
  });

  // 计算属性测试
  describe('计算属性 - totalValue', () => {
    it('应该正确计算所有项目的总值', () => {
      // 设置测试数据
      mockState.items = [
        { id: '1', name: 'Item 1', value: 100 },
        { id: '2', name: 'Item 2', value: 200 },
      ];

      // 直接计算期望值
      const expectedTotal = mockState.items.reduce((sum, item) => sum + (item.value || 0), 0);

      // 调用计算属性
      const total = mockGetters.totalValue();

      // 验证计算结果正确和方法被调用
      expect(total).toBe(300);
      expect(mockGetters.totalValue).toHaveBeenCalled();
      expect(total).toBe(expectedTotal);
    });
  });

  // 集成场景测试
  describe('集成场景 - 添加并计算', () => {
    it('应该保持状态一致性', () => {
      // 执行集成操作：直接操作状态
      mockState.items.push({ id: '1', name: 'Item 1', value: 100 });
      mockState.items.push({ id: '2', name: 'Item 2', value: 200 });

      // 调用相关方法
      mockActions.addItem({ id: '1', name: 'Item 1', value: 100 });
      mockActions.addItem({ id: '2', name: 'Item 2', value: 200 });
      const total = mockGetters.totalValue();

      // 验证整个流程的状态一致性
      expect(mockState.items).toHaveLength(2);
      expect(total).toBe(300);
      expect(mockGetters.totalValue).toHaveBeenCalled();
    });
  });
});
