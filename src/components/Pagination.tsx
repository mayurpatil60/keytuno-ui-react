import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "./icons/feather";

import { Button, type ButtonProps } from "./Button";
import {
  Select,
  type SelectOption,
  type SelectValue,
  type SelectVariant,
} from "./Select";

export type PaginationVariant = "basic" | "advance" | "compact";
export type PaginationSize = "xs" | "sm" | "md" | "lg";
export type PaginationActionSource =
  | "first"
  | "previous"
  | "next"
  | "last"
  | "page-number"
  | "page-size"
  | "page-size-reset";

export interface PaginationActionContext {
  source: PaginationActionSource;
  page: number;
  pageSize: number;
  totalPages: number;
  event?: unknown;
}

export interface PaginationTextContext {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  itemLabel: string;
}

export interface PaginationLabels {
  item?: string;
  select?: string;
  perPage?: string;
  showingPage?: string;
  navigation?: string;
  firstAria?: string;
  previousAria?: string;
  nextAria?: string;
  lastAria?: string;
  pageAriaFormatter?: (page: number) => string;
  first?: ReactNode;
  previous?: ReactNode;
  next?: ReactNode;
  last?: ReactNode;
}

export type PaginationButtonProps = Omit<
  ButtonProps,
  "children" | "onAction" | "size" | "type"
>;

export interface PaginationProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> {
  variant?: PaginationVariant;
  size?: PaginationSize;
  pageSizeSelectVariant?: SelectVariant;
  page?: number;
  defaultPage?: number;
  totalPages?: number;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  onAction?: (context: PaginationActionContext) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  disabled?: boolean;
  maxVisiblePages?: number;
  showPageSizeSelector?: boolean;
  showSummary?: boolean;
  showShowingPage?: boolean;
  resetPageOnPageSizeChange?: boolean;
  labels?: PaginationLabels;
  firstButtonProps?: PaginationButtonProps;
  previousButtonProps?: PaginationButtonProps;
  nextButtonProps?: PaginationButtonProps;
  lastButtonProps?: PaginationButtonProps;
  pageButtonProps?: PaginationButtonProps;
  activePageButtonProps?: PaginationButtonProps;
  summaryFormatter?: (context: PaginationTextContext) => ReactNode;
  showingPageFormatter?: (context: PaginationTextContext) => ReactNode;
}

type PageToken = number | "ellipsis";

type PaginationSizeTokens = {
  fontSize: string;
  gap: string;
  controlGap: string;
  selectorWidth: string;
  buttonSize: "xs" | "sm" | "md" | "lg";
  symbolButtonMinWidth: string;
};

const baseClasses = "flex w-full min-w-0";

const defaultPageSizeOptions = [12, 24, 48];

const iconSizeByPaginationSize: Record<PaginationSize, number> = {
  xs: 12,
  sm: 13,
  md: 14,
  lg: 16,
};

const sizeTokens: Record<PaginationSize, PaginationSizeTokens> = {
  xs: {
    fontSize: "0.72rem",
    gap: "0.45rem",
    controlGap: "0.3rem",
    selectorWidth: "5.85rem",
    buttonSize: "xs",
    symbolButtonMinWidth: "1.55rem",
  },
  sm: {
    fontSize: "0.78rem",
    gap: "0.55rem",
    controlGap: "0.35rem",
    selectorWidth: "6.2rem",
    buttonSize: "sm",
    symbolButtonMinWidth: "1.8rem",
  },
  md: {
    fontSize: "0.84rem",
    gap: "0.65rem",
    controlGap: "0.4rem",
    selectorWidth: "6.55rem",
    buttonSize: "md",
    symbolButtonMinWidth: "2.05rem",
  },
  lg: {
    fontSize: "0.92rem",
    gap: "0.75rem",
    controlGap: "0.45rem",
    selectorWidth: "6.95rem",
    buttonSize: "lg",
    symbolButtonMinWidth: "2.25rem",
  },
};

