import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import type { Meta, StoryObj } from "@storybook/react";
import {
  FiCheck,
  FiEdit3,
  FiEye,
  FiExternalLink,
  FiFileText,
  FiList,
  FiRefreshCw,
  FiTrash2,
} from "../src/components/icons/feather";

import {
  Card,
  CardContent,
  CardData,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  type CardDataAction,
  type CardDataFieldSchema,
  type CardDataProps,
  type RowAction,
  type TableColumnDef,
  type TableProps,
} from "../src/index";

type TradeStatus = "Open" | "Paused" | "Closed";
type TradeRisk = "Low" | "Medium" | "High";

interface TradeCardRow {
  id: string;
  symbol: string;
  sector: string;
  status: TradeStatus;
  trader: string;
  price: number;
  change: number;
  volume: number;
  risk: { label: TradeRisk; variant: "secondary" | "outline" | "destructive" };
  completion: { value: number; max: number; label: string };
  contact: { phone: string };
  updatedAt: string;
  note?: string;
  media?: { src: string; alt: string; type: "image" };
}

interface MinimalCardRow {
  id: string;
  symbol: string;
  sector: string;
  status: TradeStatus;
  price: number;
  updatedAt: string;
}

type DashboardCardActionId =
  | "view"
  | "edit"
  | "delete"
  | "chart"
  | "watch"
  | "more"
  | "alert"
  | "invest"
  | "withdraw"
  | "reports"
  | "details"
  | "repeat"
  | "cancel"
  | "modify"
  | "remove"
  | "open"
  | "add"
  | "settings"
  | "live"
  | "refresh"
  | "favorite"
  | "statement"
  | "reinvest"
  | "done";

interface DashboardCardRow {
  id: string;
  title: string;
  topRight?: string;
  line2Left?: string;
  line2Right?: string;
  line3?: string;
  line4?: string;
  description?: string;
  link?: string;
  image?: { src: string; alt: string; type: "image" };
  actions: Array<{ id: DashboardCardActionId; label: string }>;
}

interface AutoConfiguredCardRow {
  id: string;
  title: string;
  market?: string;
  value?: number;
  delta?: number;
  summary?: string;
  detailsLink?: string;
  image?: string;
}

type SharedSortState = Parameters<
  NonNullable<TableProps<TradeCardRow>["onSortChange"]>
>[0];
type SharedFilterState = Parameters<
  NonNullable<TableProps<TradeCardRow>["onFilterChange"]>
>[0];

type TableCardViewMode = "table" | "cards";

const sectors = ["Banking", "IT", "Energy", "Pharma", "Auto"];
const statuses: TradeStatus[] = ["Open", "Paused", "Closed"];
const traders = ["Mayur", "Anaya", "Vivaan", "Aditi", "Ishaan"];

function resolveRisk(seed: number): TradeCardRow["risk"] {
  if (seed % 7 === 0) {
    return { label: "High", variant: "destructive" };
  }

  if (seed % 3 === 0) {
    return { label: "Medium", variant: "outline" };
  }

  return { label: "Low", variant: "secondary" };
}

const trades: TradeCardRow[] = Array.from({ length: 120 }, (_, index) => {
  const seed = index + 1;

  return {
    id: `TRADE-${String(seed).padStart(4, "0")}`,
    symbol: `STK${String(100 + seed)}`,
    sector: sectors[index % sectors.length] ?? "Banking",
    status: statuses[index % statuses.length] ?? "Open",
    trader: traders[index % traders.length] ?? "Mayur",
    price: 120 + ((seed * 17) % 1430),
    change: ((seed % 2 === 0 ? 1 : -1) * ((seed * 11) % 145)) / 10,
    volume: 1200 + ((seed * 7531) % 89000),
    risk: resolveRisk(seed),
    completion: {
      value: 20 + ((seed * 13) % 80),
      max: 100,
      label: `${20 + ((seed * 13) % 80)}% complete`,
    },
    contact: {
      phone: `+91-9${String((seed * 9173) % 999999999).padStart(9, "0")}`,
    },
    updatedAt: `2026-06-${String((seed % 28) + 1).padStart(2, "0")}`,
    note:
      seed % 4 === 0
        ? "Watch spread compression before the next session close."
        : undefined,
    media:
      seed % 3 === 0
        ? {
            src: `https://picsum.photos/seed/keytuno-trade-${seed}/640/360`,
            alt: `Trade snapshot ${seed}`,
            type: "image",
          }
        : undefined,
  };
});

const minimalRows: MinimalCardRow[] = trades.map((row) => ({
  id: row.id,
  symbol: row.symbol,
  sector: row.sector,
  status: row.status,
  price: row.price,
  updatedAt: row.updatedAt,
}));

