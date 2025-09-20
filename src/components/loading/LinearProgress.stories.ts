import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LinerProgress from "./LinearProgress";

const meta: Meta<typeof LinerProgress> = {
  title: "Loading/LinerProgress",
  component: LinerProgress,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LinerProgress>;

export const Default: Story = {
  args: {
    value: 50, // 進捗値の例
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const Zero: Story = {
  args: {
    value: 0,
  },
};

// 自動進行: 0% → 80% (1秒で停止)
export const AutoProgress: Story = {
  args: {
    autoProgress: true,
  },
};
