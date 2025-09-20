import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Card, { Size } from "./card";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const sizeOptions: Size[] = [
  "vertical-sm",
  "vertical-md",
  "vertical-lg",
  "vertical-xl",
  "horizontal-sm",
  "horizontal-md",
  "horizontal-lg",
  "horizontal-xl",
];

const meta = {
  title: "Design System/Atom/Card",
  component: Card,
  args: {
    size: "vertical-md",
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the card content area.</p>
        </CardContent>
      </>
    ),
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: sizeOptions,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {};

// 縦長
export const VerticalSmall: Story = {
  args: {
    size: "vertical-sm",
    children: (
      <>
        <CardHeader>
          <CardTitle>Small Vertical</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Small vertical card content.</p>
        </CardContent>
      </>
    ),
  },
};

export const VerticalMedium: Story = {
  args: {
    size: "vertical-md",
    children: (
      <>
        <CardHeader>
          <CardTitle>Medium Vertical</CardTitle>
          <CardDescription>Standard size vertical card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Medium vertical card with more content area.</p>
        </CardContent>
      </>
    ),
  },
};

export const VerticalLarge: Story = {
  args: {
    size: "vertical-lg",
    children: (
      <>
        <CardHeader>
          <CardTitle>Large Vertical</CardTitle>
          <CardDescription>Large size vertical card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Large vertical card with plenty of content space. This card can
            contain more detailed information and content.
          </p>
        </CardContent>
      </>
    ),
  },
};

export const VerticalXLarge: Story = {
  args: {
    size: "vertical-xl",
    children: (
      <>
        <CardHeader>
          <CardTitle>Extra Large Vertical</CardTitle>
          <CardDescription>Maximum size vertical card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Extra large vertical card with maximum content space. Perfect for
            detailed forms, long descriptions, or complex layouts.
          </p>
        </CardContent>
      </>
    ),
  },
};

// 横長
export const HorizontalSmall: Story = {
  args: {
    size: "horizontal-sm",
    children: (
      <>
        <CardContent className="p-4">
          <p className="text-sm">Small horizontal card - compact layout</p>
        </CardContent>
      </>
    ),
  },
};

export const HorizontalMedium: Story = {
  args: {
    size: "horizontal-md",
    children: (
      <>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Medium Horizontal</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm">
            Medium horizontal card for notifications or alerts.
          </p>
        </CardContent>
      </>
    ),
  },
};

export const HorizontalLarge: Story = {
  args: {
    size: "horizontal-lg",
    children: (
      <>
        <CardHeader>
          <CardTitle>Large Horizontal</CardTitle>
          <CardDescription>Wide layout card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Large horizontal card perfect for dashboard widgets or wide content
            layouts.
          </p>
        </CardContent>
      </>
    ),
  },
};

export const HorizontalXLarge: Story = {
  args: {
    size: "horizontal-xl",
    children: (
      <>
        <CardHeader>
          <CardTitle>Extra Large Horizontal</CardTitle>
          <CardDescription>Maximum width horizontal card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Extra large horizontal card for complex horizontal layouts,
            dashboards, or wide content areas that need maximum screen width.
          </p>
        </CardContent>
      </>
    ),
  },
};
