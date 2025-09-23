import { PropsWithChildren } from "react";
import { Phone, UserCircle, Video } from "lucide-react";
import type { Flavor } from "@/types/flavor";
import Avatar from "../atom/avatar";

interface MessageScreenProps extends PropsWithChildren {
  flavor?: Flavor;
}

export const MessageScreen = ({
  children,
  flavor,
  footer,
}: MessageScreenProps & { footer?: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen w-screen bg-black">
      {/* ヘッダー（高さ固定） */}
      <div className="h-33 flex items-center px-4 shadow-sm border-b-2 border-gray-400 bg-black z-10">
        <div className="flex-1 flex items-center justify-center mt-6 max-xl:ml-30 max-md:ml-5">
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <Avatar size="md" src={flavor} />
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#36393f]" />
            </div>
            <p className="font-semibold text-white">{flavor}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-[#b9bbbe]">
          <Phone className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
          <Video className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
          <UserCircle className="size-5 hover:text-white cursor-not-allowed hidden sm:block" />
        </div>
      </div>

      {/* メッセージ履歴 */}
      <div className="flex-1 overflow-y-auto p-4 pb flex flex-col bg-black">
        {children}
      </div>

      {/* フッター（下端固定） */}
      {footer && (
        <div className="w-auto bg-[#36393f] px-4 py-2 z-10">{footer}</div>
      )}
    </div>
  );
};
