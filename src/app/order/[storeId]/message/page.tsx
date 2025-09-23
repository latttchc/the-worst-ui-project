import MessageContent from "./message-content";

interface PageProps {
  params: Promise<{
    storeId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { storeId } = await params;

  return <MessageContent storeId={storeId} />;
};

export default Page;
