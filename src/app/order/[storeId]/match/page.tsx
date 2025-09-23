"use client";

import { useRouter } from "next/navigation";
import type { Flavor } from "@/types/flavor";
import { useEffect, useState, use } from "react";
import { fetchMenu, MenuItem } from "@/api/api";
import Text from "@/components/atom/text";
import MatchCard from "@/components/matchCard";
import OrderCard from "@/components/orderCard";
import Button from "@/components/atom/button";
import { X, Heart } from "lucide-react";

interface PageProps {
  params: Promise<{
    storeId: string;
  }>;
}

// メニュー名からフレーバーを推測
const guessFlavor = (name: string): Flavor => {
  if (name.includes("ブルー")) return "blue";
  if (name.includes("メロン")) return "meron";
  if (name.includes("オレンジ")) return "orange";
  return "strawberry";
};

// 配列からランダムにn個選ぶ
function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

const Page = ({ params }: PageProps) => {
  const router = useRouter();
  const { storeId } = use(params);
  const [allMenu, setAllMenu] = useState<MenuItem[]>([]);
  const [orderableMenu, setOrderableMenu] = useState<MenuItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!storeId) return;
    setLoading(true);
    setErr(null);
    (async () => {
      try {
        const items = await fetchMenu(storeId);
        if (items.length === 0) {
          setErr("メニューが見つかりません");
          return;
        }

        const displayMenu = items.length >= 4 ? items.slice(0, 4) : items;
        setAllMenu(displayMenu);

        setOrderableMenu(pickRandom(items, Math.min(items.length, 2)));
      } catch (error) {
        setErr(
          error instanceof Error
            ? error.message
            : "メニューの取得に失敗しました",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [storeId]);

  const handleLike = (menuId: string) => {
    const isOrderable = orderableMenu.some((item) => item.id === menuId);
    if (isOrderable) {
      setSelected(menuId);
    }
  };

  const handleDislike = () => {
    // 何もしない
  };

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && allMenu[currentIndex]) {
      handleLike(allMenu[currentIndex].id);
    } else {
      handleDislike();
    }
  };

  const handleCardLeftScreen = () => {
    if (!selected) {
      setCurrentIndex((prev) => (prev + 1) % allMenu.length);
    }
  };

  const handleOrder = async () => {
    if (!storeId || !selected) return;
    setSubmitting(true);
    setErr(null);

    try {
      const selectedMenu = allMenu.find((m) => m.id === selected);
      const flavor = selectedMenu ? guessFlavor(selectedMenu?.name) : "";

      const searchParams = new URLSearchParams({
        menuId: selected,
        flavor: flavor,
      });
      router.push(`/order/${storeId}/message?${searchParams.toString()}`);
    } catch (err) {
      setErr(err instanceof Error ? err.message : "注文に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  // ボタンクリック時の処理（即座にインデックスを更新）
  const handleButtonLike = () => {
    const isOrderable = orderableMenu.some(
      (item) => item.id === allMenu[currentIndex].id,
    );
    if (isOrderable) {
      setSelected(allMenu[currentIndex].id);
    } else {
      setCurrentIndex((prev) => (prev + 1) % allMenu.length);
    }
  };

  const handleButtonDislike = () => {
    setCurrentIndex((prev) => (prev + 1) % allMenu.length);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <Text variant="body" color="muted">
          メニューを読み込み中...
        </Text>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
        <Text variant="h2" className="text-red-600 mb-4">
          エラーが発生しました
        </Text>
        <Text variant="body" className="text-red-500">
          {err}
        </Text>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          再読み込み
        </Button>
      </div>
    );
  }

  if (!allMenu.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Text variant="h2" className="text-gray-600 mb-4">
          😅
        </Text>
        <Text variant="body" color="muted">
          メニューが見つかりません
        </Text>
      </div>
    );
  }

  if (selected) {
    const selectedMenu = allMenu.find((m) => m.id === selected);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Text variant="h2" className="mb-6 text-center">
          🎉 MATCH!!! 🎉
        </Text>

        <div className="mb-8">
          <OrderCard
            flavor={guessFlavor(selectedMenu?.name ?? "")}
            title={selectedMenu?.name ?? ""}
            description={selectedMenu?.description ?? ""}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          disabled={submitting}
          onClick={handleOrder}
          className="px-8 py-4 text-lg font-bold"
        >
          {submitting ? "🔄 ROOM CREATE..." : "💝 Messageを送ろう!"}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="text-center pt-8 pb-4">
        <Text
          variant="h1"
          className="mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
        >
          🍧 かき氷マッチング
        </Text>
        <Text variant="body" color="muted" className="text-lg">
          注文したいものを LIKE してね！
        </Text>
      </div>

      {/* メインコンテンツ */}
      <div className="flex flex-col items-center justify-center px-4 pb-8 max-md:my-5">
        <div className="relative mb-8">
          {/* メインカード */}
          <MatchCard
            key={currentIndex}
            onSwipe={handleSwipe}
            onCardLeftScreen={handleCardLeftScreen}
            cardWidth={384}
            cardHeight={500}
          >
            <OrderCard
              flavor={guessFlavor(allMenu[currentIndex].name)}
              title={allMenu[currentIndex].name}
              description={allMenu[currentIndex].description ?? ""}
            />
          </MatchCard>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-30 mb-6">
          <Button
            variant="secondary"
            size="icon-lg"
            onClick={handleButtonDislike}
            className="size-20 bg-red-100 hover:bg-red-200 text-red-600 border-red-200"
          >
            <X className="size-10" />
          </Button>
          <Button
            variant="secondary"
            size="icon-lg"
            onClick={handleButtonLike}
            className="size-20 bg-green-500 hover:bg-green-600"
          >
            <Heart className="size-10" />
          </Button>
        </div>

        {/* 進行状況 */}
        <div className="flex items-center gap-2">
          {allMenu.map((menu, index) => {
            return (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? "bg-green-500" : "bg-green-200"
                  }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
