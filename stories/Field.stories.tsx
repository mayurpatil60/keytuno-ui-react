import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Select,
  DatePicker,
  type DateRangeValue,
  type DatePickerMode,
  type SelectOption,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
  type FieldActionContext,
} from '@keytuno/ui-react';

const meta: Meta<typeof Field> = {
  title: 'Component/Field',
  component: Field,
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

const frameStyle: CSSProperties = {
  width: 'min(560px, 92vw)',
};

const inputStyle: CSSProperties = {
  width: '100%',
  height: '2.35rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--ktn-border-muted)',
  borderRadius: 'var(--ktn-radius-md, 0.5rem)',
  backgroundColor: 'var(--ktn-bg-surface, #ffffff)',
  color: 'var(--ktn-text-primary)',
  fontSize: '0.875rem',
  paddingInline: '0.7rem',
  outline: 'none',
};

const leftInfoStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
};

const indexOptions: SelectOption[] = [
  { value: 'nifty50', label: 'NIFTY 50', keywords: ['nifty', 'index'] },
  { value: 'banknifty', label: 'BANKNIFTY', keywords: ['bank'] },
  { value: 'finnifty', label: 'FINNIFTY', keywords: ['finance'] },
  { value: 'midcap', label: 'NIFTY MIDCAP', keywords: ['midcap'] },
  { value: 'itnifty', label: 'NIFTY IT', keywords: ['it', 'sector'] },
];

const strategyOptions: SelectOption[] = [
  { value: 'breakout', label: 'Breakout' },
  { value: 'pullback', label: 'Pullback' },
  { value: 'mean_reversion', label: 'Mean Reversion' },
  { value: 'straddle', label: 'Short Straddle' },
  { value: 'intraday_scalp', label: 'Intraday Scalp' },
];

const defaultRange: DateRangeValue = {
  start: '2026-06-01',
  end: '2026-06-10',
};

function getDatePickerDefault(mode: DatePickerMode): string | DateRangeValue {
  if (mode === 'range') {
    return defaultRange;
  }

  if (mode === 'time') {
    return '10:30';
  }

  return '2026-06-21';
}

