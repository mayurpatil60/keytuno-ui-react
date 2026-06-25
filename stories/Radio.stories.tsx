import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FiActivity, FiTrendingUp, FiZap } from 'react-icons/fi';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Radio,
  type RadioOption,
} from '@keytuno/ui-react';

const meta: Meta<typeof Radio> = {
  title: 'Forms/Radio',
  component: Radio,
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

const strategyOptions: RadioOption[] = [
  {
    value: 'swing',
    label: 'Swing Trading',
    description: 'Hold positions for 2 to 5 sessions based on trend confirmations.',
  },
  {
    value: 'scalp',
    label: 'Scalping',
    description: 'Capture micro-moves with strict stop-loss and target controls.',
  },
  {
    value: 'intraday',
    label: 'Intraday Momentum',
    description: 'Enter breakouts on high-volume sessions and exit same day.',
  },
];

const cardOptions: RadioOption[] = [
  {
    value: 'conservative',
    label: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
        <FiActivity size={14} />
        Conservative
      </span>
    ),
    description: 'Lower risk exposure with tighter stop ranges.',
  },
  {
    value: 'balanced',
    label: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
        <FiTrendingUp size={14} />
        Balanced
      </span>
    ),
    description: 'Mix of momentum and mean reversion opportunities.',
  },
  {
    value: 'aggressive',
    label: (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
        <FiZap size={14} />
        Aggressive
      </span>
    ),
    description: 'Higher volatility setups with larger reward potential.',
  },
];

const disabledOptions: RadioOption[] = [
  { value: 'cash', label: 'Cash', description: 'Orders settled from available balance.' },
  {
    value: 'margin',
    label: 'Margin',
    description: 'Currently unavailable for this account tier.',
    disabled: true,
  },
  {
    value: 'delivery',
    label: 'Delivery',
    description: 'Place orders for CNC holdings.',
  },
];

const compactPlaygroundOptions: RadioOption[] = [
  { value: 'swing', label: 'Swing' },
  { value: 'scalp', label: 'Scalp' },
  { value: 'intraday', label: 'Intraday' },
];

const miniPlaygroundOptions: RadioOption[] = [
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
  { value: 'hold', label: 'Hold' },
];

