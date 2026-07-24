import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";

import { Button, type ButtonProps } from "./Button";
import {
  Select,
  type SelectProps,
  type SelectSize,
  type SelectVariant,
} from "./Select";
import { Scrollbar } from "./Scrollbar";
import {
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiX,
} from "./icons/feather";

export type DatePickerVariant =
  | "default"
  | "compact"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

type DatePickerToneVariant = Exclude<DatePickerVariant, "default" | "compact">;
type DatePickerLayoutVariant = "default" | "compact";

export type DatePickerSize = "xs" | "sm" | "md" | "lg";
export type DatePickerMode = "date" | "range" | "time";
export type DatePickerActionSource =
  | "open"
  | "close"
  | "clear"
  | "input-change"
  | "input-commit"
  | "date-select"
  | "time-select"
  | "month-shift"
  | "month-set"
  | "year-set";

export interface DatePickerActionContext {
  source: DatePickerActionSource;
  mode: DatePickerMode;
  value: DatePickerValue;
  inputText: string;
  open: boolean;
  required: boolean;
}

export interface DateRangeValue {
  start: string | null;
  end: string | null;
}

export type DatePickerValue = string | DateRangeValue | null;

export type DatePickerCalendarSelectProps = Omit<
  SelectProps,
  "options" | "groups" | "multiple" | "value" | "defaultValue" | "onValueChange"
>;

export type DatePickerControlButtonProps = Omit<
  ButtonProps,
  "type" | "children" | "onClick" | "onMouseDown" | "disabled"
>;

export interface DatePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> {
  mode?: DatePickerMode;
  variant?: DatePickerVariant;
  size?: DatePickerSize;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  placeholder?: string;
  datePlaceholder?: string;
  rangePlaceholder?: string;
  timePlaceholder?: string;
  rangeSeparator?: string;
  inputAriaLabel?: string;
  panelAriaLabel?: string;
  clearLabel?: string;
  openPickerLabel?: string;
  closePickerLabel?: string;
  rangeFromLabel?: string;
  rangeToLabel?: string;
  rangeStartEmptyText?: string;
  rangeEndEmptyText?: string;
  timePanelTitle?: string;
  timeOptionAriaFormatter?: (time12Hour: string, time24Hour: string) => string;
  calendarSelectVariant?: SelectVariant;
  monthSelectProps?: DatePickerCalendarSelectProps;
  yearSelectProps?: DatePickerCalendarSelectProps;
  navigationButtonProps?: DatePickerControlButtonProps;
  dayButtonProps?: DatePickerControlButtonProps;
  timeOptionButtonProps?: DatePickerControlButtonProps;
  rangeFieldButtonProps?: DatePickerControlButtonProps;
  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  onValueChange?: (value: DatePickerValue) => void;
  onAction?: (context: DatePickerActionContext) => void;
}

type DatePickerSizeTokens = {
  height: string;
  fontSize: string;
  panelPadding: string;
  compactPanelPadding: string;
  dayCellSize: string;
  compactDayCellSize: string;
};

type CalendarMonthState = {
  year: number;
  month: number;
};

type CalendarDayCell = {
  iso: string;
  day: number;
  inCurrentMonth: boolean;
};

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const sizeTokens: Record<DatePickerSize, DatePickerSizeTokens> = {
  xs: {
    height: "1.9rem",
    fontSize: "0.75rem",
    panelPadding: "0.55rem",
    compactPanelPadding: "0.42rem",
    dayCellSize: "1.65rem",
    compactDayCellSize: "1.5rem",
  },
  sm: {
    height: "2.15rem",
    fontSize: "0.8125rem",
    panelPadding: "0.65rem",
    compactPanelPadding: "0.5rem",
    dayCellSize: "1.8rem",
    compactDayCellSize: "1.62rem",
  },
  md: {
    height: "2.4rem",
    fontSize: "0.875rem",
    panelPadding: "0.75rem",
    compactPanelPadding: "0.56rem",
    dayCellSize: "2rem",
    compactDayCellSize: "1.72rem",
  },
  lg: {
    height: "2.65rem",
    fontSize: "0.9375rem",
    panelPadding: "0.875rem",
    compactPanelPadding: "0.64rem",
    dayCellSize: "2.2rem",
    compactDayCellSize: "1.86rem",
  },
};

const variantStyles: Record<DatePickerVariant, CSSProperties> = {
  default: {
    borderColor: "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
  },
  compact: {
    borderColor: "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
  },
  primary: {
    borderColor:
      "color-mix(in srgb, var(--ktn-action-primary-bg) 42%, var(--ktn-border-muted))",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
  },
  secondary: {
    borderColor: "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))",
    color: "var(--ktn-text-primary)",
  },
  destructive: {
    borderColor:
      "color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 42%, var(--ktn-border-muted))",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
  },
  outline: {
    borderColor: "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color: "var(--ktn-text-primary)",
  },
  ghost: {
    borderColor: "transparent",
    backgroundColor: "var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))",
    color: "var(--ktn-text-primary)",
  },
  link: {
    borderColor: "transparent",
    backgroundColor: "transparent",
    color: "var(--ktn-action-primary-bg)",
    textDecoration: "underline",
    textUnderlineOffset: "0.14em",
  },
};

const focusStyles: Record<DatePickerVariant, CSSProperties> = {
  default: {
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
  },
  compact: {
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
  },
  primary: {
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.24)",
  },
  secondary: {
    boxShadow: "0 0 0 2px rgba(100, 116, 139, 0.2)",
  },
  destructive: {
    boxShadow: "0 0 0 2px rgba(220, 38, 38, 0.24)",
  },
  outline: {
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.2)",
  },
  ghost: {
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.16)",
  },
  link: {
    boxShadow: "0 0 0 2px rgba(37, 99, 235, 0.16)",
  },
};

const baseClasses = "relative inline-flex flex-col";

