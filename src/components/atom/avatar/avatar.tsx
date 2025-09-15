import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Avatar as DefaultAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const avatorVariants = cva("block rounded-full overflow-hidden", {
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
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjIqqY6TLCGWs7Qr-k8vQczblwJmOe23eypzzQnoH76A20WYAQMRYE169Sx5-xWXE1m5VPCFegBrWq9aC8aVqZLffcMzAc3i7WWAdxoAKbJ2QJhrTLRJRElafcyQ2vWjJrolxACQGjlflSx/s800/kakigoori1_red.png"
      />
      <AvatarFallback>CN</AvatarFallback>
    </DefaultAvatar>
  )
}