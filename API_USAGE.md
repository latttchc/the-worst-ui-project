# API使用方法ガイド

このドキュメントでは、実装したAPIクライアントとフックの使い方を説明します。

## 📚 目次

- [基本的な使い方](#基本的な使い方)
- [React Componentでの使用例](#react-componentでの使用例)
- [カスタムフックの使い方](#カスタムフックの使い方)
- [エラーハンドリング](#エラーハンドリング)
- [環境設定](#環境設定)

## 基本的な使い方

### 1. APIクライアントのインポート

```typescript
import {
  fetchMenu,
  createOrder,
  fetchOrderById,
  fetchOrders,
  updateOrderToWaitingPickup,
  completeOrder,
} from "@/api/api";
```

### 2. メニューの取得

```typescript
// コンポーネント内での使用例
import { useEffect, useState } from 'react';
import { fetchMenu, type MenuItem } from '@/api/api';

function MenuComponent() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'KUPSRGYW';
        const items = await fetchMenu(storeId);
        setMenuItems(items);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  if (loading) return <div>メニューを読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;

  return (
    <div>
      {menuItems.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          {item.description && <p>{item.description}</p>}
        </div>
      ))}
    </div>
  );
}
```

### 3. 注文の作成

```typescript
import { createOrder, type OrderResponse } from '@/api/api';

function OrderButton({ menuItemId }: { menuItemId: string }) {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateOrder = async () => {
    setIsCreating(true);
    try {
      const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'KUPSRGYW';
      const newOrder = await createOrder(storeId, menuItemId);
      setOrder(newOrder);

      // 注文番号を表示
      alert(`注文が作成されました！注文番号: ${newOrder.order_number}`);
    } catch (error) {
      console.error('注文の作成に失敗しました:', error);
      alert('注文の作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCreateOrder}
        disabled={isCreating}
      >
        {isCreating ? '注文中...' : '注文する'}
      </button>

      {order && (
        <div>
          <p>注文番号: {order.order_number}</p>
          <p>ステータス: {order.status}</p>
          <p>商品: {order.menu_name}</p>
        </div>
      )}
    </div>
  );
}
```

## React Componentでの使用例

### 完全な注文管理コンポーネント

```typescript
'use client';

import { useState, useEffect } from 'react';
import {
  fetchMenu,
  createOrder,
  fetchOrders,
  updateOrderToWaitingPickup,
  completeOrder,
  type MenuItem,
  type OrderResponse,
  type OrderStatus,
} from '@/api/api';

export function OrderManagementComponent() {
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'KUPSRGYW';

  // State管理
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // メニュー読み込み
  useEffect(() => {
    loadMenu();
    loadOrders();
  }, []);

  const loadMenu = async () => {
    try {
      const items = await fetchMenu(storeId);
      setMenuItems(items);
      if (items.length > 0) {
        setSelectedMenuItem(items[0].id);
      }
    } catch (err) {
      setError('メニューの読み込みに失敗しました');
    }
  };

  const loadOrders = async () => {
    try {
      const allOrders = await fetchOrders(storeId);
      setOrders(allOrders);
    } catch (err) {
      console.error('注文の読み込みに失敗:', err);
    }
  };

  // 注文作成
  const handleCreateOrder = async () => {
    if (!selectedMenuItem) return;

    setLoading(true);
    setError('');

    try {
      const newOrder = await createOrder(storeId, selectedMenuItem);
      setOrders([...orders, newOrder]);
      alert(`注文番号 ${newOrder.order_number} を作成しました！`);
    } catch (err) {
      setError('注文の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // ステータス更新
  const handleStatusUpdate = async (orderId: string, action: 'pickup' | 'complete') => {
    try {
      let updatedOrder: OrderResponse;

      if (action === 'pickup') {
        updatedOrder = await updateOrderToWaitingPickup(storeId, orderId);
      } else {
        updatedOrder = await completeOrder(storeId, orderId);
      }

      // 注文リストを更新
      setOrders(orders.map(o =>
        o.id === orderId ? updatedOrder : o
      ));
    } catch (err) {
      setError('ステータスの更新に失敗しました');
    }
  };

  // ステータスごとに注文を分類
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const waitingOrders = orders.filter(o => o.status === 'waitingPickup');
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">注文管理システム</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      {/* 新規注文作成 */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">新規注文</h2>
        <select
          value={selectedMenuItem}
          onChange={(e) => setSelectedMenuItem(e.target.value)}
          className="mr-2 p-2 border rounded"
        >
          {menuItems.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleCreateOrder}
          disabled={loading || !selectedMenuItem}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {loading ? '作成中...' : '注文を作成'}
        </button>
      </div>

      {/* 注文リスト */}
      <div className="grid grid-cols-3 gap-4">
        {/* 準備中 */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">準備中 ({pendingOrders.length})</h3>
          {pendingOrders.map(order => (
            <div key={order.id} className="mb-2 p-2 bg-gray-50 rounded">
              <div>注文番号: {order.order_number}</div>
              <div className="text-sm">{order.menu_name}</div>
              <button
                onClick={() => handleStatusUpdate(order.id, 'pickup')}
                className="mt-1 px-2 py-1 bg-yellow-500 text-white text-sm rounded"
              >
                受取待ちへ
              </button>
            </div>
          ))}
        </div>

        {/* 受取待ち */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">受取待ち ({waitingOrders.length})</h3>
          {waitingOrders.map(order => (
            <div key={order.id} className="mb-2 p-2 bg-yellow-50 rounded">
              <div>注文番号: {order.order_number}</div>
              <div className="text-sm">{order.menu_name}</div>
              <button
                onClick={() => handleStatusUpdate(order.id, 'complete')}
                className="mt-1 px-2 py-1 bg-green-500 text-white text-sm rounded"
              >
                完了
              </button>
            </div>
          ))}
        </div>

        {/* 完了 */}
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">完了 ({completedOrders.length})</h3>
          {completedOrders.map(order => (
            <div key={order.id} className="mb-2 p-2 bg-green-50 rounded">
              <div>注文番号: {order.order_number}</div>
              <div className="text-sm">{order.menu_name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## カスタムフックの使い方

### 1. 注文ステータスのリアルタイム監視

```typescript
import { useOrderStatusPolling } from '@/hooks/useOrderPolling';

function OrderStatusDisplay({ orderId }: { orderId: string }) {
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'KUPSRGYW';

  // 注文ステータスをリアルタイムで監視
  const { order, error, isPolling } = useOrderStatusPolling(
    storeId,
    orderId,
    true // ポーリングを有効化
  );

  if (error) {
    return <div>エラー: {error.message}</div>;
  }

  if (!order) {
    return <div>注文を読み込み中...</div>;
  }

  return (
    <div className="p-4 border rounded">
      <h3>注文番号: {order.order_number}</h3>
      <p>商品: {order.menu_name}</p>
      <div className="mt-2">
        <span className="font-semibold">ステータス: </span>
        <span className={`
          ${order.status === 'pending' ? 'text-gray-500' : ''}
          ${order.status === 'waitingPickup' ? 'text-yellow-500' : ''}
          ${order.status === 'completed' ? 'text-green-500' : ''}
        `}>
          {order.status === 'pending' && '準備中'}
          {order.status === 'waitingPickup' && '受取待ち'}
          {order.status === 'completed' && '完了'}
        </span>
      </div>
      {isPolling && (
        <div className="text-sm text-gray-500 mt-1">
          リアルタイム更新中...
        </div>
      )}
    </div>
  );
}
```

### 2. 注文一覧のリアルタイム監視

```typescript
import { useOrdersPolling } from '@/hooks/useOrderPolling';

function LiveOrderBoard() {
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'KUPSRGYW';

  // すべての注文をリアルタイムで監視
  const { orders, error, isPolling, refetch } = useOrdersPolling(
    storeId,
    undefined, // すべてのステータス
    true // ポーリング有効
  );

  // 待機中の注文のみを監視する場合
  // const { orders, error, isPolling } = useOrdersPolling(
  //   storeId,
  //   'waitingPickup', // 特定のステータスのみ
  //   true
  // );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">注文状況ボード</h2>
        <button
          onClick={refetch}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          更新
        </button>
      </div>

      {error && (
        <div className="text-red-500">エラー: {error.message}</div>
      )}

      <div className="space-y-2">
        {orders.map(order => (
          <div
            key={order.id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <span className="font-bold">#{order.order_number}</span>
              <span className="ml-2">{order.menu_name}</span>
            </div>
            <div>
              <StatusBadge status={order.status} />
            </div>
          </div>
        ))}
      </div>

      {isPolling && (
        <div className="text-center text-sm text-gray-500 mt-2">
          自動更新中...
        </div>
      )}
    </div>
  );
}

// ステータスバッジコンポーネント
function StatusBadge({ status }: { status: OrderStatus }) {
  const colors = {
    pending: 'bg-gray-200 text-gray-700',
    waitingPickup: 'bg-yellow-200 text-yellow-700',
    completed: 'bg-green-200 text-green-700',
  };

  const labels = {
    pending: '準備中',
    waitingPickup: '受取待ち',
    completed: '完了',
  };

  return (
    <span className={`px-2 py-1 rounded text-sm ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}
```

## エラーハンドリング

### エラーハンドリングのベストプラクティス

```typescript
import { useState } from 'react';
import { createOrder, type ApiError } from '@/api/api';

function RobustOrderComponent() {
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const handleCreateOrder = async (menuItemId: string) => {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const storeId = process.env.NEXT_PUBLIC_STORE_ID || 'KUPSRGYW';
        const order = await createOrder(storeId, menuItemId);

        // 成功
        setError('');
        setRetryCount(0);
        return order;

      } catch (err) {
        attempt++;
        setRetryCount(attempt);

        if (err instanceof Error) {
          // APIエラーの詳細を表示
          console.error(`Attempt ${attempt} failed:`, err.message);

          // ユーザーフレンドリーなエラーメッセージ
          if (err.message.includes('Invalid menu item')) {
            setError('選択された商品は現在利用できません');
          } else if (err.message.includes('Store not found')) {
            setError('店舗が見つかりません');
          } else if (attempt >= maxRetries) {
            setError(`注文の作成に失敗しました (${attempt}回試行)`);
          }
        }

        // リトライ前に少し待機
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    throw new Error('Max retries exceeded');
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          <p>{error}</p>
          {retryCount > 0 && (
            <p className="text-sm mt-1">
              再試行: {retryCount}/3
            </p>
          )}
        </div>
      )}
      {/* 注文UI */}
    </div>
  );
}
```

## 環境設定

### 1. 環境変数の設定

`.env.local` ファイルを作成:

```env
# API設定
NEXT_PUBLIC_API_BASE=http://localhost:8080
NEXT_PUBLIC_STORE_ID=KUPSRGYW

# テスト設定
RUN_INTEGRATION_TESTS=true
```

### 2. TypeScriptの型定義

すでに設定済みですが、必要に応じて `env.d.ts` で型を追加:

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE?: string;
    NEXT_PUBLIC_STORE_ID?: string;
  }
}
```

### 3. グローバル設定の作成（オプション）

```typescript
// src/config/api.config.ts
export const API_CONFIG = {
  storeId: process.env.NEXT_PUBLIC_STORE_ID || "KUPSRGYW",
  apiBase: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080",
  polling: {
    interval: 2000, // 2秒
    maxRetries: 60, // 最大60回リトライ
  },
} as const;

// 使用例
import { API_CONFIG } from "@/config/api.config";
import { fetchMenu } from "@/api/api";

const menu = await fetchMenu(API_CONFIG.storeId);
```

## テストの実行

```bash
# ユニットテスト（モック使用）
npm test

# API統合テスト（実際のAPIと通信）
npm run test:api

# ウォッチモードでテスト
npm run test:watch
```

## トラブルシューティング

### よくある問題と解決方法

1. **CORSエラー**
   - バックエンドサーバーがCORSを許可しているか確認
   - Next.jsのAPI Routeを使用してプロキシすることも可能

2. **環境変数が読み込まれない**
   - `.env.local`ファイルが正しい場所にあるか確認
   - `NEXT_PUBLIC_`プレフィックスが付いているか確認
   - サーバーを再起動する

3. **ポーリングが止まらない**
   - コンポーネントのアンマウント時にクリーンアップされているか確認
   - `useEffect`の依存配列が正しいか確認

4. **型エラー**
   - `npm run build`で型チェックを実行
   - VSCodeでTypeScriptエラーを確認

## まとめ

このAPIクライアントとカスタムフックを使用することで、以下が可能になります：

- ✅ タイプセーフなAPI通信
- ✅ リアルタイムでの注文状況監視
- ✅ エラーハンドリングとリトライ機能
- ✅ Reactコンポーネントでの簡単な統合

質問や問題がある場合は、GitHubのIssueで報告してください。
