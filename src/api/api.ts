export type OrderStatus = "pending" | "waitingPickup" | "completed";
export type MenuItem = { id: string; name: string; description?: string };
export type OrderResponse = {
  id: string;
  menu_item_id: string;
  menu_name: string;
  status: OrderStatus;
  order_number: number;
};
export type ApiError = { error: string; message: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export async function fetchMenu(storeId: string): Promise<MenuItem[]> {
  const res = await fetch(`${API_BASE}/v1/stores/${storeId}/menu`);
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Menu fetch failed (${res.status})`);
  }
  const data = (await res.json()) as { menu?: MenuItem[] };
  return data.menu ?? [];
}

export async function createOrder(
  storeId: string,
  menuId: string,
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/v1/stores/${storeId}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menu_item_id: menuId }),
  });
  if (res.status !== 201) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Order create failed (${res.status})`);
  }
  return res.json();
}

export async function fetchOrderById(
  storeId: string,
  orderId: string,
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/v1/stores/${storeId}/orders/${orderId}`);
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Order fetch failed (${res.status})`);
  }
  return res.json();
}

export async function fetchOrders(
  storeId: string,
  status?: OrderStatus,
): Promise<OrderResponse[]> {
  const url = new URL(`${API_BASE}/v1/stores/${storeId}/orders`);
  if (status) url.searchParams.set("status", status);
  const res = await fetch(url);
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Orders fetch failed (${res.status})`);
  }
  const data = (await res.json()) as { orders?: OrderResponse[] };
  return data.orders ?? [];
}

export async function updateOrderToWaitingPickup(
  storeId: string,
  orderId: string,
): Promise<OrderResponse> {
  const res = await fetch(
    `${API_BASE}/v1/stores/${storeId}/orders/${orderId}/waiting-pickup`,
    { method: "POST" },
  );
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(
      data?.message || `Update to waitingPickup failed (${res.status})`,
    );
  }
  return res.json();
}

export async function completeOrder(
  storeId: string,
  orderId: string,
): Promise<OrderResponse> {
  const res = await fetch(
    `${API_BASE}/v1/stores/${storeId}/orders/${orderId}/complete`,
    { method: "POST" },
  );
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as ApiError | null;
    throw new Error(data?.message || `Complete order failed (${res.status})`);
  }
  return res.json();
}

export interface LongPollingOptions {
  interval?: number;
  maxRetries?: number;
  signal?: AbortSignal;
}

export async function pollOrderStatus(
  storeId: string,
  orderId: string,
  onStatusChange: (order: OrderResponse) => void,
  options: LongPollingOptions = {},
): Promise<void> {
  const { interval = 2000, maxRetries = 60, signal } = options;
  let retries = 0;
  let previousStatus: OrderStatus | null = null;

  const poll = async () => {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    try {
      const order = await fetchOrderById(storeId, orderId);

      if (previousStatus && previousStatus !== order.status) {
        onStatusChange(order);
      }
      previousStatus = order.status;

      if (order.status === "completed") {
        return;
      }

      retries = 0;
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw new Error(`Max retries (${maxRetries}) exceeded`);
      }
      console.warn(`Polling error (retry ${retries}/${maxRetries}):`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
    await poll();
  };

  await poll();
}

export async function pollOrders(
  storeId: string,
  status: OrderStatus | undefined,
  onOrdersChange: (orders: OrderResponse[]) => void,
  options: LongPollingOptions = {},
): Promise<void> {
  const { interval = 3000, maxRetries = 60, signal } = options;
  let retries = 0;
  let previousOrderIds = new Set<string>();

  const poll = async () => {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    try {
      const orders = await fetchOrders(storeId, status);
      const currentOrderIds = new Set(orders.map((o) => o.id));

      const hasChanges =
        orders.length !== previousOrderIds.size ||
        orders.some((order) => !previousOrderIds.has(order.id));

      if (hasChanges) {
        onOrdersChange(orders);
      }

      previousOrderIds = currentOrderIds;
      retries = 0;
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw new Error(`Max retries (${maxRetries}) exceeded`);
      }
      console.warn(`Polling error (retry ${retries}/${maxRetries}):`, error);
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
    await poll();
  };

  await poll();
}

export function createLongPollingController() {
  const abortController = new AbortController();

  return {
    signal: abortController.signal,
    cancel: () => abortController.abort(),
  };
}
