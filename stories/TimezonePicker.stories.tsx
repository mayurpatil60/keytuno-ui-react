import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  TimezonePicker,
  type TimezonePickerActionContext,
  type TimezonePickerProps,
} from "../src/index";

const meta: Meta<typeof TimezonePicker> = {
  title: "Forms/TimezonePicker",
  component: TimezonePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

type TimezonePlaygroundArgs = TimezonePickerProps;

const fallbackOnAction = action("action");
const fallbackOnValueChange = action("value-change");

const stackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  width: "min(920px, 94vw)",
};

const fieldStyle: CSSProperties = {
  width: "min(620px, 94vw)",
};

const focusedTimezoneSet = [
  "UTC",
  "Asia/Kolkata",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
];

const preferredTimezones = [
  "UTC",
  "Asia/Kolkata",
  "Europe/London",
  "America/New_York",
];

function ActionDemo(): JSX.Element {
  const [value, setValue] = useState<string | null>("Asia/Kolkata");

  return (
    <Field style={fieldStyle}>
      <FieldLabel>Notification Timezone</FieldLabel>

      <FieldContent>
        <TimezonePicker
          value={value}
          includeSystemTimezone
          preferredTimezones={preferredTimezones}
          timezones={focusedTimezoneSet}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            fallbackOnValueChange(nextValue);
          }}
          onAction={(context: TimezonePickerActionContext) => {
            fallbackOnAction(context);
          }}
          style={{ width: "100%" }}
        />

        <FieldDescription>
          Selected timezone: {value ?? "not selected"}
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={fieldStyle}>
        <FieldLabel>Timezone</FieldLabel>

        <FieldContent>
          <TimezonePicker
            defaultValue="Asia/Kolkata"
            preferredTimezones={preferredTimezones}
            timezones={focusedTimezoneSet}
            style={{ width: "100%" }}
          />

          <FieldDescription>
            Select the default timezone for scheduling and reports.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const WithSystemTimezone: Story = {
  name: "With System Timezone",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>With System Timezone</h3>

      <Field style={fieldStyle}>
        <FieldLabel>Preferred Timezone</FieldLabel>

        <FieldContent>
          <TimezonePicker
            includeSystemTimezone
            preferredTimezones={preferredTimezones}
            timezones={focusedTimezoneSet}
            defaultValue="UTC"
            style={{ width: "100%" }}
          />

          <FieldDescription>
            System timezone is injected as a dedicated top option.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const WithoutSystemTimezone: Story = {
  name: "Without System Timezone",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Without System Timezone</h3>

      <Field style={fieldStyle}>
        <FieldLabel>Preferred Timezone</FieldLabel>

        <FieldContent>
          <TimezonePicker
            includeSystemTimezone={false}
            preferredTimezones={preferredTimezones}
            timezones={focusedTimezoneSet}
            defaultValue="UTC"
            style={{ width: "100%" }}
          />

          <FieldDescription>
            Only curated IANA timezone options are shown.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Variants</h3>

      <Field style={fieldStyle}>
        <FieldLabel>Detailed</FieldLabel>

        <FieldContent>
          <TimezonePicker
            variant="detailed"
            includeSystemTimezone
            preferredTimezones={preferredTimezones}
            timezones={focusedTimezoneSet}
            defaultValue="Europe/London"
            style={{ width: "100%" }}
          />

          <FieldDescription>
            Detailed variant shows timezone name with UTC offset metadata.
          </FieldDescription>
        </FieldContent>
      </Field>

      <Field style={fieldStyle}>
        <FieldLabel>Compact</FieldLabel>

        <FieldContent>
          <TimezonePicker
            variant="compact"
            includeSystemTimezone
            preferredTimezones={preferredTimezones}
            timezones={focusedTimezoneSet}
            defaultValue="America/New_York"
            style={{ width: "100%" }}
          />

          <FieldDescription>
            Compact variant keeps option rows single-line.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>

      {(["xs", "sm", "md", "lg"] as const).map((size) => (
        <Field key={size} style={fieldStyle}>
          <FieldLabel>{size.toUpperCase()} size</FieldLabel>

          <FieldContent>
            <TimezonePicker
              size={size}
              includeSystemTimezone
              preferredTimezones={preferredTimezones}
              timezones={focusedTimezoneSet}
              defaultValue="UTC"
              style={{ width: "100%" }}
            />

            <FieldDescription>
              Size {size} for dense and spacious form layouts.
            </FieldDescription>
          </FieldContent>
        </Field>
      ))}
    </div>
  ),
};

