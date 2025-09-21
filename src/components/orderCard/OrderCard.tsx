import React from "react";
import Card from "../atom/card";
import Image from "../atom/image";
import Text from "../atom/text";
import { cn } from "@/lib/utils";

type FlavorType = "strawberry" | "blue" | "meron" | "orange";

export type OrderCardProps = {
  flavor: FlavorType;
  title: string;
  description: string;
  className?: string;
};

const flavorMap = {
  strawberry: {
    image: "/strawberry.png",
    border: "red",
    bgColor: "bg-red-50",
    name: "いちご",
  },
  meron: {
    image: "/meron.png",
    border: "green",
    bgColor: "bg-green-50",
    name: "メロン",
  },
  blue: {
    image: "/blue.png",
    border: "blue",
    bgColor: "bg-blue-50",
    name: "ブルーハワイ",
  },
  orange: {
    image: "/orange.png",
    border: "orange",
    bgColor: "bg-orange-50",
    name: "オレンジ",
  },
};

const OrderCard: React.FC<OrderCardProps> = ({
  flavor,
  title,
  description,
  className,
}) => {
  const flavorInfo = flavorMap[flavor];

  return (
    <Card
      size="vertical-lg"
      className={cn(
        "relative overflow-hidden shadow-xl",
        "transition-transform hover:scale-105",
        flavorInfo.bgColor,
        className,
      )}
    >
      <div className="relative h-80">
        <Image
          src={flavorInfo.image}
          alt={`${flavorInfo.name}味のかき氷`}
          shape="square"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative flex flex-col">
        <Text variant="h3" className="">
          {title}
        </Text>
        <Text variant="h4">{description}</Text>
      </div>
    </Card>
  );
};

export default OrderCard;
