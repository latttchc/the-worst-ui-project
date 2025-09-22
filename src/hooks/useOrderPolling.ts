import { useEffect, useRef, useState } from "react";
import {
  OrderResponse,
  pollOrderStatus,
  pollOrders,
  createLongPollingController,
  OrderStatus,
} from "../api/api";

export function useOrderStatusPolling(
  storeId: string,
  orderId: string,
  enabled = true,
) {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const controllerRef = useRef<ReturnType<
    typeof createLongPollingController
  > | null>(null);

  useEffect(() => {
    if (!enabled || !storeId || !orderId) return;

    const startPolling = async () => {
      controllerRef.current = createLongPollingController();
      setIsPolling(true);
      setError(null);

      try {
        await pollOrderStatus(
          storeId,
          orderId,
          (updatedOrder) => {
            setOrder(updatedOrder);
            if (updatedOrder.status === "completed") {
              setIsPolling(false);
            }
          },
          { signal: controllerRef.current.signal },
        );
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setIsPolling(false);
      }
    };

    startPolling();

    return () => {
      controllerRef.current?.cancel();
      setIsPolling(false);
    };
  }, [storeId, orderId, enabled]);

  const cancel = () => {
    controllerRef.current?.cancel();
    setIsPolling(false);
  };

  return { order, error, isPolling, cancel };
}

export function useOrdersPolling(
  storeId: string,
  status?: OrderStatus,
  enabled = true,
) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const controllerRef = useRef<ReturnType<
    typeof createLongPollingController
  > | null>(null);

  useEffect(() => {
    if (!enabled || !storeId) return;

    const startPolling = async () => {
      controllerRef.current = createLongPollingController();
      setIsPolling(true);
      setError(null);

      try {
        await pollOrders(
          storeId,
          status,
          (updatedOrders) => {
            setOrders(updatedOrders);
          },
          { signal: controllerRef.current.signal },
        );
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setIsPolling(false);
      }
    };

    startPolling();

    return () => {
      controllerRef.current?.cancel();
      setIsPolling(false);
    };
  }, [storeId, status, enabled]);

  const cancel = () => {
    controllerRef.current?.cancel();
    setIsPolling(false);
  };

  const refetch = async () => {
    controllerRef.current?.cancel();
    await new Promise((resolve) => setTimeout(resolve, 100));

    controllerRef.current = createLongPollingController();
    setIsPolling(true);
    setError(null);

    try {
      await pollOrders(
        storeId,
        status,
        (updatedOrders) => {
          setOrders(updatedOrders);
        },
        { signal: controllerRef.current.signal },
      );
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err);
      }
    } finally {
      setIsPolling(false);
    }
  };

  return { orders, error, isPolling, cancel, refetch };
}
