import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Pagination,
  type PaginationActionContext,
  type PaginationProps,
} from "@keytuno/ui-react";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "min(980px, 96vw)",
};

const frameStyle: CSSProperties = {
  width: "min(900px, 96vw)",
};

function ControlledPaginationDemo(): JSX.Element {
  const [currentPage, setCurrentPage] = useState(3);
  const [pageSize, setPageSize] = useState(12);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
      }}
    >
      <Pagination
        variant="advance"
        page={currentPage}
        pageSize={pageSize}
        totalPages={25}
        pageSizeOptions={[12, 24, 48]}
        labels={{ item: "rows" }}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <span
        style={{
          fontSize: "0.8rem",
          color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
        }}
      >
        State: page {currentPage}, page size {pageSize}
      </span>
    </div>
  );
}

export const BasicVariant: Story = {
  name: "Variant Basic",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic Variant</h3>

      <Field style={frameStyle}>
        <FieldLabel>Orders Table</FieldLabel>

        <FieldContent>
          <Pagination
            variant="basic"
            totalPages={10}
            defaultPage={1}
            defaultPageSize={12}
            pageSizeOptions={[12, 24, 48]}
          />
          <FieldDescription>
            Basic variant includes icon-based first/prev/page numbers/next/last
            with a single page-size Select.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const AdvanceVariant: Story = {
  name: "Variant Advance",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Advance Variant</h3>

      <Field style={frameStyle}>
        <FieldLabel>Positions Ledger</FieldLabel>

        <FieldContent>
          <Pagination
            variant="advance"
            totalPages={10}
            defaultPage={1}
            defaultPageSize={12}
            pageSizeOptions={[12, 24, 48]}
          />
          <FieldDescription>
            Advance variant keeps concise controls: page-size selector,
            showing-page text, and icon prev/next.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const CompactVariant: Story = {
  name: "Variant Compact (Shortest)",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Compact Variant</h3>

      <Field style={frameStyle}>
        <FieldLabel>Watchlist</FieldLabel>

        <FieldContent>
          <Pagination
            variant="compact"
            totalPages={10}
            defaultPage={1}
            defaultPageSize={12}
            pageSizeOptions={[12, 24, 48]}
            labels={{ item: "items", perPage: "page" }}
          />
          <FieldDescription>
            Compact layout shows page-size on the left and previous/summary/next
            on the right.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const VisiblePageCount: Story = {
  name: "Visible Page Count",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Visible Page Count</h3>

      <FieldGroup style={frameStyle}>
        <Pagination
          variant="basic"
          totalPages={10}
          defaultPage={1}
          maxVisiblePages={4}
          labels={{ item: "items", perPage: "page" }}
        />

        <Pagination
          variant="basic"
          totalPages={10}
          defaultPage={1}
          maxVisiblePages={5}
          labels={{ item: "items", perPage: "page" }}
        />
      </FieldGroup>
    </div>
  ),
};

export const ConfigurableText: Story = {
  name: "Configurable Text (Items/Rows)",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Configurable Text</h3>

      <FieldGroup style={frameStyle}>
        <Pagination
          variant="basic"
          totalPages={12}
          defaultPage={2}
          labels={{
            item: "items",
            perPage: "page",
            showingPage: "Page",
          }}
        />

        <Pagination
          variant="advance"
          totalPages={12}
          defaultPage={2}
          labels={{
            item: "rows",
            perPage: "page",
            showingPage: "Page",
          }}
        />
      </FieldGroup>
    </div>
  ),
};

export const Controlled: Story = {
  name: "Controlled",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Controlled</h3>

      <Field style={frameStyle}>
        <FieldLabel>State Controlled Pagination</FieldLabel>

        <FieldContent>
          <ControlledPaginationDemo />
          <FieldDescription>
            Uses page and pageSize as controlled props with callbacks.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const PaginationActions: Story = {
  name: "Pagination Actions",
  args: {
    onAction: undefined,
    onPageChange: undefined,
    onPageSizeChange: undefined,
  },
  argTypes: {
    onAction: {
      action: "action",
      description:
        "Fires for first/previous/next/last/page-number/page-size and page-size-reset interactions.",
    },
    onPageChange: {
      action: "page-change",
      description:
        "Fires with the next page number whenever page navigation occurs.",
    },
    onPageSizeChange: {
      action: "page-size-change",
      description: "Fires with the next page size when selector value changes.",
    },
  },
  render: (args) => {
    const onAction = args.onAction;
    const onPageChange = args.onPageChange;
    const onPageSizeChange = args.onPageSizeChange;

    const handleAction =
      onAction == null
        ? undefined
        : (context: PaginationActionContext) => {
            onAction(context);
          };

    return (
      <Field style={frameStyle}>
        <FieldLabel>Action Events</FieldLabel>

        <FieldContent>
          <Pagination
            variant="basic"
            totalPages={12}
            defaultPage={3}
            defaultPageSize={12}
            pageSizeOptions={[12, 24, 48]}
            onAction={handleAction}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />

          <FieldDescription>
            Navigate pages and change page size to inspect emitted action
            payloads.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};

type PaginationPlaygroundProps = PaginationProps;

export const PaginationPlayground: StoryObj<PaginationPlaygroundProps> = {
  name: "Pagination Playground",
  args: {
    variant: "basic",
    size: "md",
    pageSizeSelectVariant: "inline",
    totalPages: 12,
    defaultPage: 1,
    defaultPageSize: 12,
    pageSizeOptions: [12, 24, 48],
    maxVisiblePages: 2,
    disabled: false,
    showPageSizeSelector: true,
    showSummary: true,
    showShowingPage: true,
    resetPageOnPageSizeChange: true,
    labels: {
      item: "items",
      select: "Page size",
      perPage: "page",
      showingPage: "Page",
    },
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["basic", "advance", "compact"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    pageSizeSelectVariant: {
      control: "inline-radio",
      options: ["inline", "overlay"],
    },
    totalPages: { control: "number" },
    defaultPage: { control: "number" },
    defaultPageSize: { control: "number" },
    pageSizeOptions: { control: "object" },
    maxVisiblePages: { control: "number" },
    disabled: { control: "boolean" },
    showPageSizeSelector: { control: "boolean" },
    showSummary: { control: "boolean" },
    showShowingPage: { control: "boolean" },
    resetPageOnPageSizeChange: { control: "boolean" },
    labels: { control: "object" },
    page: { table: { disable: true } },
    pageSize: { table: { disable: true } },
    onAction: { action: "action" },
    onPageChange: { action: "page-change" },
    onPageSizeChange: { action: "page-size-change" },
    summaryFormatter: { table: { disable: true } },
    showingPageFormatter: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => (
    <Field style={frameStyle}>
      <FieldLabel>Interactive Playground</FieldLabel>

      <FieldContent>
        <Pagination
          key={`${args.variant}-${args.size}-${args.pageSizeSelectVariant}-${args.totalPages}-${args.defaultPage}-${args.defaultPageSize}-${args.maxVisiblePages}-${args.disabled}-${args.showPageSizeSelector}-${args.showSummary}-${args.showShowingPage}-${args.resetPageOnPageSizeChange}-${JSON.stringify(args.labels)}`}
          {...args}
        />

        <FieldDescription>
          Tune variant, size, visible-page counts, labels, total pages/items,
          and page-size behavior from controls.
        </FieldDescription>
      </FieldContent>
    </Field>
  ),
};
