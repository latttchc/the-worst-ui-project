"use client";
import React, { useState } from "react";
import Card from "@/components/atom/card/card";
import Button from "@/components/atom/button/button";
import Text from "@/components/atom/text/text";

// 店舗データの型定義
interface Store {
  id: number;
  name: string;
  description: string;
  rating: number;
  distance: string;
  emoji: string;
  color: string;
}

// サンプル店舗データ（ポップで可愛いデザイン）
const stores: Store[] = [
  {
    id: 1,
    name: "氷花亭",
    description:
      "老舗のかき氷専門店。伝統的な味から創作フレーバーまで豊富に取り揃えています。",
    rating: 4.8,
    distance: "徒歩5分",
    emoji: "🌸",
    color: "from-pink-300 to-rose-400",
  },
  {
    id: 2,
    name: "アイスパラダイス",
    description: "トロピカルなフルーツかき氷が自慢のモダンなお店です。",
    rating: 4.6,
    distance: "徒歩8分",
    emoji: "🌺",
    color: "from-orange-300 to-yellow-400",
  },
  {
    id: 3,
    name: "雪月花",
    description: "厳選された素材で作る上品なかき氷が楽しめる和風カフェです。",
    rating: 4.9,
    distance: "徒歩12分",
    emoji: "🌙",
    color: "from-blue-300 to-purple-400",
  },
  {
    id: 4,
    name: "クールサマー",
    description: "ボリューム満点のかき氷とかわいいトッピングが人気のお店です。",
    rating: 4.5,
    distance: "徒歩15分",
    emoji: "☀️",
    color: "from-green-300 to-cyan-400",
  },
];

const TopPage = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
  };

  const handleProceedToFlavors = () => {
    // フレーバー選択ページへの遷移処理をここに実装
    console.log("選択された店舗:", selectedStore);
    alert(`${selectedStore?.name}でのフレーバー選択に進みます！`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-purple-300 to-pink-300 p-4 relative overflow-hidden">
      {/* 装飾的な背景要素 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-16 w-16 h-16 bg-pink-400 rounded-full blur-lg animate-bounce"></div>
        <div
          className="absolute bottom-40 left-20 w-24 h-24 bg-purple-300 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-18 h-18 bg-blue-300 rounded-full blur-lg animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-14 h-14 bg-green-300 rounded-full blur-lg animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/3 w-12 h-12 bg-orange-300 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="max-w-md mx-auto space-y-6 relative z-10">
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
              お店を選んでください
            </Text>
            <Text variant="small" color="muted">
              気になるお店をタップしてね 💕
            </Text>
          </div>

          <div className="space-y-4">
            {stores.map((store) => (
              <div
                key={store.id}
                className={`cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg rounded-2xl ${
                  selectedStore?.id === store.id
                    ? "ring-2 ring-pink-400 shadow-lg"
                    : ""
                }`}
                onClick={() => handleStoreSelect(store)}
              >
                <Card
                  size="horizontal-md"
                  className={`bg-gradient-to-r ${store.color} border-0 shadow-md hover:shadow-lg transition-shadow duration-300`}
                >
                  <div className="p-5 h-full flex items-center space-x-4">
                    {/* アイコン */}
                    <div className="text-4xl flex-shrink-0">{store.emoji}</div>

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

                        {selectedStore?.id === store.id && (
                          <div className="flex items-center space-x-1 bg-white/70 px-2 py-1 rounded-full">
                            <span className="text-pink-500">✓</span>
                            <Text
                              variant="caption"
                              className="text-pink-600 font-medium"
                            >
                              選択中
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* 選択された店舗の確認セクション */}
        {selectedStore && (
          <div className="bg-gradient-to-br from-white via-pink-50 to-purple-50 rounded-2xl p-6 shadow-xl border-2 border-pink-200">
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">{selectedStore.emoji}</div>
              <Text variant="h4" className="text-gray-800 mb-1">
                {selectedStore.name}
              </Text>
              <Text variant="small" className="text-gray-600">
                を選択しました
              </Text>
            </div>

            <div
              className={`bg-gradient-to-r ${selectedStore.color} rounded-xl p-4 mb-4`}
            >
              <Text variant="small" className="text-gray-700 text-center">
                {selectedStore.description}
              </Text>
              <div className="flex justify-center items-center space-x-4 mt-3">
                <div className="flex items-center space-x-1">
                  <span className="text-pink-500">📍</span>
                  <Text variant="caption" className="text-gray-600">
                    {selectedStore.distance}
                  </Text>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <Text variant="caption" className="text-gray-600">
                    {selectedStore.rating}
                  </Text>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleProceedToFlavors}
            >
              <span className="mr-2">🍧</span>
              フレーバーを選ぶ
              <span className="ml-2">✨</span>
            </Button>
          </div>
        )}

        {/* フッター */}
        <div className="text-center py-6 bg-gradient-to-r from-cyan-100/70 via-blue-100/70 to-purple-100/70 rounded-2xl backdrop-blur-sm border border-white/50">
          <div className="text-2xl mb-2">🌈</div>
          <Text variant="caption" color="muted" className="text-gray-600">
            甘くて冷たい幸せをお届け
          </Text>
        </div>
      </div>
    </div>
  );
};

export default TopPage;
