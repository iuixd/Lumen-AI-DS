import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CrudListPage } from "./CrudListPage";
import { Badge, type Column } from "@lumen/ui";

interface Project {
  id: string;
  name: string;
  owner: string;
  status: "active" | "archived";
}

const seed: Project[] = [
  { id: "1", name: "Q3 Launch", owner: "Jane Cooper", status: "active" },
  { id: "2", name: "Design Refresh", owner: "Amara Okafor", status: "active" },
  { id: "3", name: "Legacy Migration", owner: "Sam Patel", status: "archived" }
];

const columns: Column<Project>[] = [
  { key: "name", header: "Project", render: (row) => row.name },
  { key: "owner", header: "Owner", render: (row) => row.owner },
  {
    key: "status",
    header: "Status",
    render: (row) => <Badge tone={row.status === "active" ? "success" : "neutral"}>{row.status}</Badge>
  }
];

const meta = {
  title: "Patterns/CrudListPage",
  component: CrudListPage<Project>,
  parameters: { layout: "fullscreen", controls: { disable: true } },
  args: {
    title: "Projects",
    columns,
    data: seed,
    rowKey: (row: Project) => row.id,
    page: 1,
    pageCount: 4,
    onPageChange: () => {}
  }
} satisfies Meta<typeof CrudListPage<Project>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return (
      <CrudListPage
        {...args}
        page={page}
        onPageChange={setPage}
        onCreate={() => alert("Create project")}
        createLabel="New project"
      />
    );
  }
};

export const Empty: Story = {
  args: { data: [] },
  render: (args) => <CrudListPage {...args} onCreate={() => alert("Create project")} />
};
