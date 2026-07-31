import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

import { Button, type ButtonProps } from "./Button";
import { Field, FieldContent, FieldLabel } from "./Field";
import { Input } from "./Input";
import { FiFilter, FiPlus, FiX } from "./icons/feather";
import {
  Select,
  type SelectOption,
  type SelectValue,
  type SelectVariant,
} from "./Select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  type SheetSide,
} from "./Sheet";

export type AdvanceFilterOperator =
  | "contains"
  | "starts-with"
  | "ends-with"
  | "equals"
  | "not-equals"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export type AdvanceSortDirection = "asc" | "desc";

export type AdvanceFilterApplyReason =
  | "apply"
  | "clear-filters"
  | "reset-sorting";

export type AdvanceFilterActionSource =
  | "open-change"
  | "add-filter"
  | "add-sort"
  | "reset-filter-rule"
  | "reset-sort-rule"
  | "clear-filters"
  | "reset-sorting"
  | "apply";

export interface AdvanceFilterColumn {
  id: string;
  label: string;
  canFilter?: boolean;
  canSort?: boolean;
}

export interface AdvanceFilterResult {
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  globalSearch: string;
}

export interface AdvanceFilterActionContext {
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

export type AdvanceFilterButtonProps = Omit<
  ButtonProps,
  "children" | "onAction" | "size" | "type"
>;

export interface AdvanceFilterProps {
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

