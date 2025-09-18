import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Image, { Shape, Border } from "./image";

const shapeOption: Shape[] = ["square", "rounded", "circular"];
const borderOption: Border[] = ["red", "blue", "green", "orange"];

const meta = {
  title: "Design System/Atom/Image",
  component: Image,
  args: {
    src: "/strawberry.png",
    alt: "strawberry flavor",
    width: 200,
    height: 200,
    shape: "rounded",
    border: "red",
  },
  argTypes: {
    shape: {
      control: { type: "radio" },
      options: shapeOption,
    },
    border: {
      control: { type: "radio" },
      options: borderOption,
    },
    width: {
      control: { type: "number" },
    },
    height: {
      control: { type: "number" },
    },
    src: {
      control: { type: "text" },
    },
    alt: {
      control: { type: "text" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof Image>;

export const Default: Story = {};

export const SquareRed: Story = {
  args: {
    shape: "square",
    border: "red",
    src: "/strawberry.png",
    alt: "strawberry border",
    bordered: true,
  },
};

export const RoundedBlue: Story = {
  args: {
    shape: "rounded",
    border: "blue",
    src: "/blue.png",
    alt: "blue border",
    bordered: true,
  },
};

export const CircularGreen: Story = {
  args: {
    shape: "circular",
    border: "green",
    src: "/meron.png",
    alt: "meron border",
  },
};

export const CircularOrangeContain: Story = {
  args: {
    shape: "circular",
    border: "orange",
    src: "/orange.png",
    alt: "orange border",
    bordered: true,
  },
};
