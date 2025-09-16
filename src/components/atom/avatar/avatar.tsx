import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import {
  Avatar as DefaultAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const avatorVariants = cva(
  "block rounded-full overflow-hidden border border-black",
  {
    variants: {
      size: {
        sm: "size-14",
        md: "size-15",
        lg: "size-16",
        xl: "size-18",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type AvatarVariantsProps = VariantProps<typeof avatorVariants>;
export type Size = AvatarVariantsProps["size"];
export type Src = "strawberry" | "meron" | "blue" | "orange";

type Props = {
  src?: Src;
} & AvatarVariantsProps;

const imageMap = {
  strawberry: "/strawberry.png",
  meron: "/meron.png",
  blue: "/blue.png",
  orange: "/orange.png",
};

export default function Avatar({ size, src = "strawberry" }: Props) {
  const imageSrc = src ? imageMap[src] : imageMap.strawberry;

  return (
    <DefaultAvatar className={cn(avatorVariants({ size }))}>
      <AvatarImage
        className="aspect-square size-full object-cover"
        src={imageSrc}
      />
      <AvatarFallback>
        {src === "strawberry" ? "Strawberry" : src?.toUpperCase() || "CN"}
      </AvatarFallback>
    </DefaultAvatar>
  );
}