  onApply: (
    result: AdvanceFilterResult,
    reason: AdvanceFilterApplyReason,
  ) => void;
  onAction?: (context: AdvanceFilterActionContext) => void;
}

interface AdvanceRule {
  id: string;
  columnId: string;
  operator: AdvanceFilterOperator;
  value: string;
}

interface AdvanceSortRule {
  id: string;
  columnId: string;
  direction: AdvanceSortDirection;
}

type AdvanceFilterOperatorOption = {
  value: AdvanceFilterOperator;
  label: string;
};

const advanceFilterOperatorOptions: AdvanceFilterOperatorOption[] = [
  { value: "contains", label: "Contains" },
  { value: "starts-with", label: "Starts with" },
  { value: "ends-with", label: "Ends with" },
  { value: "equals", label: "Equals" },
  { value: "not-equals", label: "Not equals" },
  { value: "gt", label: "Greater than" },
  { value: "gte", label: "Greater than or equal" },
  { value: "lt", label: "Less than" },
  { value: "lte", label: "Less than or equal" },
];

const sortDirectionSelectOptions: SelectOption[] = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

const defaultFilterOperator: AdvanceFilterOperator = "contains";

function createRuleId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function splitColumnFilterTerms(filterValue: unknown): string[] {
  if (typeof filterValue !== "string") {
    return [];
  }

  return filterValue
    .split(",")
    .map((term) => term.trim())
    .filter((term) => term !== "");
}

function createFilterRule(columnId: string): AdvanceRule {
  return {
    id: createRuleId("adv-filter"),
    columnId,
    operator: defaultFilterOperator,
    value: "",
  };
}

function createSortRule(columnId: string): AdvanceSortRule {
  return {
    id: createRuleId("adv-sort"),
    columnId,
    direction: "asc",
  };
}

function toFilterToken(
  operator: AdvanceFilterOperator,
  rawValue: string,
): string {
  const value = rawValue.trim();

  if (value === "") {
    return "";
  }

  if (operator === "starts-with") {
    return `^${value}`;
  }

  if (operator === "ends-with") {
    return `${value}$`;
  }

  if (operator === "equals") {
    return `=${value}`;
  }

  if (operator === "not-equals") {
    return `!=${value}`;
  }

  if (operator === "gt") {
    return `>${value}`;
  }

  if (operator === "gte") {
    return `>=${value}`;
  }

  if (operator === "lt") {
    return `<${value}`;
  }

  if (operator === "lte") {
    return `<=${value}`;
  }

  return `~${value}`;
}

function parseFilterToken(token: string): {
  operator: AdvanceFilterOperator;
  value: string;
} {
  const normalized = token.trim();

  if (normalized === "") {
    return {
      operator: defaultFilterOperator,
      value: "",
    };
  }

  if (normalized.startsWith("!=")) {
    return {
      operator: "not-equals",
      value: normalized.slice(2).trim(),
    };
  }

  if (normalized.startsWith(">=")) {
    return {
      operator: "gte",
      value: normalized.slice(2).trim(),
    };
  }

  if (normalized.startsWith("<=")) {
    return {
      operator: "lte",
      value: normalized.slice(2).trim(),
    };
  }

  if (normalized.startsWith(">")) {
    return {
      operator: "gt",
      value: normalized.slice(1).trim(),
    };
  }

  if (normalized.startsWith("<")) {
    return {
      operator: "lt",
      value: normalized.slice(1).trim(),
    };
  }

  if (normalized.startsWith("=")) {
    return {
      operator: "equals",
      value: normalized.slice(1).trim(),
    };
  }

  if (normalized.startsWith("^")) {
    return {
      operator: "starts-with",
      value: normalized.slice(1).trim(),
    };
  }

  if (normalized.startsWith("~")) {
    return {
      operator: "contains",
      value: normalized.slice(1).trim(),
    };
  }

  if (normalized.endsWith("$")) {
    return {
      operator: "ends-with",
      value: normalized.slice(0, -1).trim(),
    };
  }

  return {
    operator: "contains",
    value: normalized,
  };
}

function extractFilterRules(
  filters: ColumnFiltersState,
  allowedColumnIds: Set<string>,
): AdvanceRule[] {
  const rules: AdvanceRule[] = [];

  filters.forEach((filter) => {
    if (!allowedColumnIds.has(filter.id)) {
      return;
    }

    const terms = splitColumnFilterTerms(filter.value);

    terms.forEach((term) => {
      const parsed = parseFilterToken(term);

      rules.push({
        id: createRuleId("adv-filter"),
        columnId: filter.id,
        operator: parsed.operator,
        value: parsed.value,
      });
    });
  });

  return rules;
}

function buildFiltersFromRules(rules: AdvanceRule[]): ColumnFiltersState {
  const groupedByColumn = new Map<string, string[]>();

  rules.forEach((rule) => {
    const columnId = rule.columnId.trim();

    if (columnId === "") {
      return;
    }

    const token = toFilterToken(rule.operator, rule.value);

    if (token === "") {
      return;
    }

    const existing = groupedByColumn.get(columnId);

    if (existing == null) {
      groupedByColumn.set(columnId, [token]);
      return;
    }

    existing.push(token);
  });

  return Array.from(groupedByColumn.entries()).map(([columnId, terms]) => ({
    id: columnId,
    value: terms.join(","),
  }));
}

function extractSortRules(
  sorting: SortingState,
  allowedColumnIds: Set<string>,
): AdvanceSortRule[] {
  return sorting
    .filter((rule) => allowedColumnIds.has(rule.id))
    .map((rule) => ({
      id: createRuleId("adv-sort"),
      columnId: rule.id,
      direction: rule.desc ? "desc" : "asc",
    }));
}

function buildSortingFromRules(rules: AdvanceSortRule[]): SortingState {
  const usedColumns = new Set<string>();
  const nextSorting: SortingState = [];

  rules.forEach((rule) => {
    const columnId = rule.columnId.trim();

    if (columnId === "" || usedColumns.has(columnId)) {
      return;
    }

    usedColumns.add(columnId);

    nextSorting.push({
      id: columnId,
      desc: rule.direction === "desc",
    });
  });

  return nextSorting;
}

function toSingleSelectValue(value: SelectValue): string | null {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized === "" ? null : normalized;
  }

  if (Array.isArray(value)) {
    const first = value.find(
      (item) => typeof item === "string" && item.trim() !== "",
    );
    return first == null ? null : first;
  }

  return null;
}

function countActiveAdvancedFilters(
  columnFilters: ColumnFiltersState,
  globalSearch: string,
): number {
  const activeColumnFilterCount = columnFilters.reduce((count, filter) => {
    return count + splitColumnFilterTerms(filter.value).length;
  }, 0);

  const hasGlobalSearch = globalSearch.trim() !== "";
  return activeColumnFilterCount + (hasGlobalSearch ? 1 : 0);
}

