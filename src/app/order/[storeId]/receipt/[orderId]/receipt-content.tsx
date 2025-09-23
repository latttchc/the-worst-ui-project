"use client"

import { fetchOrderById, OrderResponse } from "@/api/api"
import OrderCard from "@/components/orderCard"
import Text from "@/components/atom/text"
import { useEffect, useState } from "react"
import type { Flavor } from "@/types/flavor"
import clsx from "clsx"

interface ReceiptContentProps {
  storeId: string
  orderId: string
}

const guessFlavor = (name: string): Flavor => {
  if (name.includes("ブルー")) return "blue";
  if (name.includes("メロン")) return "meron";
  if (name.includes("オレンジ")) return "orange";
  return "strawberry";
};

const ReceiptContent = ({
  storeId,
  orderId
}: ReceiptContentProps) => {
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!storeId || !orderId) {
      setErr("URLが不正です")
      setLoading(false)
      return
    }
    setLoading(true)
    setErr(null)
      ; (async () => {
        try {
          const res = await fetchOrderById(storeId, orderId)
          setOrder(res)
        } catch (error) {
          setErr(error instanceof Error ? error.message : String(error))
        } finally {
          setLoading(false)
        }
      })()
  }, [storeId, orderId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span>読み込み中...</span>
      </div>
    )
  }

  if (err) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-red-600">{err}</span>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div>
        <Text
          as="h2"
          color="primary"
          variant="h2"
          className="text-pretty text-pink-600 mb-3"
        >
          注文番号：{order.order_number}
        </Text>
      </div>
      <OrderCard
        description={
          <span
            className={clsx(
              "text-3xl",
              order.status === "completed" && "text-pink-800",
              order.status === "waitingPickup" && "text-pink-700",
              order.status === "pending" && "text-pink-600"
            )}
          >
            {order.status === "completed" && "完了"}
            {order.status === "waitingPickup" && "受け取り待ち"}
            {order.status === "pending" && "準備中"}
          </span>
        }
        flavor={guessFlavor(order.menu_name)}
        title={order.menu_name || ""}
        className="text-center"
      />
    </div>
  )
}

export default ReceiptContent