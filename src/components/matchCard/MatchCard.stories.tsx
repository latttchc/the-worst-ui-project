import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import MatchCard from "./MatchCard"
import { flavorOptions } from "@/types/flavor"
import OrderCard from "../orderCard"
import { fn } from "storybook/internal/test"

const meta = {
  title: "Design System/Component/MatchCard",
  component: MatchCard,
  args: {
    cardWidth: 400,
    cardHeight: 400,
    swipeThreshold: 100,
    onSwipe: fn(),
    onCardLeftScreen: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MatchCard>

export default meta

type Story = StoryObj<typeof MatchCard>

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <MatchCard {...args}>
        <OrderCard
          flavor="strawberry"
          title="プレミアムいちごかき氷"
          description="厳選された完熟いちごを使用した贅沢なかき氷です。"
        />
      </MatchCard>
    </div>
  )
}
