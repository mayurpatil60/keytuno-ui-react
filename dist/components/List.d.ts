import { HTMLAttributes, ReactNode, CSSProperties } from 'react';

type ListColumns = "auto" | "one" | "two" | "three";
type ListResolvedColumns = Exclude<ListColumns, "auto">;
type ListSize = "xs" | "sm" | "md" | "lg";
type ListTone = "default" | "muted" | "positive" | "negative";
type ListHoverActionId = "view" | "edit" | "delete";
type ListItemValues = [ReactNode] | [ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode];
interface ListLine {
    values: ListItemValues;
    size?: ListSize;
    tone?: ListTone;
    valueTones?: [ListTone?, ListTone?, ListTone?];
}
type ListActionSource = "item-click" | "item-keydown" | "item-toggle" | "hover-action";
interface ListItem {
    id?: string | number;
    values?: ListItemValues;
    lines?: ListLine[];
    disabled?: boolean;
    ariaLabel?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
}
interface ListActionContext {
    source: ListActionSource;
    item: ListItem;
    itemIndex: number;
    resolvedColumns: ListResolvedColumns;
    actionId?: ListHoverActionId;
    collapsed?: boolean;
    event?: unknown;
}
interface ListProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
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
declare function List({ items, columns, size, secondaryLineSize, secondaryLineTone, disabled, emptyText, rowDivider, collapsible, defaultCollapsed, showCollapseIndicator, showHoverActions, hoverActionIds, virtualized, virtualizedMaxHeight, virtualizedEstimateSize, virtualizedOverscan, onAction, className, style, role, ["aria-label"]: ariaLabel, ["aria-labelledby"]: ariaLabelledBy, ...props }: ListProps): JSX.Element;

export { List, type ListActionContext, type ListActionSource, type ListColumns, type ListHoverActionId, type ListItem, type ListItemValues, type ListLine, type ListProps, type ListResolvedColumns, type ListSize, type ListTone };
