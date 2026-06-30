import {
  type FocusEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Button } from "./Button";

export type SelectSize = "xs" | "sm" | "md" | "lg";
export type SelectValue = string | string[] | null;
export type SelectActionSource =
  | "open"
  | "close"
  | "search"
  | "select"
  | "clear";

export interface SelectActionContext {
  source: SelectActionSource;
  value: SelectValue;
  previousValue?: SelectValue;
  multiple: boolean;
  open: boolean;
  query: string;
  required: boolean;
  optionValue?: string;
  event?: unknown;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  keywords?: string[];
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
> {
  size?: SelectSize;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  multiple?: boolean;
  showClear?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options?: SelectOption[];
  groups?: SelectGroup[];
  value?: SelectValue;
  defaultValue?: SelectValue;
  onValueChange?: (value: SelectValue) => void;
  onAction?: (context: SelectActionContext) => void;
  renderItem?: (
    option: SelectOption,
    state: { selected: boolean },
  ) => ReactNode;
}

type SelectSizeTokens = {
  inputHeight: string;
  fontSize: string;
  panelPadding: string;
  optionHeight: string;
  optionPaddingInline: string;
  groupLabelSize: string;
};

type NormalizedGroup = {
  label?: string;
  options: SelectOption[];
};

const sizeTokens: Record<SelectSize, SelectSizeTokens> = {
  xs: {
    inputHeight: "1.9rem",
    fontSize: "0.75rem",
    panelPadding: "0.35rem",
    optionHeight: "1.7rem",
    optionPaddingInline: "0.45rem",
    groupLabelSize: "0.625rem",
  },
  sm: {
    inputHeight: "2.1rem",
    fontSize: "0.8125rem",
    panelPadding: "0.4rem",
    optionHeight: "1.95rem",
    optionPaddingInline: "0.5rem",
    groupLabelSize: "0.6875rem",
  },
  md: {
    inputHeight: "2.35rem",
    fontSize: "0.875rem",
    panelPadding: "0.45rem",
    optionHeight: "2.15rem",
    optionPaddingInline: "0.55rem",
    groupLabelSize: "0.75rem",
  },
  lg: {
    inputHeight: "2.6rem",
    fontSize: "0.9375rem",
    panelPadding: "0.5rem",
    optionHeight: "2.4rem",
    optionPaddingInline: "0.65rem",
    groupLabelSize: "0.8125rem",
  },
};

const baseClasses = "relative inline-flex flex-col";

function normalizeValue(
  value: SelectValue | undefined,
  multiple: boolean,
): SelectValue {
  if (multiple) {
    if (Array.isArray(value)) {
      return Array.from(
        new Set(
          value.filter(
            (item) => typeof item === "string" && item.trim() !== "",
          ),
        ),
      );
    }

    if (typeof value === "string" && value.trim() !== "") {
      return [value];
    }

    return [];
  }

  if (Array.isArray(value)) {
    const first = value.find(
      (item) => typeof item === "string" && item.trim() !== "",
    );
    return first ?? null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }

  return null;
}

function valueToArray(value: SelectValue): string[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    return [value];
  }

  return [];
}

function normalizeGroups(
  options: SelectOption[],
  groups: SelectGroup[],
): NormalizedGroup[] {
  const normalized: NormalizedGroup[] = [];

  if (groups.length > 0) {
    groups.forEach((group) => {
      const validOptions = group.options.filter(
        (option) => option.value.trim() !== "",
      );

      if (validOptions.length > 0) {
        normalized.push({
          label: group.label,
          options: validOptions,
        });
      }
    });
  }

  if (options.length > 0) {
    normalized.push({
      options: options.filter((option) => option.value.trim() !== ""),
    });
  }

  return normalized;
}

function getFirstEnabledOption(groups: NormalizedGroup[]): SelectOption | null {
  for (const group of groups) {
    for (const option of group.options) {
      if (option.disabled !== true) {
        return option;
      }
    }
  }

  return null;
}

