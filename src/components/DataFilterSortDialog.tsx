import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

import { Button } from "./Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./Dialog";
import { Field, FieldContent, FieldDescription, FieldLabel } from "./Field";
import { Input } from "./Input";
import { FiX } from "./icons/feather";
import { Select, type SelectOption, type SelectValue } from "./Select";

export type DataFilterOperator =
  | "contains"
  | "starts-with"
  | "ends-with"
  | "equals"
  | "not-equals"
  | "gt"
  | "gte"
  | "lt"
  | "lte";

export type DataSortDirection = "asc" | "desc";

export type DataFilterSortDialogApplyReason =
  | "apply"
  | "clear-filters"
  | "reset-sorting";

export interface DataFilterSortDialogColumn {
  id: string;
  label: string;
  canFilter?: boolean;
  canSort?: boolean;
}

export interface DataFilterSortDialogResult {
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
  globalSearch: string;
}

export interface DataFilterSortDialogProps {
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
  onApply: (
    result: DataFilterSortDialogResult,
    reason: DataFilterSortDialogApplyReason,
  ) => void;
}

interface DataFilterRule {
  id: string;
  columnId: string;
  operator: DataFilterOperator;
  value: string;
}

interface DataSortRule {
  id: string;
  columnId: string;
  direction: DataSortDirection;
}

type DataFilterOperatorOption = {
  value: DataFilterOperator;
  label: string;
};

