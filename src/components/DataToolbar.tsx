import {
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

import {
  AdvanceFilter,
  type AdvanceFilterApplyReason,
  type AdvanceFilterColumn,
  type AdvanceFilterResult,
} from "./AdvanceFilter";
import { Button } from "./Button";
import { Input } from "./Input";
import {
  FiGrid,
  FiList,
  FiMaximize2,
  FiMinimize2,
  FiRefreshCw,
  FiSearch,
} from "./icons/feather";

export type DataToolbarSize = "xs" | "sm" | "md" | "lg";
export type DataToolbarSwitchMode = "table" | "adaptive-card" | "custom";

export type DataToolbarActionSource =
  | "search"
  | "filter-open-change"
  | "filter-apply"
  | "switch"
  | "refresh"
  | "fullscreen";

export interface DataToolbarActionContext {
  source: DataToolbarActionSource;
  search?: string;
  open?: boolean;
  switchMode?: DataToolbarSwitchMode;
  fullscreen?: boolean;
  filterResult?: AdvanceFilterResult;
  filterReason?: AdvanceFilterApplyReason;
  event?: unknown;
}

export interface DataToolbarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  size?: DataToolbarSize;

  showSearch?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  searchInputMinWidth?: CSSProperties["minWidth"];
  searchInputMaxWidth?: CSSProperties["maxWidth"];

  showAdvanceFilter?: boolean;
  advanceFilterColumns?: AdvanceFilterColumn[];
  advanceFilterColumnFilters?: ColumnFiltersState;
  advanceFilterSorting?: SortingState;
  advanceFilterGlobalSearch?: string;
  advanceFilterCanUseGlobalFilter?: boolean;
  advanceFilterEnableSorting?: boolean;
  advanceFilterOpen?: boolean;
  advanceFilterDefaultOpen?: boolean;
  onAdvanceFilterOpenChange?: (open: boolean) => void;
  onAdvanceFilterApply?: (
    result: AdvanceFilterResult,
    reason: AdvanceFilterApplyReason,
  ) => void;
  advanceFilterOpenLabel?: string;
  advanceFilterCloseLabel?: string;
  advanceFilterAriaLabel?: string;
  advanceFilterActiveCount?: number;
  advanceFilterTitle?: ReactNode;
  advanceFilterDescription?: ReactNode;
  addFilterLabel?: string;
  addSortLabel?: string;
  clearFiltersLabel?: string;
  resetSortingLabel?: string;
  applyFiltersLabel?: string;
  globalFilterLabel?: ReactNode;
  globalFilterPlaceholder?: string;

  showSwitch?: boolean;
  switchMode?: DataToolbarSwitchMode;
  switchIcon?: ReactNode;
  switchLabel?: string;
  onSwitch?: (mode: DataToolbarSwitchMode) => void;

  showRefresh?: boolean;
  refreshing?: boolean;
  refreshLabel?: string;
  refreshingLabel?: string;
  onRefresh?: () => void | Promise<void>;

  showFullscreen?: boolean;
  fullscreen?: boolean;
  fullscreenLabel?: string;
  exitFullscreenLabel?: string;
  onFullscreenChange?: (nextValue: boolean) => void;

  onAction?: (context: DataToolbarActionContext) => void;
}

type ToolbarSizeTokens = {
  controlSize: "xs" | "sm" | "md" | "lg";
  iconSize: number;
  gap: string;
};

const baseClasses = "flex w-full min-w-0 items-center";

const sizeTokens: Record<DataToolbarSize, ToolbarSizeTokens> = {
  xs: {
    controlSize: "xs",
    iconSize: 12,
    gap: "0.25rem",
  },
  sm: {
    controlSize: "sm",
    iconSize: 13,
    gap: "0.3rem",
  },
  md: {
    controlSize: "md",
    iconSize: 14,
    gap: "0.36rem",
  },
  lg: {
    controlSize: "lg",
    iconSize: 15,
    gap: "0.42rem",
  },
};

function resolveDefaultSwitchLabel(mode: DataToolbarSwitchMode): string {
  if (mode === "table") {
    return "Table";
  }

  if (mode === "adaptive-card") {
    return "Cards";
  }

  return "Switch";
}

