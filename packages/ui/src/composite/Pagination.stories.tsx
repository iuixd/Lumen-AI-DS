import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pagination } from "./Pagination";

const meta = {
  title: "Composite/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    docs: { description: { component: "Maps to Figma \"Next Prev Buttons\"." } },
    controls: { disable: true }
  },
  args: { page: 3, pageCount: 8, onPageChange: () => {} }
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onPageChange={setPage} />;
  }
};

export const FirstPage: Story = {
  args: { page: 1 }
};

export const LastPage: Story = {
  args: { page: 8 }
};
