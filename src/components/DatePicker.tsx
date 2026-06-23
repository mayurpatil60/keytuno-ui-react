import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';

import { Button } from './Button';
import {
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiX,
} from 'react-icons/fi';

export type DatePickerVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link';

export type DatePickerSize = 'xs' | 'sm' | 'md' | 'lg';
export type DatePickerMode = 'date' | 'range' | 'time';
export type DatePickerActionSource =
  | 'open'
  | 'close'
  | 'clear'
  | 'input-change'
  | 'input-commit'
  | 'date-select'
  | 'time-select'
  | 'month-shift'
  | 'month-set'
  | 'year-set';

export interface DatePickerActionContext {
  source: DatePickerActionSource;
  mode: DatePickerMode;
  value: DatePickerValue;
  inputText: string;
  open: boolean;
}

export interface DateRangeValue {
  start: string | null;
  end: string | null;
}

export type DatePickerValue = string | DateRangeValue | null;

export interface DatePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'defaultValue' | 'onChange'
> {
  mode?: DatePickerMode;
  variant?: DatePickerVariant;
  varient?: DatePickerVariant;
  size?: DatePickerSize;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  rangeSeparator?: string;
  value?: DatePickerValue;
  defaultValue?: DatePickerValue;
  onValueChange?: (value: DatePickerValue) => void;
  onAction?: (context: DatePickerActionContext) => void;
}

type DatePickerSizeTokens = {
  height: string;
  fontSize: string;
  panelPadding: string;
  dayCellSize: string;
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

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const sizeTokens: Record<DatePickerSize, DatePickerSizeTokens> = {
  xs: {
    height: '1.9rem',
    fontSize: '0.75rem',
    panelPadding: '0.55rem',
    dayCellSize: '1.65rem',
  },
  sm: {
    height: '2.15rem',
    fontSize: '0.8125rem',
    panelPadding: '0.65rem',
    dayCellSize: '1.8rem',
  },
  md: {
    height: '2.4rem',
    fontSize: '0.875rem',
    panelPadding: '0.75rem',
    dayCellSize: '2rem',
  },
  lg: {
    height: '2.65rem',
    fontSize: '0.9375rem',
    panelPadding: '0.875rem',
    dayCellSize: '2.2rem',
  },
};

const variantStyles: Record<DatePickerVariant, CSSProperties> = {
  primary: {
    borderColor: 'color-mix(in srgb, var(--ktn-action-primary-bg) 42%, var(--ktn-border-muted))',
    backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
    color: 'var(--ktn-text-primary)',
  },
  secondary: {
    borderColor: 'var(--ktn-border-muted)',
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))',
    color: 'var(--ktn-text-primary)',
  },
  destructive: {
    borderColor:
      'color-mix(in srgb, var(--ktn-action-danger-bg, #dc2626) 42%, var(--ktn-border-muted))',
    backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
    color: 'var(--ktn-text-primary)',
  },
  outline: {
    borderColor: 'var(--ktn-border-muted)',
    backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
    color: 'var(--ktn-text-primary)',
  },
  ghost: {
    borderColor: 'transparent',
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.1))',
    color: 'var(--ktn-text-primary)',
  },
  link: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    color: 'var(--ktn-action-primary-bg)',
    textDecoration: 'underline',
    textUnderlineOffset: '0.14em',
  },
};

const focusStyles: Record<DatePickerVariant, CSSProperties> = {
  primary: {
    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.24)',
  },
  secondary: {
    boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.2)',
  },
  destructive: {
    boxShadow: '0 0 0 2px rgba(220, 38, 38, 0.24)',
  },
  outline: {
    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)',
  },
  ghost: {
    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.16)',
  },
  link: {
    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.16)',
  },
};

const baseClasses = 'relative inline-flex flex-col';

function padTwo(value: number): string {
  return String(value).padStart(2, '0');
}

function formatIsoDate(year: number, month: number, day: number): string {
  return `${year}-${padTwo(month)}-${padTwo(day)}`;
}

