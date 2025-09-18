import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Text from "./text";

const meta = {
  title: "Design System/Atom/Text",
  component: Text,
  args: {
    children: "Sample Text",
    variant: "body",
    color: "primary",
    as: "p",
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["h1", "h2", "h3", "h4", "body", "small", "caption"],
    },
    color: {
      control: { type: "radio" },
      options: ["primary", "secondary", "muted", "destructive"],
    },
    as: {
      control: { type: "radio" },
      options: ["h1", "h2", "h3", "h4", "p", "span"],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};

export const Heading1: Story = {
  args: {
    variant: "h1",
    as: "h1",
    children: "Heading 1",
  },
};

export const Heading2: Story = {
  args: {
    variant: "h2",
    as: "h2",
    children: "Heading 2",
  },
};

export const Body: Story = {
  args: {
    variant: "body",
    children: "Body text content",
  },
};

export const Small: Story = {
  args: {
    variant: "small",
    children: "Small text",
  },
};

export const Caption: Story = {
  args: {
    variant: "caption",
    children: "Caption text",
    className: "text-blue-500",
  },
};

export const Destructive: Story = {
  args: {
    color: "destructive",
    children: "Error message",
  },
};
