import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card as DefaultCard } from "@/components/ui/card";

const cardVariants = cva("overflow-hidden", {
  variants: {
    size: {
      // 縦長バリエーション
      "vertical-sm": "w-64 h-80",
      "vertical-md": "w-80 h-96",
      "vertical-lg": "w-96 h-[500px]",
      "vertical-xl": "w-[420px] h-[600px]",

      // 横長バリエーション
      "horizontal-sm": "w-80 h-32",
      "horizontal-md": "w-96 h-40",
      "horizontal-lg": "w-[500px] h-48",
      "horizontal-xl": "w-[600px] h-56",
    },
  },
  defaultVariants: {
    size: "vertical-md",
  },
});

type CardVariantProps = VariantProps<typeof cardVariants>;
export type Size = CardVariantProps["size"];

export type CardProps = {
  children?: React.ReactNode;
  className?: string;
} & CardVariantProps;

export default function Card({ size, children, className }: CardProps) {
  return (
    <DefaultCard className={cn(cardVariants({ size }), className)}>
      {children}
    </DefaultCard>
  );
}
