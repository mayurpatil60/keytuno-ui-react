import { ReactNode } from 'react';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';

type DataFilterOperator = "contains" | "starts-with" | "ends-with" | "equals" | "not-equals" | "gt" | "gte" | "lt" | "lte";
type DataSortDirection = "asc" | "desc";
type DataFilterSortDialogApplyReason = "apply" | "clear-filters" | "reset-sorting";
interface DataFilterSortDialogColumn {
    id: string;
    label: string;
    canFilter?: boolean;
    canSort?: boolean;
}
interface DataFilterSortDialogResult {
    columnFilters: ColumnFiltersState;
    sorting: SortingState;
    globalSearch: string;
}
interface DataFilterSortDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    columns: DataFilterSortDialogColumn[];
    columnFilters: ColumnFiltersState;
    sorting: SortingState;
    globalSearch: string;
    canUseGlobalFilter?: boolean;
    enableSorting?: boolean;
    controlSize?: "xs" | "sm" | "md" | "lg";
    title?: ReactNode;
    description?: ReactNode;
    filtersSectionLabel?: ReactNode;
    sortSectionLabel?: ReactNode;
    addFilterLabel?: string;
    addSortLabel?: string;
    clearFiltersLabel?: string;
    resetSortingLabel?: string;
    applyFiltersLabel?: string;
    globalFilterLabel?: ReactNode;
    globalFilterPlaceholder?: string;
    ruleValuePlaceholder?: string;
    onApply: (result: DataFilterSortDialogResult, reason: DataFilterSortDialogApplyReason) => void;
}
declare function DataFilterSortDialog({ open, onOpenChange, columns, columnFilters, sorting, globalSearch, canUseGlobalFilter, enableSorting, controlSize, title, description, filtersSectionLabel, sortSectionLabel, addFilterLabel, addSortLabel, clearFiltersLabel, resetSortingLabel, applyFiltersLabel, globalFilterLabel, globalFilterPlaceholder, ruleValuePlaceholder, onApply, }: DataFilterSortDialogProps): JSX.Element;

export { type DataFilterOperator, DataFilterSortDialog, type DataFilterSortDialogApplyReason, type DataFilterSortDialogColumn, type DataFilterSortDialogProps, type DataFilterSortDialogResult, type DataSortDirection };