function parseIsoDate(value: string): { year: number; month: number; day: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }

  return {
    year,
    month,
    day,
  };
}

function isDateRangeValue(value: DatePickerValue | undefined): value is DateRangeValue {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  return 'start' in value && 'end' in value;
}

function isValidDateValue(value: string): boolean {
  return parseIsoDate(value) != null;
}

function isValidTimeValue(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) {
    return false;
  }

  const [hourText, minuteText] = value.split(':');
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

function shiftMonth(monthState: CalendarMonthState, delta: number): CalendarMonthState {
  const monthIndex = monthState.year * 12 + monthState.month + delta;
  const nextYear = Math.floor(monthIndex / 12);
  const nextMonth = ((monthIndex % 12) + 12) % 12;

  return {
    year: nextYear,
    month: nextMonth,
  };
}

function monthLabel(monthState: CalendarMonthState): string {
  return new Date(monthState.year, monthState.month, 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

function buildCalendarCells(monthState: CalendarMonthState): CalendarDayCell[] {
  const firstDayOfMonth = new Date(monthState.year, monthState.month, 1).getDay();
  const daysInCurrentMonth = new Date(monthState.year, monthState.month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(monthState.year, monthState.month, 0).getDate();

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
  mode: 'date' | 'time',
): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed === '') {
    return null;
  }

  if (mode === 'date') {
    return isValidDateValue(trimmed) ? trimmed : null;
  }

  return isValidTimeValue(trimmed) ? trimmed : null;
}

function parseRangeInput(input: string, separator: string): DateRangeValue | null {
  const trimmed = input.trim();

  if (trimmed === '') {
    return {
      start: null,
      end: null,
    };
  }

  const effectiveSeparator = separator === '' ? ' - ' : separator;
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
  const start = startRaw === '' ? null : startRaw;
  const end = endRaw === '' ? null : endRaw;

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
      typeof value.start === 'string' && isValidDateValue(value.start) ? value.start : null;
    const end = typeof value.end === 'string' && isValidDateValue(value.end) ? value.end : null;

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

  if (typeof value === 'string') {
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
  if (mode === 'range') {
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

  return '';
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
  const [hourText, minuteText] = value.split(':');
  const hour = Number(hourText);

  if (!Number.isFinite(hour)) {
    return value;
  }

  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${normalizedHour}:${minuteText} ${suffix}`;
}

function formatAccessibleDate(value: string): string {
  const parsed = parseIsoDate(value);

  if (parsed == null) {
    return value;
  }

  return new Date(parsed.year, parsed.month - 1, parsed.day).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDisplayValue(
  value: DatePickerValue,
  mode: DatePickerMode,
  separator: string,
): string {
  if (mode === 'range') {
    return isDateRangeValue(value) ? formatRangeValue(value, separator) : '';
  }

  return typeof value === 'string' ? value : '';
}

export function DatePicker({
  mode = 'date',
  variant,
  varient,
  size = 'md',
  disabled = false,
  invalid = false,
  placeholder,
  rangeSeparator = ' - ',
  value,
  defaultValue,
  onValueChange,
  onAction,
  className = '',
  style,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}: DatePickerProps): JSX.Element {
  const resolvedVariant = variant ?? varient ?? 'outline';
  const isControlled = value !== undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [uncontrolledValue, setUncontrolledValue] = useState<DatePickerValue>(() =>
    normalizeValueByMode(defaultValue, mode, rangeSeparator),
  );

  const resolvedValue = useMemo(
    () => normalizeValueByMode(isControlled ? value : uncontrolledValue, mode, rangeSeparator),
    [isControlled, mode, rangeSeparator, uncontrolledValue, value],
  );

  const [inputText, setInputText] = useState(() =>
    formatDisplayValue(
      normalizeValueByMode(defaultValue, mode, rangeSeparator),
      mode,
      rangeSeparator,
    ),
  );

  const [leftMonth, setLeftMonth] = useState<CalendarMonthState>(() => {
    const normalizedDefault = normalizeValueByMode(defaultValue, mode, rangeSeparator);

    if (
      mode === 'range' &&
      isDateRangeValue(normalizedDefault) &&
      normalizedDefault.start != null
    ) {
      return toMonthState(normalizedDefault.start);
    }

    if (mode === 'date' && typeof normalizedDefault === 'string') {
      return toMonthState(normalizedDefault);
    }

    return toMonthState(null);
  });

  const [rightMonth, setRightMonth] = useState<CalendarMonthState>(() => {
    const normalizedDefault = normalizeValueByMode(defaultValue, mode, rangeSeparator);

    if (mode === 'range' && isDateRangeValue(normalizedDefault)) {
      if (normalizedDefault.end != null) {
        return toMonthState(normalizedDefault.end);
      }

      if (normalizedDefault.start != null) {
        return shiftMonth(toMonthState(normalizedDefault.start), 1);
      }
    }

    return shiftMonth(toMonthState(null), 1);
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerId = useId();

  const tokens = sizeTokens[size];
  const idBase = id ?? pickerId;
  const inputElementId = `${idBase}-input`;
  const panelElementId = `${idBase}-panel`;
  const panelAriaLabel =
    mode === 'time'
      ? 'Time picker panel'
      : mode === 'range'
        ? 'Date range picker panel'
        : 'Date picker panel';
  const inputAriaLabel =
    ariaLabel ??
    (ariaLabelledBy == null
      ? mode === 'time'
        ? 'Time picker'
        : mode === 'range'
          ? 'Date range picker'
          : 'Date picker'
      : undefined);

  const rangeValue =
    mode === 'range' && isDateRangeValue(resolvedValue)
      ? resolvedValue
      : {
          start: null,
          end: null,
        };

  const selectedDate = mode === 'date' && typeof resolvedValue === 'string' ? resolvedValue : null;
  const selectedTime = mode === 'time' && typeof resolvedValue === 'string' ? resolvedValue : null;

  const displayValue = useMemo(
    () => formatDisplayValue(resolvedValue, mode, rangeSeparator),
    [mode, rangeSeparator, resolvedValue],
  );

  const hasSelection =
    mode === 'range'
      ? rangeValue.start != null || rangeValue.end != null
      : displayValue.trim() !== '';

  const timeOptions = useMemo(() => createTimeOptions(15), []);
  const leftYearOptions = useMemo(() => createYearOptions(leftMonth.year), [leftMonth.year]);
  const rightYearOptions = useMemo(() => createYearOptions(rightMonth.year), [rightMonth.year]);
  const todayIso = useMemo(() => {
    const now = new Date();

    return formatIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledValue((current) => normalizeValueByMode(current, mode, rangeSeparator));
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
      if (rootRef.current != null && !rootRef.current.contains(event.target as Node)) {
        commitInputText();
        closePanel(false);
        setIsFocused(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [disabled, inputText, isOpen, mode, rangeSeparator, resolvedValue]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === 'date' && selectedDate != null) {
      setLeftMonth(toMonthState(selectedDate));
      return;
    }

    if (mode === 'range' && rangeValue.start != null) {
      const nextLeftMonth = toMonthState(rangeValue.start);
      setLeftMonth(nextLeftMonth);

      if (rangeValue.end != null) {
        setRightMonth(toMonthState(rangeValue.end));
      } else {
        setRightMonth(shiftMonth(nextLeftMonth, 1));
      }
      return;
    }

    if (mode === 'range') {
      const nextLeftMonth = toMonthState(null);
      setLeftMonth(nextLeftMonth);
      setRightMonth(shiftMonth(nextLeftMonth, 1));
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

    const nextValue = normalizeValueByMode(options?.value ?? resolvedValue, mode, rangeSeparator);

    onAction({
      source,
      mode,
      value: nextValue,
      inputText: options?.inputText ?? inputText,
      open: options?.open ?? isOpen,
    });
  }

  function updateValue(
    nextValue: DatePickerValue,
    source: DatePickerActionSource,
  ): DatePickerValue {
    const normalized = normalizeValueByMode(nextValue, mode, rangeSeparator);

    if (!isControlled) {
      setUncontrolledValue(normalized);
    }

    onValueChange?.(normalized);

    return normalized;
  }

  function setValueAndSync(nextValue: DatePickerValue, source: DatePickerActionSource): void {
    const normalized = updateValue(nextValue, source);
    const nextDisplayValue = formatDisplayValue(normalized, mode, rangeSeparator);
    setInputText(nextDisplayValue);
    emitAction(source, {
      value: normalized,
      inputText: nextDisplayValue,
    });
  }

  function commitInputText(): void {
    const trimmed = inputText.trim();

    if (mode === 'range') {
      const parsedRange = parseRangeInput(inputText, rangeSeparator);

      if (parsedRange != null) {
        setValueAndSync(parsedRange, 'input-commit');
        return;
      }

      setInputText(displayValue);
      return;
    }

    if (trimmed === '') {
      setValueAndSync(null, 'input-commit');
      return;
    }

    if (mode === 'date') {
      if (isValidDateValue(trimmed)) {
        setValueAndSync(trimmed, 'input-commit');
        return;
      }

      setInputText(displayValue);
      return;
    }

    if (isValidTimeValue(trimmed)) {
      setValueAndSync(trimmed, 'input-commit');
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

      emitAction('open', {
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

      emitAction('close', {
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

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      openPanel();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closePanel(true);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      commitInputText();
      closePanel(false);
      return;
    }

    if (event.key === 'Tab') {
      commitInputText();
      closePanel(false);
    }
  }

  function clearSelection(): void {
    if (disabled) {
      return;
    }

    if (mode === 'range') {
      setValueAndSync({ start: null, end: null }, 'clear');
    } else {
      setValueAndSync(null, 'clear');
    }

    inputRef.current?.focus();
  }

  function handleDateSelect(isoDate: string): void {
    if (disabled) {
      return;
    }

    if (mode === 'range') {
      let nextRange: DateRangeValue;

      if (rangeValue.start == null || rangeValue.end != null) {
        nextRange = {
          start: isoDate,
          end: null,
        };
      } else if (isoDate < rangeValue.start) {
        nextRange = {
          start: isoDate,
          end: rangeValue.start,
        };
      } else {
        nextRange = {
          start: rangeValue.start,
          end: isoDate,
        };
      }

      setValueAndSync(nextRange, 'date-select');

      if (nextRange.end != null) {
        closePanel(false);
      }

      return;
    }

    setValueAndSync(isoDate, 'date-select');
    closePanel(false);
  }

  function handleTimeSelect(nextTime: string): void {
    if (disabled) {
      return;
    }

    setValueAndSync(nextTime, 'time-select');
    closePanel(false);
  }

  function updateLeftMonth(partial: Partial<CalendarMonthState>): void {
    setLeftMonth((current) => {
      const nextMonth = partial.month ?? current.month;
      const nextYear = partial.year ?? current.year;

      return {
        month: Math.min(11, Math.max(0, nextMonth)),
        year: nextYear,
      };
    });
  }

  function updateRightMonth(partial: Partial<CalendarMonthState>): void {
    setRightMonth((current) => {
      const nextMonth = partial.month ?? current.month;
      const nextYear = partial.year ?? current.year;

      return {
        month: Math.min(11, Math.max(0, nextMonth)),
        year: nextYear,
      };
    });
  }

  const rootStyle: CSSProperties = {
    width: '100%',
    position: 'relative',
    ...style,
  };

  const fieldWrapStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  const leadingIconStyle: CSSProperties = {
    position: 'absolute',
    insetInlineStart: '0.625rem',
    insetBlockStart: '50%',
    transform: 'translateY(-50%)',
    width: '0.95rem',
    height: '0.95rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
    lineHeight: 0,
    pointerEvents: 'none',
    zIndex: 1,
  };

  const fieldBaseStyle: CSSProperties = {
    width: '100%',
    height: tokens.height,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 'var(--ktn-radius-md, 0.5rem)',
    outline: 'none',
    paddingInlineStart: '2rem',
    paddingInlineEnd: hasSelection ? '4.2rem' : '2.35rem',
    fontSize: tokens.fontSize,
    lineHeight: 1.25,
    transition: 'border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease',
  };

  const fieldStyle: CSSProperties = {
    ...fieldBaseStyle,
    ...variantStyles[resolvedVariant],
    color:
      inputText.trim() === ''
        ? 'var(--ktn-text-secondary, var(--ktn-text-primary))'
        : 'var(--ktn-text-primary)',
    ...(invalid
      ? {
          borderColor: 'var(--ktn-action-danger-bg, #dc2626)',
          boxShadow: isFocused || isOpen ? '0 0 0 2px rgba(220, 38, 38, 0.24)' : undefined,
        }
      : isFocused || isOpen
        ? focusStyles[resolvedVariant]
        : {}),
    ...(disabled
      ? {
          opacity: 0.62,
          cursor: 'not-allowed',
        }
      : {
          cursor: 'text',
        }),
  };

  const controlWrapStyle: CSSProperties = {
    position: 'absolute',
    insetInlineEnd: '0.35rem',
    insetBlockStart: '50%',
    transform: 'translateY(-50%)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
  };

  const iconButtonStyle: CSSProperties = {
    width: '1.45rem',
    height: '1.45rem',
    minHeight: '1.45rem',
    paddingInline: 0,
    paddingBlock: 0,
    borderRadius: '999px',
  };

  const chevronStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '0.9rem',
    height: '0.9rem',
    lineHeight: 0,
    transition: 'transform 160ms ease',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  };

  const panelStyle: CSSProperties = {
    position: 'absolute',
    insetInlineStart: 0,
    insetBlockStart: 'calc(100% + 0.35rem)',
    zIndex: 20,
    width:
      mode === 'range'
        ? 'min(44rem, calc(100vw - 1rem))'
        : mode === 'time'
          ? 'min(18.5rem, calc(100vw - 1rem))'
          : 'min(20rem, calc(100vw - 1rem))',
    maxWidth: 'calc(100vw - 1rem)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: invalid ? 'var(--ktn-action-danger-bg, #dc2626)' : 'var(--ktn-border-muted)',
    borderRadius: 'var(--ktn-radius-md, 0.5rem)',
    backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
    boxShadow: '0 10px 28px rgba(15, 23, 42, 0.12)',
    padding: tokens.panelPadding,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.65rem',
  };

  const panelHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: mode === 'time' ? 'center' : 'space-between',
    gap: '0.5rem',
  };

  const panelNavigationButtonStyle: CSSProperties = {
    width: '1.65rem',
    height: '1.65rem',
    minHeight: '1.65rem',
    paddingInline: 0,
    paddingBlock: 0,
    borderRadius: '999px',
  };

  const monthYearControlWrapStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    flex: 1,
    minWidth: 0,
  };

  const monthYearSelectStyle: CSSProperties = {
    height: '1.75rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--ktn-border-muted)',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))',
    color: 'var(--ktn-text-primary)',
    fontSize: '0.78rem',
    fontWeight: 500,
    paddingInline: '0.4rem',
    outline: 'none',
  };

  const calendarHeaderStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.35rem',
  };

  const panelHeaderTitleStyle: CSSProperties = {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--ktn-text-primary)',
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem',
  };

  const calendarStackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.55rem',
  };

  const rangeSummaryStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '0.5rem',
  };

  const rangeSummaryItemStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--ktn-border-muted)',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.08))',
    paddingInline: '0.55rem',
    paddingBlock: '0.35rem',
  };

  const rangeSummaryLabelStyle: CSSProperties = {
    fontSize: '0.68rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
  };

  const rangeSummaryValueStyle: CSSProperties = {
    fontSize: '0.78rem',
    color: 'var(--ktn-text-primary)',
    minHeight: '1rem',
  };

  const calendarRowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns:
      mode === 'range' ? 'repeat(auto-fit, minmax(16rem, 1fr))' : 'minmax(16rem, 1fr)',
    gap: '0.75rem',
    alignItems: 'start',
  };

  const calendarBoxStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    minWidth: 0,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--ktn-border-muted)',
    borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
    backgroundColor: 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.06))',
    padding: '0.45rem',
  };

  const weekHeaderStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: '0.25rem',
  };

  const weekDayStyle: CSSProperties = {
    textAlign: 'center',
    fontSize: '0.72rem',
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
    fontWeight: 500,
  };

  const dayGridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    gap: '0.25rem',
    alignItems: 'center',
  };

  const timeListStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    maxHeight: '15rem',
    overflowY: 'auto',
    paddingInlineEnd: '0.2rem',
  };

  const timeButtonStyle: CSSProperties = {
    width: '100%',
    justifyContent: 'space-between',
    height: '1.95rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    paddingInline: '0.65rem',
  };

  const timeTextRowStyle: CSSProperties = {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.65rem',
    fontVariantNumeric: 'tabular-nums',
  };

  const timeTextPrimaryStyle: CSSProperties = {
    fontSize: tokens.fontSize,
    color: 'var(--ktn-text-primary)',
    fontWeight: 500,
  };

  const timeTextSecondaryStyle: CSSProperties = {
    fontSize: '0.78em',
    color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
    letterSpacing: '0.02em',
  };

  const resolvedPlaceholder =
    placeholder ??
    (mode === 'time' ? 'Select time' : mode === 'range' ? 'Select date range' : 'Select date');

  const leftMonthCells = buildCalendarCells(leftMonth);
  const rightMonthCells = buildCalendarCells(rightMonth);

  function isInRange(isoDate: string): boolean {
    if (rangeValue.start == null || rangeValue.end == null) {
      return false;
    }

    return isoDate > rangeValue.start && isoDate < rangeValue.end;
  }

  function renderCalendar({
    monthState,
    cells,
    yearOptions,
    onSetMonth,
    onSetYear,
    onShiftMonth,
    ariaPrefix,
  }: {
    monthState: CalendarMonthState;
    cells: CalendarDayCell[];
    yearOptions: number[];
    onSetMonth: (month: number) => void;
    onSetYear: (year: number) => void;
    onShiftMonth: (delta: number) => void;
    ariaPrefix: string;
  }): JSX.Element {
    return (
      <div style={calendarBoxStyle}>
        <div style={calendarHeaderStyle}>
          <Button
            type="button"
            size="xs"
            variant="ghost"
            disabled={disabled}
            aria-label={`${ariaPrefix} previous month`}
            style={panelNavigationButtonStyle}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => {
              onShiftMonth(-1);
              emitAction('month-shift');
            }}
          >
            <span aria-hidden style={{ display: 'inline-flex', lineHeight: 0 }}>
              <FiChevronLeft size={14} />
            </span>
          </Button>

          <div style={monthYearControlWrapStyle}>
            <select
              aria-label={`${ariaPrefix} month`}
              value={monthState.month}
              disabled={disabled}
              style={{
                ...monthYearSelectStyle,
                minWidth: '5.1rem',
              }}
              onChange={(event) => {
                const nextMonth = Number(event.currentTarget.value);

                if (Number.isFinite(nextMonth)) {
                  onSetMonth(nextMonth);
                  emitAction('month-set');
                }
              }}
            >
              {MONTH_LABELS.map((monthLabel, monthIndex) => (
                <option key={`${ariaPrefix}-month-option-${monthLabel}`} value={monthIndex}>
                  {monthLabel}
                </option>
              ))}
            </select>

            <select
              aria-label={`${ariaPrefix} year`}
              value={monthState.year}
              disabled={disabled}
              style={{
                ...monthYearSelectStyle,
                minWidth: '4.65rem',
              }}
              onChange={(event) => {
                const nextYear = Number(event.currentTarget.value);

                if (Number.isFinite(nextYear)) {
                  onSetYear(nextYear);
                  emitAction('year-set');
                }
              }}
            >
              {yearOptions.map((yearValue) => (
                <option key={`${ariaPrefix}-year-option-${yearValue}`} value={yearValue}>
                  {yearValue}
                </option>
              ))}
            </select>
          </div>

          <Button
            type="button"
            size="xs"
            variant="ghost"
            disabled={disabled}
            aria-label={`${ariaPrefix} next month`}
            style={panelNavigationButtonStyle}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={() => {
              onShiftMonth(1);
              emitAction('month-shift');
            }}
          >
            <span aria-hidden style={{ display: 'inline-flex', lineHeight: 0 }}>
              <FiChevronRight size={14} />
            </span>
          </Button>
        </div>

        <div style={weekHeaderStyle}>
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={`weekday-${monthState.year}-${monthState.month}-${label}`}
              style={weekDayStyle}
            >
              {label}
            </div>
          ))}
        </div>

        <div style={dayGridStyle}>
          {cells.map((cell) => {
            const isSelectedDate = mode === 'date' && selectedDate === cell.iso;
            const isRangeStart = mode === 'range' && rangeValue.start === cell.iso;
            const isRangeEnd = mode === 'range' && rangeValue.end === cell.iso;
            const isRangeBoundary = mode === 'range' && (isRangeStart || isRangeEnd);
            const isBetweenRange = mode === 'range' && isInRange(cell.iso);
            const isToday = cell.iso === todayIso;

            const cellAriaParts: string[] = [formatAccessibleDate(cell.iso)];

            if (isToday) {
              cellAriaParts.push('today');
            }

            if (isSelectedDate) {
              cellAriaParts.push('selected');
            }

            if (isRangeStart) {
              cellAriaParts.push('range start');
            }

            if (isRangeEnd) {
              cellAriaParts.push('range end');
            }

            if (isBetweenRange) {
              cellAriaParts.push('in selected range');
            }

            if (!cell.inCurrentMonth) {
              cellAriaParts.push('outside current month');
            }

            return (
              <Button
                key={`day-${monthState.year}-${monthState.month}-${cell.iso}`}
                type="button"
                variant="ghost"
                size="xs"
                disabled={disabled}
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={() => {
                  handleDateSelect(cell.iso);
                }}
                aria-label={cellAriaParts.join(', ')}
                aria-pressed={isSelectedDate || isRangeBoundary}
                aria-current={isToday ? 'date' : undefined}
                style={{
                  width: '100%',
                  minHeight: tokens.dayCellSize,
                  paddingInline: 0,
                  paddingBlock: 0,
                  justifyContent: 'center',
                  borderRadius: '0.375rem',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor:
                    isSelectedDate || isRangeBoundary
                      ? 'var(--ktn-action-primary-bg)'
                      : isToday
                        ? 'color-mix(in srgb, var(--ktn-action-primary-bg) 40%, var(--ktn-border-muted))'
                        : 'transparent',
                  backgroundColor:
                    isSelectedDate || isRangeBoundary
                      ? 'var(--ktn-action-primary-bg)'
                      : isBetweenRange
                        ? 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.2))'
                        : 'transparent',
                  color:
                    isSelectedDate || isRangeBoundary
                      ? 'var(--ktn-action-primary-fg, #ffffff)'
                      : cell.inCurrentMonth
                        ? 'var(--ktn-text-primary)'
                        : 'var(--ktn-text-secondary, var(--ktn-text-primary))',
                  opacity: cell.inCurrentMonth ? 1 : 0.6,
                  fontSize: tokens.fontSize,
                  aspectRatio: '1 / 1',
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
          {mode === 'time' ? <FiClock size={14} /> : <FiCalendar size={14} />}
        </span>

        <input
          ref={inputRef}
          id={inputElementId}
          type="text"
          disabled={disabled}
          aria-invalid={invalid ? true : undefined}
          aria-label={inputAriaLabel}
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
            emitAction('input-change', {
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
              aria-label="Clear value"
              style={iconButtonStyle}
              onMouseDown={(event) => {
                event.preventDefault();
              }}
              onClick={(event) => {
                event.preventDefault();
                clearSelection();
              }}
            >
              <span aria-hidden style={{ display: 'inline-flex', lineHeight: 0 }}>
                <FiX size={12} />
              </span>
            </Button>
          ) : null}

          <Button
            type="button"
            variant="ghost"
            size="xs"
            disabled={disabled}
            aria-label={isOpen ? 'Close picker' : 'Open picker'}
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

                emitAction(nextOpen ? 'open' : 'close', {
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
          aria-label={panelAriaLabel}
          style={panelStyle}
        >
          {mode === 'date' || mode === 'range' ? (
            <>
              <div style={calendarStackStyle}>
                {mode === 'range' ? (
                  <div style={rangeSummaryStyle}>
                    <div style={rangeSummaryItemStyle}>
                      <span style={rangeSummaryLabelStyle}>From</span>
                      <span style={rangeSummaryValueStyle}>{rangeValue.start ?? 'Start date'}</span>
                    </div>

                    <div style={rangeSummaryItemStyle}>
                      <span style={rangeSummaryLabelStyle}>To</span>
                      <span style={rangeSummaryValueStyle}>{rangeValue.end ?? 'End date'}</span>
                    </div>
                  </div>
                ) : null}

                <div style={calendarRowStyle}>
                  {renderCalendar({
                    monthState: leftMonth,
                    cells: leftMonthCells,
                    yearOptions: leftYearOptions,
                    onSetMonth: (nextMonth) => {
                      updateLeftMonth({ month: nextMonth });
                    },
                    onSetYear: (nextYear) => {
                      updateLeftMonth({ year: nextYear });
                    },
                    onShiftMonth: (delta) => {
                      setLeftMonth((current) => shiftMonth(current, delta));
                    },
                    ariaPrefix: mode === 'range' ? 'Left calendar' : 'Calendar',
                  })}

                  {mode === 'range'
                    ? renderCalendar({
                        monthState: rightMonth,
                        cells: rightMonthCells,
                        yearOptions: rightYearOptions,
                        onSetMonth: (nextMonth) => {
                          updateRightMonth({ month: nextMonth });
                        },
                        onSetYear: (nextYear) => {
                          updateRightMonth({ year: nextYear });
                        },
                        onShiftMonth: (delta) => {
                          setRightMonth((current) => shiftMonth(current, delta));
                        },
                        ariaPrefix: 'Right calendar',
                      })
                    : null}
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={panelHeaderStyle}>
                <div style={panelHeaderTitleStyle}>
                  <FiClock size={13} />
                  Select Time
                </div>
              </div>

              <div style={timeListStyle}>
                {timeOptions.map((timeValue) => {
                  const selected = selectedTime === timeValue;
                  const time12Hour = formatTime12Hour(timeValue);

                  return (
                    <Button
                      key={`time-${timeValue}`}
                      type="button"
                      variant="ghost"
                      size="xs"
                      disabled={disabled}
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => {
                        handleTimeSelect(timeValue);
                      }}
                      aria-label={`Select ${time12Hour} (${timeValue})`}
                      aria-pressed={selected}
                      style={{
                        ...timeButtonStyle,
                        backgroundColor: selected
                          ? 'var(--ktn-bg-muted, rgba(100, 116, 139, 0.16))'
                          : 'transparent',
                        borderColor: selected ? 'var(--ktn-action-primary-bg)' : 'transparent',
                        color: selected
                          ? 'var(--ktn-text-primary)'
                          : 'var(--ktn-text-secondary, var(--ktn-text-primary))',
                      }}
                    >
                      <span style={timeTextRowStyle}>
                        <span style={timeTextPrimaryStyle}>{time12Hour}</span>
                        <span style={timeTextSecondaryStyle}>{timeValue}</span>
                      </span>
                    </Button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
