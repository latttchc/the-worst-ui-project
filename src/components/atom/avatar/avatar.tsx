import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Avatar as DefaultAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const avatorVariants = cva("black rounded-full overflow-hidden", {
  variants: {
    size: {
      sm: "size-7",
      md: "size-8",
      lg: "size-9",
      xl: "size-10",
    }
  },
  defaultVariants: {
    size: "md"
  }
})

type AvatarVariantsProps = VariantProps<typeof avatorVariants>;
export type Size = AvatarVariantsProps["size"]

type Props = {

} & AvatarVariantsProps

export default function Avatar({ size }: Props) {
  return (
    <DefaultAvatar className={cn(avatorVariants({ size }))}>
      <AvatarImage
        className="aspect-square size-full object-cover"
        src="https://www.istockphoto.com/jp/%E3%83%99%E3%82%AF%E3%82%BF%E3%83%BC/%E3%81%8B%E3%81%8D%E6%B0%B7%E5%A4%8F%E3%81%AE%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88%E3%83%99%E3%82%AF%E3%82%BF%E3%83%BC%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3-gm1401659421-454829272"
      />
      <AvatarFallback>CN</AvatarFallback>
    </DefaultAvatar>
  )
}