function ChoiceCardDemo(): JSX.Element {
  const [value, setValue] = useState<string>('balanced');

  return (
    <Radio
      choiceCard
      options={cardOptions}
      value={value}
      onValueChange={setValue}
      size="md"
      orientation="vertical"
    />
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel>Trade Style</FieldLabel>

        <FieldContent>
          <Radio options={strategyOptions} defaultValue="swing" />
          <FieldDescription>Pick the primary style for this strategy profile.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Description: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Description</h3>

      <Field style={frameStyle}>
        <FieldLabel>Execution Preference</FieldLabel>

        <FieldContent>
          <Radio options={strategyOptions} defaultValue="intraday" orientation="vertical" />
          <FieldDescription>
            Each option includes a supporting description for better context.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const ChoiceCard: Story = {
  name: 'Choice Card',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Choice Card</h3>

      <Field style={frameStyle}>
        <FieldLabel>Risk Profile</FieldLabel>

        <FieldContent>
          <ChoiceCardDemo />
          <FieldDescription>Card-style radios make major choices more prominent.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Disabled</h3>

      <FieldGroup style={frameStyle}>
        <Field disabled>
          <FieldLabel>Account Mode</FieldLabel>

          <FieldContent>
            <Radio options={disabledOptions} defaultValue="cash" disabled />
            <FieldDescription>Entire group disabled.</FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Account Mode (Partial)</FieldLabel>

          <FieldContent>
            <Radio options={disabledOptions} defaultValue="delivery" />
            <FieldDescription>Only one option is disabled.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Invalid</h3>

      <Field invalid required style={frameStyle}>
        <FieldLabel>Order Type</FieldLabel>

        <FieldContent>
          <Radio
            invalid
            required
            options={[
              { value: 'market', label: 'Market' },
              { value: 'limit', label: 'Limit' },
              { value: 'stop-loss', label: 'Stop Loss' },
            ]}
          />
          <FieldError>Please select one order type to continue.</FieldError>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const RightControl: Story = {
  name: 'Right Control',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Right Control</h3>

      <Field style={frameStyle}>
        <FieldLabel>Notification Priority</FieldLabel>

        <FieldContent>
          <Radio
            defaultValue="high"
            align="inline-end"
            options={[
              { value: 'low', label: 'Low Priority', description: 'Digest and summary alerts.' },
              {
                value: 'medium',
                label: 'Medium Priority',
                description: 'Standard trade signal alerts.',
              },
              {
                value: 'high',
                label: 'High Priority',
                description: 'Immediate push and SMS notifications.',
              },
            ]}
          />

          <FieldDescription>
            Text stays left while radio control is pinned to the right.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const MiniOrientationAlignPlayground: Story = {
  name: 'Mini Orientation Align Playground',
  args: {
    orientation: 'vertical',
    align: 'inline-start',
    disabled: false,
    required: false,
    invalid: false,
    withAction: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    align: {
      control: 'inline-radio',
      options: ['inline-start', 'inline-end'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onValueChange: { action: 'value-change' },
    size: { table: { disable: true } },
    choiceCard: { table: { disable: true } },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    name: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field
        invalid={args.invalid}
        required={args.required}
        disabled={args.disabled}
        style={{ ...frameStyle, maxWidth: '22rem' }}
      >
        <FieldLabel>Mini Playground (XS)</FieldLabel>

        <FieldContent>
          <Radio
            key={`${args.orientation}-${args.align}-${args.disabled}-${args.required}-${args.invalid}-${withAction}`}
            options={miniPlaygroundOptions}
            defaultValue="buy"
            size="xs"
            orientation={args.orientation}
            align={args.align}
            disabled={args.disabled}
            required={args.required}
            invalid={args.invalid}
            onAction={withAction ? args.onAction : undefined}
            onValueChange={withAction ? args.onValueChange : undefined}
            style={{
              width: args.orientation === 'horizontal' ? 'fit-content' : '100%',
              border: '1px dashed var(--ktn-border-muted)',
              borderRadius: 'var(--ktn-radius-sm, 0.375rem)',
              padding: '0.45rem',
            }}
          />

          {args.invalid ? (
            <FieldError>Select one valid option.</FieldError>
          ) : (
            <FieldDescription>
              Uses smallest radio size to clearly compare orientation and align changes.
            </FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};

export const RadioPlayground: Story = {
  name: 'Radio Playground',
  args: {
    orientation: 'vertical',
    size: 'md',
    align: 'inline-start',
    disabled: false,
    required: false,
    invalid: false,
    choiceCard: false,
    withAction: false,
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    align: {
      control: 'inline-radio',
      options: ['inline-start', 'inline-end'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
    choiceCard: { control: 'boolean' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onValueChange: { action: 'value-change' },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    name: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field
        invalid={args.invalid}
        required={args.required}
        disabled={args.disabled}
        style={frameStyle}
      >
        <FieldLabel>Playground</FieldLabel>

        <FieldContent>
          <Radio
            key={`${args.orientation}-${args.size}-${args.align}-${args.disabled}-${args.required}-${args.invalid}-${args.choiceCard}-${withAction}`}
            options={compactPlaygroundOptions}
            defaultValue="swing"
            orientation={args.orientation}
            size={args.size}
            align={args.align}
            disabled={args.disabled}
            required={args.required}
            invalid={args.invalid}
            choiceCard={args.choiceCard}
            onAction={withAction ? args.onAction : undefined}
            onValueChange={withAction ? args.onValueChange : undefined}
          />

          {args.invalid ? (
            <FieldError>Select one valid option.</FieldError>
          ) : (
            <FieldDescription>
              Adjust controls to test orientation, align, and sizing.
            </FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};