function toInteger(value: number | undefined, fallback: number): number {
  if (value == null || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.round(value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizePageSizeOptions(
  pageSizeOptions: number[] | undefined,
): number[] {
  const source =
    pageSizeOptions != null && pageSizeOptions.length > 0
      ? pageSizeOptions
      : defaultPageSizeOptions;
  const deduped: number[] = [];

  source.forEach((optionValue) => {
    const normalized = toInteger(optionValue, -1);

    if (normalized > 0 && !deduped.includes(normalized)) {
      deduped.push(normalized);
    }
  });

  return deduped.length > 0 ? deduped : [...defaultPageSizeOptions];
}

function buildPageTokens(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number,
): PageToken[] {
  if (totalPages <= 1) {
    return [1];
  }

  const safeVisiblePages = Math.max(4, toInteger(maxVisiblePages, 5));

  if (totalPages <= safeVisiblePages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const siblingCount = Math.max(0, Math.floor((safeVisiblePages - 3) / 2));
  let leftBoundary = currentPage - siblingCount;
  let rightBoundary = currentPage + siblingCount;

  if (leftBoundary <= 2) {
    leftBoundary = 2;
    rightBoundary = Math.min(totalPages - 1, leftBoundary + siblingCount * 2);
  }

  if (rightBoundary >= totalPages - 1) {
    rightBoundary = totalPages - 1;
    leftBoundary = Math.max(2, rightBoundary - siblingCount * 2);
  }

  const tokens: PageToken[] = [1];

  if (leftBoundary > 2) {
    tokens.push("ellipsis");
  }

  for (
    let pageNumber = leftBoundary;
    pageNumber <= rightBoundary;
    pageNumber += 1
  ) {
    tokens.push(pageNumber);
  }

  if (rightBoundary < totalPages - 1) {
    tokens.push("ellipsis");
  }

  tokens.push(totalPages);

  return tokens;
}

export function Pagination({
  variant = "basic",
  size = "md",
  pageSizeSelectVariant = "inline",
  page,
  defaultPage = 1,
  totalPages = 1,
  pageSize,
  defaultPageSize,
  pageSizeOptions,
  onAction,
  onPageChange,
  onPageSizeChange,
  disabled = false,
  maxVisiblePages = 5,
  showPageSizeSelector = true,
  showSummary = true,
  showShowingPage = true,
  resetPageOnPageSizeChange = true,
  labels,
  firstButtonProps,
  previousButtonProps,
  nextButtonProps,
  lastButtonProps,
  pageButtonProps,
  activePageButtonProps,
  summaryFormatter,
  showingPageFormatter,
  className = "",
  style,
  role,
  ["aria-label"]: ariaLabel,
  ...props
}: PaginationProps): JSX.Element {
  const resolvedSizeTokens = sizeTokens[size];
  const navigationIconSize = iconSizeByPaginationSize[size];
  const firstButtonOverrides = firstButtonProps ?? {};
  const previousButtonOverrides = previousButtonProps ?? {};
  const nextButtonOverrides = nextButtonProps ?? {};
  const lastButtonOverrides = lastButtonProps ?? {};
  const pageButtonOverrides = pageButtonProps ?? {};
  const activePageButtonOverrides = activePageButtonProps ?? {};

  const navIconWrapStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 0,
  };

  const resolvedLabels = {
    item: labels?.item ?? "items",
    select: labels?.select ?? "Page size",
    perPage: labels?.perPage ?? "page",
    showingPage: labels?.showingPage ?? "Page",
    navigation: labels?.navigation ?? "Pagination",
    firstAria: labels?.firstAria ?? "Go to first page",
    previousAria: labels?.previousAria ?? "Go to previous page",
    nextAria: labels?.nextAria ?? "Go to next page",
    lastAria: labels?.lastAria ?? "Go to last page",
    pageAriaFormatter:
      labels?.pageAriaFormatter ??
      ((pageNumber: number) => `Go to page ${pageNumber}`),
    first: labels?.first ?? (
      <span aria-hidden style={navIconWrapStyle}>
        <FiChevronsLeft size={navigationIconSize} />
      </span>
    ),
    previous: labels?.previous ?? (
      <span aria-hidden style={navIconWrapStyle}>
        <FiChevronLeft size={navigationIconSize} />
      </span>
    ),
    next: labels?.next ?? (
      <span aria-hidden style={navIconWrapStyle}>
        <FiChevronRight size={navigationIconSize} />
      </span>
    ),
    last: labels?.last ?? (
      <span aria-hidden style={navIconWrapStyle}>
        <FiChevronsRight size={navigationIconSize} />
      </span>
    ),
  };

  const normalizedPageSizeOptions = useMemo(
    () => normalizePageSizeOptions(pageSizeOptions),
    [pageSizeOptions],
  );

  const fallbackPageSize =
    normalizedPageSizeOptions[0] ?? defaultPageSizeOptions[0];
  const isPageSizeControlled = pageSize !== undefined;

  const [uncontrolledPageSize, setUncontrolledPageSize] = useState<number>(
    () => {
      const initial = toInteger(defaultPageSize, fallbackPageSize);
      if (initial <= 0) {
        return fallbackPageSize;
      }

      return normalizedPageSizeOptions.includes(initial)
        ? initial
        : fallbackPageSize;
    },
  );

  useEffect(() => {
    if (
      !isPageSizeControlled &&
      (uncontrolledPageSize <= 0 ||
        Number.isNaN(uncontrolledPageSize) ||
        !normalizedPageSizeOptions.includes(uncontrolledPageSize))
    ) {
      setUncontrolledPageSize(fallbackPageSize);
    }
  }, [
    fallbackPageSize,
    isPageSizeControlled,
    normalizedPageSizeOptions,
    uncontrolledPageSize,
  ]);

  const resolvedPageSizeRaw = isPageSizeControlled
    ? toInteger(pageSize, fallbackPageSize)
    : uncontrolledPageSize;
  const resolvedPageSize =
    resolvedPageSizeRaw > 0 &&
    normalizedPageSizeOptions.includes(resolvedPageSizeRaw)
      ? resolvedPageSizeRaw
      : fallbackPageSize;

  const resolvedTotalPages = Math.max(1, toInteger(totalPages, 1));

  const isPageControlled = page !== undefined;

  const [uncontrolledPage, setUncontrolledPage] = useState<number>(() => {
    const initialPage = toInteger(defaultPage, 1);
    return Math.max(1, initialPage);
  });

  const rawPage = isPageControlled ? toInteger(page, 1) : uncontrolledPage;
  const resolvedPage = clamp(rawPage, 1, resolvedTotalPages);

  useEffect(() => {
    if (
      !isPageControlled &&
      unresolvedPageNeedsClamp(uncontrolledPage, resolvedPage)
    ) {
      setUncontrolledPage(resolvedPage);
    }
  }, [isPageControlled, resolvedPage, uncontrolledPage]);

  const summaryContext: PaginationTextContext = {
    currentPage: resolvedPage,
    totalPages: resolvedTotalPages,
    pageSize: resolvedPageSize,
    itemLabel: resolvedLabels.item,
  };

  const pageTokens = useMemo(
    () => buildPageTokens(resolvedPage, resolvedTotalPages, maxVisiblePages),
    [maxVisiblePages, resolvedPage, resolvedTotalPages],
  );

  const pageSizeSelectOptions: SelectOption[] = useMemo(
    () =>
      normalizedPageSizeOptions.map((optionValue) => ({
        value: `${optionValue}`,
        label: `${optionValue} / ${resolvedLabels.perPage}`,
      })),
    [normalizedPageSizeOptions, resolvedLabels.perPage],
  );

  const pageSizeSelectorMinWidth = useMemo(() => {
    const longestOptionLabelLength = pageSizeSelectOptions.reduce(
      (longestLength, option) => Math.max(longestLength, option.label.length),
      0,
    );
    const safeLabelLength = Math.max(7, longestOptionLabelLength);

    return `calc(${safeLabelLength}ch + 3.35rem)`;
  }, [pageSizeSelectOptions]);

  const pageSizeSelectorWidth = `max(${resolvedSizeTokens.selectorWidth}, ${pageSizeSelectorMinWidth})`;

  function setPage(
    nextPage: number,
    source: PaginationActionSource = "page-number",
    event?: unknown,
  ): void {
    if (disabled) {
      return;
    }

    const normalizedPage = clamp(
      toInteger(nextPage, resolvedPage),
      1,
      resolvedTotalPages,
    );

    if (!isPageControlled) {
      setUncontrolledPage(normalizedPage);
    }

    if (normalizedPage !== resolvedPage || isPageControlled) {
      onPageChange?.(normalizedPage);
      onAction?.({
        source,
        page: normalizedPage,
        pageSize: resolvedPageSize,
        totalPages: resolvedTotalPages,
        event,
      });
    }
  }

  function setPageSizeValue(nextPageSize: number): void {
    if (disabled) {
      return;
    }

    const normalizedPageSize = Math.max(
      1,
      toInteger(nextPageSize, resolvedPageSize),
    );

    if (!isPageSizeControlled) {
      setUncontrolledPageSize(normalizedPageSize);
    }

    if (normalizedPageSize !== resolvedPageSize || isPageSizeControlled) {
      onPageSizeChange?.(normalizedPageSize);
      onAction?.({
        source: "page-size",
        page: resolvedPage,
        pageSize: normalizedPageSize,
        totalPages: resolvedTotalPages,
      });
    }

    if (resetPageOnPageSizeChange) {
      setPage(1, "page-size-reset");
    }
  }

  function handlePageSizeSelectChange(nextValue: SelectValue): void {
    if (Array.isArray(nextValue) || nextValue == null) {
      return;
    }

    const parsedValue = Number.parseInt(nextValue, 10);

    if (!Number.isNaN(parsedValue) && parsedValue > 0) {
      setPageSizeValue(parsedValue);
    }
  }

  const summaryText =
    summaryFormatter?.(summaryContext) ??
    `${resolvedPage}/${resolvedTotalPages} ${resolvedLabels.item}`;

  const showingPageText =
    showingPageFormatter?.(summaryContext) ??
    `${resolvedLabels.showingPage} ${resolvedPage}/${resolvedTotalPages}`;

  const preferSingleRow = variant === "advance" || variant === "compact";

  const composedClassName = `${baseClasses} ${className}`.trim();

  const rootStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: preferSingleRow ? "flex-start" : "space-between",
    flexWrap: "wrap",
    gap: resolvedSizeTokens.gap,
    boxSizing: "border-box",
    fontSize: resolvedSizeTokens.fontSize,
    ...style,
  };

  const infoStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: preferSingleRow ? "nowrap" : "wrap",
    gap: resolvedSizeTokens.controlGap,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    minWidth: 0,
    maxWidth: "100%",
    flexShrink: 1,
    boxSizing: "border-box",
  };

  const summaryStyle: CSSProperties = {
    margin: 0,
    fontWeight: 500,
    color: "var(--ktn-text-primary)",
    minWidth: 0,
  };

  const showingPageStyle: CSSProperties = {
    margin: 0,
    fontWeight: 500,
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    minWidth: 0,
  };

  const pageSizeSelectWrapStyle: CSSProperties = {
    width: preferSingleRow
      ? pageSizeSelectorWidth
      : `min(100%, ${pageSizeSelectorWidth})`,
    maxWidth: preferSingleRow ? pageSizeSelectorWidth : "100%",
    minWidth: 0,
    flexShrink: preferSingleRow ? 0 : 1,
    flexGrow: 0,
    flexBasis: preferSingleRow ? pageSizeSelectorWidth : "auto",
  };

  const navStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: preferSingleRow ? "nowrap" : "wrap",
    gap: resolvedSizeTokens.controlGap,
    minWidth: 0,
    maxWidth: "100%",
    flexShrink: 1,
    boxSizing: "border-box",
  };

  const compactNavStyle: CSSProperties = {
    ...navStyle,
    marginInlineStart: "auto",
  };

  const advanceNavStyle: CSSProperties = {
    ...navStyle,
    marginInlineStart: "auto",
  };

  const ellipsisStyle: CSSProperties = {
    minWidth: resolvedSizeTokens.symbolButtonMinWidth,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    paddingInline: "0.2rem",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  };

  const symbolButtonStyle: CSSProperties = {
    minWidth: resolvedSizeTokens.symbolButtonMinWidth,
    paddingInline: "0.45rem",
  };

  const pageButtonStyle: CSSProperties = {
    minWidth: resolvedSizeTokens.symbolButtonMinWidth,
    paddingInline: "0.45rem",
  };

  const pageSizeSelectorNode = showPageSizeSelector ? (
    <div style={pageSizeSelectWrapStyle}>
      <Select
        size={size}
        variant={pageSizeSelectVariant}
        options={pageSizeSelectOptions}
        value={`${resolvedPageSize}`}
        onValueChange={handlePageSizeSelectChange}
        disabled={disabled}
        placeholder={resolvedLabels.select}
        searchPlaceholder={resolvedLabels.select}
        style={{ width: "100%" }}
      />
    </div>
  ) : null;

  return (
    <div
      className={composedClassName}
      style={rootStyle}
      role={role ?? "navigation"}
      aria-label={ariaLabel ?? resolvedLabels.navigation}
      {...props}
    >
      {variant === "basic" ? (
        <>
          <div style={infoStyle}>
            {showSummary ? (
              <span style={summaryStyle}>{summaryText}</span>
            ) : null}
            {pageSizeSelectorNode}
          </div>

          <div style={navStyle}>
            <Button
              {...firstButtonOverrides}
              variant={firstButtonOverrides.variant ?? "outline"}
              size={resolvedSizeTokens.buttonSize}
              disabled={
                disabled ||
                resolvedPage <= 1 ||
                firstButtonOverrides.disabled === true
              }
              onAction={(event) => {
                setPage(1, "first", event);
              }}
              style={{
                ...symbolButtonStyle,
                ...(firstButtonOverrides.style ?? {}),
              }}
              aria-label={
                typeof firstButtonOverrides["aria-label"] === "string" &&
                firstButtonOverrides["aria-label"].trim() !== ""
                  ? firstButtonOverrides["aria-label"]
                  : resolvedLabels.firstAria
              }
            >
              {resolvedLabels.first}
            </Button>

            <Button
              {...previousButtonOverrides}
              variant={previousButtonOverrides.variant ?? "outline"}
              size={resolvedSizeTokens.buttonSize}
              disabled={
                disabled ||
                resolvedPage <= 1 ||
                previousButtonOverrides.disabled === true
              }
              onAction={(event) => {
                setPage(resolvedPage - 1, "previous", event);
              }}
              style={{
                ...symbolButtonStyle,
                ...(previousButtonOverrides.style ?? {}),
              }}
              aria-label={
                typeof previousButtonOverrides["aria-label"] === "string" &&
                previousButtonOverrides["aria-label"].trim() !== ""
                  ? previousButtonOverrides["aria-label"]
                  : resolvedLabels.previousAria
              }
            >
              {resolvedLabels.previous}
            </Button>

            {pageTokens.map((token, tokenIndex) => {
              if (token === "ellipsis") {
                return (
                  <span
                    key={`ellipsis-${tokenIndex}`}
                    aria-hidden
                    style={ellipsisStyle}
                  >
                    ...
                  </span>
                );
              }

              const pageNumber = token;
              const isActive = pageNumber === resolvedPage;
              const mergedPageButtonOverrides = {
                ...pageButtonOverrides,
                ...(isActive ? activePageButtonOverrides : {}),
              };

              return (
                <Button
                  key={`page-${pageNumber}`}
                  {...mergedPageButtonOverrides}
                  variant={
                    mergedPageButtonOverrides.variant ??
                    (isActive ? "primary" : "outline")
                  }
                  size={resolvedSizeTokens.buttonSize}
                  disabled={
                    disabled || mergedPageButtonOverrides.disabled === true
                  }
                  onAction={(event) => {
                    setPage(pageNumber, "page-number", event);
                  }}
                  style={{
                    ...pageButtonStyle,
                    ...(mergedPageButtonOverrides.style ?? {}),
                  }}
                  aria-label={
                    typeof mergedPageButtonOverrides["aria-label"] ===
                      "string" &&
                    mergedPageButtonOverrides["aria-label"].trim() !== ""
                      ? mergedPageButtonOverrides["aria-label"]
                      : resolvedLabels.pageAriaFormatter(pageNumber)
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              {...nextButtonOverrides}
              variant={nextButtonOverrides.variant ?? "outline"}
              size={resolvedSizeTokens.buttonSize}
              disabled={
                disabled ||
                resolvedPage >= resolvedTotalPages ||
                nextButtonOverrides.disabled === true
              }
              onAction={(event) => {
                setPage(resolvedPage + 1, "next", event);
              }}
              style={{
                ...symbolButtonStyle,
                ...(nextButtonOverrides.style ?? {}),
              }}
              aria-label={
                typeof nextButtonOverrides["aria-label"] === "string" &&
                nextButtonOverrides["aria-label"].trim() !== ""
                  ? nextButtonOverrides["aria-label"]
                  : resolvedLabels.nextAria
              }
            >
              {resolvedLabels.next}
            </Button>

            <Button
              {...lastButtonOverrides}
              variant={lastButtonOverrides.variant ?? "outline"}
              size={resolvedSizeTokens.buttonSize}
              disabled={
                disabled ||
                resolvedPage >= resolvedTotalPages ||
                lastButtonOverrides.disabled === true
              }
              onAction={(event) => {
                setPage(resolvedTotalPages, "last", event);
              }}
              style={{
                ...symbolButtonStyle,
                ...(lastButtonOverrides.style ?? {}),
              }}
              aria-label={
                typeof lastButtonOverrides["aria-label"] === "string" &&
                lastButtonOverrides["aria-label"].trim() !== ""
                  ? lastButtonOverrides["aria-label"]
                  : resolvedLabels.lastAria
              }
            >
              {resolvedLabels.last}
            </Button>
          </div>
        </>
      ) : null}

      {variant === "advance" ? (
        <>
          <div style={infoStyle}>{pageSizeSelectorNode}</div>

          <div style={advanceNavStyle}>
            {showShowingPage ? (
              <span style={showingPageStyle}>{showingPageText}</span>
            ) : null}

            <Button
              {...previousButtonOverrides}
              variant={previousButtonOverrides.variant ?? "outline"}
              size={resolvedSizeTokens.buttonSize}
              disabled={
                disabled ||
                resolvedPage <= 1 ||
                previousButtonOverrides.disabled === true
              }
              onAction={(event) => {
                setPage(resolvedPage - 1, "previous", event);
              }}
              style={{
                ...symbolButtonStyle,
                ...(previousButtonOverrides.style ?? {}),
              }}
              aria-label={
                typeof previousButtonOverrides["aria-label"] === "string" &&
                previousButtonOverrides["aria-label"].trim() !== ""
                  ? previousButtonOverrides["aria-label"]
                  : resolvedLabels.previousAria
              }
            >
              {resolvedLabels.previous}
            </Button>

            <Button
              {...nextButtonOverrides}
              variant={nextButtonOverrides.variant ?? "outline"}
              size={resolvedSizeTokens.buttonSize}
              disabled={
                disabled ||
                resolvedPage >= resolvedTotalPages ||
                nextButtonOverrides.disabled === true
              }
              onAction={(event) => {
                setPage(resolvedPage + 1, "next", event);
              }}
              style={{
                ...symbolButtonStyle,
                ...(nextButtonOverrides.style ?? {}),
              }}
              aria-label={
                typeof nextButtonOverrides["aria-label"] === "string" &&
                nextButtonOverrides["aria-label"].trim() !== ""
                  ? nextButtonOverrides["aria-label"]
                  : resolvedLabels.nextAria
              }
            >
              {resolvedLabels.next}
            </Button>
          </div>
        </>
      ) : null}

      {variant === "compact" ? (
        <>
          {pageSizeSelectorNode}

          <div style={compactNavStyle}>
            <Button
              {...previousButtonOverrides}
              variant={previousButtonOverrides.variant ?? "outline"}
              size={resolvedSizeTokens.buttonSize}
              disabled={
                disabled ||
                resolvedPage <= 1 ||
                previousButtonOverrides.disabled === true
              }
              onAction={(event) => {
                setPage(resolvedPage - 1, "previous", event);
              }}
              style={{
                ...symbolButtonStyle,
                ...(previousButtonOverrides.style ?? {}),
              }}
              aria-label={
                typeof previousButtonOverrides["aria-label"] === "string" &&
                previousButtonOverrides["aria-label"].trim() !== ""
                  ? previousButtonOverrides["aria-label"]
                  : resolvedLabels.previousAria
              }
            >
              {resolvedLabels.previous}
            </Button>

            {showSummary ? (
              <span style={summaryStyle}>{summaryText}</span>
            ) : null}

            <Button
              {...nextButtonOverrides}
              variant={nextButtonOverrides.variant ?? "outline"}
              size={resolvedSizeTokens.buttonSize}
              disabled={
                disabled ||
                resolvedPage >= resolvedTotalPages ||
                nextButtonOverrides.disabled === true
              }
              onAction={(event) => {
                setPage(resolvedPage + 1, "next", event);
              }}
              style={{
                ...symbolButtonStyle,
                ...(nextButtonOverrides.style ?? {}),
              }}
              aria-label={
                typeof nextButtonOverrides["aria-label"] === "string" &&
                nextButtonOverrides["aria-label"].trim() !== ""
                  ? nextButtonOverrides["aria-label"]
                  : resolvedLabels.nextAria
              }
            >
              {resolvedLabels.next}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}

function unresolvedPageNeedsClamp(
  uncontrolledPage: number,
  resolvedPage: number,
): boolean {
  return uncontrolledPage !== resolvedPage;
}
