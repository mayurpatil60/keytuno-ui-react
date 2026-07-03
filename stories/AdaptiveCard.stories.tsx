import { useMemo, useState, type CSSProperties } from "react";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import type { Meta, StoryObj } from "@storybook/react";
import { FiEdit3, FiEye, FiTrash2 } from "../src/components/icons/feather";

import {
  AdaptiveCard,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  type AdaptiveCardAction,
  type AdaptiveCardFieldSchema,
  type AdaptiveCardProps,
} from "../src/index";

type TradeStatus = "Open" | "Review" | "Closed";

interface TradeAdaptiveRow {
  id: string;
  symbol: string;
  desk: string;
  owner: string;
  status: TradeStatus;
  price: number;
  change: number;
  exposure: number;
  progress: { value: number; max: number; label: string };
  risk: {
    label: "Low" | "Medium" | "High";
    variant: "secondary" | "outline" | "destructive";
  };
  contact: { phone: string };
  reportUrl: string;
  snapshot?: { src: string; alt: string; type: "image" };
  updatedAt: string;
  note?: string;
}

const desks = ["Derivatives", "Cash", "Arbitrage", "Commodities"];
const owners = ["Mayur", "Anaya", "Vivaan", "Aditi", "Ishaan"];
const statuses: TradeStatus[] = ["Open", "Review", "Closed"];

function resolveRisk(seed: number): TradeAdaptiveRow["risk"] {
  if (seed % 7 === 0) {
    return { label: "High", variant: "destructive" };
  }

  if (seed % 3 === 0) {
    return { label: "Medium", variant: "outline" };
  }

  return { label: "Low", variant: "secondary" };
}

const adaptiveRows: TradeAdaptiveRow[] = Array.from(
  { length: 220 },
  (_, index) => {
    const seed = index + 1;
    const progressValue = 20 + ((seed * 13) % 80);

    return {
      id: `ADP-${String(seed).padStart(4, "0")}`,
      symbol: `STK${String(100 + seed)}`,
      desk: desks[index % desks.length] ?? "Derivatives",
      owner: owners[index % owners.length] ?? "Mayur",
      status: statuses[index % statuses.length] ?? "Open",
      price: 110 + ((seed * 19) % 1620),
      change: ((seed % 2 === 0 ? 1 : -1) * ((seed * 9) % 125)) / 100,
      exposure: 50000 + ((seed * 7913) % 750000),
      progress: {
        value: progressValue,
        max: 100,
        label: `${progressValue}% complete`,
      },
      risk: resolveRisk(seed),
      contact: {
        phone: `+91-9${String((seed * 9173) % 999999999).padStart(9, "0")}`,
      },
      reportUrl: `https://example.com/reports/${seed}`,
      snapshot:
        seed % 3 === 0
          ? {
              src: `https://picsum.photos/seed/keytuno-adaptive-${seed}/720/400`,
              alt: `Trade snapshot ${seed}`,
              type: "image",
            }
          : undefined,
      updatedAt: `2026-07-${String((seed % 28) + 1).padStart(2, "0")}`,
      note:
        seed % 4 === 0
          ? "Watch spread compression before market close and verify hedge inventory."
          : undefined,
    };
  },
);

const adaptiveSchema: AdaptiveCardFieldSchema<TradeAdaptiveRow>[] = [
  {
    key: "symbol",
    label: "Symbol",
    priority: 0,
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    align: "right",
    priority: 1,
  },
  {
    key: "desk",
    label: "Desk",
    priority: 2,
  },
  {
    key: "owner",
    label: "Owner",
    priority: 3,
  },
  {
    key: "price",
    label: "Price",
    type: "currency",
    currency: "INR",
    align: "right",
    maximumFractionDigits: 2,
    priority: 4,
  },
  {
    key: "change",
    label: "Change",
    type: "percent",
    align: "right",
    maximumFractionDigits: 2,
    priority: 5,
  },
  {
    key: "exposure",
    label: "Exposure",
    type: "currency",
    currency: "INR",
    align: "right",
    maximumFractionDigits: 0,
    priority: 6,
  },
  {
    key: "risk",
    label: "Risk",
    type: "badge",
    priority: 7,
  },
  {
    key: "progress",
    label: "Progress",
    type: "progress",
    span: "full",
    priority: 8,
  },
  {
    key: "contact.phone",
    label: "Desk Contact",
    type: "phone",
    priority: 9,
  },
  {
    key: "reportUrl",
    label: "Report",
    type: "link",
    priority: 10,
  },
  {
    key: "updatedAt",
    label: "Updated",
    type: "date",
    dateOptions: { year: "numeric", month: "short", day: "numeric" },
    priority: 11,
  },
  {
    key: "note",
    label: "Note",
    span: "full",
    hideIfEmpty: true,
    priority: 12,
  },
  {
    key: "snapshot",
    label: "Snapshot",
    type: "media",
    span: "full",
    hideIfEmpty: true,
    priority: 13,
  },
];

