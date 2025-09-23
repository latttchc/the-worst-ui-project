"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageScreen } from "@/components/MessageComponents/MessageScreen";
import { Message } from "@/components/MessageComponents/Message";
import { MessageOptions } from "@/components/MessageComponents/MessageOptions";
import Text from "@/components/atom/text";
import Button from "@/components/atom/button";
import type { Flavor } from "@/types/flavor";
import { conversationFlow } from "@/constants/conversationFlow";
import { createOrder } from "@/api/api";

export interface MessageType {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const MessageContent = ({ storeId }: { storeId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const menuId = searchParams.get("menuId");
  const flavor = searchParams.get("flavor") as Flavor;
  const menuName = searchParams.get("menuName");

  const [exchangeCount, setExchangeCount] = useState(1);
  const [usedIndexes, setUsedIndexes] = useState<number[]>([0]);

  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showOptions, setShowOptions] = useState(true);

  // 初期メッセージを追加
  useEffect(() => {
    const initialMessage: MessageType = {
      id: "bot-0",
      text: conversationFlow[0].botMessage,
      isBot: true,
      timestamp: new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([initialMessage]);
  }, []);

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;

    const currentConversation = conversationFlow[currentStep];
    const isCorrect = option === currentConversation.correctResponse;

    const userMessage: MessageType = {
      id: `user-${currentStep}-${Date.now()}`,
      text: option,
      isBot: false,
      timestamp: new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [userMessage, ...prev]);
    setSelectedOption(option);
    setShowOptions(false);

    if (!isCorrect) {
      setTimeout(() => {
        const errorMessage: MessageType = {
          id: `bot-error-${currentStep}-${Date.now()}`,
          text: "申し訳ございません。もう一度お聞かせください。",
          isBot: true,
          timestamp: new Date().toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [errorMessage, ...prev]);
        setSelectedOption(null);
        setShowOptions(true);
      }, 1500);
      return;
    }

    setTimeout(() => {
      if (exchangeCount < 4) {
        let nextStep = exchangeCount;
        if (exchangeCount === 1) {
          const candidates = conversationFlow
            .map((_, i) => i)
            .filter((i) => i !== 0 && !usedIndexes.includes(i));
          nextStep = candidates[Math.floor(Math.random() * candidates.length)];
        }

        const nextMessage: MessageType = {
          id: `bot-${nextStep}-${Date.now()}`,
          text: conversationFlow[nextStep].botMessage,
          isBot: true,
          timestamp: new Date().toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [nextMessage, ...prev]);
        setCurrentStep(nextStep);
        setExchangeCount((prev) => prev + 1);
        setUsedIndexes((prev) => [...prev, nextStep]);
        setSelectedOption(null);
        setShowOptions(true);
      } else {
        const successMessage: MessageType = {
          id: `bot-success-${Date.now()}`,
          text: `ありがとうございます！${menuName || "かき氷"}のご注文を承りました！🎉`,
          isBot: true,
          timestamp: new Date().toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [successMessage, ...prev]);
        setGameCompleted(true);
        setShowOptions(false);
      }
    }, 1500);
  };

  const handleOrderComplete = async () => {
    try {
      const res = await createOrder(storeId, menuId as string);
      router.push(`/order/${storeId}/receipt/${res.id}`);
    } catch (e) {
      alert("注文処理に失敗しました。時間をおいて再度お試しください。");
    }
  };

  if (!menuId || !flavor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Text variant="h2" className="text-red-600">
          注文情報が不足しています
        </Text>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <MessageScreen
        flavor={flavor}
        footer={
          <>
            {showOptions && !gameCompleted && (
              <div className="w-full">
                <MessageOptions
                  options={conversationFlow[currentStep].options}
                  onOptionSelect={handleOptionSelect}
                  disabled={!!selectedOption}
                />
              </div>
            )}
            {gameCompleted && (
              <div className="mt-2 flex justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full max-w-xl bg-green-600 hover:bg-green-700"
                  onClick={handleOrderComplete}
                >
                  🎉 注文を完了する
                </Button>
              </div>
            )}
          </>
        }
      >
        {/* メッセージ履歴 */}
        <div className="space-y-4 flex-col">
          {messages
            .slice()
            .reverse()
            .map((message) => (
              <Message key={message.id} message={message} flavor={flavor} />
            ))}
        </div>
      </MessageScreen>
    </div>
  );
};

export default MessageContent;
