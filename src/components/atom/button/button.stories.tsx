import { Bell, Mails, Plus, ThumbsUp, HeartOff } from "lucide-react";
import Button from "./button";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

const meta = {
  title: "Design System/Atom/Button",
  component: Button,
  args: {
    children: "Button",
    variant: "secondary",
    size: "md",
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["primary", "secondary", "text", "link"],
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg", "icon-sm", "icon-md", "icon-lg"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: (
      <>
        <Plus />
        <span>Add to Story</span>
      </>
    ),
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: (
      <>
        <Mails />
        <span>Send Message</span>
      </>
    ),
    variant: "secondary",
  },
};

export const LikeText: Story = {
  args: {
    children: (
      <>
        <ThumbsUp />
        <span>Like</span>
      </>
    ),
    variant: "text",
  },
};

export const UnlikeText: Story = {
  args: {
    children: (
      <>
        <HeartOff />
        <span>Unlike</span>
      </>
    ),
    variant: "text",
  },
};

export const Icon: Story = {
  args: {
    children: <Bell />,
    variant: "secondary",
    size: "icon-md",
  },
};

export const Link: Story = {
  args: {
    children: "John Wick",
    variant: "link",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};