function padTwo(value: number): string {
  return String(value).padStart(2, "0");
}

function formatIsoDate(year: number, month: number, day: number): string {
  return `${year}-${padTwo(month)}-${padTwo(day)}`;
}

function parseIsoDate(
  value: string,
): { year: number; month: number; day: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return {
    year,
    month,
    day,
  };
}

function isDateRangeValue(
  value: DatePickerValue | undefined,
): value is DateRangeValue {
  if (value == null || typeof value !== "object") {
    return false;
  }

  return "start" in value && "end" in value;
}

function isValidDateValue(value: string): boolean {
  return parseIsoDate(value) != null;
}

function isValidTimeValue(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function toMonthState(isoDate: string | null | undefined): CalendarMonthState {
  if (isoDate != null) {
    const parsed = parseIsoDate(isoDate);

    if (parsed != null) {
      return {
        year: parsed.year,
        month: parsed.month - 1,
      };
    }
  }

  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth(),
  };
}

function shiftMonth(
  monthState: CalendarMonthState,
  delta: number,
): CalendarMonthState {
  const monthIndex = monthState.year * 12 + monthState.month + delta;
  const nextYear = Math.floor(monthIndex / 12);
  const nextMonth = ((monthIndex % 12) + 12) % 12;

  return {
    year: nextYear,
    month: nextMonth,
  };
}

function monthLabel(monthState: CalendarMonthState): string {
  return new Date(monthState.year, monthState.month, 1).toLocaleString(
    undefined,
    {
      month: "long",
      year: "numeric",
    },
  );
}

function buildCalendarCells(monthState: CalendarMonthState): CalendarDayCell[] {
  const firstDayOfMonth = new Date(
    monthState.year,
    monthState.month,
    1,
  ).getDay();
  const daysInCurrentMonth = new Date(
    monthState.year,
    monthState.month + 1,
    0,
  ).getDate();
  const daysInPreviousMonth = new Date(
    monthState.year,
    monthState.month,
    0,
  ).getDate();

  const cells: CalendarDayCell[] = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i -= 1) {
    const day = daysInPreviousMonth - i;
    const prevMonth = shiftMonth(monthState, -1);

    cells.push({
      iso: formatIsoDate(prevMonth.year, prevMonth.month + 1, day),
      day,
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInCurrentMonth; day += 1) {
    cells.push({
      iso: formatIsoDate(monthState.year, monthState.month + 1, day),
      day,
      inCurrentMonth: true,
    });
  }

  let trailingDay = 1;

  while (cells.length < 42) {
    const nextMonth = shiftMonth(monthState, 1);

    cells.push({
      iso: formatIsoDate(nextMonth.year, nextMonth.month + 1, trailingDay),
      day: trailingDay,
      inCurrentMonth: false,
    });

    trailingDay += 1;
  }

  return cells;
}

function normalizeScalarValue(
  value: DatePickerValue | undefined,
  mode: "date" | "time",
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed === "") {
    return null;
  }

  if (mode === "date") {
    return isValidDateValue(trimmed) ? trimmed : null;
  }

  return isValidTimeValue(trimmed) ? trimmed : null;
}

function parseRangeInput(
  input: string,
  separator: string,
): DateRangeValue | null {
  const trimmed = input.trim();

  if (trimmed === "") {
    return {
      start: null,
      end: null,
    };
  }

  const effectiveSeparator = separator === "" ? " - " : separator;
  const parts = trimmed.split(effectiveSeparator).map((item) => item.trim());

  if (parts.length > 2) {
    return null;
  }

  if (parts.length === 1) {
    const singleDate = parts[0];

    if (!isValidDateValue(singleDate)) {
      return null;
    }

    return {
      start: singleDate,
      end: null,
    };
  }

  const [startRaw, endRaw] = parts;
  const start = startRaw === "" ? null : startRaw;
  const end = endRaw === "" ? null : endRaw;

  if (start != null && !isValidDateValue(start)) {
    return null;
  }

  if (end != null && !isValidDateValue(end)) {
    return null;
  }

  if (start != null && end != null && start > end) {
    return {
      start: end,
      end: start,
    };
  }

  return {
    start,
    end,
  };
}

function normalizeRangeValue(
  value: DatePickerValue | undefined,
  separator: string,
): DateRangeValue {
  if (isDateRangeValue(value)) {
    const start =
      typeof value.start === "string" && isValidDateValue(value.start)
        ? value.start
        : null;
    const end =
      typeof value.end === "string" && isValidDateValue(value.end)
        ? value.end
        : null;

    if (start != null && end != null && start > end) {
      return {
        start: end,
        end: start,
      };
    }

    return {
      start,
      end,
    };
  }

  if (typeof value === "string") {
    const parsed = parseRangeInput(value, separator);

    if (parsed != null) {
      return parsed;
    }
  }

  return {
    start: null,
    end: null,
  };
}

function normalizeValueByMode(
  value: DatePickerValue | undefined,
  mode: DatePickerMode,
  separator: string,
): DatePickerValue {
  if (mode === "range") {
    return normalizeRangeValue(value, separator);
  }

  return normalizeScalarValue(value, mode);
}

function formatRangeValue(value: DateRangeValue, separator: string): string {
  if (value.start != null && value.end != null) {
    return `${value.start}${separator}${value.end}`;
  }

  if (value.start != null) {
    return value.start;
  }

  if (value.end != null) {
    return value.end;
  }

  return "";
}

function createTimeOptions(stepMinutes: number): string[] {
  const options: string[] = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += stepMinutes) {
      options.push(`${padTwo(hour)}:${padTwo(minute)}`);
    }
  }

  return options;
}

function createYearOptions(anchorYear: number): number[] {
  const options: number[] = [];

  for (let year = anchorYear - 75; year <= anchorYear + 25; year += 1) {
    options.push(year);
  }

  return options;
}