export const BasicField: Story = {
  name: 'Field',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Field Primitives</h3>

      <FieldGroup style={frameStyle}>
        <Field required>
          <FieldLabel htmlFor="field-full-name">Full Name</FieldLabel>

          <FieldContent>
            <input id="field-full-name" type="text" defaultValue="Mayur Patel" style={inputStyle} />
            <FieldDescription>
              Use the same name that appears in your trading account.
            </FieldDescription>
          </FieldContent>
        </Field>

        <FieldSeparator />

        <Field orientation="horizontal" invalid>
          <div style={leftInfoStyle}>
            <FieldTitle>Contact Verification</FieldTitle>
            <FieldDescription>Execution alerts and OTP messages use this number.</FieldDescription>
          </div>

          <FieldContent>
            <input id="field-phone" type="tel" defaultValue="+91 98XXXXXX1" style={inputStyle} />
            <FieldError>Please enter a valid mobile number.</FieldError>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const FieldWithSelect: Story = {
  name: 'Select Example',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Select with Field</h3>

      <FieldGroup style={frameStyle}>
        <Field required>
          <FieldLabel>Primary Index</FieldLabel>

          <FieldContent>
            <Select
              options={indexOptions}
              defaultValue="nifty50"
              showClear
              style={{ width: '100%' }}
            />
            <FieldDescription>Select the main index for strategy screening.</FieldDescription>
          </FieldContent>
        </Field>

        <Field invalid>
          <FieldLabel>Strategy Tags</FieldLabel>

          <FieldContent>
            <Select
              multiple
              options={strategyOptions}
              defaultValue={['breakout']}
              showClear
              style={{ width: '100%' }}
            />
            <FieldError>Select at least two strategies for this scan.</FieldError>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const FieldWithDatePicker: Story = {
  name: 'DatePicker Example',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>DatePicker with Field</h3>

      <FieldGroup style={frameStyle}>
        <Field>
          <FieldLabel>Trade Date</FieldLabel>
          <FieldContent>
            <DatePicker mode="date" defaultValue="2026-06-21" style={{ width: '100%' }} />
            <FieldDescription>Choose a trade date for backtesting snapshots.</FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Execution Window</FieldLabel>
          <FieldContent>
            <DatePicker mode="range" defaultValue={defaultRange} style={{ width: '100%' }} />
            <FieldDescription>Select from and to dates for analytics range.</FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Alert Time</FieldLabel>
          <FieldContent>
            <DatePicker mode="time" defaultValue="09:30" style={{ width: '100%' }} />
            <FieldDescription>Used for intraday notification scheduling.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const FieldActions: Story = {
  name: 'Field Actions',
  args: {
    onAction: undefined,
  },
  argTypes: {
    onAction: {
      action: 'action',
      description: 'Fires for focus-within, blur-within, label-click, and field-click events.',
    },
  },
  render: (args) => {
    const onAction = args.onAction;

    const handleAction =
      onAction == null
        ? undefined
        : (context: FieldActionContext) => {
            onAction(context);
          };

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Field Actions</h3>

        <Field required onAction={handleAction} style={frameStyle}>
          <FieldLabel htmlFor="field-actions-name">Strategy Name</FieldLabel>

          <FieldContent>
            <input
              id="field-actions-name"
              type="text"
              defaultValue="Momentum Basket"
              style={inputStyle}
            />
            <FieldDescription>
              Focus, blur, click field and click label to emit actions.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const FieldPlayground: Story = {
  name: 'Field Playground',
  args: {
    orientation: 'vertical',
    disabled: false,
    invalid: false,
    required: false,
    withAction: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'responsive'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    required: { control: 'boolean' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;
    const onAction = withAction ? args.onAction : undefined;

    return (
      <Field
        key={`${args.orientation}-${args.disabled}-${args.invalid}-${args.required}`}
        orientation={args.orientation}
        disabled={args.disabled}
        invalid={args.invalid}
        required={args.required}
        onAction={onAction}
        style={frameStyle}
      >
        <FieldLabel htmlFor="field-playground-name">Account Name</FieldLabel>

        <FieldContent>
          <input
            id="field-playground-name"
            type="text"
            defaultValue="Momentum Basket"
            style={inputStyle}
          />
          <FieldDescription>Try orientation and state controls from the panel.</FieldDescription>
          {args.invalid ? <FieldError>This value does not pass validation.</FieldError> : null}
        </FieldContent>
      </Field>
    );
  },
};

export const SelectFieldPlayground: Story = {
  name: 'Select Playground',
  args: {
    orientation: 'vertical',
    disabled: false,
    invalid: false,
    multiple: false,
    size: 'md',
    withAction: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'responsive'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    multiple: { control: 'boolean' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;
    const onAction = withAction ? args.onAction : undefined;

    return (
      <Field
        key={`${args.orientation}-${args.disabled}-${args.invalid}-${args.multiple}-${args.size}`}
        orientation={args.orientation}
        disabled={args.disabled}
        invalid={args.invalid}
        onAction={onAction}
        style={frameStyle}
      >
        <FieldLabel>Index Watchlist</FieldLabel>

        <FieldContent>
          <Select
            size={args.size}
            disabled={args.disabled}
            invalid={args.invalid}
            multiple={args.multiple}
            options={indexOptions}
            defaultValue={args.multiple ? ['nifty50'] : 'nifty50'}
            showClear
            style={{ width: '100%' }}
          />

          <FieldDescription>
            Use this playground to validate Field and Select combinations.
          </FieldDescription>
          {args.invalid ? <FieldError>Please select a valid index.</FieldError> : null}
        </FieldContent>
      </Field>
    );
  },
};

export const DatePickerFieldPlayground: Story = {
  name: 'DatePicker Playground',
  args: {
    orientation: 'vertical',
    disabled: false,
    invalid: false,
    mode: 'date',
    size: 'md',
    variant: 'outline',
    withAction: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal', 'responsive'],
    },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    mode: {
      control: 'inline-radio',
      options: ['date', 'range', 'time'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const resolvedMode = args.mode as DatePickerMode;
    const withAction = args.withAction ?? false;
    const onAction = withAction ? args.onAction : undefined;

    return (
      <Field
        key={`${args.orientation}-${args.disabled}-${args.invalid}-${resolvedMode}-${args.size}-${args.variant}`}
        orientation={args.orientation}
        disabled={args.disabled}
        invalid={args.invalid}
        onAction={onAction}
        style={frameStyle}
      >
        <FieldLabel>Schedule</FieldLabel>

        <FieldContent>
          <DatePicker
            mode={resolvedMode}
            size={args.size}
            variant={args.variant}
            disabled={args.disabled}
            invalid={args.invalid}
            defaultValue={getDatePickerDefault(resolvedMode)}
            style={{ width: '100%' }}
          />

          <FieldDescription>
            Switch mode, size, and variant to test different states.
          </FieldDescription>
          {args.invalid ? <FieldError>Selected schedule is not valid.</FieldError> : null}
        </FieldContent>
      </Field>
    );
  },
};
