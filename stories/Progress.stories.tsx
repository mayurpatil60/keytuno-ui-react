import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Progress,
  ProgressLabel,
  ProgressValue,
  Slider,
} from '@keytuno/ui-react';

const meta: Meta<typeof Progress> = {
  title: 'Feedback/Progress',
  component: Progress,
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

function SliderControlledDemo(): JSX.Element {
  const [sliderValue, setSliderValue] = useState<number[]>([42]);
  const resolvedValue = sliderValue[0] ?? 0;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <Progress value={resolvedValue} size="md">
        <ProgressLabel>Execution Coverage</ProgressLabel>
        <ProgressValue formatter={(value) => `${Math.round(value)} / 100`} />
      </Progress>

      <Slider
        value={sliderValue}
        onValueChange={setSliderValue}
        min={0}
        max={100}
        step={1}
        minLabel="0"
        maxLabel="100"
      />
    </div>
  );
}

export const Basic: Story = {
  name: 'Without Label / Value',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Without Label / Value</h3>

      <Field style={frameStyle}>
        <FieldLabel>Portfolio Migration</FieldLabel>

        <FieldContent>
          <Progress value={58} />
          <FieldDescription>
            Simple progress bar usage without extra label components.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const WithLabelAndValue: Story = {
  name: 'With Label and Value',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>With Label and Value</h3>

      <FieldGroup style={frameStyle}>
        <Progress value={36}>
          <ProgressLabel>Data Sync</ProgressLabel>
          <ProgressValue />
        </Progress>

        <Progress value={81} size="lg">
          <ProgressLabel>Backtest Processing</ProgressLabel>
          <ProgressValue
            formatter={(value, percentage) => `${Math.round(value)} (${Math.round(percentage)}%)`}
          />
        </Progress>
      </FieldGroup>
    </div>
  ),
};

export const ControlledWithSlider: Story = {
  name: 'Controlled With Slider',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Controlled With Slider</h3>

      <Field style={frameStyle}>
        <FieldLabel>Execution Progress</FieldLabel>

        <FieldContent>
          <SliderControlledDemo />
          <FieldDescription>
            Progress is controlled from Slider value and updates in real time.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Size: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Size</h3>

      <FieldGroup style={frameStyle}>
        <Progress value={48} size="xs">
          <ProgressLabel>xs</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Progress value={48} size="sm">
          <ProgressLabel>sm</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Progress value={48} size="md">
          <ProgressLabel>md</ProgressLabel>
          <ProgressValue />
        </Progress>
        <Progress value={48} size="lg">
          <ProgressLabel>lg</ProgressLabel>
          <ProgressValue />
        </Progress>
      </FieldGroup>
    </div>
  ),
};

export const ProgressPlayground: Story = {
  name: 'Progress Playground',
  args: {
    value: 64,
    min: 0,
    max: 100,
    size: 'md',
    showLabel: true,
    showValue: true,
    labelText: 'Account Verification',
    withAction: false,
  },
  argTypes: {
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    showLabel: { control: 'boolean' },
    showValue: { control: 'boolean' },
    labelText: { control: 'text' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    children: { table: { disable: true } },
    formatAriaValue: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field style={frameStyle}>
        <FieldLabel>Interactive Playground</FieldLabel>

        <FieldContent>
          <Progress
            key={`${args.value}-${args.min}-${args.max}-${args.size}-${args.showLabel}-${args.showValue}-${args.labelText}-${withAction}`}
            value={args.value}
            min={args.min}
            max={args.max}
            size={args.size}
            onAction={withAction ? args.onAction : undefined}
          >
            {args.showLabel ? <ProgressLabel>{args.labelText}</ProgressLabel> : null}
            {args.showValue ? (
              <ProgressValue style={args.showLabel ? undefined : { marginInlineStart: 'auto' }} />
            ) : null}
          </Progress>

          <FieldDescription>
            Toggle label and value components to test both with and without variants.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
