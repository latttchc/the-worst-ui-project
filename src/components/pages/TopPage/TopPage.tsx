"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/atom/card/card";
import Text from "@/components/atom/text/text";
import Modal from "./Modal";
import { Store } from "./Type";
import { stores } from "./Data";


const TopPage = () => {
  const [selectedStore] = useState<Store | null>(null);
  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const storeId = process.env.NEXT_PUBLIC_STORE_ID;
  const router = useRouter();

  const handleClick = () => {
    router.push(`/order/${storeId}/match`);
  };


  return (
    <div className="max-w-md mx-auto space-y-6 relative z-10">
      <>
        {/* ヘッダー */}
        <div className="text-center py-8 bg-gradient-to-r from-white/80 via-pink-100/80 to-purple-100/80 rounded-3xl backdrop-blur-sm shadow-lg border border-white/50">
          <div className="text-5xl mb-4">🧊✨</div>
          <Text
            variant="h1"
            className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-2"
          >
            KakiMatch
          </Text>
          <Text variant="body" color="muted" className="text-gray-700">
            あなたにぴったりのかき氷を見つけよう
          </Text>
        </div>

        {/* 店舗選択セクション */}
        <div className="space-y-6">
          <div className="text-center">
            <Text variant="h3" className="text-gray-700 mb-2">
              {/* お店を選択してね 💕 */}
              正しいお店をタップしてね🥰
            </Text>
            {/* <Text variant="small" color="muted">
              正しいお店をタップしてね🥰
            </Text> */}
          </div>

          <div className="space-y-4">
            {stores.map((store) => (
              <div
                key={store.id}
                className={`cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg rounded-2xl ${selectedStore?.id === store.id
                  ? "ring-2 ring-pink-400 shadow-lg"
                  : ""
                  }`}
                onClick={() => setIsOpenModal(true)}
              >
                <Card
                  size="horizontal-md"
                  className={`w-full bg-gradient-to-r ${store.color} border-0 shadow-md hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className="p-5 h-full flex items-center space-x-4">
                    {/* アイコン */}
                    <div className="text-4xl flex-shrink-0">
                      {store.emoji}
                    </div>

                    {/* 店舗情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <Text
                          variant="h4"
                          className="font-bold text-gray-800 truncate"
                        >
                          {store.name}
                        </Text>
                        <div className="flex items-center space-x-1 ml-2">
                          <span className="text-yellow-400">⭐</span>
                          <Text
                            variant="small"
                            className="font-semibold text-gray-700"
                          >
                            {store.rating}
                          </Text>
                        </div>
                      </div>

                      <Text
                        variant="small"
                        className="text-gray-600 line-clamp-2 mb-2"
                      >
                        {store.description}
                      </Text>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          <span className="text-pink-500">📍</span>
                          <Text variant="caption" className="text-gray-600">
                            {store.distance}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* フッター ここが正しい店舗！ */}
        <div
          className="text-center py-6 bg-gradient-to-r from-cyan-100/70 via-blue-100/70 to-purple-100/70 rounded-2xl backdrop-blur-sm border border-white/50"
          onClick={() => handleClick()}
        >
          <div className="text-2xl mb-2">🌈</div>
          <Text variant="caption" color="muted" className="text-gray-600">
            うまいよほんとに
          </Text>
        </div>

        {/* モーダル */}
        <Modal isOpenModal={isOpenModal} setIsOpenModal={setIsOpenModal} />
      </>
    </div>
  );
};

export default TopPage;
