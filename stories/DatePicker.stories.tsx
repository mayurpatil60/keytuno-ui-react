import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  DatePicker,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  type DatePickerActionContext,
  type DateRangeValue,
} from '@keytuno/ui-react';

const meta: Meta<typeof DatePicker> = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const stackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: 'min(860px, 92vw)',
};

const fieldStyle: CSSProperties = {
  width: 'min(560px, 92vw)',
};

const defaultRange: DateRangeValue = {
  start: '2026-06-01',
  end: '2026-06-10',
};

export const Datepicker: Story = {
  name: 'Datepicker',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Datepicker</h3>

      <Field style={fieldStyle}>
        <FieldLabel>Trade Date</FieldLabel>

        <FieldContent>
          <DatePicker mode="date" defaultValue="2026-06-21" style={{ width: '100%' }} />
          <FieldDescription>Select a date for your analysis snapshot.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const RangePickerInput: Story = {
  name: 'RangePicker Input',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>RangePicker Input</h3>

      <Field style={fieldStyle}>
        <FieldLabel>Execution Window</FieldLabel>

        <FieldContent>
          <DatePicker mode="range" defaultValue={defaultRange} style={{ width: '100%' }} />
          <FieldDescription>Set start and end dates for range-based reporting.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const TimePicker: Story = {
  name: 'TimePicker',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>TimePicker</h3>

      <Field style={fieldStyle}>
        <FieldLabel>Alert Time</FieldLabel>

        <FieldContent>
          <DatePicker mode="time" defaultValue="10:30" style={{ width: '100%' }} />
          <FieldDescription>Choose when notifications should be triggered.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Invalid</h3>

      <Field invalid required style={fieldStyle}>
        <FieldLabel>Trade Date</FieldLabel>

        <FieldContent>
          <DatePicker mode="date" invalid style={{ width: '100%' }} />
          <FieldError>Trade date is required.</FieldError>
        </FieldContent>
      </Field>

      <Field invalid required style={fieldStyle}>
        <FieldLabel>Execution Window</FieldLabel>

        <FieldContent>
          <DatePicker mode="range" invalid defaultValue={defaultRange} style={{ width: '100%' }} />
          <FieldError>Valid start and end dates are required.</FieldError>
        </FieldContent>
      </Field>

      <Field invalid required style={fieldStyle}>
        <FieldLabel>Alert Time</FieldLabel>

        <FieldContent>
          <DatePicker mode="time" invalid defaultValue="09:45" style={{ width: '100%' }} />
          <FieldError>Alert time is required.</FieldError>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Disabled</h3>

      <Field disabled style={fieldStyle}>
        <FieldLabel>Trade Date</FieldLabel>

        <FieldContent>
          <DatePicker mode="date" disabled defaultValue="2026-06-21" style={{ width: '100%' }} />
          <FieldDescription>Date selection is locked for archived entries.</FieldDescription>
        </FieldContent>
      </Field>

      <Field disabled style={fieldStyle}>
        <FieldLabel>Execution Window</FieldLabel>

        <FieldContent>
          <DatePicker mode="range" disabled defaultValue={defaultRange} style={{ width: '100%' }} />
          <FieldDescription>Range editing is disabled in this workflow.</FieldDescription>
        </FieldContent>
      </Field>

      <Field disabled style={fieldStyle}>
        <FieldLabel>Alert Time</FieldLabel>

        <FieldContent>
          <DatePicker mode="time" disabled defaultValue="10:30" style={{ width: '100%' }} />
          <FieldDescription>Alert schedule is managed by the system.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const DatePickerActions: Story = {
  name: 'DatePicker Actions',
  args: {
    onAction: undefined,
    onValueChange: undefined,
  },
  argTypes: {
    onAction: {
      action: 'action',
      description:
        'Fires for open, close, input, clear, date/time select, and month/year navigation actions.',
    },
    onValueChange: {
      action: 'value-change',
      description: 'Fires when a valid normalized value is committed.',
    },
  },
  render: (args) => {
    const onAction = args.onAction;
    const onValueChange = args.onValueChange;

    const handleAction =
      onAction == null
        ? undefined
        : (context: DatePickerActionContext) => {
            onAction(context);
          };

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Action Events</h3>

        <Field style={fieldStyle}>
          <FieldLabel>Trade Date</FieldLabel>

          <FieldContent>
            <DatePicker
              mode="date"
              defaultValue="2026-06-21"
              onAction={handleAction}
              onValueChange={onValueChange}
              style={{ width: '100%' }}
            />
            <FieldDescription>
              Use input, open/close controls, and day buttons to emit actions.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const DatePickerPlayground: Story = {
  name: 'Date Playground',
  args: {
    mode: 'date',
    variant: 'primary',
    size: 'md',
    disabled: false,
    invalid: false,
    placeholder: 'Select date',
    withAction: false,
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['date'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    varient: { table: { disable: true } },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    placeholder: { control: 'text' },
    withAction: { control: 'boolean' },
    rangeSeparator: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onAction: { action: 'action' },
    onValueChange: { action: 'value-change' },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field disabled={args.disabled} invalid={args.invalid} style={fieldStyle}>
        <FieldLabel>Trade Date</FieldLabel>

        <FieldContent>
          <DatePicker
            key={`${args.variant}-${args.size}-${args.disabled}-${args.invalid}-${args.placeholder}`}
            mode="date"
            variant={args.variant}
            size={args.size}
            disabled={args.disabled}
            invalid={args.invalid}
            placeholder={args.placeholder}
            defaultValue="2026-06-21"
            onAction={withAction ? args.onAction : undefined}
            onValueChange={withAction ? args.onValueChange : undefined}
            style={{ width: '100%' }}
          />

          {args.invalid ? (
            <FieldError>Provide a valid date.</FieldError>
          ) : (
            <FieldDescription>Adjust props to test date mode behavior.</FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};

export const RangePickerPlayground: Story = {
  name: 'Range Playground',
  args: {
    mode: 'range',
    variant: 'primary',
    size: 'md',
    disabled: false,
    invalid: false,
    placeholder: 'Select date range',
    rangeSeparator: ' - ',
    withAction: false,
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['range'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    varient: { table: { disable: true } },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    placeholder: { control: 'text' },
    rangeSeparator: { control: 'text' },
    withAction: { control: 'boolean' },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onAction: { action: 'action' },
    onValueChange: { action: 'value-change' },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field disabled={args.disabled} invalid={args.invalid} style={fieldStyle}>
        <FieldLabel>Execution Window</FieldLabel>

        <FieldContent>
          <DatePicker
            key={`${args.variant}-${args.size}-${args.disabled}-${args.invalid}-${args.rangeSeparator}`}
            mode="range"
            variant={args.variant}
            size={args.size}
            disabled={args.disabled}
            invalid={args.invalid}
            placeholder={args.placeholder}
            rangeSeparator={args.rangeSeparator}
            defaultValue={defaultRange}
            onAction={withAction ? args.onAction : undefined}
            onValueChange={withAction ? args.onValueChange : undefined}
            style={{ width: '100%' }}
          />

          {args.invalid ? (
            <FieldError>Provide a valid date range.</FieldError>
          ) : (
            <FieldDescription>Adjust controls to validate range behavior.</FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};

export const TimePickerPlayground: Story = {
  name: 'Time Playground',
  args: {
    mode: 'time',
    variant: 'primary',
    size: 'md',
    disabled: false,
    invalid: false,
    placeholder: 'Select time',
    withAction: false,
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['time'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    varient: { table: { disable: true } },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    placeholder: { control: 'text' },
    withAction: { control: 'boolean' },
    rangeSeparator: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onAction: { action: 'action' },
    onValueChange: { action: 'value-change' },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field disabled={args.disabled} invalid={args.invalid} style={fieldStyle}>
        <FieldLabel>Alert Time</FieldLabel>

        <FieldContent>
          <DatePicker
            key={`${args.variant}-${args.size}-${args.disabled}-${args.invalid}-${args.placeholder}`}
            mode="time"
            variant={args.variant}
            size={args.size}
            disabled={args.disabled}
            invalid={args.invalid}
            placeholder={args.placeholder}
            defaultValue="10:30"
            onAction={withAction ? args.onAction : undefined}
            onValueChange={withAction ? args.onValueChange : undefined}
            style={{ width: '100%' }}
          />

          {args.invalid ? (
            <FieldError>Provide a valid time.</FieldError>
          ) : (
            <FieldDescription>Adjust controls to validate time behavior.</FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};
