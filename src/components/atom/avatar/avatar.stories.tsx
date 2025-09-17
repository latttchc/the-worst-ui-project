// 1.meta
// 2.stories
// 3.type meta and stories

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Avatar, { Size, Src } from "./avatar";

const sizeOption: Size[] = ["sm", "md", "lg", "xl"];
const srcOption: Src[] = ["strawberry", "meron", "blue", "orange"];

const meta = {
  title: "Design System/Atom/Avatar",
  component: Avatar,
  args: {
    size: "md",
    src: "strawberry",
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: sizeOption,
    },
    src: {
      control: { type: "radio" },
      options: srcOption,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default = {} satisfies Story;

export const Small = {
  args: {
    size: "sm",
  },
} satisfies Story;

export const Large = {
  args: {
    size: "lg",
  },
} satisfies Story;

export const XLarge = {
  args: {
    size: "xl",
  },
} satisfies Story;

export const Strawberry = {
  args: {
    src: "strawberry",
  },
} satisfies Story;