function formatTime12Hour(value: string): string {
  const [hourText, minuteText] = value.split(":");
  const hour = Number(hourText);

  if (!Number.isFinite(hour)) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${normalizedHour}:${minuteText} ${suffix}`;
}

function formatAccessibleDate(value: string): string {
  const parsed = parseIsoDate(value);

  if (parsed == null) {
    return value;
  }

  return new Date(parsed.year, parsed.month - 1, parsed.day).toLocaleDateString(
    undefined,
    {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

function formatDisplayValue(
  value: DatePickerValue,
  mode: DatePickerMode,
  separator: string,
): string {
  if (mode === "range") {
    return isDateRangeValue(value) ? formatRangeValue(value, separator) : "";
  }

  return typeof value === "string" ? value : "";
}

export function DatePicker({
  mode = "date",
  variant,
  size = "md",
  disabled = false,
  required = false,
  invalid = false,
  placeholder,
  datePlaceholder = "Select date",
  rangePlaceholder = "Select date range",
  timePlaceholder = "Select time",
  rangeSeparator = " - ",
  inputAriaLabel,
  panelAriaLabel,
  clearLabel = "Clear value",
  openPickerLabel = "Open picker",
  closePickerLabel = "Close picker",
  rangeFromLabel = "From",
  rangeToLabel = "To",
  rangeStartEmptyText = "Start date",
  rangeEndEmptyText = "End date",
  timePanelTitle = "Select Time",
  timeOptionAriaFormatter,
  calendarSelectVariant = "overlay",
  monthSelectProps,
  yearSelectProps,
  navigationButtonProps,
  dayButtonProps,
  timeOptionButtonProps,
  rangeFieldButtonProps,
  value,
  defaultValue,
  onValueChange,
  onAction,
  className = "",
  style,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: DatePickerProps): JSX.Element {
  const resolvedVariant = variant ?? "default";
  const resolvedLayoutVariant: DatePickerLayoutVariant =
    resolvedVariant === "compact" ? "compact" : "default";
  const resolvedToneVariant: DatePickerToneVariant =
    resolvedVariant === "default" || resolvedVariant === "compact"
      ? "outline"
      : resolvedVariant;
  const isCompactLayout = resolvedLayoutVariant === "compact";
  const isControlled = value !== undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeRangeField, setActiveRangeField] = useState<"start" | "end">(
    "start",
  );

  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerValue>(
    () => normalizeValueByMode(defaultValue, mode, rangeSeparator),
  );

  const resolvedValue = useMemo(
    () =>
      normalizeValueByMode(
        isControlled ? value : uncontrolledValue,
        mode,
        rangeSeparator,
      ),
    [isControlled, mode, rangeSeparator, uncontrolledValue, value],
  );

  const [inputText, setInputText] = useState(() =>
    formatDisplayValue(
      normalizeValueByMode(defaultValue, mode, rangeSeparator),
      mode,
      rangeSeparator,
    ),
  );

  const [calendarMonth, setCalendarMonth] = useState<CalendarMonthState>(() => {
    const normalizedDefault = normalizeValueByMode(
      defaultValue,
      mode,
      rangeSeparator,
    );

    if (mode === "range" && isDateRangeValue(normalizedDefault)) {
      return toMonthState(normalizedDefault.start ?? normalizedDefault.end);
    }

    if (mode === "date" && typeof normalizedDefault === "string") {
      return toMonthState(normalizedDefault);
    }

    return toMonthState(null);
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerId = useId();

  const tokens = sizeTokens[size];
  const compactPanelPadding = isCompactLayout
    ? tokens.compactPanelPadding
    : tokens.panelPadding;
  const resolvedDayCellSize = isCompactLayout
    ? tokens.compactDayCellSize
    : tokens.dayCellSize;
  const resolvedMonthSelectSize: SelectSize =
    monthSelectProps?.size ??
    (isCompactLayout
      ? size === "lg"
        ? "sm"
        : "xs"
      : size === "xs"
        ? "xs"
        : "sm");
  const resolvedYearSelectSize: SelectSize =
    yearSelectProps?.size ?? resolvedMonthSelectSize;

  const monthSelectOverrides = monthSelectProps ?? {};
  const yearSelectOverrides = yearSelectProps ?? {};
  const navigationButtonOverrides = navigationButtonProps ?? {};
  const dayButtonOverrides = dayButtonProps ?? {};
  const timeOptionButtonOverrides = timeOptionButtonProps ?? {};
  const rangeFieldButtonOverrides = rangeFieldButtonProps ?? {};

  const idBase = id ?? pickerId;
  const inputElementId = `${idBase}-input`;
  const panelElementId = `${idBase}-panel`;
  const resolvedPanelAriaLabel =
    panelAriaLabel ??
    (mode === "time"
      ? "Time picker panel"
      : mode === "range"
        ? "Date range picker panel"
        : "Date picker panel");
  const resolvedInputAriaLabel =
    ariaLabel ??
    inputAriaLabel ??
    (ariaLabelledBy == null
      ? mode === "time"
        ? "Time picker"
        : mode === "range"
          ? "Date range picker"
          : "Date picker"
      : undefined);

  const rangeValue =
    mode === "range" && isDateRangeValue(resolvedValue)
      ? resolvedValue
      : {
          start: null,
          end: null,
        };

  const selectedDate =
    mode === "date" && typeof resolvedValue === "string" ? resolvedValue : null;
  const selectedTime =
    mode === "time" && typeof resolvedValue === "string" ? resolvedValue : null;

  const displayValue = useMemo(
    () => formatDisplayValue(resolvedValue, mode, rangeSeparator),
    [mode, rangeSeparator, resolvedValue],
  );

  const hasSelection =
    mode === "range"
      ? rangeValue.start != null || rangeValue.end != null
      : displayValue.trim() !== "";

  const timeOptions = useMemo(() => createTimeOptions(15), []);
  const monthOptions = useMemo(
    () =>
      MONTH_LABELS.map((label, index) => ({
        value: String(index),
        label,
      })),
    [],
  );
  const yearOptions = useMemo(
    () =>
      createYearOptions(calendarMonth.year).map((yearValue) => ({
        value: String(yearValue),
        label: String(yearValue),
      })),
    [calendarMonth.year],
  );
  const todayIso = useMemo(() => {
    const now = new Date();

    return formatIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledValue((current) =>
        normalizeValueByMode(current, mode, rangeSeparator),
      );
    }
  }, [isControlled, mode, rangeSeparator]);

  useEffect(() => {
    setInputText(displayValue);
  }, [displayValue]);

  useEffect(() => {
    if (!(isOpen && !disabled)) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (
        rootRef.current != null &&
        !rootRef.current.contains(event.target as Node)
      ) {
        commitInputText();
        closePanel(false);
        setIsFocused(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [disabled, inputText, isOpen, mode, rangeSeparator, resolvedValue]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "date") {
      setCalendarMonth(toMonthState(selectedDate));
      return;
    }

    if (mode === "range") {
      const nextActiveField: "start" | "end" =
        rangeValue.start != null && rangeValue.end == null ? "end" : "start";

      setActiveRangeField(nextActiveField);

      const anchorDate =
        nextActiveField === "start"
          ? (rangeValue.start ?? rangeValue.end)
          : (rangeValue.end ?? rangeValue.start);

      setCalendarMonth(toMonthState(anchorDate));
    }
  }, [isOpen, mode, rangeValue.end, rangeValue.start, selectedDate]);

  useEffect(() => {
    if (disabled && isOpen) {
      closePanel(false);
    }
  }, [disabled, isOpen]);

  function emitAction(
    source: DatePickerActionSource,
    options?: {
      value?: DatePickerValue;
      inputText?: string;
      open?: boolean;
    },
  ): void {
    if (onAction == null) {
      return;
    }

    const nextValue = normalizeValueByMode(
      options?.value ?? resolvedValue,
      mode,
      rangeSeparator,
    );

    onAction({
      source,
      mode,
      value: nextValue,
      inputText: options?.inputText ?? inputText,
      open: options?.open ?? isOpen,
      required,
    });
  }

  function updateValue(nextValue: DatePickerValue): DatePickerValue {
    const normalized = normalizeValueByMode(nextValue, mode, rangeSeparator);

    if (!isControlled) {
      setUncontrolledValue(normalized);
    }

    onValueChange?.(normalized);

    return normalized;
  }

  function setValueAndSync(
    nextValue: DatePickerValue,
    source: DatePickerActionSource,
  ): void {
    const normalized = updateValue(nextValue);
    const nextDisplayValue = formatDisplayValue(
      normalized,
      mode,
      rangeSeparator,
    );
    setInputText(nextDisplayValue);
    emitAction(source, {
      value: normalized,
      inputText: nextDisplayValue,
    });
  }

  function commitInputText(): void {
    const trimmed = inputText.trim();

    if (mode === "range") {
      const parsedRange = parseRangeInput(inputText, rangeSeparator);

      if (parsedRange != null) {
        setValueAndSync(parsedRange, "input-commit");

        if (parsedRange.start != null && parsedRange.end == null) {
          setActiveRangeField("end");
          setCalendarMonth(toMonthState(parsedRange.start));
        }

        if (parsedRange.end != null) {
          setCalendarMonth(toMonthState(parsedRange.end));
        }

        return;
      }

      setInputText(displayValue);
      return;
    }

    if (trimmed === "") {
      setValueAndSync(null, "input-commit");
      return;
    }

    if (mode === "date") {
      if (isValidDateValue(trimmed)) {
        setValueAndSync(trimmed, "input-commit");
        return;
      }

      setInputText(displayValue);
      return;
    }

    if (isValidTimeValue(trimmed)) {
      setValueAndSync(trimmed, "input-commit");
      return;
    }

    setInputText(displayValue);
  }

  function openPanel(): void {
    if (disabled) {
      return;
    }

    setIsOpen((current) => {
      if (current) {
        return current;
      }

      emitAction("open", {
        open: true,
      });

      return true;
    });
  }

  function closePanel(restoreDisplay = false): void {
    setIsOpen((current) => {
      if (!current) {
        return current;
      }

      emitAction("close", {
        open: false,
      });

      return false;
    });

    if (restoreDisplay) {
      setInputText(displayValue);
    }
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (disabled) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      openPanel();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closePanel(true);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      commitInputText();
      closePanel(false);
      return;
    }

    if (event.key === "Tab") {
      commitInputText();
      closePanel(false);
    }
  }

  function clearSelection(): void {
    if (disabled) {
      return;
    }

    if (mode === "range") {
      setValueAndSync({ start: null, end: null }, "clear");
      setActiveRangeField("start");
      setCalendarMonth(toMonthState(null));
    } else {
      setValueAndSync(null, "clear");
    }

    inputRef.current?.focus();
  }

  function handleDateSelect(isoDate: string): void {
    if (disabled) {
      return;
    }

    if (mode === "range") {
      if (activeRangeField === "start") {
        const nextRange: DateRangeValue = {
          start: isoDate,
          end:
            rangeValue.end != null && rangeValue.end >= isoDate
              ? rangeValue.end
              : null,
        };

        setValueAndSync(nextRange, "date-select");
        setActiveRangeField("end");
        setCalendarMonth(toMonthState(nextRange.end ?? isoDate));

        return;
      }

      if (rangeValue.start == null) {
        const nextRange: DateRangeValue = {
          start: isoDate,
          end: null,
        };

        setValueAndSync(nextRange, "date-select");
        setActiveRangeField("end");
        setCalendarMonth(toMonthState(isoDate));
        return;
      }

      const nextRange: DateRangeValue =
        isoDate < rangeValue.start
          ? {
              start: isoDate,
              end: rangeValue.start,
            }
          : {
              start: rangeValue.start,
              end: isoDate,
            };

      setValueAndSync(nextRange, "date-select");
      closePanel(false);
      return;
    }

    setValueAndSync(isoDate, "date-select");
    closePanel(false);
  }

  function handleTimeSelect(nextTime: string): void {
    if (disabled) {
      return;
    }

    setValueAndSync(nextTime, "time-select");
    closePanel(false);
  }

  function updateCalendarMonth(partial: Partial<CalendarMonthState>): void {
    setCalendarMonth((current) => {
      const nextMonth = partial.month ?? current.month;
      const nextYear = partial.year ?? current.year;

      return {
        month: Math.min(11, Math.max(0, nextMonth)),
        year: nextYear,
      };
    });
  }

  function shiftCalendarMonth(delta: number): void {
    setCalendarMonth((current) => shiftMonth(current, delta));
  }

  function focusRangeField(field: "start" | "end"): void {
    if (mode !== "range") {
      return;
    }

    setActiveRangeField(field);

    const anchorDate =
      field === "start"
        ? (rangeValue.start ?? rangeValue.end)
        : (rangeValue.end ?? rangeValue.start);

    setCalendarMonth(toMonthState(anchorDate));
  }

  const rootStyle: CSSProperties = {
    width: "100%",
    position: "relative",
    ...style,
  };

  const fieldWrapStyle: CSSProperties = {
    position: "relative",
    width: "100%",
  };

  const leadingIconStyle: CSSProperties = {
    position: "absolute",
    insetInlineStart: "0.625rem",
    insetBlockStart: "50%",
    transform: "translateY(-50%)",
    width: "0.95rem",
    height: "0.95rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    lineHeight: 0,
    pointerEvents: "none",
    zIndex: 1,
  };

  const fieldBaseStyle: CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    height: tokens.height,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "var(--ktn-radius-md, 0.5rem)",
    outline: "none",
    paddingInlineStart: "2rem",
    paddingInlineEnd: hasSelection ? "4.2rem" : "2.35rem",
    fontSize: tokens.fontSize,
    lineHeight: 1.25,
    transition:
      "border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease",
  };

  const fieldStyle: CSSProperties = {
    ...fieldBaseStyle,
    ...variantStyles[resolvedToneVariant],
    color:
      inputText.trim() === ""
        ? "var(--ktn-text-secondary, var(--ktn-text-primary))"
        : "var(--ktn-text-primary)",
    ...(invalid
      ? {
          borderColor: "var(--ktn-action-danger-bg, #dc2626)",
          boxShadow:
            isFocused || isOpen
              ? "0 0 0 2px rgba(220, 38, 38, 0.24)"
              : undefined,
        }
      : isFocused || isOpen
        ? focusStyles[resolvedToneVariant]
        : {}),
    ...(disabled
      ? {
          opacity: 0.62,
          cursor: "not-allowed",
        }
      : {
          cursor: "text",
        }),
  };

  const controlWrapStyle: CSSProperties = {
    position: "absolute",
    insetInlineEnd: "0.35rem",
    insetBlockStart: "50%",
    transform: "translateY(-50%)",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
  };

  const iconButtonStyle: CSSProperties = {
    width: isCompactLayout ? "1.35rem" : "1.45rem",
    height: isCompactLayout ? "1.35rem" : "1.45rem",
    minHeight: isCompactLayout ? "1.35rem" : "1.45rem",
    paddingInline: 0,
    paddingBlock: 0,
    borderRadius: "999px",
  };

  const chevronStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "0.9rem",
    height: "0.9rem",
    lineHeight: 0,
    transition: "transform 160ms ease",
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
  };

  const panelStyle: CSSProperties = {
    position: "absolute",
    insetInlineStart: 0,
    insetBlockStart: "calc(100% + 0.35rem)",
    zIndex: 20,
    width:
      mode === "time"
        ? isCompactLayout
          ? "min(100%, 15.5rem, calc(100vw - 0.5rem))"
          : "min(100%, 16.75rem, calc(100vw - 0.75rem))"
        : isCompactLayout
          ? "min(100%, 15.5rem, calc(100vw - 0.5rem))"
          : "min(100%, 17.25rem, calc(100vw - 0.75rem))",
    maxWidth: isCompactLayout
      ? "calc(100vw - 0.5rem)"
      : "calc(100vw - 0.75rem)",
    boxSizing: "border-box",
    overflowX: "hidden",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: invalid
      ? "var(--ktn-action-danger-bg, #dc2626)"
      : "var(--ktn-border-muted)",
    borderRadius: "var(--ktn-radius-md, 0.5rem)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.12)",
    padding: compactPanelPadding,
    display: "flex",
    flexDirection: "column",
    gap: isCompactLayout ? "0.5rem" : "0.65rem",
  };

  const panelHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: mode === "time" ? "center" : "space-between",
    gap: "0.5rem",
  };

  const panelNavigationButtonStyle: CSSProperties = {
    width: isCompactLayout ? "1.36rem" : "1.65rem",
    height: isCompactLayout ? "1.36rem" : "1.65rem",
    minHeight: isCompactLayout ? "1.36rem" : "1.65rem",
    paddingInline: 0,
    paddingBlock: 0,
    borderRadius: "999px",
  };

  const monthYearControlWrapStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: isCompactLayout ? "0.2rem" : "0.35rem",
    flex: 1,
    minWidth: 0,
  };

  const monthYearSelectStyle: CSSProperties = {
    minWidth: 0,
  };

  const calendarHeaderStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: isCompactLayout ? "0.3rem" : "0.35rem",
  };

  const panelHeaderTitleStyle: CSSProperties = {
    fontSize: isCompactLayout ? "0.75rem" : "0.8rem",
    fontWeight: 600,
    color: "var(--ktn-text-primary)",
    textAlign: "center",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: isCompactLayout ? "0.25rem" : "0.3rem",
  };

  const calendarStackStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: isCompactLayout ? "0.45rem" : "0.55rem",
  };

  const rangeFieldRowStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: isCompactLayout ? "0.25rem" : "0.45rem",
  };

  const rangeFieldButtonStyle: CSSProperties = {
    width: "100%",
    height: "auto",
    minHeight: "unset",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: "0.12rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "var(--ktn-radius-sm, 0.375rem)",
    paddingInline: isCompactLayout ? "0.4rem" : "0.55rem",
    paddingBlock: isCompactLayout ? "0.3rem" : "0.35rem",
    lineHeight: 1.2,
  };

  const rangeFieldLabelStyle: CSSProperties = {
    fontSize: isCompactLayout ? "0.64rem" : "0.68rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  };

  const rangeFieldValueStyle: CSSProperties = {
    fontSize: isCompactLayout ? "0.74rem" : "0.78rem",
    color: "var(--ktn-text-primary)",
    minHeight: "1rem",
    fontVariantNumeric: "tabular-nums",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const calendarBoxStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: isCompactLayout ? "0.3rem" : "0.35rem",
    minWidth: 0,
  };

  const weekHeaderStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: isCompactLayout ? "0.16rem" : "0.25rem",
  };

  const weekDayStyle: CSSProperties = {
    textAlign: "center",
    fontSize: isCompactLayout ? "0.68rem" : "0.72rem",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    fontWeight: 500,
  };

  const dayGridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gap: isCompactLayout ? "0.16rem" : "0.25rem",
    alignItems: "center",
  };

  const timeListStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: isCompactLayout ? "0.3rem" : "0.35rem",
  };

  const timeListViewportStyle: CSSProperties = {
    maxHeight: isCompactLayout ? "13.5rem" : "15rem",
    paddingInlineEnd: "0.2rem",
  };

  const timeButtonStyle: CSSProperties = {
    width: "100%",
    justifyContent: "space-between",
    height: isCompactLayout ? "1.7rem" : "1.95rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    paddingInline: isCompactLayout ? "0.5rem" : "0.65rem",
  };

  const timeTextRowStyle: CSSProperties = {
    width: "100%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.65rem",
    fontVariantNumeric: "tabular-nums",
  };

  const timeTextPrimaryStyle: CSSProperties = {
    fontSize: tokens.fontSize,
    color: "var(--ktn-text-primary)",
    fontWeight: 500,
  };

  const timeTextSecondaryStyle: CSSProperties = {
    fontSize: isCompactLayout ? "0.74em" : "0.78em",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    letterSpacing: "0.02em",
  };

  const resolvedPlaceholder =
    placeholder ??
    (mode === "time"
      ? timePlaceholder
      : mode === "range"
        ? rangePlaceholder
        : datePlaceholder);

  const calendarCells = buildCalendarCells(calendarMonth);

  function isInRange(isoDate: string): boolean {
    if (rangeValue.start == null || rangeValue.end == null) {
      return false;
    }

    return isoDate > rangeValue.start && isoDate < rangeValue.end;
  }

  function renderCalendar(ariaPrefix: string): JSX.Element {
    return (
      <div style={calendarBoxStyle}>
        <div style={calendarHeaderStyle}>
          <Button
            {...navigationButtonOverrides}
            type="button"
            size={navigationButtonOverrides.size ?? "xs"}
            variant={navigationButtonOverrides.variant ?? "ghost"}
            compact={navigationButtonOverrides.compact ?? isCompactLayout}
            disabled={disabled}
            aria-label={`${ariaPrefix} previous month`}
            style={{
              ...panelNavigationButtonStyle,
              ...navigationButtonOverrides.style,
            }}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => {
              shiftCalendarMonth(-1);
              emitAction("month-shift");
            }}
          >
            <span aria-hidden style={{ display: "inline-flex", lineHeight: 0 }}>
              <FiChevronLeft size={14} />
            </span>
          </Button>

          <div style={monthYearControlWrapStyle}>
            <Select
              {...monthSelectOverrides}
              aria-label={`${ariaPrefix} month`}
              value={String(calendarMonth.month)}
              disabled={disabled}
              size={resolvedMonthSelectSize}
              variant={monthSelectOverrides.variant ?? calendarSelectVariant}
              showClear={monthSelectOverrides.showClear ?? false}
              options={monthOptions}
              placeholder={monthSelectOverrides.placeholder ?? "Month"}
              searchPlaceholder={
                monthSelectOverrides.searchPlaceholder ?? "Search month..."
              }
              emptyText={monthSelectOverrides.emptyText ?? "No month found."}
              style={{
                ...monthYearSelectStyle,
                ...monthSelectOverrides.style,
              }}
              onValueChange={(nextValue) => {
                const nextMonth =
                  typeof nextValue === "string" ? Number(nextValue) : NaN;

                if (Number.isFinite(nextMonth)) {
                  updateCalendarMonth({ month: nextMonth });
                  emitAction("month-set");
                }
              }}
            />

            <Select
              {...yearSelectOverrides}
              aria-label={`${ariaPrefix} year`}
              value={String(calendarMonth.year)}
              disabled={disabled}
              size={resolvedYearSelectSize}
              variant={yearSelectOverrides.variant ?? calendarSelectVariant}
              showClear={yearSelectOverrides.showClear ?? false}
              options={yearOptions}
              placeholder={yearSelectOverrides.placeholder ?? "Year"}
              searchPlaceholder={
                yearSelectOverrides.searchPlaceholder ?? "Search year..."
              }
              emptyText={yearSelectOverrides.emptyText ?? "No year found."}
              style={{
                ...monthYearSelectStyle,
                ...yearSelectOverrides.style,
              }}
              onValueChange={(nextValue) => {
                const nextYear =
                  typeof nextValue === "string" ? Number(nextValue) : NaN;

                if (Number.isFinite(nextYear)) {
                  updateCalendarMonth({ year: nextYear });
                  emitAction("year-set");
                }
              }}
            />
          </div>

          <Button
            {...navigationButtonOverrides}
            type="button"
            size={navigationButtonOverrides.size ?? "xs"}
            variant={navigationButtonOverrides.variant ?? "ghost"}
            compact={navigationButtonOverrides.compact ?? isCompactLayout}
            disabled={disabled}
            aria-label={`${ariaPrefix} next month`}
            style={{
              ...panelNavigationButtonStyle,
              ...navigationButtonOverrides.style,
            }}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => {
              shiftCalendarMonth(1);
              emitAction("month-shift");
            }}
          >
            <span aria-hidden style={{ display: "inline-flex", lineHeight: 0 }}>
              <FiChevronRight size={14} />
            </span>
          </Button>
        </div>

        <div style={weekHeaderStyle}>
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={`weekday-${calendarMonth.year}-${calendarMonth.month}-${label}`}
              style={weekDayStyle}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={dayGridStyle}>
          {calendarCells.map((cell) => {
            const isSelectedDate = mode === "date" && selectedDate === cell.iso;
            const isRangeStart =
              mode === "range" && rangeValue.start === cell.iso;
            const isRangeEnd = mode === "range" && rangeValue.end === cell.iso;
            const isRangeBoundary =
              mode === "range" && (isRangeStart || isRangeEnd);
            const isBetweenRange = mode === "range" && isInRange(cell.iso);
            const isToday = cell.iso === todayIso;

            const cellAriaParts: string[] = [formatAccessibleDate(cell.iso)];

            if (isToday) {
              cellAriaParts.push("today");
            }

            if (isSelectedDate) {
              cellAriaParts.push("selected");
            }

            if (isRangeStart) {
              cellAriaParts.push("range start");
            }

            if (isRangeEnd) {
              cellAriaParts.push("range end");
            }

            if (isBetweenRange) {
              cellAriaParts.push("in selected range");
            }

            if (!cell.inCurrentMonth) {
              cellAriaParts.push("outside current month");
            }

            return (
              <Button
                {...dayButtonOverrides}
                key={`day-${calendarMonth.year}-${calendarMonth.month}-${cell.iso}`}
                type="button"
                variant={dayButtonOverrides.variant ?? "ghost"}
                size={dayButtonOverrides.size ?? "xs"}
                compact={dayButtonOverrides.compact ?? isCompactLayout}
                disabled={disabled}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  handleDateSelect(cell.iso);
                }}
                aria-label={cellAriaParts.join(", ")}
                aria-pressed={isSelectedDate || isRangeBoundary}
                aria-current={isToday ? "date" : undefined}
                style={{
                  width: "100%",
                  minHeight: resolvedDayCellSize,
                  paddingInline: 0,
                  paddingBlock: 0,
                  justifyContent: "center",
                  borderRadius: "0.375rem",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor:
                    isSelectedDate || isRangeBoundary
                      ? "var(--ktn-action-primary-bg)"
                      : isToday
                        ? "color-mix(in srgb, var(--ktn-action-primary-bg) 40%, var(--ktn-border-muted))"
                        : "transparent",
                  backgroundColor:
                    isSelectedDate || isRangeBoundary
                      ? "var(--ktn-action-primary-bg)"
                      : isBetweenRange
                        ? "var(--ktn-bg-muted, rgba(100, 116, 139, 0.2))"
                        : "transparent",
                  color:
                    isSelectedDate || isRangeBoundary
                      ? "var(--ktn-action-primary-fg, #ffffff)"
                      : cell.inCurrentMonth
                        ? "var(--ktn-text-primary)"
                        : "var(--ktn-text-secondary, var(--ktn-text-primary))",
                  opacity: cell.inCurrentMonth ? 1 : 0.6,
                  fontSize: isCompactLayout ? "0.78em" : tokens.fontSize,
                  aspectRatio: "1 / 1",
                  ...dayButtonOverrides.style,
                }}
              >
                {cell.day}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${className}`.trim()}
      style={rootStyle}
      id={id}
      ref={rootRef}
      {...props}
    >
      <div style={fieldWrapStyle}>
        <span aria-hidden style={leadingIconStyle}>
          {mode === "time" ? <FiClock size={14} /> : <FiCalendar size={14} />}
        </span>

        <input
          ref={inputRef}
          id={inputElementId}
          type="text"
          disabled={disabled}
          required={required}
          aria-invalid={invalid ? true : undefined}
          aria-required={required || undefined}
          aria-label={resolvedInputAriaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={panelElementId}
          role="combobox"
          aria-autocomplete="none"
          value={inputText}
          placeholder={resolvedPlaceholder}
          onFocus={() => {
            setIsFocused(true);
            openPanel();
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          onClick={() => {
            openPanel();
          }}
          onChange={(event) => {
            const nextInputText = event.currentTarget.value;
            setInputText(nextInputText);
            emitAction("input-change", {
              inputText: nextInputText,
              open: disabled ? isOpen : true,
            });

            if (!disabled && !isOpen) {
              openPanel();
            }
          }}
          onKeyDown={handleInputKeyDown}
          style={fieldStyle}
        />

        <div style={controlWrapStyle}>
          {hasSelection ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={disabled}
              aria-label={clearLabel}
              style={iconButtonStyle}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={(event) => {
                event.preventDefault();
                clearSelection();
              }}
            >
              <span
                aria-hidden
                style={{ display: "inline-flex", lineHeight: 0 }}
              >
                <FiX size={12} />
              </span>
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={disabled}
            aria-label={isOpen ? closePickerLabel : openPickerLabel}
            style={iconButtonStyle}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={(event) => {
              event.preventDefault();

              if (disabled) {
                return;
              }

              setIsOpen((current) => {
                const nextOpen = !current;

                emitAction(nextOpen ? "open" : "close", {
                  open: nextOpen,
                });

                return nextOpen;
              });
              inputRef.current?.focus();
            }}
          >
            <span aria-hidden style={chevronStyle}>
              <FiChevronDown size={14} />
            </span>
          </Button>
        </div>
      </div>

      {isOpen ? (
        <div
          id={panelElementId}
          role="dialog"
          aria-modal={false}
          aria-label={resolvedPanelAriaLabel}
          style={panelStyle}
        >
          {mode === "date" || mode === "range" ? (
            <>
              <div style={calendarStackStyle}>
                {mode === "range" ? (
                  <div style={rangeFieldRowStyle}>
                    <Button
                      {...rangeFieldButtonOverrides}
                      type="button"
                      size={rangeFieldButtonOverrides.size ?? "xs"}
                      compact={
                        rangeFieldButtonOverrides.compact ?? isCompactLayout
                      }
                      variant={rangeFieldButtonOverrides.variant ?? "secondary"}
                      disabled={disabled}
                      aria-label={`${rangeFromLabel}: ${
                        rangeValue.start ?? rangeStartEmptyText
                      }`}
                      aria-pressed={activeRangeField === "start"}
                      style={{
                        ...rangeFieldButtonStyle,
                        borderColor:
                          activeRangeField === "start"
                            ? "var(--ktn-action-primary-bg)"
                            : "var(--ktn-border-muted)",
                        backgroundColor:
                          activeRangeField === "start"
                            ? "color-mix(in srgb, var(--ktn-action-primary-bg) 10%, var(--ktn-bg-surface, #ffffff))"
                            : "var(--ktn-bg-muted, rgba(100, 116, 139, 0.06))",
                        ...rangeFieldButtonOverrides.style,
                      }}
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => {
                        focusRangeField("start");
                      }}
                    >
                      <span style={rangeFieldLabelStyle}>{rangeFromLabel}</span>
                      <span style={rangeFieldValueStyle}>
                        {rangeValue.start ?? rangeStartEmptyText}
                      </span>
                    </Button>

                    <Button
                      {...rangeFieldButtonOverrides}
                      type="button"
                      size={rangeFieldButtonOverrides.size ?? "xs"}
                      compact={
                        rangeFieldButtonOverrides.compact ?? isCompactLayout
                      }
                      variant={rangeFieldButtonOverrides.variant ?? "secondary"}
                      disabled={disabled}
                      aria-label={`${rangeToLabel}: ${
                        rangeValue.end ?? rangeEndEmptyText
                      }`}
                      aria-pressed={activeRangeField === "end"}
                      style={{
                        ...rangeFieldButtonStyle,
                        borderColor:
                          activeRangeField === "end"
                            ? "var(--ktn-action-primary-bg)"
                            : "var(--ktn-border-muted)",
                        backgroundColor:
                          activeRangeField === "end"
                            ? "color-mix(in srgb, var(--ktn-action-primary-bg) 10%, var(--ktn-bg-surface, #ffffff))"
                            : "var(--ktn-bg-muted, rgba(100, 116, 139, 0.06))",
                        ...rangeFieldButtonOverrides.style,
                      }}
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => {
                        focusRangeField("end");
                      }}
                    >
                      <span style={rangeFieldLabelStyle}>{rangeToLabel}</span>
                      <span style={rangeFieldValueStyle}>
                        {rangeValue.end ?? rangeEndEmptyText}
                      </span>
                    </Button>
                  </div>
                ) : null}

                {renderCalendar(
                  mode === "range"
                    ? activeRangeField === "start"
                      ? "From date calendar"
                      : "To date calendar"
                    : "Date calendar",
                )}
              </div>
            </>
          ) : (
            <>
              <div style={panelHeaderStyle}>
                <div style={panelHeaderTitleStyle}>
                  <FiClock size={13} />
                  {timePanelTitle}
                </div>
              </div>

              <Scrollbar
                axis="y"
                role="presentation"
                tabIndex={-1}
                style={timeListViewportStyle}
              >
                <div style={timeListStyle}>
                  {timeOptions.map((timeValue) => {
                    const selected = selectedTime === timeValue;
                    const time12Hour = formatTime12Hour(timeValue);

                    return (
                      <Button
                        {...timeOptionButtonOverrides}
                        key={`time-${timeValue}`}
                        type="button"
                        variant={timeOptionButtonOverrides.variant ?? "ghost"}
                        size={timeOptionButtonOverrides.size ?? "xs"}
                        compact={
                          timeOptionButtonOverrides.compact ?? isCompactLayout
                        }
                        disabled={disabled}
                        onMouseDown={(event) => {
                          event.preventDefault();
                        }}
                        onClick={() => {
                          handleTimeSelect(timeValue);
                        }}
                        aria-label={
                          timeOptionAriaFormatter != null
                            ? timeOptionAriaFormatter(time12Hour, timeValue)
                            : `Select ${time12Hour} (${timeValue})`
                        }
                        aria-pressed={selected}
                        style={{
                          ...timeButtonStyle,
                          ...timeOptionButtonOverrides.style,
                          backgroundColor: selected
                            ? "var(--ktn-bg-muted, rgba(100, 116, 139, 0.16))"
                            : "transparent",
                          borderColor: selected
                            ? "var(--ktn-action-primary-bg)"
                            : "transparent",
                          color: selected
                            ? "var(--ktn-text-primary)"
                            : "var(--ktn-text-secondary, var(--ktn-text-primary))",
                        }}
                      >
                        <span style={timeTextRowStyle}>
                          <span style={timeTextPrimaryStyle}>{time12Hour}</span>
                          <span style={timeTextSecondaryStyle}>
                            {timeValue}
                          </span>
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </Scrollbar>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