const dashboardCards: DashboardCardRow[] = [
  {
    id: "nifty",
    title: "NIFTY",
    topRight: "140000",
    line2Left: "Index",
    line2Right: "(+200) 3%",
    actions: [
      { id: "view", label: "View" },
      { id: "edit", label: "Edit" },
      { id: "delete", label: "Delete" },
    ],
  },
  {
    id: "banknifty",
    title: "BANKNIFTY",
    topRight: "250000",
    description: "This index is made up of 20 banking stocks.",
    image: {
      src: "https://picsum.photos/seed/keytuno-banknifty/960/460",
      alt: "Bank index snapshot",
      type: "image",
    },
    actions: [
      { id: "view", label: "View" },
      { id: "edit", label: "Edit" },
      { id: "delete", label: "Delete" },
    ],
  },
  {
    id: "reliance",
    title: "RELIANCE",
    topRight: "INR 2,985",
    line2Left: "+1.8% Today",
    line3: "Volume: 2.3M",
    actions: [
      { id: "chart", label: "Chart" },
      { id: "watch", label: "Watch" },
      { id: "more", label: "More" },
    ],
  },
  {
    id: "aapl",
    title: "AAPL",
    topRight: "$212.45",
    line2Left: "NASDAQ",
    line3: "Market Open",
    line4: "+2.15%",
    actions: [
      { id: "view", label: "View" },
      { id: "alert", label: "Alert" },
      { id: "edit", label: "Edit" },
    ],
  },
  {
    id: "portfolio-value",
    title: "Portfolio Value",
    topRight: "INR 12,45,860",
    line2Left: "Today's Gain",
    line2Right: "+INR 18,420 (1.50%)",
    link: "https://example.com/portfolio/reports",
    actions: [
      { id: "invest", label: "Invest" },
      { id: "withdraw", label: "Withdraw" },
      { id: "reports", label: "Reports" },
      { id: "details", label: "Details" },
      { id: "favorite", label: "Favorite" },
      { id: "settings", label: "Settings" },
    ],
  },
  {
    id: "order-10254",
    title: "Order #10254",
    line2Left: "BUY 100 INFY",
    line3: "Executed Successfully",
    actions: [
      { id: "details", label: "Details" },
      { id: "repeat", label: "Repeat" },
      { id: "cancel", label: "Cancel" },
    ],
  },
  {
    id: "tata-motors",
    title: "TATA MOTORS",
    line2Left: "Current: INR 845",
    line3: "Target: INR 900",
    line4: "Stop Loss: INR 810",
    actions: [
      { id: "modify", label: "Modify" },
      { id: "alert", label: "Alert" },
      { id: "remove", label: "Remove" },
    ],
  },
  {
    id: "watchlist",
    title: "Watchlist",
    line2Left: "8 Stocks",
    line3: "3 Gainers",
    line4: "5 Losers",
    actions: [
      { id: "open", label: "Open" },
      { id: "add", label: "Add Stock" },
      { id: "settings", label: "Settings" },
    ],
  },
  {
    id: "sensex",
    title: "SENSEX",
    topRight: "82,410",
    line2Left: "Market closes in",
    line2Right: "02h 15m",
    link: "https://www.bseindia.com",
    actions: [
      { id: "live", label: "Live" },
      { id: "refresh", label: "Refresh" },
      { id: "favorite", label: "Favorite" },
    ],
  },
  {
    id: "dividend",
    title: "Dividend Received",
    line2Left: "HDFC BANK",
    line3: "INR 4,280 credited",
    actions: [
      { id: "statement", label: "Statement" },
      { id: "reinvest", label: "Reinvest" },
      { id: "done", label: "Done" },
    ],
  },
];

const autoConfiguredCards: AutoConfiguredCardRow[] = [
  {
    id: "auto-nifty",
    title: "NIFTY",
    market: "NSE",
    value: 24350,
    delta: 1.34,
    detailsLink: "https://www.nseindia.com",
  },
  {
    id: "auto-banknifty",
    title: "BANKNIFTY",
    market: "NSE",
    value: 52410,
    delta: -0.62,
    summary:
      "This index tracks major Indian banking stocks and is useful for sector momentum decisions.",
  },
  {
    id: "auto-reliance",
    title: "RELIANCE",
    market: "NSE",
    value: 2985,
    delta: 2.15,
    image: "https://picsum.photos/seed/keytuno-auto-reliance/960/460",
  },
  {
    id: "auto-aapl",
    title: "AAPL",
    market: "NASDAQ",
    value: 212.45,
    delta: 1.02,
    detailsLink: "https://www.apple.com/investor/",
  },
];

function getRowValueByPath(row: object, keyPath: string): unknown {
  const path = keyPath.trim();

  if (path === "") {
    return undefined;
  }

  const segments = path.split(".");
  let current: unknown = row;

  for (const segment of segments) {
    if (
      typeof current !== "object" ||
      current == null ||
      !(segment in current)
    ) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function splitFilterTerms(filterValue: unknown): string[] {
  if (typeof filterValue !== "string") {
    return [];
  }

  return filterValue
    .split(",")
    .map((term) => term.trim())
    .filter((term) => term !== "");
}

type NumericFilterOperator = "gt" | "gte" | "lt" | "lte" | "eq" | "neq";

type ParsedNumericFilterCondition = {
  operator: NumericFilterOperator;
  value: number;
};

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim();

    if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalizedValue)) {
      return null;
    }

    const parsedValue = Number.parseFloat(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
}

function parseNumericFilterCondition(
  term: string,
): ParsedNumericFilterCondition | null {
  const normalizedTerm = term.trim();

  if (normalizedTerm === "") {
    return null;
  }

  const prefixedMatch = normalizedTerm.match(
    /^(>=|<=|!=|>|<|=)\s*(-?(?:\d+(?:\.\d+)?|\.\d+))$/,
  );

  if (prefixedMatch != null) {
    const [, operatorToken, valueToken] = prefixedMatch;
    const numericValue = Number.parseFloat(valueToken);

    if (!Number.isFinite(numericValue)) {
      return null;
    }

    if (operatorToken === ">") {
      return { operator: "gt", value: numericValue };
    }

    if (operatorToken === ">=") {
      return { operator: "gte", value: numericValue };
    }

    if (operatorToken === "<") {
      return { operator: "lt", value: numericValue };
    }

    if (operatorToken === "<=") {
      return { operator: "lte", value: numericValue };
    }

    if (operatorToken === "!=") {
      return { operator: "neq", value: numericValue };
    }

    return { operator: "eq", value: numericValue };
  }

  if (!/^-?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalizedTerm)) {
    return null;
  }

  const numericValue = Number.parseFloat(normalizedTerm);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return { operator: "eq", value: numericValue };
}

