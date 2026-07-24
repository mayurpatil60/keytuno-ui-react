import { ReactNode, CSSProperties, HTMLAttributes } from 'react';
import { ColumnDef, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { ButtonProps } from './Button.js';
import './Tooltip.js';

type TableVariant = "basic" | "outline" | "ghost" | "filled" | "minimal" | "striped";
type TableSize = "xs" | "sm" | "md" | "lg";
type TableActionSource = "sort" | "filter" | "selection" | "column-visibility" | "row-action";
interface TableActionContext<TData extends object = object> {
    source: TableActionSource;
    sort?: SortingState;
    filters?: ColumnFiltersState;
    selectedRows?: TData[];
    visibleColumnIds?: string[];
    actionId?: string;
    row?: TData;
    rowIndex?: number;
    event?: unknown;
}
type TableColumnDef<TData extends object = object> = ColumnDef<TData, unknown>;
type TableButtonVariant = NonNullable<ButtonProps["variant"]>;
interface RowAction<TData extends object = object> {
    id: string;
    label: ReactNode;
    icon?: ReactNode;
    variant?: TableButtonVariant;
    compact?: boolean;
    iconOnly?: boolean;
    iconOnlyTone?: boolean;
    iconColor?: CSSProperties["color"];
    tooltip?: ButtonProps["tooltip"];
    tooltipSide?: ButtonProps["tooltipSide"];
    tooltipSize?: ButtonProps["tooltipSize"];
    tooltipDisabled?: ButtonProps["tooltipDisabled"];
    tooltipOpenDelay?: ButtonProps["tooltipOpenDelay"];
    tooltipCloseDelay?: ButtonProps["tooltipCloseDelay"];
    onClick: (row: TData, rowIndex: number) => void;
    disabled?: (row: TData, rowIndex: number) => boolean;
}
interface TableProps<TData extends object = object> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    data?: TData[];
    columns: TableColumnDef<TData>[];
    rowKey?: keyof TData | ((row: TData, index: number) => string | number);
    variant?: TableVariant;
    size?: TableSize;
    compact?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    columnFilters?: string[];
    selectable?: boolean;
    multiSelect?: boolean;
    selectAllRowsAriaLabel?: string;
    selectRowAriaLabelFormatter?: (rowNumber: number) => string;
    selectedCountFormatter?: (count: number) => ReactNode;
    onSelectionChange?: (selectedRows: TData[]) => void;
    onAction?: (context: TableActionContext<TData>) => void;
    rowActions?: RowAction<TData>[];
    columnVisibility?: boolean;
    defaultHiddenColumns?: string[];
    loading?: boolean;
    loadingRows?: number;
    loadingText?: ReactNode;
    skeleton?: boolean;
    striped?: boolean;
    hoverable?: boolean;
    bordered?: boolean;
    rounded?: boolean;
    stickyHeader?: boolean;
    emptyText?: ReactNode;
}
declare function Table<TData extends object = object>({ data, columns, rowKey, variant, size, compact, sortable, filterable, columnFilters, selectable, multiSelect, selectAllRowsAriaLabel, selectRowAriaLabelFormatter, selectedCountFormatter, onSelectionChange, onAction, rowActions, columnVisibility, defaultHiddenColumns, loading, loadingRows, loadingText, skeleton, striped, hoverable, bordered, rounded, stickyHeader, emptyText, className, style, ...props }: TableProps<TData>): JSX.Element;

export { type RowAction, Table, type TableActionContext, type TableActionSource, type TableColumnDef, type TableProps, type TableSize, type TableVariant };
