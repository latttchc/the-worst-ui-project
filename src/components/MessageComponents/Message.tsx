import type { Flavor } from "@/types/flavor";
import { User } from "lucide-react";
import Avatar from "../atom/avatar";

export interface MessageType {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface MessageProps {
  message: MessageType;
  flavor?: Flavor;
}

export const Message = ({ message, flavor }: MessageProps) => {
  return (
    <div>
      {message.isBot ? (
        <>
          <div className="flex items-start space-x-3">
            <Avatar size="md" src={flavor} />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {message.timestamp}
                </span>
              </div>
              <p className="text-gray-300 mt-1">{message.text}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row-reverse items-end space-x-3 space-x-reverse">
            <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                <User />
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-end space-x-2">
                <span className="text-xs text-gray-400">
                  {message.timestamp}
                </span>
                <span className="font-semibold text-white">あなた</span>
              </div>
              <p className="text-gray-300 mt-1 text-right">{message.text}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
