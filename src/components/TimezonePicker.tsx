import { useMemo, type HTMLAttributes } from "react";

import {
  Select,
  type SelectActionContext,
  type SelectOption,
  type SelectValue,
} from "./Select";

export type TimezonePickerSize = "xs" | "sm" | "md" | "lg";
export type TimezonePickerVariant = "compact" | "detailed";

export type TimezonePickerActionSource =
  | "open"
  | "close"
  | "search"
  | "select"
  | "clear"
  | "system-select";

export interface TimezonePickerActionContext {
  source: TimezonePickerActionSource;
  value: string | null;
  previousValue?: string | null;
  open: boolean;
  query: string;
  required: boolean;
  variant: TimezonePickerVariant;
  includeSystemTimezone: boolean;
  systemTimezone: string | null;
  optionValue?: string;
  event?: unknown;
}

export interface TimezonePickerOption extends SelectOption {
  timezone: string;
  offset: string;
  system: boolean;
}

export interface TimezonePickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> {
  size?: TimezonePickerSize;
  variant?: TimezonePickerVariant;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  showClear?: boolean;
  includeSystemTimezone?: boolean;
  systemTimezone?: string | null;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  timezones?: string[];
  preferredTimezones?: string[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  onAction?: (context: TimezonePickerActionContext) => void;
}

const FALLBACK_TIMEZONES = [
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Europe/Madrid",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Africa/Johannesburg",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
];

const baseClasses = "inline-flex w-full";

function normalizeTimezoneValue(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

function normalizeTimezoneList(values: string[]): string[] {
  const unique = new Set<string>();

  values.forEach((timezone) => {
    const normalized = normalizeTimezoneValue(timezone);

    if (normalized != null) {
      unique.add(normalized);
    }
  });

  return Array.from(unique).sort((first, second) =>
    first.localeCompare(second, "en", { sensitivity: "base" }),
  );
}

function formatTimezoneLabel(timezone: string): string {
  return timezone
    .split("/")
    .map((segment) => segment.replace(/_/g, " "))
    .join(" / ");
}

function formatOffset(minutesOffset: number): string {
  const sign = minutesOffset >= 0 ? "+" : "-";
  const absoluteMinutes = Math.abs(minutesOffset);
  const hours = Math.floor(absoluteMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (absoluteMinutes % 60).toString().padStart(2, "0");

  return `UTC${sign}${hours}:${minutes}`;
}

function calculateOffsetMinutes(
  timezone: string,
  reference: Date,
): number | null {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      hourCycle: "h23",
    });

    const partMap = new Map(
      formatter
        .formatToParts(reference)
        .map((part) => [part.type, Number(part.value)]),
    );

    const year = partMap.get("year");
    const month = partMap.get("month");
    const day = partMap.get("day");
    const hour = partMap.get("hour");
    const minute = partMap.get("minute");
    const second = partMap.get("second");

    if (
      year == null ||
      month == null ||
      day == null ||
      hour == null ||
      minute == null ||
      second == null ||
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day) ||
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      Number.isNaN(second)
    ) {
      return null;
    }

    const zonedTimeUtc = Date.UTC(year, month - 1, day, hour, minute, second);

    return Math.round((zonedTimeUtc - reference.getTime()) / 60000);
  } catch {
    return null;
  }
}

function getTimezoneOffsetLabel(timezone: string, reference: Date): string {
  const offsetMinutes = calculateOffsetMinutes(timezone, reference);

  if (offsetMinutes == null) {
    return "UTC";
  }

  return formatOffset(offsetMinutes);
}

