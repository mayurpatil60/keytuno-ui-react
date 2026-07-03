import { ReactNode } from 'react';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { ButtonProps } from './Button.js';
import { SheetSide } from './Sheet.js';
import './Tooltip.js';

type AdvanceFilterOperator = "contains" | "starts-with" | "ends-with" | "equals" | "not-equals" | "gt" | "gte" | "lt" | "lte";
type AdvanceSortDirection = "asc" | "desc";
type AdvanceFilterApplyReason = "apply" | "clear-filters" | "reset-sorting";
type AdvanceFilterActionSource = "open-change" | "add-filter" | "add-sort" | "reset-filter-rule" | "reset-sort-rule" | "clear-filters" | "reset-sorting" | "apply";
interface AdvanceFilterColumn {
    id: string;
    label: string;
    canFilter?: boolean;
    canSort?: boolean;
}
interface AdvanceFilterResult {
    columnFilters: ColumnFiltersState;
    sorting: SortingState;
    globalSearch: string;
}
interface AdvanceFilterActionContext {
    source: AdvanceFilterActionSource;
    open: boolean;
    reason?: AdvanceFilterApplyReason;
    columnFilters: ColumnFiltersState;
    sorting: SortingState;
    globalSearch: string;
    filterRuleCount: number;
    sortRuleCount: number;
    activeFilterCount: number;
}
interface AdvanceFilterProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    columns: AdvanceFilterColumn[];
    columnFilters: ColumnFiltersState;
    sorting: SortingState;
    globalSearch: string;
    canUseGlobalFilter?: boolean;
    enableSorting?: boolean;
    controlSize?: "xs" | "sm" | "md" | "lg";
    showTrigger?: boolean;
    triggerDisabled?: boolean;
    triggerTooltipSide?: ButtonProps["tooltipSide"];
    triggerTooltipSize?: ButtonProps["tooltipSize"];
    triggerOpenLabel?: string;
    triggerCloseLabel?: string;
    triggerIcon?: ReactNode;
    triggerAriaLabel?: string;
    activeFilterCount?: number;
    side?: SheetSide;
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
    onApply: (result: AdvanceFilterResult, reason: AdvanceFilterApplyReason) => void;
    onAction?: (context: AdvanceFilterActionContext) => void;
}
declare function AdvanceFilter({ open, defaultOpen, onOpenChange, columns, columnFilters, sorting, globalSearch, canUseGlobalFilter, enableSorting, controlSize, showTrigger, triggerDisabled, triggerTooltipSide, triggerTooltipSize, triggerOpenLabel, triggerCloseLabel, triggerIcon, triggerAriaLabel, activeFilterCount, side, title, description, filtersSectionLabel, sortSectionLabel, addFilterLabel, addSortLabel, clearFiltersLabel, resetSortingLabel, applyFiltersLabel, globalFilterLabel, globalFilterPlaceholder, ruleValuePlaceholder, onApply, onAction, }: AdvanceFilterProps): JSX.Element;

export { AdvanceFilter, type AdvanceFilterActionContext, type AdvanceFilterActionSource, type AdvanceFilterApplyReason, type AdvanceFilterColumn, type AdvanceFilterOperator, type AdvanceFilterProps, type AdvanceFilterResult, type AdvanceSortDirection };