const adaptiveActions: AdaptiveCardAction<TradeAdaptiveRow>[] = [
  {
    id: "view",
    label: "View",
    icon: <FiEye size={13} />,
    variant: "secondary",
  },
  {
    id: "edit",
    label: "Edit",
    icon: <FiEdit3 size={13} />,
    variant: "outline",
  },
  {
    id: "delete",
    label: "Delete",
    icon: <FiTrash2 size={13} />,
    variant: "destructive",
  },
];

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1200px",
  minWidth: 0,
  marginInline: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  paddingInline: "clamp(0.75rem, 2.2vw, 1.4rem)",
  boxSizing: "border-box",
};

const frameStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const meta: Meta<AdaptiveCardProps<TradeAdaptiveRow>> = {
  title: "Data/AdaptiveCard",
  component: AdaptiveCard as unknown as Meta<
    AdaptiveCardProps<TradeAdaptiveRow>
  >["component"],
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<AdaptiveCardProps<TradeAdaptiveRow>>;

export const EnterpriseDefault: Story = {
  render: () => (
    <div style={containerStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Enterprise Adaptive Card (One Card Per Row)</FieldLabel>
        <FieldContent>
          <AdaptiveCard<TradeAdaptiveRow>
            data={adaptiveRows.slice(0, 8)}
            rowKey="id"
            schema={adaptiveSchema}
            variant="default"
            size="sm"
            insideColumns={2}
            columns={{ mobile: 1, tablet: 1, web: 1 }}
            actions={adaptiveActions}
            actionMode="auto"
            searchable
            showToolbar
            showPagination
          />
          <FieldDescription>
            Enterprise baseline with one adaptive card per row and reusable
            inbuilt components.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const InsideColumnVariants: Story = {
  render: () => (
    <div style={containerStyle}>
      {([1, 2, 3] as const).map((insideColumns) => (
        <Field key={insideColumns} style={frameStyle}>
          <FieldLabel>{`Inside Columns: ${insideColumns}`}</FieldLabel>
          <FieldContent>
            <AdaptiveCard<TradeAdaptiveRow>
              data={adaptiveRows.slice(0, 4)}
              rowKey="id"
              schema={adaptiveSchema}
              variant="compact"
              size="sm"
              insideColumns={insideColumns}
              columns={1}
              actions={adaptiveActions}
              actionMode="auto"
              showToolbar={false}
              showPagination={false}
            />
          </FieldContent>
        </Field>
      ))}
    </div>
  ),
};

export const ResponsiveOutsideColumns: Story = {
  render: () => (
    <div style={containerStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Outside Grid: Mobile 1 / Tablet 2 / Web 4</FieldLabel>
        <FieldContent>
          <AdaptiveCard<TradeAdaptiveRow>
            data={adaptiveRows.slice(0, 20)}
            rowKey="id"
            schema={adaptiveSchema}
            variant="default"
            size="sm"
            insideColumns={2}
            columns={{ mobile: 1, tablet: 2, web: 4 }}
            actions={adaptiveActions}
            actionMode="auto"
            searchable
            showToolbar
            showPagination
          />
          <FieldDescription>
            Outside columns are configurable independently from inside card
            columns.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const VirtualizedOneColumn: Story = {
  render: () => (
    <div style={containerStyle}>
      <Field style={frameStyle}>
        <FieldLabel>Virtualized Adaptive Cards</FieldLabel>
        <FieldContent>
          <AdaptiveCard<TradeAdaptiveRow>
            data={adaptiveRows}
            rowKey="id"
            schema={adaptiveSchema}
            variant="compact"
            size="sm"
            insideColumns={2}
            columns={1}
            actions={adaptiveActions}
            actionMode="auto"
            virtualized
            virtualizedMaxHeight="38rem"
            virtualizedEstimateSize={240}
            virtualizedOverscan={8}
            showToolbar
            searchable
            showPagination={false}
          />
          <FieldDescription>
            Uses TanStack Virtual for high-volume enterprise card streams.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

function paginateRows<TData>(
  rows: TData[],
  page: number,
  pageSize: number,
): TData[] {
  const safePageSize = Math.max(1, pageSize);
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * safePageSize;
  return rows.slice(startIndex, startIndex + safePageSize);
}

function ServerSideAdaptiveCardInner(): JSX.Element {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshToken, setRefreshToken] = useState(0);

  const query = useQuery({
    queryKey: ["adaptive-card-server", page, pageSize, refreshToken],
    queryFn: async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 240);
      });

      const pageRows = paginateRows(adaptiveRows, page, pageSize);

      return {
        rows: pageRows,
        totalRows: adaptiveRows.length,
      };
    },
    placeholderData: (previousData) => previousData,
    staleTime: 20_000,
  });

  return (
    <AdaptiveCard<TradeAdaptiveRow>
      data={query.data?.rows ?? []}
      rowKey="id"
      schema={adaptiveSchema}
      variant="default"
      size="sm"
      insideColumns={2}
      columns={1}
      actions={adaptiveActions}
      serverSide
      totalRows={query.data?.totalRows ?? adaptiveRows.length}
      pageIndex={page}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      showToolbar
      showRefresh
      onRefresh={() => {
        setRefreshToken((current) => current + 1);
      }}
      showPagination
      searchable={false}
    />
  );
}

export const ServerSideTanstackQuery: Story = {
  name: "Server-Side (TanStack Query)",
  render: () => {
    const queryClient = useMemo(() => new QueryClient(), []);

    return (
      <div style={containerStyle}>
        <Field style={frameStyle}>
          <FieldLabel>Server-side Adaptive Card</FieldLabel>
          <FieldContent>
            <QueryClientProvider client={queryClient}>
              <ServerSideAdaptiveCardInner />
            </QueryClientProvider>
            <FieldDescription>
              Uses TanStack Query with server-side pagination callbacks.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

const playgroundDefaultArgs: Story["args"] = {
  variant: "default",
  size: "sm",
  insideColumns: 2,
  columns: { mobile: 1, tablet: 2, web: 3 },
  searchable: true,
  showToolbar: true,
  showViewSwitch: true,
  switchToTableViewLabel: "Table",
  showRefresh: true,
  showPagination: true,
  paginationVariant: "advance",
  paginationDefaultPageSize: 10,
  paginationPageSizeOptions: [10, 20, 50],
  paginationMaxVisiblePages: 5,
  paginationShowPageSizeSelector: true,
  paginationShowSummary: true,
  paginationShowShowingPage: true,
  paginationResetPageOnPageSizeChange: true,
  actionMode: "auto",
  actionInlineMaxVisible: 4,
  actionAlignment: "right",
  actionPlacement: "bottom",
  virtualized: false,
  virtualizedMaxHeight: "36rem",
  virtualizedEstimateSize: 240,
  virtualizedOverscan: 6,
  viewportMaxHeight: "36rem",
};

const playgroundArgTypes = {
  variant: {
    control: "select",
    options: ["default", "compact", "ghost"],
  },
  size: {
    control: "select",
    options: ["xs", "sm", "md", "lg"],
  },
  insideColumns: {
    control: "inline-radio",
    options: [1, 2, 3],
  },
  columns: { control: "object" },
  columnBreakpoints: { control: "object" },
  searchable: { control: "boolean" },
  searchPlaceholder: { control: "text" },
  showToolbar: { control: "boolean" },
  showViewSwitch: { control: "boolean" },
  switchToTableViewLabel: { control: "text" },
  showRefresh: { control: "boolean" },
  refreshLabel: { control: "text" },
  refreshingLabel: { control: "text" },
  showPagination: { control: "boolean" },
  paginationVariant: {
    control: "select",
    options: ["basic", "advance", "compact"],
  },
  paginationDefaultPageSize: {
    control: { type: "number", min: 1, max: 100, step: 1 },
  },
  paginationPageSizeOptions: { control: "object" },
  paginationMaxVisiblePages: {
    control: { type: "number", min: 3, max: 15, step: 1 },
  },
  paginationShowPageSizeSelector: { control: "boolean" },
  paginationShowSummary: { control: "boolean" },
  paginationShowShowingPage: { control: "boolean" },
  paginationResetPageOnPageSizeChange: { control: "boolean" },
  actionMode: {
    control: "select",
    options: ["auto", "inline", "menu"],
  },
  actionInlineMaxVisible: {
    control: { type: "number", min: 1, max: 8, step: 1 },
  },
  actionAlignment: {
    control: "inline-radio",
    options: ["left", "right"],
  },
  actionPlacement: {
    control: "inline-radio",
    options: ["top", "bottom"],
  },
  virtualized: { control: "boolean" },
  virtualizedMaxHeight: { control: "text" },
  virtualizedEstimateSize: {
    control: { type: "number", min: 120, max: 500, step: 1 },
  },
  virtualizedOverscan: {
    control: { type: "number", min: 1, max: 20, step: 1 },
  },
  viewportMaxHeight: { control: "text" },
  data: { table: { disable: true } },
  schema: { table: { disable: true } },
  rowKey: { table: { disable: true } },
  actions: { table: { disable: true } },
  onAction: { action: "action" },
  onRefresh: { action: "refresh" },
  onPageChange: { action: "page-change" },
  onPageSizeChange: { action: "page-size-change" },
} satisfies NonNullable<Story["argTypes"]>;

export const AdaptiveCardPlayground: Story = {
  name: "AdaptiveCard Playground",
  args: playgroundDefaultArgs,
  argTypes: playgroundArgTypes,
  render: (args) => (
    <div style={containerStyle}>
      <Card size="sm" spacing="sm" style={{ width: "100%" }}>
        <CardHeader>
          <CardTitle>AdaptiveCard Playground</CardTitle>
          <CardDescription>
            Tune enterprise layout, action behavior, and responsive/virtualized
            settings.
          </CardDescription>
        </CardHeader>

        <CardContent style={{ width: "100%", minWidth: 0 }}>
          <AdaptiveCard<TradeAdaptiveRow>
            data={adaptiveRows}
            rowKey="id"
            schema={adaptiveSchema}
            actions={adaptiveActions}
            onSwitchToTableView={() => {}}
            {...args}
          />
        </CardContent>
      </Card>
    </div>
  ),
};