function matchesStringCondition(value: string, term: string): boolean {
  const normalizedValue = value.toLowerCase();
  const normalizedTerm = term.trim();

  if (normalizedTerm === "") {
    return true;
  }

  if (normalizedTerm.startsWith("!=")) {
    const expected = normalizedTerm.slice(2).trim().toLowerCase();
    return expected === "" ? true : normalizedValue !== expected;
  }

  if (normalizedTerm.startsWith("=")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue === expected;
  }

  if (normalizedTerm.startsWith("^")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue.startsWith(expected);
  }

  if (normalizedTerm.startsWith("~")) {
    const expected = normalizedTerm.slice(1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue.includes(expected);
  }

  if (normalizedTerm.endsWith("$")) {
    const expected = normalizedTerm.slice(0, -1).trim().toLowerCase();
    return expected === "" ? true : normalizedValue.endsWith(expected);
  }

  return normalizedValue.includes(normalizedTerm.toLowerCase());
}

function matchesNumericCondition(
  value: number,
  condition: ParsedNumericFilterCondition,
): boolean {
  if (condition.operator === "gt") {
    return value > condition.value;
  }

  if (condition.operator === "gte") {
    return value >= condition.value;
  }

  if (condition.operator === "lt") {
    return value < condition.value;
  }

  if (condition.operator === "lte") {
    return value <= condition.value;
  }

  if (condition.operator === "neq") {
    return value !== condition.value;
  }

  return value === condition.value;
}

function matchesAdvancedColumnFilter(
  rowValue: unknown,
  filterValue: unknown,
): boolean {
  const terms = splitFilterTerms(filterValue);

  if (terms.length === 0) {
    return true;
  }

  const numericValue = toFiniteNumber(rowValue);
  const stringValue = String(rowValue ?? "");

  return terms.some((term) => {
    const numericCondition = parseNumericFilterCondition(term);

    if (numericCondition != null) {
      if (numericValue == null) {
        return false;
      }

      return matchesNumericCondition(numericValue, numericCondition);
    }

    return matchesStringCondition(stringValue, term);
  });
}

function applySharedFilters(
  rows: TradeCardRow[],
  filters: SharedFilterState,
): TradeCardRow[] {
  const globalSearch = String(
    filters.find((filter) => filter.id === "__global")?.value ?? "",
  )
    .trim()
    .toLowerCase();

  const scopedFilters = filters.filter((filter) => filter.id !== "__global");

  return rows.filter((row) => {
    if (globalSearch !== "") {
      const searchableText = JSON.stringify(row).toLowerCase();

      if (!searchableText.includes(globalSearch)) {
        return false;
      }
    }

    return scopedFilters.every((filter) => {
      const rowValue = getRowValueByPath(row, filter.id);
      return matchesAdvancedColumnFilter(rowValue, filter.value);
    });
  });
}

function applySharedSorting(
  rows: TradeCardRow[],
  sorting: SharedSortState,
): TradeCardRow[] {
  if (sorting.length === 0) {
    return rows;
  }

  const [{ id, desc }] = sorting;

  return [...rows].sort((leftRow, rightRow) => {
    const left = getRowValueByPath(leftRow, id);
    const right = getRowValueByPath(rightRow, id);

    if (typeof left === "number" && typeof right === "number") {
      return desc ? right - left : left - right;
    }

    const leftText = String(left ?? "").toLowerCase();
    const rightText = String(right ?? "").toLowerCase();

    if (leftText === rightText) {
      return 0;
    }

    return desc
      ? leftText < rightText
        ? 1
        : -1
      : leftText < rightText
        ? -1
        : 1;
  });
}

function paginateRows(
  rows: TradeCardRow[],
  page: number,
  pageSize: number,
): TradeCardRow[] {
  const safePageSize = Math.max(1, pageSize);
  const safePage = Math.max(1, page);
  const startIndex = (safePage - 1) * safePageSize;

  return rows.slice(startIndex, startIndex + safePageSize);
}

const autoConfiguredSchema: CardDataFieldSchema<AutoConfiguredCardRow>[] = [
  {
    key: "title",
    label: "Title",
    showLabel: false,
    align: "left",
    span: 2,
    priority: 0,
  },
  {
    key: "market",
    label: "Market",
    align: "left",
    showLabel: false,
    hideIfEmpty: true,
    priority: 1,
  },
  {
    key: "value",
    label: "Value",
    type: "number",
    maximumFractionDigits: 2,
    align: "right",
    showLabel: false,
    hideIfEmpty: true,
    priority: 2,
  },
  {
    key: "delta",
    label: "Delta",
    type: "percent",
    maximumFractionDigits: 2,
    align: "right",
    showLabel: false,
    hideIfEmpty: true,
    priority: 3,
  },
  {
    key: "summary",
    label: "Summary",
    align: "left",
    showLabel: false,
    span: 2,
    hideIfEmpty: true,
    priority: 4,
  },
  {
    key: "detailsLink",
    label: "Link",
    type: "link",
    align: "left",
    showLabel: false,
    span: 2,
    hideIfEmpty: true,
    priority: 5,
  },
  {
    key: "image",
    label: "Snapshot",
    type: "media",
    showLabel: false,
    span: 2,
    hideIfEmpty: true,
    priority: 6,
  },
];

function resolveAutoActions(
  row: AutoConfiguredCardRow,
): CardDataAction<AutoConfiguredCardRow>[] {
  if (row.id === "auto-banknifty") {
    return [
      { id: "view", label: "View", icon: <FiEye size={13} /> },
      { id: "edit", label: "Edit", icon: <FiEdit3 size={13} /> },
      { id: "report", label: "Report", icon: <FiFileText size={13} /> },
      { id: "share", label: "Share", icon: <FiExternalLink size={13} /> },
      { id: "watch", label: "Watch", icon: <FiList size={13} /> },
      {
        id: "delete",
        label: "Delete",
        icon: <FiTrash2 size={13} />,
        variant: "destructive",
      },
    ];
  }

  return [
    { id: "view", label: "View", icon: <FiEye size={13} /> },
    { id: "edit", label: "Edit", icon: <FiEdit3 size={13} /> },
    {
      id: "delete",
      label: "Delete",
      icon: <FiTrash2 size={13} />,
      variant: "destructive",
    },
  ];
}

function resolveDashboardActionIcon(
  actionId: DashboardCardActionId,
): ReactNode {
  if (actionId === "view" || actionId === "open" || actionId === "live") {
    return <FiEye size={13} />;
  }

  if (
    actionId === "edit" ||
    actionId === "modify" ||
    actionId === "watch" ||
    actionId === "alert"
  ) {
    return <FiEdit3 size={13} />;
  }

  if (actionId === "delete" || actionId === "cancel" || actionId === "remove") {
    return <FiTrash2 size={13} />;
  }

  if (actionId === "details" || actionId === "statement") {
    return <FiFileText size={13} />;
  }

  if (actionId === "refresh" || actionId === "repeat") {
    return <FiRefreshCw size={13} />;
  }

  if (actionId === "reports" || actionId === "more") {
    return <FiList size={13} />;
  }

  if (actionId === "done") {
    return <FiCheck size={13} />;
  }

  return <FiList size={13} />;
}

function resolveDashboardActionVariant(
  actionId: DashboardCardActionId,
): CardDataAction<DashboardCardRow>["variant"] {
  if (actionId === "delete" || actionId === "cancel" || actionId === "remove") {
    return "destructive";
  }

  if (actionId === "invest" || actionId === "done") {
    return "primary";
  }

  return "outline";
}

function resolveDashboardActions(
  row: DashboardCardRow,
): CardDataAction<DashboardCardRow>[] {
  return row.actions.map((action) => ({
    id: action.id,
    label: action.label,
    icon: resolveDashboardActionIcon(action.id),
    variant: resolveDashboardActionVariant(action.id),
  }));
}

const tableColumns: TableColumnDef<TradeCardRow>[] = [
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "sector",
    header: "Sector",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = String(getValue() ?? "Open") as TradeStatus;
      const color =
        status === "Open"
          ? "var(--ktn-action-success-bg, #16a34a)"
          : status === "Paused"
            ? "var(--ktn-warning-600, #d97706)"
            : "var(--ktn-action-danger-bg, #dc2626)";

      return <span style={{ color }}>{status}</span>;
    },
  },
  {
    accessorKey: "trader",
    header: "Trader",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => {
      const value = Number(getValue() ?? 0);
      return `INR ${value.toFixed(2)}`;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
  },
];

