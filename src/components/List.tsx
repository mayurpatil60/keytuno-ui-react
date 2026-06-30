import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Button } from "./Button";
import { Separator } from "./Separator";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit3,
  FiEye,
  FiTrash2,
} from "./icons/feather";

export type ListColumns = "auto" | "one" | "two" | "three";
export type ListResolvedColumns = Exclude<ListColumns, "auto">;
export type ListSize = "xs" | "sm" | "md" | "lg";
export type ListTone = "default" | "muted" | "positive" | "negative";
export type ListHoverActionId = "view" | "edit" | "delete";
export type ListItemValues =
  | [ReactNode]
  | [ReactNode, ReactNode]
  | [ReactNode, ReactNode, ReactNode];

export interface ListLine {
  values: ListItemValues;
  size?: ListSize;
  tone?: ListTone;
  valueTones?: [ListTone?, ListTone?, ListTone?];
}

export type ListActionSource =
  | "item-click"
  | "item-keydown"
  | "item-toggle"
  | "hover-action";

export interface ListItem {
  id?: string | number;
  values?: ListItemValues;
  lines?: ListLine[];
  disabled?: boolean;
  ariaLabel?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface ListActionContext {
  source: ListActionSource;
  item: ListItem;
  itemIndex: number;
  resolvedColumns: ListResolvedColumns;
  actionId?: ListHoverActionId;
  collapsed?: boolean;
  event?: unknown;
}

export interface ListProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  items?: ListItem[];
  columns?: ListColumns;
  size?: ListSize;
  secondaryLineSize?: ListSize;
  secondaryLineTone?: ListTone;
  disabled?: boolean;
  emptyText?: ReactNode;
  rowDivider?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  showCollapseIndicator?: boolean;
  showHoverActions?: boolean;
  hoverActionIds?: ListHoverActionId[];
  virtualized?: boolean;
  virtualizedMaxHeight?: CSSProperties["maxHeight"];
  virtualizedEstimateSize?: number;
  virtualizedOverscan?: number;
  onAction?: (context: ListActionContext) => void;
}

type ListSizeTokens = {
  rowPaddingY: string;
  rowPaddingX: string;
  lineGap: string;
  columnGap: string;
  fontSize: string;
  lineHeight: string;
  actionIconSize: number;
  actionButtonWidth: number;
};

type ListRenderableRow = {
  item: ListItem;
  itemIndex: number;
  itemKey: string;
  allLines: ListLine[];
  primaryLine: ListLine;
  resolvedColumns: ListResolvedColumns;
};

const baseClasses = "flex w-full min-w-0 flex-col";
const DEFAULT_HOVER_ACTIONS: ListHoverActionId[] = ["view", "edit", "delete"];
const DEFAULT_VIRTUAL_ESTIMATE: Record<ListSize, number> = {
  xs: 52,
  sm: 58,
  md: 66,
  lg: 74,
};

const sizeTokens: Record<ListSize, ListSizeTokens> = {
  xs: {
    rowPaddingY: "0.34rem",
    rowPaddingX: "0.4rem",
    lineGap: "0.16rem",
    columnGap: "0.35rem",
    fontSize: "0.72rem",
    lineHeight: "1.3",
    actionIconSize: 12,
    actionButtonWidth: 20,
  },
  sm: {
    rowPaddingY: "0.42rem",
    rowPaddingX: "0.54rem",
    lineGap: "0.2rem",
    columnGap: "0.42rem",
    fontSize: "0.79rem",
    lineHeight: "1.35",
    actionIconSize: 12,
    actionButtonWidth: 22,
  },
  md: {
    rowPaddingY: "0.5rem",
    rowPaddingX: "0.64rem",
    lineGap: "0.22rem",
    columnGap: "0.48rem",
    fontSize: "0.86rem",
    lineHeight: "1.42",
    actionIconSize: 13,
    actionButtonWidth: 24,
  },
  lg: {
    rowPaddingY: "0.62rem",
    rowPaddingX: "0.76rem",
    lineGap: "0.24rem",
    columnGap: "0.52rem",
    fontSize: "0.94rem",
    lineHeight: "1.5",
    actionIconSize: 14,
    actionButtonWidth: 26,
  },
};