export function Select({
  size = "md",
  disabled = false,
  required = false,
  invalid = false,
  multiple = false,
  showClear = false,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  options = [],
  groups = [],
  value,
  defaultValue,
  onValueChange,
  onAction,
  renderItem,
  className = "",
  style,
  ["aria-label"]: ariaLabel,
  ["aria-labelledby"]: ariaLabelledBy,
  ["aria-describedby"]: ariaDescribedBy,
  ...props
}: SelectProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const isControlled = value !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState<SelectValue>(() =>
    normalizeValue(defaultValue, multiple),
  );

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledValue((current) => normalizeValue(current, multiple));
    }
  }, [isControlled, multiple]);

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent): void {
      if (
        rootRef.current != null &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpenState(false, event);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const tokens = sizeTokens[size];
  const resolvedValue = normalizeValue(
    isControlled ? value : uncontrolledValue,
    multiple,
  );
  const selectedValues = valueToArray(resolvedValue);
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const normalizedGroups = useMemo(
    () => normalizeGroups(options, groups),
    [groups, options],
  );

  const allOptions = useMemo(
    () => normalizedGroups.flatMap((group) => group.options),
    [normalizedGroups],
  );

  const optionByValue = useMemo(() => {
    const map = new Map<string, SelectOption>();

    allOptions.forEach((option) => {
      if (!map.has(option.value)) {
        map.set(option.value, option);
      }
    });

    return map;
  }, [allOptions]);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (query === "") {
      return normalizedGroups;
    }

    return normalizedGroups
      .map((group) => {
        const nextOptions = group.options.filter((option) => {
          const searchableText = [
            option.label,
            option.value,
            option.description ?? "",
            ...(option.keywords ?? []),
          ]
            .join(" ")
            .toLowerCase();

          return searchableText.includes(query);
        });

        return {
          ...group,
          options: nextOptions,
        };
      })
      .filter((group) => group.options.length > 0);
  }, [normalizedGroups, search]);

  const selectedLabels = selectedValues
    .map(
      (selectedValue) =>
        optionByValue.get(selectedValue)?.label ?? selectedValue,
    )
    .filter((label) => label.trim() !== "");

  const displayText =
    selectedLabels.length === 0
      ? ""
      : multiple
        ? selectedLabels.length <= 2
          ? selectedLabels.join(", ")
          : `${selectedLabels.length} selected`
        : selectedLabels[0];

  const composedClassName = `${baseClasses} ${className}`.trim();
  const showClearButton = showClear && selectedValues.length > 0 && !disabled;
  const inputValue = isOpen ? search : displayText;
  const inputPlaceholder = isOpen ? searchPlaceholder : placeholder;

  function emitAction(
    source: SelectActionSource,
    options?: {
      value?: SelectValue;
      previousValue?: SelectValue;
      open?: boolean;
      query?: string;
      optionValue?: string;
      event?: unknown;
    },
  ): void {
    onAction?.({
      source,
      value: options?.value ?? resolvedValue,
      previousValue: options?.previousValue,
      multiple,
      open: options?.open ?? isOpen,
      query: options?.query ?? search,
      required,
      optionValue: options?.optionValue,
      event: options?.event,
    });
  }

  function setOpenState(nextOpen: boolean, event?: unknown): void {
    if (disabled || nextOpen === isOpen) {
      return;
    }

    setIsOpen(nextOpen);
    emitAction(nextOpen ? "open" : "close", {
      open: nextOpen,
      event,
    });
  }

  function setValue(
    nextValue: SelectValue,
    source: Extract<SelectActionSource, "select" | "clear">,
    event?: unknown,
    optionValue?: string,
  ): void {
    const normalized = normalizeValue(nextValue, multiple);
    const previousValue = resolvedValue;

    if (!isControlled) {
      setUncontrolledValue(normalized);
    }

    onValueChange?.(normalized);
    emitAction(source, {
      value: normalized,
      previousValue,
      optionValue,
      event,
    });
  }

  function toggleOpen(event?: unknown): void {
    if (disabled) {
      return;
    }

    setOpenState(!isOpen, event);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (disabled) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpenState(true, event);
      return;
    }

    if (event.key === "Escape") {
      setOpenState(false, event);
      return;
    }

    if (event.key === "Enter" && isOpen) {
      const firstOption = getFirstEnabledOption(filteredGroups);

      if (firstOption != null) {
        event.preventDefault();
        handleOptionSelect(firstOption);
      }
    }
  }

  function handleOptionSelect(option: SelectOption): void {
    if (disabled || option.disabled) {
      return;
    }

    if (multiple) {
      const nextValues = new Set(selectedValues);

      if (nextValues.has(option.value)) {
        nextValues.delete(option.value);
      } else {
        nextValues.add(option.value);
      }

      setValue(Array.from(nextValues), "select", undefined, option.value);
      setSearch("");
      inputRef.current?.focus();
      return;
    }

    setValue(option.value, "select", undefined, option.value);
    setSearch("");
    setOpenState(false);
  }

  function handleClearSelection(): void {
    if (disabled) {
      return;
    }

    setValue(multiple ? [] : null, "clear");
    setSearch("");
    setOpenState(true);
    inputRef.current?.focus();
  }

  function handleInputBlur(event: FocusEvent<HTMLInputElement>): void {
    const relatedTarget = event.relatedTarget;

    if (
      relatedTarget instanceof Node &&
      rootRef.current?.contains(relatedTarget)
    ) {
      return;
    }

    setOpenState(false, event);
  }

  const rootStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    ...style,
  };

  const fieldWrapStyle: CSSProperties = {
    position: "relative",
    width: "100%",
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    height: tokens.inputHeight,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "var(--ktn-radius-md, 0.5rem)",
    outline: "none",
    paddingInlineStart: "0.625rem",
    paddingInlineEnd: showClearButton ? "4.05rem" : "2.2rem",
    fontSize: tokens.fontSize,
    lineHeight: 1.2,
    borderColor: invalid
      ? "var(--ktn-action-danger-bg, #dc2626)"
      : "var(--ktn-border-muted)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    color:
      inputValue.trim() === ""
        ? "var(--ktn-text-secondary, var(--ktn-text-primary))"
        : "var(--ktn-text-primary)",
    boxShadow: isOpen
      ? invalid
        ? "0 0 0 2px rgba(220, 38, 38, 0.22)"
        : "0 0 0 2px rgba(37, 99, 235, 0.22)"
      : undefined,
    opacity: disabled ? 0.62 : 1,
    cursor: disabled ? "not-allowed" : "text",
  };

  const chevronButtonStyle: CSSProperties = {
    position: "absolute",
    insetInlineEnd: "0.25rem",
    insetBlockStart: "50%",
    transform: "translateY(-50%)",
    width: "1.5rem",
    height: "1.5rem",
    minHeight: "1.5rem",
    paddingInline: 0,
    paddingBlock: 0,
    borderRadius: "999px",
    zIndex: 2,
  };

  const chevronStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1rem",
    height: "1rem",
    lineHeight: 0,
    flexShrink: 0,
    transition: "transform 160ms ease",
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
  };

  const clearButtonStyle: CSSProperties = {
    position: "absolute",
    insetInlineEnd: "2.1rem",
    insetBlockStart: "50%",
    transform: "translateY(-50%)",
    width: "1.3rem",
    height: "1.3rem",
    minHeight: "1.3rem",
    paddingInline: 0,
    paddingBlock: 0,
    borderRadius: "999px",
    zIndex: 2,
  };

  const panelStyle: CSSProperties = {
    position: "absolute",
    insetInlineStart: 0,
    insetInlineEnd: 0,
    insetBlockStart: "calc(100% + 0.35rem)",
    zIndex: 20,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: invalid
      ? "var(--ktn-action-danger-bg, #dc2626)"
      : "var(--ktn-border-muted)",
    borderRadius: "var(--ktn-radius-md, 0.5rem)",
    backgroundColor: "var(--ktn-bg-surface, #ffffff)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.12)",
    padding: tokens.panelPadding,
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  };

  const listStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    maxHeight: "14.5rem",
    overflowY: "auto",
    paddingInlineEnd: "0.1rem",
  };

  const groupStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  };

  const groupLabelStyle: CSSProperties = {
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    fontSize: tokens.groupLabelSize,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    paddingInline: "0.25rem",
    paddingBlockStart: "0.15rem",
  };

  const optionStyle: CSSProperties = {
    width: "100%",
    justifyContent: "space-between",
    height: tokens.optionHeight,
    paddingInline: tokens.optionPaddingInline,
    borderRadius: "var(--ktn-radius-sm, 0.375rem)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    lineHeight: 1.2,
  };

  const optionTextWrapStyle: CSSProperties = {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.1rem",
    minWidth: 0,
  };

  const optionLabelStyle: CSSProperties = {
    fontSize: tokens.fontSize,
    color: "var(--ktn-text-primary)",
  };

  const optionDescriptionStyle: CSSProperties = {
    fontSize: "0.72em",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
  };

  const checkMarkStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "0.95rem",
    height: "0.95rem",
    lineHeight: 0,
    color: "var(--ktn-action-primary-bg)",
    flexShrink: 0,
    marginInlineStart: "0.35rem",
  };

  const emptyStyle: CSSProperties = {
    paddingBlock: "0.625rem",
    paddingInline: "0.45rem",
    color: "var(--ktn-text-secondary, var(--ktn-text-primary))",
    fontSize: tokens.fontSize,
  };

  return (
    <div
      className={composedClassName}
      style={rootStyle}
      ref={rootRef}
      {...props}
    >
      <div style={fieldWrapStyle}>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          value={inputValue}
          placeholder={inputPlaceholder}
          disabled={disabled}
          required={required}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-disabled={disabled || undefined}
          aria-required={required || undefined}
          aria-invalid={invalid ? true : undefined}
          onFocus={(event) => {
            if (!disabled) {
              setOpenState(true, event);
            }
          }}
          onBlur={handleInputBlur}
          onClick={(event) => {
            if (!disabled) {
              setOpenState(true, event);
            }
          }}
          onChange={(event) => {
            const nextQuery = event.currentTarget.value;
            setSearch(nextQuery);

            emitAction("search", {
              query: nextQuery,
              open: isOpen || !disabled,
              event,
            });

            if (!disabled && !isOpen) {
              setOpenState(true, event);
            }
          }}
          onKeyDown={handleInputKeyDown}
          style={inputStyle}
        />

        {showClearButton ? (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            aria-label="Clear selection"
            style={clearButtonStyle}
            onMouseDown={(event) => {
              event.preventDefault();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleClearSelection();
            }}
          >
            <span aria-hidden style={{ lineHeight: 0 }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </Button>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          size="xs"
          disabled={disabled}
          aria-label={isOpen ? "Close options" : "Open options"}
          style={chevronButtonStyle}
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={(event) => {
            event.preventDefault();
            toggleOpen(event);
            inputRef.current?.focus();
          }}
        >
          <span aria-hidden style={chevronStyle}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Button>
      </div>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={
            ariaLabelledBy == null ? (ariaLabel ?? placeholder) : undefined
          }
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-multiselectable={multiple || undefined}
          style={panelStyle}
        >
          {filteredGroups.length === 0 ? (
            <div role="status" aria-live="polite" style={emptyStyle}>
              {emptyText}
            </div>
          ) : (
            <div style={listStyle}>
              {filteredGroups.map((group, groupIndex) => (
                <div
                  key={`select-group-${group.label ?? "plain"}-${groupIndex}`}
                  role={
                    group.label != null && group.label.trim() !== ""
                      ? "group"
                      : undefined
                  }
                  aria-labelledby={
                    group.label != null && group.label.trim() !== ""
                      ? `${listboxId}-group-${groupIndex}-label`
                      : undefined
                  }
                  style={{
                    ...groupStyle,
                    borderTop:
                      groupIndex > 0 && group.label != null
                        ? "1px solid var(--ktn-border-muted)"
                        : undefined,
                    paddingBlockStart: groupIndex > 0 ? "0.35rem" : 0,
                  }}
                >
                  {group.label != null && group.label.trim() !== "" ? (
                    <div
                      id={`${listboxId}-group-${groupIndex}-label`}
                      style={groupLabelStyle}
                    >
                      {group.label}
                    </div>
                  ) : null}

                  {group.options.map((option, optionIndex) => {
                    const selected = selectedSet.has(option.value);
                    const optionId = `${listboxId}-option-${groupIndex}-${optionIndex}`;

                    return (
                      <Button
                        key={option.value}
                        id={optionId}
                        type="button"
                        variant="ghost"
                        size="xs"
                        disabled={disabled || option.disabled}
                        aria-selected={selected}
                        aria-disabled={
                          disabled || option.disabled ? true : undefined
                        }
                        role="option"
                        style={{
                          ...optionStyle,
                          backgroundColor: selected
                            ? "var(--ktn-bg-muted, rgba(100, 116, 139, 0.12))"
                            : "transparent",
                          color: option.disabled
                            ? "var(--ktn-text-secondary, var(--ktn-text-primary))"
                            : "var(--ktn-text-primary)",
                          cursor:
                            disabled || option.disabled
                              ? "not-allowed"
                              : "pointer",
                          opacity: option.disabled ? 0.6 : 1,
                        }}
                        onMouseDown={(event) => {
                          event.preventDefault();
                        }}
                        onClick={() => {
                          handleOptionSelect(option);
                        }}
                      >
                        {renderItem != null ? (
                          renderItem(option, { selected })
                        ) : (
                          <span style={optionTextWrapStyle}>
                            <span style={optionLabelStyle}>{option.label}</span>
                            {option.description != null ? (
                              <span style={optionDescriptionStyle}>
                                {option.description}
                              </span>
                            ) : null}
                          </span>
                        )}

                        {selected ? (
                          <span aria-hidden style={checkMarkStyle}>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                d="M3.5 8.2l2.8 2.8 6.2-6.2"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </Button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
