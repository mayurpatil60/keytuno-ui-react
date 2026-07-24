import { ReactNode } from 'react';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { ButtonProps } from './Button.js';
import { SelectVariant } from './Select.js';
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
type AdvanceFilterButtonProps = Omit<ButtonProps, "children" | "onAction" | "size" | "type">;
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
    selectVariant?: SelectVariant;
    showTrigger?: boolean;
    triggerDisabled?: boolean;
    triggerTooltipSide?: ButtonProps["tooltipSide"];
    triggerTooltipSize?: ButtonProps["tooltipSize"];
    triggerOpenLabel?: string;
    triggerCloseLabel?: string;
    triggerIcon?: ReactNode;
    triggerAriaLabel?: string;
    activeFilterCount?: number;
    triggerButtonProps?: AdvanceFilterButtonProps;
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
    addFilterButtonProps?: AdvanceFilterButtonProps;
    addSortButtonProps?: AdvanceFilterButtonProps;
    resetFilterButtonProps?: AdvanceFilterButtonProps;
    resetSortButtonProps?: AdvanceFilterButtonProps;
    clearFiltersButtonProps?: AdvanceFilterButtonProps;
    resetSortingButtonProps?: AdvanceFilterButtonProps;
    applyFiltersButtonProps?: AdvanceFilterButtonProps;
    globalFilterLabel?: ReactNode;
    globalFilterPlaceholder?: string;
    ruleValuePlaceholder?: string;
    onApply: (result: AdvanceFilterResult, reason: AdvanceFilterApplyReason) => void;
    onAction?: (context: AdvanceFilterActionContext) => void;
}
declare function AdvanceFilter({ open, defaultOpen, onOpenChange, columns, columnFilters, sorting, globalSearch, canUseGlobalFilter, enableSorting, controlSize, selectVariant, showTrigger, triggerDisabled, triggerTooltipSide, triggerTooltipSize, triggerOpenLabel, triggerCloseLabel, triggerIcon, triggerAriaLabel, activeFilterCount, triggerButtonProps, side, title, description, filtersSectionLabel, sortSectionLabel, addFilterLabel, addSortLabel, clearFiltersLabel, resetSortingLabel, applyFiltersLabel, addFilterButtonProps, addSortButtonProps, resetFilterButtonProps, resetSortButtonProps, clearFiltersButtonProps, resetSortingButtonProps, applyFiltersButtonProps, globalFilterLabel, globalFilterPlaceholder, ruleValuePlaceholder, onApply, onAction, }: AdvanceFilterProps): JSX.Element;

export { AdvanceFilter, type AdvanceFilterActionContext, type AdvanceFilterActionSource, type AdvanceFilterApplyReason, type AdvanceFilterButtonProps, type AdvanceFilterColumn, type AdvanceFilterOperator, type AdvanceFilterProps, type AdvanceFilterResult, type AdvanceSortDirection };