function toItemKey(item: ListItem, index: number): string {
  if (item.id != null) {
    return String(item.id);
  }

  return `index-${index}`;
}

function resolveLines(item: ListItem): ListLine[] {
  if (item.lines != null && item.lines.length > 0) {
    return item.lines;
  }

  if (item.values != null) {
    return [{ values: item.values }];
  }

  return [];
}

function toResolvedColumns(
  columns: ListColumns,
  values: ListItemValues,
): ListResolvedColumns {
  if (columns === "one" || columns === "two" || columns === "three") {
    return columns;
  }

  const valueLength = values.length;

  if (valueLength >= 3) {
    return "three";
  }

  if (valueLength === 2) {
    return "two";
  }

  return "one";
}

function toColumnCount(columns: ListResolvedColumns): 1 | 2 | 3 {
  if (columns === "one") {
    return 1;
  }

  if (columns === "two") {
    return 2;
  }

  return 3;
}

function resolveTextAlign(
  resolvedColumns: ListResolvedColumns,
  columnIndex: number,
): CSSProperties["textAlign"] {
  if (resolvedColumns === "one") {
    return "left";
  }

  if (resolvedColumns === "two") {
    return columnIndex === 0 ? "left" : "right";
  }

  if (columnIndex === 0) {
    return "left";
  }

  if (columnIndex === 1) {
    return "center";
  }

  return "right";
}

function resolveJustifySelf(
  resolvedColumns: ListResolvedColumns,
  columnIndex: number,
): CSSProperties["justifySelf"] {
  if (resolvedColumns === "one") {
    return "start";
  }

  if (resolvedColumns === "two") {
    return columnIndex === 0 ? "start" : "end";
  }

  if (columnIndex === 0) {
    return "start";
  }

  if (columnIndex === 1) {
    return "center";
  }

  return "end";
}

function normalizeValues(
  values: ListItemValues,
  columnCount: 1 | 2 | 3,
): ReactNode[] {
  const normalized = [...values.slice(0, 3)];

  while (normalized.length < columnCount) {
    normalized.push(null);
  }

  return normalized.slice(0, columnCount);
}

function resolveToneColor(tone: ListTone): string {
  if (tone === "muted") {
    return "var(--ktn-text-secondary, var(--ktn-text-primary))";
  }

  if (tone === "positive") {
    return "var(--ktn-action-success-bg, #16a34a)";
  }

  if (tone === "negative") {
    return "var(--ktn-action-danger-bg, #dc2626)";
  }

  return "var(--ktn-text-primary)";
}

function toHoverActionIcon(
  actionId: ListHoverActionId,
  iconSize: number,
): ReactNode {
  if (actionId === "view") {
    return <FiEye size={iconSize} />;
  }

  if (actionId === "edit") {
    return <FiEdit3 size={iconSize} />;
  }

  return <FiTrash2 size={iconSize} />;
}

function toHoverActionLabel(actionId: ListHoverActionId): string {
  if (actionId === "view") {
    return "View";
  }

  if (actionId === "edit") {
    return "Edit";
  }

  return "Delete";
}

function toPlainText(value: ReactNode): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function toItemAccessibleLabel(
  item: ListItem,
  primaryLine: ListLine,
  itemIndex: number,
): string {
  if (typeof item.ariaLabel === "string" && item.ariaLabel.trim() !== "") {
    return item.ariaLabel.trim();
  }

  const firstValue = toPlainText(primaryLine.values[0]);

  if (firstValue !== "") {
    return firstValue;
  }

  return `Row ${itemIndex + 1}`;
}

function toInitialCollapsedState(
  items: ListItem[],
  collapsible: boolean,
  defaultCollapsed: boolean,
): Record<string, boolean> {
  const nextState: Record<string, boolean> = {};

  items.forEach((item, itemIndex) => {
    const itemLines = resolveLines(item);
    const itemCanCollapse =
      (item.collapsible ?? collapsible) && itemLines.length > 1;
    const itemKey = toItemKey(item, itemIndex);

    nextState[itemKey] = itemCanCollapse
      ? (item.defaultCollapsed ?? defaultCollapsed)
      : false;
  });

  return nextState;
}