const dataFilterOperatorOptions: DataFilterOperatorOption[] = [
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

const defaultFilterOperator: DataFilterOperator = "contains";
const globalFilterId = "__global";

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

function createFilterRule(columnId: string): DataFilterRule {
  return {
    id: createRuleId("adv-filter"),
    columnId,
    operator: defaultFilterOperator,
    value: "",
  };
}

function createSortRule(columnId: string): DataSortRule {
  return {
    id: createRuleId("adv-sort"),
    columnId,
    direction: "asc",
  };
}

function toFilterToken(operator: DataFilterOperator, rawValue: string): string {
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
  operator: DataFilterOperator;
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
): DataFilterRule[] {
  const rules: DataFilterRule[] = [];

  filters.forEach((filter) => {
    if (!allowedColumnIds.has(filter.id) || filter.id === globalFilterId) {
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

function buildFiltersFromRules(rules: DataFilterRule[]): ColumnFiltersState {
  const groupedByColumn = new Map<string, string[]>();

  rules.forEach((rule) => {
    const columnId = rule.columnId.trim();

    if (columnId === "" || columnId === globalFilterId) {
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
): DataSortRule[] {
  return sorting
    .filter((rule) => allowedColumnIds.has(rule.id))
    .map((rule) => ({
      id: createRuleId("adv-sort"),
      columnId: rule.id,
      direction: rule.desc ? "desc" : "asc",
    }));
}

function buildSortingFromRules(rules: DataSortRule[]): SortingState {
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

export function DataFilterSortDialog({
  open,
  onOpenChange,
  columns,
  columnFilters,
  sorting,
  globalSearch,
  canUseGlobalFilter = false,
  enableSorting = true,
  controlSize = "sm",
  title = "Advanced filters and sorting",
  description = "Build multi-column filters and sorting in one place.",
  filtersSectionLabel = "Filter rules",
  sortSectionLabel = "Sort rules",
  addFilterLabel = "Add filter",
  addSortLabel = "Add sort",
  clearFiltersLabel = "Clear filters",
  resetSortingLabel = "Reset sorting",
  applyFiltersLabel = "Apply",
  globalFilterLabel = "Global search",
  globalFilterPlaceholder = "Search all columns",
  ruleValuePlaceholder = "Enter value",
  onApply,
}: DataFilterSortDialogProps): JSX.Element {
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
      dataFilterOperatorOptions.map((operator) => ({
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
  const [filterRules, setFilterRules] = useState<DataFilterRule[]>([]);
  const [sortRules, setSortRules] = useState<DataSortRule[]>([]);

  useEffect(() => {
    if (!open) {
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

    setFilterRules(
      nextFilterRules.length > 0
        ? nextFilterRules
        : firstFilterableColumnId === ""
          ? []
          : [createFilterRule(firstFilterableColumnId)],
    );

    setSortRules(extractSortRules(sorting, allowedSortColumnIds));
    setDraftGlobalSearch(globalSearch);
  }, [
    columnFilters,
    filterableColumns,
    firstFilterableColumnId,
    firstSortableColumnId,
    globalSearch,
    open,
    sortableColumns,
    sorting,
  ]);

  function updateFilterRule(
    ruleId: string,
    changes: Partial<Omit<DataFilterRule, "id">>,
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
    changes: Partial<Omit<DataSortRule, "id">>,
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
    setFilterRules((current) => {
      if (current.length <= 1) {
        return current.map((rule) =>
          rule.id === ruleId
            ? {
                ...rule,
                operator: defaultFilterOperator,
                value: "",
              }
            : rule,
        );
      }

      return current.filter((rule) => rule.id !== ruleId);
    });
  }

  function resetSortRule(ruleId: string): void {
    setSortRules((current) => current.filter((rule) => rule.id !== ruleId));
  }

  function emitApply(reason: DataFilterSortDialogApplyReason): void {
    onApply(
      {
        columnFilters: buildFiltersFromRules(filterRules),
        sorting: buildSortingFromRules(sortRules),
        globalSearch: canUseGlobalFilter ? draftGlobalSearch : "",
      },
      reason,
    );
  }

  function handleApply(): void {
    emitApply("apply");
    onOpenChange(false);
  }

  function handleClearFilters(): void {
    const fallbackRules =
      firstFilterableColumnId === ""
        ? []
        : [createFilterRule(firstFilterableColumnId)];

    setFilterRules(fallbackRules);
    setDraftGlobalSearch("");

    onApply(
      {
        columnFilters: [],
        sorting: buildSortingFromRules(sortRules),
        globalSearch: "",
      },
      "clear-filters",
    );
  }

  function handleResetSorting(): void {
    setSortRules([]);

    onApply(
      {
        columnFilters: buildFiltersFromRules(filterRules),
        sorting: [],
        globalSearch: canUseGlobalFilter ? draftGlobalSearch : "",
      },
      "reset-sorting",
    );
  }

  const bodyStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.78rem",
    minWidth: 0,
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
    fontSize: "0.84rem",
    fontWeight: 600,
    color: "var(--ktn-text-primary)",
  };

  const rulesWrapStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const filterRuleRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.15fr) minmax(0, 1.15fr) minmax(0, 1.8fr) auto",
    gap: "0.42rem",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
  };

  const sortRuleRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr) auto",
    gap: "0.42rem",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
  };

  const ruleControlStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
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
    display: "inline-flex",
    alignItems: "center",
    gap: "0.46rem",
    flexWrap: "wrap",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} variant="outline" size="lg">
      <DialogContent
        scrollable
        maxContentHeight="min(86vh, 38rem)"
        style={{ width: "min(100%, 56rem)", maxWidth: "56rem" }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

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

                <FieldDescription>
                  Applies across all visible columns.
                </FieldDescription>
              </FieldContent>
            </Field>
          ) : null}

          <div style={sectionHeaderStyle}>
            <p style={sectionLabelStyle}>{filtersSectionLabel}</p>

            <Button
              size={controlSize}
              variant="outline"
              onAction={() => {
                if (firstFilterableColumnId === "") {
                  return;
                }

                setFilterRules((current) => [
                  ...current,
                  createFilterRule(firstFilterableColumnId),
                ]);
              }}
            >
              + {addFilterLabel}
            </Button>
          </div>

          <div style={rulesWrapStyle}>
            {filterRules.map((rule, index) => (
              <div key={rule.id} style={filterRuleRowStyle}>
                <Select
                  size={controlSize}
                  options={filterColumnSelectOptions}
                  value={rule.columnId}
                  placeholder="Column"
                  searchPlaceholder="Search columns"
                  emptyText="No columns found."
                  aria-label={`Filter column ${index + 1}`}
                  style={ruleControlStyle}
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
                  options={filterOperatorSelectOptions}
                  value={rule.operator}
                  placeholder="Operator"
                  searchPlaceholder="Search operators"
                  emptyText="No operators found."
                  aria-label={`Filter operator ${index + 1}`}
                  style={ruleControlStyle}
                  onValueChange={(value) => {
                    const nextOperator = toSingleSelectValue(value);

                    if (nextOperator == null) {
                      return;
                    }

                    updateFilterRule(rule.id, {
                      operator: nextOperator as DataFilterOperator,
                    });
                  }}
                />

                <Input
                  size={controlSize}
                  value={rule.value}
                  placeholder={ruleValuePlaceholder}
                  aria-label={`Filter value ${index + 1}`}
                  onChange={(event) => {
                    updateFilterRule(rule.id, {
                      value: event.currentTarget.value,
                    });
                  }}
                />

                <Button
                  size={controlSize}
                  variant="ghost"
                  iconOnly
                  iconOnlyTone
                  tooltip="Reset this filter"
                  tooltipSide="top"
                  tooltipSize="xs"
                  aria-label={`Reset filter ${index + 1}`}
                  onAction={() => {
                    resetFilterRule(rule.id);
                  }}
                >
                  <FiX size={14} />
                </Button>
              </div>
            ))}

            {filterRules.length === 0 ? (
              <p style={hintTextStyle}>Add a filter row to start filtering.</p>
            ) : null}
          </div>

          {enableSorting && sortableColumns.length > 0 ? (
            <>
              <div style={sectionHeaderStyle}>
                <p style={sectionLabelStyle}>{sortSectionLabel}</p>

                <Button
                  size={controlSize}
                  variant="outline"
                  onAction={() => {
                    if (firstSortableColumnId === "") {
                      return;
                    }

                    setSortRules((current) => [
                      ...current,
                      createSortRule(firstSortableColumnId),
                    ]);
                  }}
                >
                  + {addSortLabel}
                </Button>
              </div>

              <div style={rulesWrapStyle}>
                {sortRules.map((rule, index) => (
                  <div key={rule.id} style={sortRuleRowStyle}>
                    <Select
                      size={controlSize}
                      options={sortableColumnSelectOptions}
                      value={rule.columnId}
                      placeholder="Column"
                      searchPlaceholder="Search columns"
                      emptyText="No columns found."
                      aria-label={`Sort column ${index + 1}`}
                      style={ruleControlStyle}
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
                      options={sortDirectionSelectOptions}
                      value={rule.direction}
                      placeholder="Direction"
                      searchPlaceholder="Search directions"
                      emptyText="No directions found."
                      aria-label={`Sort direction ${index + 1}`}
                      style={ruleControlStyle}
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

                    <Button
                      size={controlSize}
                      variant="ghost"
                      iconOnly
                      iconOnlyTone
                      tooltip="Reset this sort"
                      tooltipSide="top"
                      tooltipSize="xs"
                      aria-label={`Reset sort ${index + 1}`}
                      onAction={() => {
                        resetSortRule(rule.id);
                      }}
                    >
                      <FiX size={14} />
                    </Button>
                  </div>
                ))}

                {sortRules.length === 0 ? (
                  <p style={hintTextStyle}>
                    Add sort rows to apply multi-column sorting.
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        <DialogFooter style={footerStyle} sticky>
          <div style={footerLeftStyle}>
            <Button
              size={controlSize}
              variant="outline"
              onAction={handleClearFilters}
            >
              {clearFiltersLabel}
            </Button>

            {enableSorting && sortableColumns.length > 0 ? (
              <Button
                size={controlSize}
                variant="outline"
                onAction={handleResetSorting}
              >
                {resetSortingLabel}
              </Button>
            ) : null}
          </div>

          <Button size={controlSize} variant="primary" onAction={handleApply}>
            {applyFiltersLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