function detectSystemTimezone(): string | null {
  try {
    return normalizeTimezoneValue(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
  } catch {
    return null;
  }
}

function prioritizeTimezones(
  timezones: string[],
  preferredTimezones: string[],
): string[] {
  if (preferredTimezones.length === 0) {
    return timezones;
  }

  const preferred = normalizeTimezoneList(preferredTimezones);
  const seen = new Set<string>();
  const ordered: string[] = [];
  const available = new Set(timezones);

  preferred.forEach((timezone) => {
    if (available.has(timezone)) {
      ordered.push(timezone);
      seen.add(timezone);
    }
  });

  timezones.forEach((timezone) => {
    if (!seen.has(timezone)) {
      ordered.push(timezone);
    }
  });

  return ordered;
}

function toSingleSelectValue(value: SelectValue | undefined): string | null {
  if (typeof value === "string") {
    return normalizeTimezoneValue(value);
  }

  return null;
}

export function TimezonePicker({
  size = "md",
  variant,
  disabled = false,
  required = false,
  invalid = false,
  showClear = true,
  includeSystemTimezone = true,
  systemTimezone,
  placeholder = "Select timezone",
  searchPlaceholder = "Search timezone...",
  emptyText = "No timezone found.",
  timezones,
  preferredTimezones = [
    "UTC",
    "Asia/Kolkata",
    "Europe/London",
    "America/New_York",
  ],
  value,
  defaultValue,
  onValueChange,
  onAction,
  className = "",
  style,
  ["aria-label"]: ariaLabel,
  ["aria-labelledby"]: ariaLabelledBy,
  ["aria-describedby"]: ariaDescribedBy,
  ...props
}: TimezonePickerProps): JSX.Element {
  const resolvedVariant = variant ?? "detailed";

  const resolvedSystemTimezone =
    normalizeTimezoneValue(systemTimezone) ?? detectSystemTimezone();

  const requestedTimezones = useMemo(
    () =>
      timezones != null && timezones.length > 0
        ? normalizeTimezoneList(timezones)
        : normalizeTimezoneList(FALLBACK_TIMEZONES),
    [timezones],
  );

  const orderedTimezones = useMemo(
    () => prioritizeTimezones(requestedTimezones, preferredTimezones),
    [preferredTimezones, requestedTimezones],
  );

  const timezoneOptions = useMemo<TimezonePickerOption[]>(() => {
    const reference = new Date();
    const seen = new Set<string>();
    const options: TimezonePickerOption[] = [];

    function pushOption(timezone: string, system: boolean): void {
      const offset = getTimezoneOffsetLabel(timezone, reference);
      const timezoneLabel = formatTimezoneLabel(timezone);
      const selectedLabel = system ? `System (${timezone})` : timezone;
      const optionDescription =
        resolvedVariant === "detailed"
          ? system
            ? `${offset} - Local device timezone`
            : `${offset} - ${timezoneLabel}`
          : undefined;

      options.push({
        value: timezone,
        label: selectedLabel,
        description: optionDescription,
        keywords: [
          timezone,
          timezoneLabel,
          offset,
          ...(system ? ["system", "local", "device"] : []),
        ],
        timezone,
        offset,
        system,
      });

      seen.add(timezone);
    }

    if (includeSystemTimezone && resolvedSystemTimezone != null) {
      pushOption(resolvedSystemTimezone, true);
    }

    orderedTimezones.forEach((timezone) => {
      if (!seen.has(timezone)) {
        pushOption(timezone, false);
      }
    });

    return options;
  }, [
    includeSystemTimezone,
    orderedTimezones,
    resolvedSystemTimezone,
    resolvedVariant,
  ]);

  function handleValueChange(nextValue: SelectValue): void {
    onValueChange?.(toSingleSelectValue(nextValue));
  }

  function handleAction(context: SelectActionContext): void {
    if (onAction == null) {
      return;
    }

    const nextValue = toSingleSelectValue(context.value);
    const previousValue =
      context.previousValue === undefined
        ? undefined
        : toSingleSelectValue(context.previousValue);

    const selectedSystemTimezone =
      context.source === "select" &&
      includeSystemTimezone &&
      resolvedSystemTimezone != null &&
      context.optionValue === resolvedSystemTimezone;

    onAction({
      source: selectedSystemTimezone ? "system-select" : context.source,
      value: nextValue,
      previousValue,
      open: context.open,
      query: context.query,
      required,
      variant: resolvedVariant,
      includeSystemTimezone,
      systemTimezone: resolvedSystemTimezone,
      optionValue: context.optionValue,
      event: context.event,
    });
  }

  const composedClassName = `${baseClasses} ${className}`.trim();
  const isControlled = value !== undefined;
  const resolvedValue = isControlled
    ? normalizeTimezoneValue(value)
    : undefined;
  const resolvedDefaultValue = isControlled
    ? undefined
    : normalizeTimezoneValue(defaultValue);

  return (
    <Select
      {...props}
      className={composedClassName}
      style={style}
      size={size}
      disabled={disabled}
      required={required}
      invalid={invalid}
      showClear={showClear}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      options={timezoneOptions}
      value={resolvedValue}
      defaultValue={resolvedDefaultValue}
      onValueChange={handleValueChange}
      onAction={handleAction}
      aria-label={
        ariaLabel ?? (ariaLabelledBy == null ? "Timezone picker" : undefined)
      }
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    />
  );
}