function resolveDefaultSwitchIcon(
  mode: DataToolbarSwitchMode,
  iconSize: number,
): ReactNode {
  if (mode === "table") {
    return <FiList size={iconSize} />;
  }

  return <FiGrid size={iconSize} />;
}

export function DataToolbar({
  size = "sm",
  showSearch = true,
  searchValue,
  defaultSearchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",
  searchAriaLabel = "Search",
  searchInputMinWidth = "20px",
  searchInputMaxWidth = "100%",
  showAdvanceFilter = false,
  advanceFilterColumns,
  advanceFilterColumnFilters,
  advanceFilterSorting,
  advanceFilterGlobalSearch,
  advanceFilterCanUseGlobalFilter = true,
  advanceFilterEnableSorting = true,
  advanceFilterOpen,
  advanceFilterDefaultOpen = false,
  onAdvanceFilterOpenChange,
  onAdvanceFilterApply,
  advanceFilterOpenLabel = "Filter",
  advanceFilterCloseLabel = "Close",
  advanceFilterAriaLabel,
  advanceFilterActiveCount,
  advanceFilterTitle,
  advanceFilterDescription,
  addFilterLabel,
  addSortLabel,
  clearFiltersLabel,
  resetSortingLabel,
  applyFiltersLabel,
  globalFilterLabel,
  globalFilterPlaceholder,
  showSwitch = false,
  switchMode = "adaptive-card",
  switchIcon,
  switchLabel,
  onSwitch,
  showRefresh = false,
  refreshing,
  refreshLabel = "Refresh",
  refreshingLabel = "Refreshing",
  onRefresh,
  showFullscreen = false,
  fullscreen = false,
  fullscreenLabel = "Fullscreen",
  exitFullscreenLabel = "Exit",
  onFullscreenChange,
  onAction,
  className = "",
  style,
  ...props
}: DataToolbarProps): JSX.Element {
  const sizeToken = sizeTokens[size];
  const [uncontrolledSearchValue, setUncontrolledSearchValue] =
    useState(defaultSearchValue);
  const [internalRefreshing, setInternalRefreshing] = useState(false);

  const resolvedSearchValue = searchValue ?? uncontrolledSearchValue;
  const isRefreshing = refreshing ?? internalRefreshing;
  const resolvedSwitchLabel =
    switchLabel ?? resolveDefaultSwitchLabel(switchMode);

  const resolvedSwitchIcon = useMemo(() => {
    if (switchIcon != null) {
      return switchIcon;
    }

    return resolveDefaultSwitchIcon(switchMode, sizeToken.iconSize);
  }, [sizeToken.iconSize, switchIcon, switchMode]);

  const resolvedFullscreenLabel = fullscreen
    ? exitFullscreenLabel
    : fullscreenLabel;

  const resolvedAdvanceFilterColumns = advanceFilterColumns ?? [];
  const canShowAdvanceFilter =
    showAdvanceFilter && resolvedAdvanceFilterColumns.length > 0;

  const rootStyle: CSSProperties = {
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: sizeToken.gap,
    boxSizing: "border-box",
    ...style,
  };

  const actionsWrapStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    flexWrap: "nowrap",
    gap: sizeToken.gap,
    flex: "0 0 auto",
    flexShrink: 0,
    minWidth: "fit-content",
  };

  const searchWrapStyle: CSSProperties = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1 1 20px",
    minWidth: searchInputMinWidth,
    maxWidth: searchInputMaxWidth,
    width: "100%",
    boxSizing: "border-box",
  };

  const searchIconStyle: CSSProperties = {
    position: "absolute",
    insetInlineStart: "0.65rem",
    insetBlockStart: "50%",
    transform: "translateY(-50%)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    pointerEvents: "none",
    lineHeight: 0,
  };

  function handleSearchChange(nextValue: string): void {
    if (searchValue == null) {
      setUncontrolledSearchValue(nextValue);
    }

    onSearchChange?.(nextValue);
    onAction?.({
      source: "search",
      search: nextValue,
    });
  }

  async function handleRefresh(event: unknown): Promise<void> {
    if (onRefresh == null) {
      return;
    }

    if (refreshing == null) {
      setInternalRefreshing(true);
    }

    try {
      await Promise.resolve(onRefresh());
      onAction?.({
        source: "refresh",
        event,
      });
    } finally {
      if (refreshing == null) {
        setInternalRefreshing(false);
      }
    }
  }

  return (
    <div
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      role="toolbar"
      aria-label="Data toolbar"
      {...props}
    >
      {showSearch ? (
        <div style={searchWrapStyle}>
          <span style={searchIconStyle}>
            <FiSearch size={sizeToken.iconSize} />
          </span>

          <Input
            size={sizeToken.controlSize}
            value={resolvedSearchValue}
            placeholder={searchPlaceholder}
            aria-label={searchAriaLabel}
            onChange={(event) => {
              handleSearchChange(event.currentTarget.value);
            }}
            style={{
              minWidth: 0,
              paddingInlineStart: "1.95rem",
            }}
          />
        </div>
      ) : null}

      <div style={actionsWrapStyle}>
        {canShowAdvanceFilter ? (
          <AdvanceFilter
            open={advanceFilterOpen}
            defaultOpen={advanceFilterDefaultOpen}
            onOpenChange={(open) => {
              onAdvanceFilterOpenChange?.(open);
              onAction?.({
                source: "filter-open-change",
                open,
              });
            }}
            columns={resolvedAdvanceFilterColumns}
            columnFilters={advanceFilterColumnFilters ?? []}
            sorting={advanceFilterSorting ?? []}
            globalSearch={advanceFilterGlobalSearch ?? ""}
            canUseGlobalFilter={advanceFilterCanUseGlobalFilter}
            enableSorting={advanceFilterEnableSorting}
            controlSize={sizeToken.controlSize}
            showTrigger
            triggerOpenLabel={advanceFilterOpenLabel}
            triggerCloseLabel={advanceFilterCloseLabel}
            triggerAriaLabel={advanceFilterAriaLabel}
            activeFilterCount={advanceFilterActiveCount}
            title={advanceFilterTitle}
            description={advanceFilterDescription}
            addFilterLabel={addFilterLabel}
            addSortLabel={addSortLabel}
            clearFiltersLabel={clearFiltersLabel}
            resetSortingLabel={resetSortingLabel}
            applyFiltersLabel={applyFiltersLabel}
            globalFilterLabel={globalFilterLabel}
            globalFilterPlaceholder={globalFilterPlaceholder}
            onApply={(result, reason) => {
              onAdvanceFilterApply?.(result, reason);
              onAction?.({
                source: "filter-apply",
                filterResult: result,
                filterReason: reason,
              });
            }}
          />
        ) : null}

        {showSwitch ? (
          <Button
            size={sizeToken.controlSize}
            variant="outline"
            iconOnly
            tooltip={resolvedSwitchLabel}
            tooltipSide="top"
            tooltipSize="xs"
            aria-label={resolvedSwitchLabel}
            onAction={(event) => {
              onSwitch?.(switchMode);
              onAction?.({
                source: "switch",
                switchMode,
                event,
              });
            }}
          >
            {resolvedSwitchIcon}
          </Button>
        ) : null}

        {showRefresh ? (
          <Button
            size={sizeToken.controlSize}
            variant="outline"
            iconOnly
            tooltip={isRefreshing ? refreshingLabel : refreshLabel}
            tooltipSide="top"
            tooltipSize="xs"
            aria-label={isRefreshing ? refreshingLabel : refreshLabel}
            disabled={isRefreshing}
            onAction={(event) => {
              void handleRefresh(event);
            }}
          >
            <FiRefreshCw size={sizeToken.iconSize} />
          </Button>
        ) : null}

        {showFullscreen ? (
          <Button
            size={sizeToken.controlSize}
            variant={fullscreen ? "primary" : "outline"}
            iconOnly
            tooltip={resolvedFullscreenLabel}
            tooltipSide="top"
            tooltipSize="xs"
            aria-label={resolvedFullscreenLabel}
            onAction={(event) => {
              const nextValue = !fullscreen;
              onFullscreenChange?.(nextValue);
              onAction?.({
                source: "fullscreen",
                fullscreen: nextValue,
                event,
              });
            }}
          >
            {fullscreen ? (
              <FiMinimize2 size={sizeToken.iconSize} />
            ) : (
              <FiMaximize2 size={sizeToken.iconSize} />
            )}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
