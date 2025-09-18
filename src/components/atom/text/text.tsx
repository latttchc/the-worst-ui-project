import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      h1: "text-4xl font-bold",
      h2: "text-3xl font-semibold",
      h3: "text-2xl font-semibold",
      h4: "text-xl font-semibold",
      body: "text-base",
      small: "text-sm",
      caption: "text-xs text-gray-600",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "primary",
  },
})

type TextVariantProps = VariantProps<typeof textVariants>

export type TextProps = {
  children: React.ReactNode
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
  className?: string
} & TextVariantProps

export default function Text({
  children,
  variant,
  color,
  as = "p",
  className,
}: TextProps) {
  const Component = as;

  return (
    <Component className={cn(textVariants({ variant, color }), className)}>
      {children}
    </Component>
  );
}