import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import OrderCard from "./order-card";

const flavorOptions = ["strawberry", "blue", "meron", "orange"] as const;

const meta = {
  title: "Design System/Component/OrderCard",
  component: OrderCard,
  args: {
    flavor: "strawberry",
    title: "プレミアムいちごかき氷",
    description:
      "厳選された完熟いちごを使用した贅沢なかき氷です。ふわふわの氷に甘酸っぱいいちごシロップが絶妙にマッチします。",
  },
  argTypes: {
    flavor: {
      control: { type: "radio" },
      options: flavorOptions,
    },
    title: {
      control: { type: "text" },
    },
    description: {
      control: { type: "text" },
    },
    className: {
      control: { type: "text" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OrderCard>;

export default meta;

type Story = StoryObj<typeof OrderCard>;

export const Default: Story = {};

export const Strawberry: Story = {
  args: {
    flavor: "strawberry",
    title: "プレミアムいちごかき氷",
    description: "厳選された完熟いちごを使用した贅沢なかき氷です。",
  },
};

export const Blue: Story = {
  args: {
    flavor: "blue",
    title: "ブルーハワイかき氷",
    description:
      "南国の青い海をイメージした爽やかなかき氷。夏にぴったりの涼しげな一品です。",
  },
};

export const Meron: Story = {
  args: {
    flavor: "meron",
    title: "メロンプレミアムかき氷",
    description:
      "高級メロンの濃厚な甘さが楽しめる贅沢なかき氷。メロンの香りが口いっぱいに広がります。",
  },
};

export const Orange: Story = {
  args: {
    flavor: "orange",
    title: "オレンジフレッシュかき氷",
    description:
      "新鮮なオレンジの爽やかな酸味と甘みが絶妙なバランス。ビタミンCたっぷりの健康的な一品。",
  },
};

export const ShortTitle: Story = {
  args: {
    flavor: "blue",
    title: "青",
    description: "シンプルなブルーハワイ味。",
  },
};
