import ReceiptContent from "./receipt-content";

interface PageProps {
  params: Promise<{
    storeId: string
    orderId: string
  }>
}

const Page = async (
  { params }: PageProps
) => {
  const { storeId, orderId } = await params
  return (
    <ReceiptContent
      storeId={storeId}
      orderId={orderId}
    />
  )
}

export default Page