#!/usr/bin/env node

/**
 * APIとの手動統合テストスクリプト
 * 使用方法: npx tsx src/api/manual-test.ts
 */

import {
  fetchMenu,
  createOrder,
  fetchOrderById,
  fetchOrders,
  updateOrderToWaitingPickup,
  completeOrder,
  pollOrderStatus,
  createLongPollingController,
} from "./api";

// ストアIDと設定
const STORE_ID = "KUPSRGYW";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

async function runManualTest() {
  console.log("=== Manual Integration Test Starting ===");
  console.log(`Store ID: ${STORE_ID}`);
  console.log(`API Base: ${API_BASE}`);

  let createdOrderId: string | null = null;

  try {
    // 1. メニューを取得
    console.log("\n1. Fetching menu...");
    const menu = await fetchMenu(STORE_ID);
    console.log(`   ✓ Found ${menu.length} menu items`);
    if (menu.length > 0) {
      console.log(`   Sample items:`);
      menu.slice(0, 3).forEach((item) => {
        console.log(`     - ${item.name} (ID: ${item.id})`);
        if (item.description) {
          console.log(`       Description: ${item.description}`);
        }
      });
    }

    if (menu.length === 0) {
      console.log(
        "   ⚠ No menu items available, cannot proceed with order tests",
      );
      return;
    }

    // 2. 注文を作成
    console.log("\n2. Creating order...");
    const order = await createOrder(STORE_ID, menu[0].id);
    createdOrderId = order.id;
    console.log(`   ✓ Order created successfully`);
    console.log(`     - Order ID: ${order.id}`);
    console.log(`     - Order number: ${order.order_number}`);
    console.log(`     - Menu item: ${order.menu_name}`);
    console.log(`     - Status: ${order.status}`);

    // 3. 注文を取得
    console.log("\n3. Fetching order by ID...");
    const fetchedOrder = await fetchOrderById(STORE_ID, order.id);
    console.log(`   ✓ Order fetched successfully`);
    console.log(`     - Status: ${fetchedOrder.status}`);

    // 4. 全注文を取得
    console.log("\n4. Fetching all orders...");
    const allOrders = await fetchOrders(STORE_ID);
    console.log(`   ✓ Found ${allOrders.length} total orders`);

    const pendingOrders = await fetchOrders(STORE_ID, "pending");
    const waitingOrders = await fetchOrders(STORE_ID, "waitingPickup");
    const completedOrders = await fetchOrders(STORE_ID, "completed");

    console.log(`     - Pending: ${pendingOrders.length}`);
    console.log(`     - Waiting for pickup: ${waitingOrders.length}`);
    console.log(`     - Completed: ${completedOrders.length}`);

    // 5. ステータスを更新
    console.log("\n5. Updating order status to waitingPickup...");
    const updatedOrder = await updateOrderToWaitingPickup(STORE_ID, order.id);
    console.log(`   ✓ Order status updated`);
    console.log(`     - New status: ${updatedOrder.status}`);

    // 6. ポーリングテスト
    console.log("\n6. Testing polling functionality...");
    console.log("   Creating a new order for polling test...");
    const pollingOrder = await createOrder(STORE_ID, menu[0].id);
    console.log(`   ✓ Created order ${pollingOrder.order_number} for polling`);

    const controller = createLongPollingController();
    let pollCount = 0;

    console.log("   Starting polling (max 5 seconds)...");
    const pollPromise = pollOrderStatus(
      STORE_ID,
      pollingOrder.id,
      (order) => {
        pollCount++;
        console.log(`   [Poll ${pollCount}] Status: ${order.status}`);
        if (order.status === "waitingPickup" || order.status === "completed") {
          controller.cancel();
        }
      },
      {
        signal: controller.signal,
        interval: 1000,
        maxRetries: 3,
      },
    );

    // 2秒後にステータスを更新
    setTimeout(async () => {
      console.log("   Updating polling test order status...");
      try {
        await updateOrderToWaitingPickup(STORE_ID, pollingOrder.id);
      } catch (error) {
        console.warn("   Failed to update polling order:", error);
      }
    }, 2000);

    // 最大5秒待つ
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        controller.cancel();
        reject(new Error("Polling timeout"));
      }, 5000);
    });

    try {
      await Promise.race([pollPromise, timeoutPromise]);
    } catch (error) {
      if (
        (error as Error).message !== "Polling timeout" &&
        (error as Error).name !== "AbortError"
      ) {
        throw error;
      }
    }

    console.log(`   ✓ Polling test completed (${pollCount} polls executed)`);

    // ポーリングテスト注文をクリーンアップ
    await completeOrder(STORE_ID, pollingOrder.id);

    // 7. 元の注文を完了
    console.log("\n7. Completing original order...");
    const completedOrder = await completeOrder(STORE_ID, createdOrderId);
    console.log(`   ✓ Order completed`);
    console.log(`     - Final status: ${completedOrder.status}`);

    // 8. エラーハンドリングテスト
    console.log("\n8. Testing error handling...");

    console.log("   Testing invalid store ID...");
    try {
      await fetchMenu("INVALID_STORE");
      console.log("   ✗ Should have thrown an error");
    } catch {
      console.log("   ✓ Correctly threw error for invalid store");
    }

    console.log("   Testing invalid order ID...");
    try {
      await fetchOrderById(STORE_ID, "invalid-order-id");
      console.log("   ✗ Should have thrown an error");
    } catch {
      console.log("   ✓ Correctly threw error for invalid order ID");
    }

    console.log("   Testing invalid menu item...");
    try {
      await createOrder(STORE_ID, "invalid-menu-id");
      console.log("   ✗ Should have thrown an error");
    } catch {
      console.log("   ✓ Correctly threw error for invalid menu item");
    }

    console.log("\n=== All Integration Tests Passed ✓ ===");
    return true;
  } catch (error) {
    console.error("\n=== Integration Test Failed ✗ ===");
    console.error(error);

    // クリーンアップを試みる
    if (createdOrderId) {
      console.log("\nAttempting cleanup...");
      try {
        await completeOrder(STORE_ID, createdOrderId);
        console.log("Order cleaned up successfully");
      } catch (cleanupError) {
        console.warn("Failed to clean up order:", cleanupError);
      }
    }

    throw error;
  }
}

// スクリプトを実行
console.log("Starting API Integration Test...");
console.log("================================");

runManualTest()
  .then(() => {
    console.log("\n✅ All tests completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  });
