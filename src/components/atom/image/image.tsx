import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { default as NextImage } from "next/image";

const imageVariants = cva("contain", {
  variants: {
    shape: {
      square: "rounded-none",
      rounded: "rounded-lg",
      circular: "rounded-full",
    },
    border: {
      red: "border-red-500",
      blue: "border-blue-500",
      green: "border-green-500",
      orange: "border-amber-500",
    },
  },
  defaultVariants: {
    shape: "square",
    border: "red",
  },
});

type ImageVariantProps = VariantProps<typeof imageVariants>;
export type Shape = ImageVariantProps["shape"];
export type Border = ImageVariantProps["border"];

export type ImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  bordered?: boolean;
  border?: Border;
} & ImageVariantProps;

export default function Image({
  src,
  alt,
  width = 200,
  height = 200,
  shape,
  border,
  bordered = false,
  className,
  priority = false,
}: ImageProps) {
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn(
        imageVariants({ shape, border }),
        bordered && "border-2",
        className,
      )}
    />
  );
}