export function List({
  items = [],
  columns = "auto",
  size = "md",
  secondaryLineSize = "sm",
  secondaryLineTone = "muted",
  disabled = false,
  emptyText = "No data available.",
  rowDivider = true,
  collapsible = false,
  defaultCollapsed = false,
  showCollapseIndicator = true,
  showHoverActions = false,
  hoverActionIds = DEFAULT_HOVER_ACTIONS,
  virtualized = false,
  virtualizedMaxHeight = "24rem",
  virtualizedEstimateSize,
  virtualizedOverscan = 8,
  onAction,
  className = "",
  style,
  role,
  ["aria-label"]: ariaLabel,
  ["aria-labelledby"]: ariaLabelledBy,
  ...props
}: ListProps): JSX.Element {
  const baseTokens = sizeTokens[size];
  const [activeItemKey, setActiveItemKey] = useState<string | null>(null);
  const [collapsedByKey, setCollapsedByKey] = useState<Record<string, boolean>>(
    () => toInitialCollapsedState(items, collapsible, defaultCollapsed),
  );

  useEffect(() => {
    setCollapsedByKey((currentState) => {
      const nextState = toInitialCollapsedState(
        items,
        collapsible,
        defaultCollapsed,
      );
      let hasChanges = false;

      Object.entries(nextState).forEach(([itemKey, isCollapsed]) => {
        if (currentState[itemKey] != null) {
          nextState[itemKey] = currentState[itemKey];
          return;
        }

        if (!hasChanges && currentState[itemKey] !== isCollapsed) {
          hasChanges = true;
        }
      });

      if (!hasChanges) {
        const currentKeys = Object.keys(currentState);
        const nextKeys = Object.keys(nextState);

        if (currentKeys.length !== nextKeys.length) {
          hasChanges = true;
        } else {
          hasChanges = nextKeys.some(
            (itemKey) => currentState[itemKey] !== nextState[itemKey],
          );
        }
      }

      return hasChanges ? nextState : currentState;
    });
  }, [items, collapsible, defaultCollapsed]);

  const renderableRows = useMemo<ListRenderableRow[]>(() => {
    const rows: ListRenderableRow[] = [];

    items.forEach((item, itemIndex) => {
      const allLines = resolveLines(item);

      if (allLines.length === 0) {
        return;
      }

      const primaryLine = allLines[0];

      rows.push({
        item,
        itemIndex,
        itemKey: toItemKey(item, itemIndex),
        allLines,
        primaryLine,
        resolvedColumns: toResolvedColumns(columns, primaryLine.values),
      });
    });

    return rows;
  }, [items, columns]);

  const listViewportRef = useRef<HTMLDivElement | null>(null);
  const resolvedEstimateSize =
    virtualizedEstimateSize ?? DEFAULT_VIRTUAL_ESTIMATE[size];

  const virtualizer = useVirtualizer({
    count: renderableRows.length,
    getScrollElement: () => (virtualized ? listViewportRef.current : null),
    estimateSize: () => resolvedEstimateSize,
    overscan: virtualizedOverscan,
    getItemKey: (rowIndex) => {
      const row = renderableRows[rowIndex];

      if (row == null) {
        return rowIndex;
      }

      return `${row.itemKey}-${row.itemIndex}`;
    },
    measureElement: (element) => {
      if (element == null) {
        return resolvedEstimateSize;
      }

      return element.getBoundingClientRect().height;
    },
  });

  useEffect(() => {
    if (!virtualized) {
      return;
    }

    virtualizer.measure();
  }, [
    virtualized,
    renderableRows.length,
    collapsedByKey,
    rowDivider,
    showCollapseIndicator,
    showHoverActions,
    virtualizer,
  ]);

  const resolvedAriaLabel =
    ariaLabel ?? (ariaLabelledBy == null ? "Data list" : undefined);

  const rootStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    ...style,
  };

  function emitAction(
    source: ListActionSource,
    item: ListItem,
    itemIndex: number,
    resolvedColumns: ListResolvedColumns,
    event: unknown,
    options?: {
      actionId?: ListHoverActionId;
      collapsed?: boolean;
    },
  ): void {
    onAction?.({
      source,
      item,
      itemIndex,
      resolvedColumns,
      actionId: options?.actionId,
      collapsed: options?.collapsed,
      event,
    });
  }

  function handleRowBlur(
    event: FocusEvent<HTMLDivElement>,
    itemKey: string,
  ): void {
    const nextFocused = event.relatedTarget;

    if (
      nextFocused instanceof Node &&
      event.currentTarget.contains(nextFocused)
    ) {
      return;
    }

    setActiveItemKey((currentItemKey) =>
      currentItemKey === itemKey ? null : currentItemKey,
    );
  }

  function toggleCollapsed(
    item: ListItem,
    itemIndex: number,
    itemKey: string,
    resolvedColumns: ListResolvedColumns,
    event: unknown,
  ): void {
    setCollapsedByKey((currentState) => {
      const nextCollapsed = !(currentState[itemKey] ?? false);

      emitAction("item-toggle", item, itemIndex, resolvedColumns, event, {
        collapsed: nextCollapsed,
      });

      return {
        ...currentState,
        [itemKey]: nextCollapsed,
      };
    });
  }

  const resolvedHoverActionIds =
    hoverActionIds.length > 0 ? hoverActionIds : DEFAULT_HOVER_ACTIONS;

  function renderRow(
    row: ListRenderableRow,
    rowIndex: number,
    rowCount: number,
  ): JSX.Element {
    const { item, itemIndex, itemKey, allLines, primaryLine, resolvedColumns } =
      row;
    const itemCanCollapse =
      (item.collapsible ?? collapsible) && allLines.length > 1;
    const rowDisabled = disabled || item.disabled === true;
    const rowInteractive =
      !rowDisabled && (onAction != null || itemCanCollapse);
    const rowAccessibleLabel = toItemAccessibleLabel(
      item,
      primaryLine,
      itemIndex,
    );
    const rowContentId = `ktn-list-row-${itemIndex}-content`;
    const itemCollapsed = itemCanCollapse
      ? (collapsedByKey[itemKey] ?? item.defaultCollapsed ?? defaultCollapsed)
      : false;
    const visibleLines = itemCollapsed ? allLines.slice(0, 1) : allLines;
    const hasHoverActionButtons =
      showHoverActions && !rowDisabled && resolvedHoverActionIds.length > 0;
    const collapseControlWidth =
      itemCanCollapse && showCollapseIndicator
        ? baseTokens.actionButtonWidth
        : 0;
    const rightControlReserve =
      collapseControlWidth > 0 ? collapseControlWidth + 4 : 0;
    const hoverOverlayRight: CSSProperties["right"] =
      collapseControlWidth > 0
        ? `calc(${baseTokens.rowPaddingX} + ${collapseControlWidth}px + 0.3rem)`
        : baseTokens.rowPaddingX;
    const rowIsActive = activeItemKey === itemKey;
    const rowRole = rowInteractive
      ? itemCanCollapse || hasHoverActionButtons
        ? "group"
        : "button"
      : undefined;

    const rowStyle: CSSProperties = {
      position: "relative",
      paddingBlock: baseTokens.rowPaddingY,
      paddingInlineStart: baseTokens.rowPaddingX,
      paddingInlineEnd:
        rightControlReserve > 0
          ? `calc(${baseTokens.rowPaddingX} + ${rightControlReserve}px)`
          : baseTokens.rowPaddingX,
      opacity: rowDisabled ? 0.56 : 1,
      cursor: rowInteractive ? "pointer" : "default",
    };

    return (
      <div
        key={`${itemKey}-${itemIndex}`}
        role="listitem"
        aria-label={item.ariaLabel}
      >
        <div
          role={rowRole}
          tabIndex={rowInteractive ? 0 : undefined}
          aria-label={rowInteractive ? rowAccessibleLabel : undefined}
          aria-disabled={rowDisabled ? true : undefined}
          aria-controls={itemCanCollapse ? rowContentId : undefined}
          aria-expanded={itemCanCollapse ? !itemCollapsed : undefined}
          aria-keyshortcuts={rowInteractive ? "Enter Space" : undefined}
          style={rowStyle}
          onMouseEnter={
            rowDisabled
              ? undefined
              : () => {
                  setActiveItemKey(itemKey);
                }
          }
          onMouseLeave={
            rowDisabled
              ? undefined
              : () => {
                  setActiveItemKey((currentItemKey) =>
                    currentItemKey === itemKey ? null : currentItemKey,
                  );
                }
          }
          onFocusCapture={
            rowDisabled
              ? undefined
              : () => {
                  setActiveItemKey(itemKey);
                }
          }
          onBlurCapture={
            rowDisabled
              ? undefined
              : (event) => {
                  handleRowBlur(event, itemKey);
                }
          }
          onClick={
            rowInteractive
              ? (event) => {
                  if (itemCanCollapse) {
                    emitAction(
                      "item-click",
                      item,
                      itemIndex,
                      resolvedColumns,
                      event,
                    );

                    toggleCollapsed(
                      item,
                      itemIndex,
                      itemKey,
                      resolvedColumns,
                      event,
                    );
                    return;
                  }

                  emitAction(
                    "item-click",
                    item,
                    itemIndex,
                    resolvedColumns,
                    event,
                  );
                }
              : undefined
          }
          onKeyDown={
            rowInteractive
              ? (event) => {
                  if (event.key !== "Enter" && event.key !== " ") {
                    return;
                  }

                  event.preventDefault();

                  if (itemCanCollapse) {
                    emitAction(
                      "item-keydown",
                      item,
                      itemIndex,
                      resolvedColumns,
                      event,
                    );

                    toggleCollapsed(
                      item,
                      itemIndex,
                      itemKey,
                      resolvedColumns,
                      event,
                    );
                    return;
                  }

                  emitAction(
                    "item-keydown",
                    item,
                    itemIndex,
                    resolvedColumns,
                    event,
                  );
                }
              : undefined
          }
        >
          <div
            id={rowContentId}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: baseTokens.lineGap,
            }}
          >
            {visibleLines.map((line, lineIndex) => {
              const resolvedLineSize =
                line.size ?? (lineIndex === 0 ? size : secondaryLineSize);
              const lineTokens = sizeTokens[resolvedLineSize];
              const lineTone =
                line.tone ?? (lineIndex === 0 ? "default" : secondaryLineTone);
              const lineResolvedColumns = toResolvedColumns(
                columns,
                line.values,
              );
              const lineColumnCount = toColumnCount(lineResolvedColumns);
              const lineValues = normalizeValues(line.values, lineColumnCount);

              return (
                <div
                  key={`${itemKey}-line-${lineIndex}`}
                  style={{
                    display: "grid",
                    width: "100%",
                    minWidth: 0,
                    alignItems: "start",
                    gap: lineTokens.columnGap,
                    gridTemplateColumns: `repeat(${lineColumnCount}, minmax(0, 1fr))`,
                    fontSize: lineTokens.fontSize,
                    lineHeight: lineTokens.lineHeight,
                  }}
                >
                  {lineValues.map((value, valueIndex) => {
                    const valueTone = line.valueTones?.[valueIndex] ?? lineTone;

                    return (
                      <div
                        key={`${itemKey}-line-${lineIndex}-value-${valueIndex}`}
                        style={{
                          minWidth: 0,
                          textAlign: resolveTextAlign(
                            lineResolvedColumns,
                            valueIndex,
                          ),
                          justifySelf: resolveJustifySelf(
                            lineResolvedColumns,
                            valueIndex,
                          ),
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          color:
                            value == null
                              ? "transparent"
                              : resolveToneColor(valueTone),
                          userSelect: rowDisabled ? "none" : undefined,
                        }}
                      >
                        {value ?? " "}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {itemCanCollapse && showCollapseIndicator ? (
            <div
              style={{
                position: "absolute",
                right: baseTokens.rowPaddingX,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <Button
                size="xs"
                compact
                iconOnly
                iconOnlyTone
                variant="ghost"
                disabled={rowDisabled}
                tooltip={`${itemCollapsed ? "Expand" : "Collapse"} ${rowAccessibleLabel}`}
                aria-label={`${itemCollapsed ? "Expand" : "Collapse"} ${rowAccessibleLabel}`}
                aria-controls={rowContentId}
                aria-expanded={!itemCollapsed}
                onAction={(event) => {
                  event.stopPropagation();

                  if (rowDisabled) {
                    return;
                  }

                  toggleCollapsed(
                    item,
                    itemIndex,
                    itemKey,
                    resolvedColumns,
                    event,
                  );
                }}
              >
                {itemCollapsed ? (
                  <FiChevronDown size={baseTokens.actionIconSize} />
                ) : (
                  <FiChevronUp size={baseTokens.actionIconSize} />
                )}
              </Button>
            </div>
          ) : null}

          {hasHoverActionButtons ? (
            <div
              style={{
                position: "absolute",
                right: hoverOverlayRight,
                top: baseTokens.rowPaddingY,
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                gap: "0.24rem",
                opacity: rowIsActive ? 1 : 0,
                transform: rowIsActive
                  ? "translateY(0)"
                  : "translateY(-0.2rem)",
                pointerEvents: rowIsActive ? "auto" : "none",
                transition: "opacity 140ms ease, transform 140ms ease",
              }}
            >
              {resolvedHoverActionIds.map((actionId) => {
                const iconColor =
                  actionId === "delete"
                    ? "var(--ktn-action-danger-bg, #dc2626)"
                    : "var(--ktn-text-secondary, var(--ktn-text-primary))";

                return (
                  <Button
                    key={`${itemKey}-${actionId}`}
                    size="xs"
                    compact
                    iconOnly
                    variant="secondary"
                    tooltip={`${toHoverActionLabel(actionId)} ${rowAccessibleLabel}`}
                    aria-label={`${toHoverActionLabel(actionId)} ${rowAccessibleLabel}`}
                    disabled={rowDisabled}
                    onAction={(event) => {
                      event.stopPropagation();

                      if (rowDisabled) {
                        return;
                      }

                      emitAction(
                        "hover-action",
                        item,
                        itemIndex,
                        resolvedColumns,
                        event,
                        { actionId },
                      );
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        color: iconColor,
                      }}
                    >
                      {toHoverActionIcon(actionId, baseTokens.actionIconSize)}
                    </span>
                  </Button>
                );
              })}
            </div>
          ) : null}
        </div>

        {rowDivider && rowIndex < rowCount - 1 ? (
          <Separator
            size="xs"
            decorative
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--ktn-border-muted) 82%, transparent)",
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div
      role={role ?? "list"}
      aria-label={resolvedAriaLabel}
      aria-labelledby={ariaLabelledBy}
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      {...props}
    >
      {renderableRows.length === 0 ? (
        <div
          role="listitem"
          style={{
            paddingBlock: baseTokens.rowPaddingY,
            paddingInline: baseTokens.rowPaddingX,
            fontSize: baseTokens.fontSize,
            lineHeight: baseTokens.lineHeight,
            color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
          }}
        >
          {emptyText}
        </div>
      ) : virtualized ? (
        <div
          ref={listViewportRef}
          role="presentation"
          style={{
            position: "relative",
            width: "100%",
            minWidth: 0,
            maxHeight: virtualizedMaxHeight,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div
            role="presentation"
            style={{
              position: "relative",
              width: "100%",
              minWidth: 0,
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = renderableRows[virtualRow.index];

              if (row == null) {
                return null;
              }

              return (
                <div
                  key={virtualRow.key}
                  role="presentation"
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {renderRow(row, virtualRow.index, renderableRows.length)}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        renderableRows.map((row, rowIndex) =>
          renderRow(row, rowIndex, renderableRows.length),
        )
      )}
    </div>
  );
}