export function AdvanceFilter({
  open,
  defaultOpen = false,
  onOpenChange,
  columns,
  columnFilters,
  sorting,
  globalSearch,
  canUseGlobalFilter = true,
  enableSorting = true,
  controlSize = "sm",
  selectVariant = "inline",
  showTrigger = true,
  triggerDisabled = false,
  triggerTooltipSide = "top",
  triggerTooltipSize = "xs",
  triggerOpenLabel = "Advance Filter",
  triggerCloseLabel = "Close Advance Filter",
  triggerIcon,
  triggerAriaLabel,
  activeFilterCount,
  triggerButtonProps,
  side = "right",
  title = "Advance Filter",
  filtersSectionLabel = "Filter rules",
  sortSectionLabel = "Sort rules",
  addFilterLabel = "Add filter",
  addSortLabel = "Add sort",
  clearFiltersLabel = "Clear",
  applyFiltersLabel = "Apply",
  addFilterButtonProps,
  addSortButtonProps,
  resetFilterButtonProps,
  resetSortButtonProps,
  clearFiltersButtonProps,
  applyFiltersButtonProps,
  globalFilterLabel = "Global search",
  globalFilterPlaceholder = "Search all columns",
  ruleValuePlaceholder = "Enter value",
  onApply,
  onAction,
}: AdvanceFilterProps): JSX.Element {
  const isOpenControlled = open != null;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isOpenControlled ? open === true : uncontrolledOpen;

  const filterableColumns = useMemo(
    () => columns.filter((column) => column.canFilter !== false),
    [columns],
  );
  const sortableColumns = useMemo(
    () => columns.filter((column) => column.canSort !== false),
    [columns],
  );

  const firstFilterableColumnId = filterableColumns[0]?.id ?? "";
  const firstSortableColumnId = sortableColumns[0]?.id ?? "";

  const filterColumnSelectOptions = useMemo<SelectOption[]>(
    () =>
      filterableColumns.map((column) => ({
        value: column.id,
        label: column.label,
      })),
    [filterableColumns],
  );

  const sortableColumnSelectOptions = useMemo<SelectOption[]>(
    () =>
      sortableColumns.map((column) => ({
        value: column.id,
        label: column.label,
      })),
    [sortableColumns],
  );

  const filterOperatorSelectOptions = useMemo<SelectOption[]>(
    () =>
      advanceFilterOperatorOptions.map((operator) => ({
        value: operator.value,
        label: operator.label,
      })),
    [],
  );

  const globalSearchAriaLabel =
    typeof globalFilterLabel === "string" && globalFilterLabel.trim() !== ""
      ? globalFilterLabel
      : "Global search";

  const [draftGlobalSearch, setDraftGlobalSearch] = useState(globalSearch);
  const [filterRules, setFilterRules] = useState<AdvanceRule[]>([]);
  const [sortRules, setSortRules] = useState<AdvanceSortRule[]>([]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const allowedFilterColumnIds = new Set(
      filterableColumns.map((column) => column.id),
    );
    const allowedSortColumnIds = new Set(
      sortableColumns.map((column) => column.id),
    );

    const nextFilterRules = extractFilterRules(
      columnFilters,
      allowedFilterColumnIds,
    );

    setFilterRules(nextFilterRules.length > 0 ? nextFilterRules : []);

    setSortRules(extractSortRules(sorting, allowedSortColumnIds));
    setDraftGlobalSearch(globalSearch);
  }, [
    columnFilters,
    filterableColumns,
    firstFilterableColumnId,
    globalSearch,
    isOpen,
    sortableColumns,
    sorting,
  ]);

  function emitAction(
    source: AdvanceFilterActionSource,
    reason?: AdvanceFilterApplyReason,
    result?: AdvanceFilterResult,
  ): void {
    const resolvedResult = result ?? {
      columnFilters: buildFiltersFromRules(filterRules),
      sorting: buildSortingFromRules(sortRules),
      globalSearch: canUseGlobalFilter ? draftGlobalSearch : "",
    };

    onAction?.({
      source,
      reason,
      open: isOpen,
      columnFilters: resolvedResult.columnFilters,
      sorting: resolvedResult.sorting,
      globalSearch: resolvedResult.globalSearch,
      filterRuleCount: filterRules.length,
      sortRuleCount: sortRules.length,
      activeFilterCount: countActiveAdvancedFilters(
        resolvedResult.columnFilters,
        resolvedResult.globalSearch,
      ),
    });
  }

  function handleOpenChange(nextOpen: boolean): void {
    if (!isOpenControlled) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);

    onAction?.({
      source: "open-change",
      open: nextOpen,
      columnFilters: buildFiltersFromRules(filterRules),
      sorting: buildSortingFromRules(sortRules),
      globalSearch: canUseGlobalFilter ? draftGlobalSearch : "",
      filterRuleCount: filterRules.length,
      sortRuleCount: sortRules.length,
      activeFilterCount: countActiveAdvancedFilters(
        buildFiltersFromRules(filterRules),
        canUseGlobalFilter ? draftGlobalSearch : "",
      ),
    });
  }

  function updateFilterRule(
    ruleId: string,
    changes: Partial<Omit<AdvanceRule, "id">>,
  ): void {
    setFilterRules((current) =>
      current.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              ...changes,
            }
          : rule,
      ),
    );
  }

  function updateSortRule(
    ruleId: string,
    changes: Partial<Omit<AdvanceSortRule, "id">>,
  ): void {
    setSortRules((current) =>
      current.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              ...changes,
            }
          : rule,
      ),
    );
  }

  function resetFilterRule(ruleId: string): void {
    setFilterRules((current) => current.filter((rule) => rule.id !== ruleId));

    emitAction("reset-filter-rule");
  }

  function resetSortRule(ruleId: string): void {
    setSortRules((current) => current.filter((rule) => rule.id !== ruleId));
    emitAction("reset-sort-rule");
  }

  function buildApplyResult(): AdvanceFilterResult {
    return {
      columnFilters: buildFiltersFromRules(filterRules),
      sorting: buildSortingFromRules(sortRules),
      globalSearch: canUseGlobalFilter ? draftGlobalSearch : "",
    };
  }

  function emitApply(reason: AdvanceFilterApplyReason): void {
    const nextResult = buildApplyResult();
    onApply(nextResult, reason);
    emitAction(reason === "apply" ? "apply" : reason, reason, nextResult);
  }

  function handleApply(): void {
    emitApply("apply");
    handleOpenChange(false);
  }

  function handleClearFilters(): void {
    const fallbackRules: AdvanceRule[] = [];

    setFilterRules(fallbackRules);
    setSortRules([]);
    setDraftGlobalSearch("");

    const nextResult: AdvanceFilterResult = {
      columnFilters: [],
      sorting: [],
      globalSearch: "",
    };

    onApply(nextResult, "clear-filters");
    onAction?.({
      source: "clear-filters",
      reason: "clear-filters",
      open: isOpen,
      columnFilters: nextResult.columnFilters,
      sorting: nextResult.sorting,
      globalSearch: nextResult.globalSearch,
      filterRuleCount: fallbackRules.length,
      sortRuleCount: 0,
      activeFilterCount: 0,
    });
  }

  const computedActiveFilterCount = countActiveAdvancedFilters(
    columnFilters,
    canUseGlobalFilter ? globalSearch : "",
  );
  const resolvedActiveFilterCount =
    activeFilterCount ?? computedActiveFilterCount;

  const triggerTooltip = isOpen ? triggerCloseLabel : triggerOpenLabel;
  const resolvedTriggerAriaLabel =
    triggerAriaLabel ??
    (!isOpen && resolvedActiveFilterCount > 0
      ? `${triggerOpenLabel} (${resolvedActiveFilterCount} active)`
      : triggerTooltip);
  const triggerCountLabel =
    resolvedActiveFilterCount > 99 ? "99+" : String(resolvedActiveFilterCount);

  const triggerButtonOverrides = triggerButtonProps ?? {};
  const addFilterButtonOverrides = addFilterButtonProps ?? {};
  const addSortButtonOverrides = addSortButtonProps ?? {};
  const resetFilterButtonOverrides = resetFilterButtonProps ?? {};
  const resetSortButtonOverrides = resetSortButtonProps ?? {};
  const clearFiltersButtonOverrides = clearFiltersButtonProps ?? {};
  const applyFiltersButtonOverrides = applyFiltersButtonProps ?? {};

  const resolvedTriggerButtonAriaLabel =
    typeof triggerButtonOverrides["aria-label"] === "string" &&
    triggerButtonOverrides["aria-label"].trim() !== ""
      ? triggerButtonOverrides["aria-label"]
      : resolvedTriggerAriaLabel;

  const bodyStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.88rem",
    minWidth: 0,
    width: "100%",
  };

  const sectionHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    flexWrap: "wrap",
  };

  const sectionLabelStyle: CSSProperties = {
    margin: 0,
    fontSize: "0.86rem",
    fontWeight: 600,
    color: "var(--ktn-text-primary)",
  };

  const rulesWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.56rem",
  };

  const filterSectionStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    marginBlockStart: canUseGlobalFilter ? "0.3rem" : 0,
  };

  const sortSectionStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    marginBlockStart: "0.55rem",
  };

  const filterRuleRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.46rem",
    width: "100%",
    minWidth: 0,
  };

  const sortRuleRowStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.46rem",
    width: "100%",
    minWidth: 0,
  };

  const filterColumnControlStyle: CSSProperties = {
    flex: "1 1 11rem",
    minWidth: "10rem",
    maxWidth: "100%",
  };

  const filterOperatorControlStyle: CSSProperties = {
    flex: "1 1 11rem",
    minWidth: "10rem",
    maxWidth: "100%",
  };

  const filterValueControlStyle: CSSProperties = {
    flex: "1.4 1 12rem",
    minWidth: "11rem",
    maxWidth: "100%",
  };

  const sortColumnControlStyle: CSSProperties = {
    flex: "1.2 1 12rem",
    minWidth: "11rem",
    maxWidth: "100%",
  };

  const sortDirectionControlStyle: CSSProperties = {
    flex: "1 1 10rem",
    minWidth: "9rem",
    maxWidth: "100%",
  };

  const clearRuleButtonWrapStyle: CSSProperties = {
    flex: "0 0 auto",
    marginInlineStart: "auto",
  };

  const hintTextStyle: CSSProperties = {
    margin: 0,
    fontSize: "0.76rem",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  };

  const footerStyle: CSSProperties = {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  };

  const footerLeftStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.46rem",
    flexWrap: "wrap",
  };

  const triggerIconWrapStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 0,
  };

  const triggerCountBadgeStyle: CSSProperties = {
    position: "absolute",
    insetInlineEnd: "-0.5rem",
    insetBlockStart: "-0.5rem",
    minWidth: "1rem",
    height: "1rem",
    paddingInline: "0.2rem",
    borderRadius: "9999px",
    border: "1px solid var(--ktn-bg-surface, #ffffff)",
    boxSizing: "border-box",
    backgroundColor: "var(--ktn-action-danger-bg, #dc2626)",
    color: "var(--ktn-action-danger-fg, #ffffff)",
    fontSize: "0.62rem",
    fontWeight: 700,
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={handleOpenChange}
      side={side}
      trigger={
        showTrigger ? (
          <Button
            {...triggerButtonOverrides}
            size={controlSize}
            variant={
              triggerButtonOverrides.variant ??
              (isOpen || resolvedActiveFilterCount > 0 ? "primary" : "outline")
            }
            iconOnly={triggerButtonOverrides.iconOnly ?? true}
            tooltip={triggerButtonOverrides.tooltip ?? triggerTooltip}
            tooltipSide={
              triggerButtonOverrides.tooltipSide ?? triggerTooltipSide
            }
            tooltipSize={
              triggerButtonOverrides.tooltipSize ?? triggerTooltipSize
            }
            aria-label={resolvedTriggerButtonAriaLabel}
            disabled={
              triggerDisabled || triggerButtonOverrides.disabled === true
            }
          >
            <span style={triggerIconWrapStyle}>
              {triggerIcon ?? <FiFilter size={14} />}
              {resolvedActiveFilterCount > 0 ? (
                <span aria-hidden style={triggerCountBadgeStyle}>
                  {triggerCountLabel}
                </span>
              ) : null}
            </span>
          </Button>
        ) : undefined
      }
    >
      <SheetContent
        scrollable
        maxContentHeight="min(90vh, 44rem)"
        style={{ width: "min(100vw, 44rem)", maxWidth: "44rem", minWidth: 0 }}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div style={bodyStyle}>
          {canUseGlobalFilter ? (
            <Field orientation="vertical">
              <FieldLabel>{globalFilterLabel}</FieldLabel>
              <FieldContent>
                <Input
                  size={controlSize}
                  value={draftGlobalSearch}
                  placeholder={globalFilterPlaceholder}
                  aria-label={globalSearchAriaLabel}
                  onChange={(event) => {
                    setDraftGlobalSearch(event.currentTarget.value);
                  }}
                />
              </FieldContent>
            </Field>
          ) : null}

          <div style={filterSectionStyle}>
            <div style={sectionHeaderStyle}>
              <p style={sectionLabelStyle}>{filtersSectionLabel}</p>

              <Button
                {...addFilterButtonOverrides}
                size={controlSize}
                variant={addFilterButtonOverrides.variant ?? "outline"}
                onAction={() => {
                  if (firstFilterableColumnId === "") {
                    return;
                  }

                  setFilterRules((current) => [
                    ...current,
                    createFilterRule(firstFilterableColumnId),
                  ]);
                  emitAction("add-filter");
                }}
              >
                <FiPlus size={14} /> {addFilterLabel}
              </Button>
            </div>

            <div style={rulesWrapStyle}>
              {filterRules.map((rule, index) => (
                <div key={rule.id} style={filterRuleRowStyle}>
                  <Select
                    size={controlSize}
                    variant={selectVariant}
                    options={filterColumnSelectOptions}
                    value={rule.columnId}
                    placeholder="Column"
                    searchPlaceholder="Search columns"
                    emptyText="No columns found."
                    aria-label={`Filter column ${index + 1}`}
                    style={filterColumnControlStyle}
                    onValueChange={(value) => {
                      const nextColumnId = toSingleSelectValue(value);

                      if (nextColumnId == null) {
                        return;
                      }

                      updateFilterRule(rule.id, {
                        columnId: nextColumnId,
                      });
                    }}
                  />

                  <Select
                    size={controlSize}
                    variant={selectVariant}
                    options={filterOperatorSelectOptions}
                    value={rule.operator}
                    placeholder="Operator"
                    searchPlaceholder="Search operators"
                    emptyText="No operators found."
                    aria-label={`Filter operator ${index + 1}`}
                    style={filterOperatorControlStyle}
                    onValueChange={(value) => {
                      const nextOperator = toSingleSelectValue(value);

                      if (nextOperator == null) {
                        return;
                      }

                      updateFilterRule(rule.id, {
                        operator: nextOperator as AdvanceFilterOperator,
                      });
                    }}
                  />

                  <Input
                    size={controlSize}
                    value={rule.value}
                    placeholder={ruleValuePlaceholder}
                    aria-label={`Filter value ${index + 1}`}
                    style={filterValueControlStyle}
                    onChange={(event) => {
                      updateFilterRule(rule.id, {
                        value: event.currentTarget.value,
                      });
                    }}
                  />

                  <div style={clearRuleButtonWrapStyle}>
                    <Button
                      {...resetFilterButtonOverrides}
                      size={controlSize}
                      variant={resetFilterButtonOverrides.variant ?? "ghost"}
                      iconOnly={resetFilterButtonOverrides.iconOnly ?? true}
                      iconOnlyTone={
                        resetFilterButtonOverrides.iconOnlyTone ?? true
                      }
                      tooltip={
                        resetFilterButtonOverrides.tooltip ?? "Remove filter"
                      }
                      tooltipSide={
                        resetFilterButtonOverrides.tooltipSide ?? "top"
                      }
                      tooltipSize={
                        resetFilterButtonOverrides.tooltipSize ?? "xs"
                      }
                      aria-label={
                        typeof resetFilterButtonOverrides["aria-label"] ===
                          "string" &&
                        resetFilterButtonOverrides["aria-label"].trim() !== ""
                          ? resetFilterButtonOverrides["aria-label"]
                          : `Remove filter ${index + 1}`
                      }
                      onAction={() => {
                        resetFilterRule(rule.id);
                      }}
                    >
                      <FiX size={14} />
                    </Button>
                  </div>
                </div>
              ))}

              {filterRules.length === 0 ? (
                <p style={hintTextStyle}>
                  Add a filter row to start filtering.
                </p>
              ) : null}
            </div>
          </div>

          {enableSorting && sortableColumns.length > 0 ? (
            <div style={sortSectionStyle}>
              <div style={sectionHeaderStyle}>
                <p style={sectionLabelStyle}>{sortSectionLabel}</p>

                <Button
                  {...addSortButtonOverrides}
                  size={controlSize}
                  variant={addSortButtonOverrides.variant ?? "outline"}
                  onAction={() => {
                    if (firstSortableColumnId === "") {
                      return;
                    }

                    setSortRules((current) => [
                      ...current,
                      createSortRule(firstSortableColumnId),
                    ]);
                    emitAction("add-sort");
                  }}
                >
                  <FiPlus size={14} /> {addSortLabel}
                </Button>
              </div>

              <div style={rulesWrapStyle}>
                {sortRules.map((rule, index) => (
                  <div key={rule.id} style={sortRuleRowStyle}>
                    <Select
                      size={controlSize}
                      variant={selectVariant}
                      options={sortableColumnSelectOptions}
                      value={rule.columnId}
                      placeholder="Column"
                      searchPlaceholder="Search columns"
                      emptyText="No columns found."
                      aria-label={`Sort column ${index + 1}`}
                      style={sortColumnControlStyle}
                      onValueChange={(value) => {
                        const nextColumnId = toSingleSelectValue(value);

                        if (nextColumnId == null) {
                          return;
                        }

                        updateSortRule(rule.id, {
                          columnId: nextColumnId,
                        });
                      }}
                    />

                    <Select
                      size={controlSize}
                      variant={selectVariant}
                      options={sortDirectionSelectOptions}
                      value={rule.direction}
                      placeholder="Direction"
                      searchPlaceholder="Search directions"
                      emptyText="No directions found."
                      aria-label={`Sort direction ${index + 1}`}
                      style={sortDirectionControlStyle}
                      onValueChange={(value) => {
                        const nextDirection = toSingleSelectValue(value);

                        if (
                          nextDirection !== "asc" &&
                          nextDirection !== "desc"
                        ) {
                          return;
                        }

                        updateSortRule(rule.id, {
                          direction: nextDirection,
                        });
                      }}
                    />

                    <div style={clearRuleButtonWrapStyle}>
                      <Button
                        {...resetSortButtonOverrides}
                        size={controlSize}
                        variant={resetSortButtonOverrides.variant ?? "ghost"}
                        iconOnly={resetSortButtonOverrides.iconOnly ?? true}
                        iconOnlyTone={
                          resetSortButtonOverrides.iconOnlyTone ?? true
                        }
                        tooltip={
                          resetSortButtonOverrides.tooltip ?? "Remove sort"
                        }
                        tooltipSide={
                          resetSortButtonOverrides.tooltipSide ?? "top"
                        }
                        tooltipSize={
                          resetSortButtonOverrides.tooltipSize ?? "xs"
                        }
                        aria-label={
                          typeof resetSortButtonOverrides["aria-label"] ===
                            "string" &&
                          resetSortButtonOverrides["aria-label"].trim() !== ""
                            ? resetSortButtonOverrides["aria-label"]
                            : `Remove sort ${index + 1}`
                        }
                        onAction={() => {
                          resetSortRule(rule.id);
                        }}
                      >
                        <FiX size={14} />
                      </Button>
                    </div>
                  </div>
                ))}

                {sortRules.length === 0 ? (
                  <p style={hintTextStyle}>Add a sort row to start sorting.</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <SheetFooter style={footerStyle} sticky>
          <div style={footerLeftStyle}>
            <Button
              {...clearFiltersButtonOverrides}
              size={controlSize}
              variant={clearFiltersButtonOverrides.variant ?? "outline"}
              onAction={handleClearFilters}
            >
              {clearFiltersLabel}
            </Button>
          </div>

          <Button
            {...applyFiltersButtonOverrides}
            size={controlSize}
            variant={applyFiltersButtonOverrides.variant ?? "primary"}
            onAction={handleApply}
          >
            {applyFiltersLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
