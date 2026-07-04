import { HTMLAttributes, ReactNode } from 'react';
import { SelectVariant } from './Select.js';

type PaginationVariant = "basic" | "advance" | "compact";
type PaginationSize = "xs" | "sm" | "md" | "lg";
type PaginationActionSource = "first" | "previous" | "next" | "last" | "page-number" | "page-size" | "page-size-reset";
interface PaginationActionContext {
    source: PaginationActionSource;
    page: number;
    pageSize: number;
    totalPages: number;
    event?: unknown;
}
interface PaginationTextContext {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    itemLabel: string;
}
interface PaginationLabels {
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
interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange"> {
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
    summaryFormatter?: (context: PaginationTextContext) => ReactNode;
    showingPageFormatter?: (context: PaginationTextContext) => ReactNode;
}
declare function Pagination({ variant, size, pageSizeSelectVariant, page, defaultPage, totalPages, pageSize, defaultPageSize, pageSizeOptions, onAction, onPageChange, onPageSizeChange, disabled, maxVisiblePages, showPageSizeSelector, showSummary, showShowingPage, resetPageOnPageSizeChange, labels, summaryFormatter, showingPageFormatter, className, style, role, ["aria-label"]: ariaLabel, ...props }: PaginationProps): JSX.Element;

export { Pagination, type PaginationActionContext, type PaginationActionSource, type PaginationLabels, type PaginationProps, type PaginationSize, type PaginationTextContext, type PaginationVariant };
