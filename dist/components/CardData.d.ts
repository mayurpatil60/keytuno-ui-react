import { HTMLAttributes, ReactNode } from 'react';
import { SortingState, ColumnFiltersState } from '@tanstack/react-table';
import { BadgeVariant } from './Badge.js';
import { ButtonProps } from './Button.js';
import { PaginationProps } from './Pagination.js';
import './Tooltip.js';

type CardDataVariant = "default" | "compact" | "ghost";
type CardDataSize = "xs" | "sm" | "md" | "lg";
type CardDataActionAlignment = "left" | "right";
type CardDataActionPlacement = "top" | "bottom";
type CardDataActionMode = "auto" | "inline" | "menu";
type CardDataFieldType = "auto" | "text" | "link" | "number" | "currency" | "percent" | "date" | "phone" | "status" | "badge" | "progress" | "media";
type CardDataStatusTone = "neutral" | "positive" | "warning" | "negative";
interface CardDataStatusValue {
    label: ReactNode;
    tone?: CardDataStatusTone;
}
interface CardDataBadgeValue {
    label: ReactNode;
    variant?: BadgeVariant;
}
interface CardDataProgressValue {
    value: number;
    min?: number;
    max?: number;
    label?: ReactNode;
}
interface CardDataMediaValue {
    src: string;
    alt?: string;
    type?: "auto" | "image" | "video" | "audio" | "file";
}
interface CardDataColumns {
    mobile?: number;
    tablet?: number;
    web?: number;
}
interface CardDataColumnBreakpoints {
    tablet?: number;
    web?: number;
}
interface CardDataFieldSchema<TData extends object = object> {
    key: Extract<keyof TData, string> | string;
    label?: ReactNode;
    showLabel?: boolean;
    type?: CardDataFieldType;
    align?: "left" | "right";
    span?: 1 | 2 | "auto";
    priority?: number;
    hideIfEmpty?: boolean;
    formatter?: (value: unknown, row: TData, rowIndex: number) => ReactNode;
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    dateOptions?: Intl.DateTimeFormatOptions;
    mediaAlt?: string;
    mediaType?: "auto" | "image" | "video" | "audio" | "file";
}
interface CardDataAction<TData extends object = object> {
    id: string;
    label: ReactNode;
    icon?: ReactNode;
    variant?: ButtonProps["variant"];
    disabled?: boolean | ((row: TData, rowIndex: number) => boolean);
    onAction?: (row: TData, rowIndex: number) => void;
}
type CardDataActionSource = "item-action" | "view-switch" | "refresh" | "fullscreen" | "search" | "sort" | "sort-reset" | "filter" | "column-filters-toggle" | "column-filters-apply" | "column-filters-clear" | "pagination" | "page-size";
interface CardDataActionContext<TData extends object = object> {
    source: CardDataActionSource;
    actionId?: string;
    row?: TData;
    rowIndex?: number;
    page?: number;
    pageSize?: number;
    sort?: SortingState;
    filters?: ColumnFiltersState;
    search?: string;
    fullscreen?: boolean;
    showColumnFilters?: boolean;
    event?: unknown;
}
interface CardDataProps<TData extends object = object> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    data?: TData[];
    schema?: CardDataFieldSchema<TData>[];
    rowKey?: keyof TData | ((row: TData, index: number) => string | number);
    variant?: CardDataVariant;
    size?: CardDataSize;
    locale?: string;
    currency?: string;
    showFieldLabels?: boolean;
    actions?: CardDataAction<TData>[] | ((row: TData, rowIndex: number) => CardDataAction<TData>[]);
    sortable?: boolean;
    filterable?: boolean;
    columnFilters?: string[];
    globalFilter?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchAriaLabel?: string;
    showToolbar?: boolean;
    showRefresh?: boolean;
    onRefresh?: () => void | Promise<void>;
    refreshLabel?: string;
    refreshingLabel?: string;
    fullscreen?: boolean;
    fullscreenLabel?: string;
    resetScreenLabel?: string;
    showFiltersLabel?: string;
    hideFiltersLabel?: string;
    filterDialogTitle?: string;
    filterDialogDescription?: string;
    addFilterLabel?: string;
    addSortLabel?: string;
    clearFiltersLabel?: string;
    resetSortingLabel?: string;
    applyFiltersLabel?: string;
    globalFilterLabel?: string;
    globalFilterPlaceholder?: string;
    actionInlineMaxVisible?: number;
    actionMode?: CardDataActionMode;
    actionAlignment?: CardDataActionAlignment;
    actionPlacement?: CardDataActionPlacement;
    actionMenuLabel?: ReactNode;
    showViewSwitch?: boolean;
    switchToTableViewLabel?: string;
    onSwitchToTableView?: () => void;
    columns?: number | CardDataColumns;
    columnBreakpoints?: CardDataColumnBreakpoints;
    virtualized?: boolean;
    virtualizedMaxHeight?: number | string;
    virtualizedEstimateSize?: number;
    virtualizedOverscan?: number;
    serverSide?: boolean;
    totalRows?: number;
    pageIndex?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    showPagination?: boolean;
    paginationVariant?: PaginationProps["variant"];
    paginationDefaultPageSize?: number;
    paginationPageSizeOptions?: number[];
    paginationMaxVisiblePages?: number;
    paginationShowPageSizeSelector?: boolean;
    paginationShowSummary?: boolean;
    paginationShowShowingPage?: boolean;
    paginationResetPageOnPageSizeChange?: boolean;
    paginationLabels?: PaginationProps["labels"];
    paginationSummaryFormatter?: PaginationProps["summaryFormatter"];
    paginationShowingPageFormatter?: PaginationProps["showingPageFormatter"];
    onSortChange?: (sort: SortingState) => void;
    onFilterChange?: (filters: ColumnFiltersState) => void;
    viewportMaxHeight?: number | string;
    safeAreaAware?: boolean;
    emptyText?: ReactNode;
    onAction?: (context: CardDataActionContext<TData>) => void;
}
declare function CardData<TData extends object = object>({ data, schema, rowKey, variant, size, locale, currency, showFieldLabels, actions, sortable, filterable, columnFilters, globalFilter, searchable, searchPlaceholder, searchAriaLabel, showToolbar, showRefresh, onRefresh, refreshLabel, refreshingLabel, fullscreen, fullscreenLabel, resetScreenLabel, showFiltersLabel, hideFiltersLabel, filterDialogTitle, filterDialogDescription, addFilterLabel, addSortLabel, clearFiltersLabel, resetSortingLabel, applyFiltersLabel, globalFilterLabel, globalFilterPlaceholder, actionInlineMaxVisible, actionMode, actionAlignment, actionPlacement, actionMenuLabel, showViewSwitch, switchToTableViewLabel, onSwitchToTableView, columns, columnBreakpoints, virtualized, virtualizedMaxHeight, virtualizedEstimateSize, virtualizedOverscan, serverSide, totalRows, pageIndex, onPageChange, onPageSizeChange, showPagination, paginationVariant, paginationDefaultPageSize, paginationPageSizeOptions, paginationMaxVisiblePages, paginationShowPageSizeSelector, paginationShowSummary, paginationShowShowingPage, paginationResetPageOnPageSizeChange, paginationLabels, paginationSummaryFormatter, paginationShowingPageFormatter, onSortChange, onFilterChange, viewportMaxHeight, safeAreaAware, emptyText, onAction, className, style, ...props }: CardDataProps<TData>): JSX.Element;

export { CardData, type CardDataAction, type CardDataActionAlignment, type CardDataActionContext, type CardDataActionMode, type CardDataActionPlacement, type CardDataActionSource, type CardDataBadgeValue, type CardDataColumnBreakpoints, type CardDataColumns, type CardDataFieldSchema, type CardDataFieldType, type CardDataMediaValue, type CardDataProgressValue, type CardDataProps, type CardDataSize, type CardDataStatusValue, type CardDataVariant };