export const Accessibility: Story = {
  render: () => {
    const descriptionId = "timezone-picker-accessibility-description";

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Accessibility</h3>

        <Field required style={fieldStyle}>
          <FieldLabel>Settlement Timezone</FieldLabel>

          <FieldContent>
            <TimezonePicker
              required
              aria-label="Settlement timezone"
              aria-describedby={descriptionId}
              preferredTimezones={preferredTimezones}
              timezones={focusedTimezoneSet}
              defaultValue="UTC"
              style={{ width: "100%" }}
            />

            <FieldDescription id={descriptionId}>
              Supports keyboard open/close, search input, and listbox option
              navigation.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const TimezonePickerActions: Story = {
  name: "Timezone Picker Actions",
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Action Events</h3>
      <ActionDemo />
    </div>
  ),
};

export const TimezonePickerPlayground: Story = {
  name: "Timezone Playground",
  args: {
    size: "md",
    variant: "detailed",
    disabled: false,
    required: false,
    invalid: false,
    showClear: true,
    includeSystemTimezone: true,
    placeholder: "Select timezone",
    searchPlaceholder: "Search timezone...",
    emptyText: "No timezone found.",
  } satisfies TimezonePlaygroundArgs,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    variant: {
      control: "inline-radio",
      options: ["compact", "detailed"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    showClear: { control: "boolean" },
    includeSystemTimezone: { control: "boolean" },
    placeholder: { control: "text" },
    searchPlaceholder: { control: "text" },
    emptyText: { control: "text" },
    timezones: { table: { disable: true } },
    preferredTimezones: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onAction: { action: "action" },
    onValueChange: { action: "value-change" },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => (
    <Field
      disabled={args.disabled}
      invalid={args.invalid}
      required={args.required}
      style={fieldStyle}
    >
      <FieldLabel>Execution Timezone</FieldLabel>

      <FieldContent>
        <TimezonePicker
          key={`${args.size}-${args.variant}-${args.disabled}-${args.required}-${args.invalid}-${args.includeSystemTimezone}-${args.showClear}`}
          size={args.size}
          variant={args.variant}
          disabled={args.disabled}
          required={args.required}
          invalid={args.invalid}
          showClear={args.showClear}
          includeSystemTimezone={args.includeSystemTimezone}
          placeholder={args.placeholder}
          searchPlaceholder={args.searchPlaceholder}
          emptyText={args.emptyText}
          preferredTimezones={preferredTimezones}
          timezones={focusedTimezoneSet}
          defaultValue="Asia/Kolkata"
          onAction={args.onAction}
          onValueChange={args.onValueChange}
          style={{ width: "100%" }}
        />

        {args.invalid ? (
          <FieldError>Please select a valid timezone.</FieldError>
        ) : (
          <FieldDescription>
            Playground always emits action and value-change events.
          </FieldDescription>
        )}
      </FieldContent>
    </Field>
  ),
};

export const CompactTimezonePlayground: Story = {
  name: "Compact Playground",
  args: {
    size: "md",
    variant: "compact",
    disabled: false,
    required: false,
    invalid: false,
    showClear: true,
    includeSystemTimezone: false,
    placeholder: "Select timezone",
    searchPlaceholder: "Search timezone...",
    emptyText: "No timezone found.",
  } satisfies TimezonePlaygroundArgs,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
    variant: {
      control: "inline-radio",
      options: ["compact", "detailed"],
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    invalid: { control: "boolean" },
    showClear: { control: "boolean" },
    includeSystemTimezone: { control: "boolean" },
    placeholder: { control: "text" },
    searchPlaceholder: { control: "text" },
    emptyText: { control: "text" },
    timezones: { table: { disable: true } },
    preferredTimezones: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onAction: { action: "action" },
    onValueChange: { action: "value-change" },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => (
    <Field
      disabled={args.disabled}
      invalid={args.invalid}
      required={args.required}
      style={fieldStyle}
    >
      <FieldLabel>Compact Timezone Picker</FieldLabel>

      <FieldContent>
        <TimezonePicker
          key={`compact-${args.size}-${args.variant}-${args.disabled}-${args.required}-${args.invalid}-${args.includeSystemTimezone}-${args.showClear}`}
          size={args.size}
          variant={args.variant}
          disabled={args.disabled}
          required={args.required}
          invalid={args.invalid}
          showClear={args.showClear}
          includeSystemTimezone={args.includeSystemTimezone}
          placeholder={args.placeholder}
          searchPlaceholder={args.searchPlaceholder}
          emptyText={args.emptyText}
          preferredTimezones={preferredTimezones}
          timezones={focusedTimezoneSet}
          defaultValue="Europe/London"
          onAction={args.onAction}
          onValueChange={args.onValueChange}
          style={{ width: "100%" }}
        />

        {args.invalid ? (
          <FieldError>Select a timezone.</FieldError>
        ) : (
          <FieldDescription>
            Compact playground also emits action and value-change events.
          </FieldDescription>
        )}
      </FieldContent>
    </Field>
  ),
};