const tableRowActions: RowAction<TradeCardRow>[] = [
  {
    id: "view",
    label: "",
    icon: <FiEye size={13} />,
    variant: "secondary",
    compact: true,
    iconOnly: true,
    iconOnlyTone: true,
    tooltip: "View",
    onClick: () => {},
  },
  {
    id: "edit",
    label: "",
    icon: <FiEdit3 size={13} />,
    variant: "primary",
    compact: true,
    iconOnly: true,
    iconOnlyTone: true,
    tooltip: "Edit",
    onClick: () => {},
  },
  {
    id: "delete",
    label: "",
    icon: <FiTrash2 size={13} />,
    variant: "destructive",
    compact: true,
    iconOnly: true,
    iconOnlyTone: true,
    tooltip: "Delete",
    onClick: () => {},
  },
];

const cardActions: CardDataAction<TradeCardRow>[] = [
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

const adaptiveSchema: CardDataFieldSchema<TradeCardRow>[] = [
  {
    key: "symbol",
    label: "Symbol",
    priority: 0,
  },
  {
    key: "price",
    label: "Price",
    type: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    align: "right",
    priority: 1,
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    priority: 2,
  },
  {
    key: "change",
    label: "Change",
    type: "percent",
    maximumFractionDigits: 2,
    align: "right",
    priority: 3,
  },
  {
    key: "risk",
    label: "Risk",
    type: "badge",
    priority: 4,
  },
  {
    key: "completion",
    label: "Completion",
    type: "progress",
    span: 2,
    priority: 5,
  },
  {
    key: "contact.phone",
    label: "Desk",
    type: "phone",
    priority: 6,
  },
  {
    key: "updatedAt",
    label: "Updated",
    type: "date",
    dateOptions: { year: "numeric", month: "short", day: "numeric" },
    priority: 7,
  },
  {
    key: "note",
    label: "Note",
    span: 2,
    hideIfEmpty: true,
    priority: 8,
  },
  {
    key: "media",
    label: "Snapshot",
    type: "media",
    span: 2,
    hideIfEmpty: true,
    mediaAlt: "Trade snapshot",
    priority: 9,
  },
];

const switchParitySchema: CardDataFieldSchema<TradeCardRow>[] = [
  {
    key: "symbol",
    label: "Symbol",
    priority: 0,
  },
  {
    key: "sector",
    label: "Sector",
    priority: 1,
  },
  {
    key: "status",
    label: "Status",
    type: "status",
    priority: 2,
  },
  {
    key: "trader",
    label: "Trader",
    priority: 3,
  },
  {
    key: "price",
    label: "Price",
    type: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    align: "right",
    priority: 4,
  },
  {
    key: "updatedAt",
    label: "Updated",
    type: "date",
    dateOptions: { year: "numeric", month: "short", day: "numeric" },
    priority: 5,
  },
];

const dashboardTopRowStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "0.75rem",
};

const dashboardTopTitleStyle: CSSProperties = {
  fontSize: "0.98rem",
  fontWeight: 700,
  letterSpacing: "0.01em",
};

const dashboardTopValueStyle: CSSProperties = {
  fontSize: "0.96rem",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const dashboardInlineRowStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.65rem",
};

const dashboardSubTextStyle: CSSProperties = {
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  fontSize: "0.86rem",
  lineHeight: 1.36,
};

const dashboardValueTextStyle: CSSProperties = {
  fontSize: "0.88rem",
  fontWeight: 600,
};

const dashboardDescriptionStyle: CSSProperties = {
  color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  fontSize: "0.84rem",
  lineHeight: 1.45,
};

const dashboardSchema: CardDataFieldSchema<DashboardCardRow>[] = [
  {
    key: "title",
    span: 2,
    showLabel: false,
    priority: 0,
    formatter: (_value, row) => (
      <div style={dashboardTopRowStyle}>
        <span style={dashboardTopTitleStyle}>{row.title}</span>
        {row.topRight != null && row.topRight.trim() !== "" ? (
          <span style={dashboardTopValueStyle}>{row.topRight}</span>
        ) : null}
      </div>
    ),
  },
  {
    key: "line2Left",
    span: 2,
    showLabel: false,
    hideIfEmpty: true,
    priority: 1,
    formatter: (_value, row) => {
      const hasLeft = row.line2Left != null && row.line2Left.trim() !== "";
      const hasRight = row.line2Right != null && row.line2Right.trim() !== "";

      if (!hasLeft && !hasRight) {
        return "";
      }

      return (
        <div style={dashboardInlineRowStyle}>
          {hasLeft ? (
            <span style={dashboardSubTextStyle}>{row.line2Left}</span>
          ) : (
            <span />
          )}
          {hasRight ? (
            <span style={dashboardValueTextStyle}>{row.line2Right}</span>
          ) : null}
        </div>
      );
    },
  },
  {
    key: "line3",
    span: 2,
    showLabel: false,
    hideIfEmpty: true,
    priority: 2,
    formatter: (_value, row) => (
      <span style={dashboardSubTextStyle}>{row.line3}</span>
    ),
  },
  {
    key: "line4",
    span: 2,
    showLabel: false,
    hideIfEmpty: true,
    priority: 3,
    formatter: (_value, row) => (
      <span style={dashboardSubTextStyle}>{row.line4}</span>
    ),
  },
  {
    key: "description",
    span: 2,
    showLabel: false,
    hideIfEmpty: true,
    priority: 4,
    formatter: (_value, row) => (
      <span style={dashboardDescriptionStyle}>{row.description}</span>
    ),
  },
  {
    key: "link",
    span: 2,
    showLabel: false,
    hideIfEmpty: true,
    type: "link",
    priority: 5,
  },
  {
    key: "image",
    span: 2,
    showLabel: false,
    hideIfEmpty: true,
    type: "media",
    mediaAlt: "Market image",
    priority: 6,
  },
];

const sectionStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "100%",
  maxWidth: "1200px",
  minWidth: 0,
  marginInline: "auto",
  paddingInline: "clamp(0.75rem, 2.5vw, 1.5rem)",
  boxSizing: "border-box",
};

const shellStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const meta: Meta<CardDataProps<object>> = {
  title: "Data/CardData",
  component: CardData as unknown as Meta<CardDataProps<object>>["component"],
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<CardDataProps<object>>;

export const MinimalPropsFastDefault: Story = {
  name: "Minimal Props (Fast Default)",
  render: () => (
    <div style={sectionStyle}>
      <CardData data={minimalRows} rowKey="id" />
    </div>
  ),
};

export const SchemaDrivenAdaptiveCards: Story = {
  name: "Schema-Driven Adaptive Cards",
  render: () => (
    <div style={sectionStyle}>
      <CardData<DashboardCardRow>
        data={dashboardCards}
        rowKey="id"
        schema={dashboardSchema}
        showFieldLabels={false}
        variant="default"
        size="sm"
        actions={(row) => resolveDashboardActions(row)}
        actionMode="auto"
        actionInlineMaxVisible={5}
        actionAlignment="right"
        actionMenuLabel="Actions"
        viewportMaxHeight="40rem"
      />
    </div>
  ),
};

export const AutoConfiguredMixedLayout: Story = {
  name: "Auto Configured Mixed Layout",
  render: () => (
    <div style={sectionStyle}>
      <CardData<AutoConfiguredCardRow>
        data={autoConfiguredCards}
        rowKey="id"
        schema={autoConfiguredSchema}
        variant="compact"
        size="sm"
        showFieldLabels={false}
        locale="en-IN"
        currency="INR"
        actions={(row) => resolveAutoActions(row)}
        actionMode="auto"
        actionInlineMaxVisible={5}
        actionAlignment="right"
        viewportMaxHeight="32rem"
      />
    </div>
  ),
};

export const ActionOverflowMenu: Story = {
  name: "Action Overflow Menu",
  render: () => (
    <div style={sectionStyle}>
      <CardData<AutoConfiguredCardRow>
        data={autoConfiguredCards.slice(0, 2)}
        rowKey="id"
        schema={autoConfiguredSchema}
        variant="default"
        size="sm"
        showFieldLabels={false}
        actions={(row) => resolveAutoActions(row)}
        actionMode="auto"
        actionInlineMaxVisible={5}
        actionAlignment="right"
      />
    </div>
  ),
};

export const ResponsiveColumnsTopActions: Story = {
  name: "Responsive Columns + Top Actions",
  render: () => (
    <div style={sectionStyle}>
      <CardData<AutoConfiguredCardRow>
        data={autoConfiguredCards}
        rowKey="id"
        schema={autoConfiguredSchema}
        variant="compact"
        size="sm"
        showFieldLabels={false}
        locale="en-IN"
        currency="INR"
        columns={{ mobile: 1, tablet: 2, web: 3 }}
        actionPlacement="top"
        actionAlignment="right"
        actions={(row) => resolveAutoActions(row)}
        actionMode="auto"
        actionInlineMaxVisible={5}
      />
    </div>
  ),
};

export const VirtualizedAdvancedFilterCards: Story = {
  name: "Virtualized + Advanced Filter Cards",
  render: () => (
    <div style={sectionStyle}>
      <CardData<TradeCardRow>
        data={trades}
        rowKey="id"
        schema={adaptiveSchema}
        variant="default"
        size="sm"
        showFieldLabels={false}
        locale="en-IN"
        currency="INR"
        actions={cardActions}
        sortable
        filterable
        columnFilters={["symbol", "sector", "status", "trader", "price"]}
        searchable
        globalFilter
        showToolbar
        showPagination={false}
        virtualized
        virtualizedMaxHeight="34rem"
        columns={{ mobile: 1, tablet: 2, web: 3 }}
        actionMode="auto"
        actionAlignment="right"
      />
    </div>
  ),
};

function CardTableSwitchDemo(): JSX.Element {
  const [view, setView] = useState<TableCardViewMode>("cards");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<SharedSortState>([]);
  const [filters, setFilters] = useState<SharedFilterState>([]);

  const sharedResult = useMemo(() => {
    const filteredRows = applySharedFilters(trades, filters);
    const sortedRows = applySharedSorting(filteredRows, sorting);
    const pageRows = paginateRows(sortedRows, page, pageSize);

    return {
      rows: pageRows,
      totalRows: sortedRows.length,
    };
  }, [filters, page, pageSize, sorting]);

  const parityFilterColumns = [
    "symbol",
    "sector",
    "status",
    "trader",
    "price",
    "updatedAt",
  ];

  function deferSetSorting(next: SharedSortState): void {
    queueMicrotask(() => {
      setSorting(next);
    });
  }

  function deferSetFilters(next: SharedFilterState): void {
    queueMicrotask(() => {
      setFilters(next);
    });
  }

  return (
    <div style={sectionStyle}>
      <Card size="sm" spacing="sm" style={shellStyle}>
        <CardHeader>
          <CardTitle>Trade Monitor</CardTitle>
          <CardDescription>
            Table and CardData share the same advanced filters, sorting, and
            pagination state while switching views.
          </CardDescription>
        </CardHeader>

        <CardContent style={{ width: "100%", minWidth: 0, padding: "0.65rem" }}>
          {view === "table" ? (
            <Table<TradeCardRow>
              data={sharedResult.rows}
              columns={tableColumns}
              rowKey="id"
              variant="outline"
              size="sm"
              serverSide
              totalRows={sharedResult.totalRows}
              pageIndex={page}
              paginationDefaultPageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onSortChange={deferSetSorting}
              onFilterChange={deferSetFilters}
              searchable
              filterable
              columnFilters={parityFilterColumns}
              globalFilter
              sortable
              showToolbar
              showRefresh
              fullscreen
              onRefresh={() => {}}
              rowActions={tableRowActions}
              showPagination
              showViewSwitch
              switchToCardViewLabel="Cards"
              onSwitchToCardView={() => {
                setView("cards");
              }}
            />
          ) : (
            <CardData<TradeCardRow>
              data={sharedResult.rows}
              rowKey="id"
              schema={switchParitySchema}
              size="sm"
              variant="compact"
              showFieldLabels={false}
              locale="en-IN"
              currency="INR"
              actions={cardActions}
              serverSide
              totalRows={sharedResult.totalRows}
              pageIndex={page}
              paginationDefaultPageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              sortable
              filterable
              columnFilters={parityFilterColumns}
              searchable
              globalFilter
              onSortChange={deferSetSorting}
              onFilterChange={deferSetFilters}
              actionMode="auto"
              actionAlignment="right"
              showToolbar
              showRefresh
              fullscreen
              onRefresh={() => {}}
              showPagination
              showViewSwitch
              switchToTableViewLabel="Table"
              onSwitchToTableView={() => {
                setView("table");
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export const TableCardSwitchPlaybook: Story = {
  name: "Card First + Table Switch Playbook",
  render: () => <CardTableSwitchDemo />,
};

interface CardTableUnifiedPlaygroundArgs {
  defaultView: TableCardViewMode;
  tableVariant: NonNullable<TableProps<TradeCardRow>["variant"]>;
  tableSize: NonNullable<TableProps<TradeCardRow>["size"]>;
  cardVariant: NonNullable<CardDataProps<TradeCardRow>["variant"]>;
  cardSize: NonNullable<CardDataProps<TradeCardRow>["size"]>;
  sortable: boolean;
  filterable: boolean;
  searchable: boolean;
  globalFilter: boolean;
  showToolbar: boolean;
  showRefresh: boolean;
  fullscreen: boolean;
  showPagination: boolean;
  showViewSwitch: boolean;
  actionMode: NonNullable<CardDataProps<TradeCardRow>["actionMode"]>;
  actionAlignment: NonNullable<CardDataProps<TradeCardRow>["actionAlignment"]>;
  actionPlacement: NonNullable<CardDataProps<TradeCardRow>["actionPlacement"]>;
  onTableAction?: (context: unknown) => void;
  onCardAction?: (context: unknown) => void;
  onRefresh?: () => void;
}

type CardTableUnifiedStory = StoryObj<CardTableUnifiedPlaygroundArgs>;

export const CardTableUnifiedPlayground: CardTableUnifiedStory = {
  name: "Card + Table Unified Playground",
  args: {
    defaultView: "cards",
    tableVariant: "outline",
    tableSize: "sm",
    cardVariant: "compact",
    cardSize: "sm",
    sortable: true,
    filterable: true,
    searchable: true,
    globalFilter: true,
    showToolbar: true,
    showRefresh: true,
    fullscreen: true,
    showPagination: true,
    showViewSwitch: true,
    actionMode: "auto",
    actionAlignment: "right",
    actionPlacement: "bottom",
  },
  argTypes: {
    defaultView: {
      control: "inline-radio",
      options: ["cards", "table"],
    },
    tableVariant: {
      control: "select",
      options: ["basic", "outline", "ghost", "filled", "minimal", "striped"],
    },
    tableSize: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    cardVariant: {
      control: "select",
      options: ["default", "compact", "ghost"],
    },
    cardSize: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    sortable: { control: "boolean" },
    filterable: { control: "boolean" },
    searchable: { control: "boolean" },
    globalFilter: { control: "boolean" },
    showToolbar: { control: "boolean" },
    showRefresh: { control: "boolean" },
    fullscreen: { control: "boolean" },
    showPagination: { control: "boolean" },
    showViewSwitch: { control: "boolean" },
    actionMode: {
      control: "select",
      options: ["auto", "inline", "menu"],
    },
    actionAlignment: {
      control: "select",
      options: ["left", "right"],
    },
    actionPlacement: {
      control: "select",
      options: ["top", "bottom"],
    },
    onTableAction: { action: "table-action" },
    onCardAction: { action: "card-action" },
    onRefresh: { action: "refresh" },
  },
  render: (args) => {
    const [view, setView] = useState<TableCardViewMode>(args.defaultView);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState<SharedSortState>([]);
    const [filters, setFilters] = useState<SharedFilterState>([]);

    useEffect(() => {
      setView(args.defaultView);
    }, [args.defaultView]);

    const parityFilterColumns = [
      "symbol",
      "sector",
      "status",
      "trader",
      "price",
      "updatedAt",
    ];

    const sharedResult = useMemo(() => {
      const filteredRows = applySharedFilters(trades, filters);
      const sortedRows = applySharedSorting(filteredRows, sorting);
      const pageRows = paginateRows(sortedRows, page, pageSize);

      return {
        rows: pageRows,
        totalRows: sortedRows.length,
      };
    }, [filters, page, pageSize, sorting]);

    function deferSetSorting(next: SharedSortState): void {
      queueMicrotask(() => {
        setSorting(next);
      });
    }

    function deferSetFilters(next: SharedFilterState): void {
      queueMicrotask(() => {
        setFilters(next);
      });
    }

    return (
      <div style={sectionStyle}>
        <Card size="sm" spacing="sm" style={shellStyle}>
          <CardHeader>
            <CardTitle>Unified Trade Monitor</CardTitle>
            <CardDescription>
              One playground to test card-first switching, shared data state,
              and both Table/CardData action callbacks.
            </CardDescription>
          </CardHeader>

          <CardContent
            style={{ width: "100%", minWidth: 0, padding: "0.65rem" }}
          >
            {view === "table" ? (
              <Table<TradeCardRow>
                data={sharedResult.rows}
                columns={tableColumns}
                rowKey="id"
                variant={args.tableVariant}
                size={args.tableSize}
                serverSide
                totalRows={sharedResult.totalRows}
                pageIndex={page}
                paginationDefaultPageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                onSortChange={deferSetSorting}
                onFilterChange={deferSetFilters}
                onAction={(context) => {
                  args.onTableAction?.(context);
                }}
                searchable={args.searchable}
                filterable={args.filterable}
                columnFilters={parityFilterColumns}
                globalFilter={args.globalFilter}
                sortable={args.sortable}
                showToolbar={args.showToolbar}
                showRefresh={args.showRefresh}
                fullscreen={args.fullscreen}
                onRefresh={() => {
                  args.onRefresh?.();
                }}
                rowActions={tableRowActions}
                showPagination={args.showPagination}
                showViewSwitch={args.showViewSwitch}
                switchToCardViewLabel="Cards"
                onSwitchToCardView={() => {
                  setView("cards");
                }}
              />
            ) : (
              <CardData<TradeCardRow>
                data={sharedResult.rows}
                rowKey="id"
                schema={switchParitySchema}
                variant={args.cardVariant}
                size={args.cardSize}
                showFieldLabels={false}
                locale="en-IN"
                currency="INR"
                actions={cardActions}
                serverSide
                totalRows={sharedResult.totalRows}
                pageIndex={page}
                paginationDefaultPageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
                sortable={args.sortable}
                filterable={args.filterable}
                columnFilters={parityFilterColumns}
                searchable={args.searchable}
                globalFilter={args.globalFilter}
                onSortChange={deferSetSorting}
                onFilterChange={deferSetFilters}
                actionMode={args.actionMode}
                actionAlignment={args.actionAlignment}
                actionPlacement={args.actionPlacement}
                showToolbar={args.showToolbar}
                showRefresh={args.showRefresh}
                fullscreen={args.fullscreen}
                onRefresh={() => {
                  args.onRefresh?.();
                }}
                showPagination={args.showPagination}
                showViewSwitch={args.showViewSwitch}
                switchToTableViewLabel="Table"
                onSwitchToTableView={() => {
                  setView("table");
                }}
                onAction={(context) => {
                  args.onCardAction?.(context);
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  },
};

export const CardDataPlayground: Story = {
  name: "CardData Playground",
  args: {
    variant: "default",
    size: "sm",
    showFieldLabels: false,
    sortable: true,
    filterable: true,
    searchable: true,
    globalFilter: true,
    showToolbar: true,
    showRefresh: false,
    refreshLabel: "Refresh",
    refreshingLabel: "Refreshing",
    fullscreen: false,
    fullscreenLabel: "Fullscreen",
    resetScreenLabel: "Reset",
    showFiltersLabel: "Filters",
    hideFiltersLabel: "Close",
    actionMode: "auto",
    actionInlineMaxVisible: 5,
    actionAlignment: "right",
    actionPlacement: "bottom",
    columns: { mobile: 1, tablet: 2, web: 3 },
    showPagination: true,
    paginationVariant: "advance",
    paginationDefaultPageSize: 10,
    paginationPageSizeOptions: [10, 20, 50],
    paginationMaxVisiblePages: 5,
    paginationShowPageSizeSelector: true,
    paginationShowSummary: true,
    paginationShowShowingPage: true,
    paginationResetPageOnPageSizeChange: true,
    virtualized: false,
    virtualizedMaxHeight: "34rem",
    virtualizedOverscan: 6,
    viewportMaxHeight: "34rem",
    safeAreaAware: true,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "compact", "ghost"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    showFieldLabels: { control: "boolean" },
    sortable: { control: "boolean" },
    filterable: { control: "boolean" },
    searchable: { control: "boolean" },
    globalFilter: { control: "boolean" },
    showToolbar: { control: "boolean" },
    showRefresh: { control: "boolean" },
    refreshLabel: { control: "text" },
    refreshingLabel: { control: "text" },
    fullscreen: { control: "boolean" },
    fullscreenLabel: { control: "text" },
    resetScreenLabel: { control: "text" },
    showFiltersLabel: { control: "text" },
    hideFiltersLabel: { control: "text" },
    searchPlaceholder: { control: "text" },
    columnFilters: { control: "object" },
    actionMode: {
      control: "select",
      options: ["auto", "inline", "menu"],
    },
    actionInlineMaxVisible: {
      control: { type: "number", min: 1, max: 10, step: 1 },
    },
    actionAlignment: {
      control: "select",
      options: ["left", "right"],
    },
    actionPlacement: {
      control: "select",
      options: ["top", "bottom"],
    },
    columns: { control: "object" },
    columnBreakpoints: { control: "object" },
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
    virtualized: { control: "boolean" },
    virtualizedMaxHeight: { control: "text" },
    virtualizedEstimateSize: {
      control: { type: "number", min: 80, max: 420, step: 1 },
    },
    virtualizedOverscan: {
      control: { type: "number", min: 1, max: 30, step: 1 },
    },
    viewportMaxHeight: { control: "text" },
    safeAreaAware: { control: "boolean" },
    actions: { table: { disable: true } },
    schema: { table: { disable: true } },
    rowKey: { table: { disable: true } },
    data: { table: { disable: true } },
    onAction: { action: "action" },
    onRefresh: { action: "refresh" },
    onSortChange: { action: "sort-change" },
    onFilterChange: { action: "filter-change" },
    onPageChange: { action: "page-change" },
    onPageSizeChange: { action: "page-size-change" },
  },
  render: (args) => (
    <div style={sectionStyle}>
      <CardData<AutoConfiguredCardRow>
        data={autoConfiguredCards}
        rowKey="id"
        schema={autoConfiguredSchema}
        locale="en-IN"
        currency="INR"
        actions={(row) => resolveAutoActions(row)}
        {...args}
      />
    </div>
  ),
};
