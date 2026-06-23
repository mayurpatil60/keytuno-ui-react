import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Tooltip,
} from '@keytuno/ui-react';

const meta: Meta<typeof Tooltip> = {
  title: 'Component/Tooltip',
  component: Tooltip,
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
  width: 'min(620px, 92vw)',
};

const sideGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(9.5rem, 1fr))',
  gap: '0.8rem',
};

const labelRowStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.45rem',
};

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="tooltip-basic-trigger">Hover Trigger</FieldLabel>

        <FieldContent>
          <Tooltip label="Use this action to open portfolio quick controls.">
            <Button id="tooltip-basic-trigger" variant="outline" size="sm">
              Hover or focus me
            </Button>
          </Tooltip>

          <FieldDescription>Tooltip appears on hover and keyboard focus.</FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes</h3>

      <FieldGroup style={frameStyle}>
        <Tooltip size="xs" label="XS tooltip for compact UI hints.">
          <Button size="xs" variant="secondary">
            Extra Small
          </Button>
        </Tooltip>

        <Tooltip size="sm" label="SM tooltip keeps hints concise.">
          <Button size="sm" variant="secondary">
            Small
          </Button>
        </Tooltip>

        <Tooltip size="md" label="MD is the default tooltip size.">
          <Button size="md" variant="secondary">
            Medium
          </Button>
        </Tooltip>

        <Tooltip size="lg" label="LG tooltip works for slightly longer guidance copy.">
          <Button size="lg" variant="secondary">
            Large
          </Button>
        </Tooltip>
      </FieldGroup>
    </div>
  ),
};

export const Sides: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sides</h3>

      <div style={sideGridStyle}>
        <Tooltip side="top" label="Tooltip above the trigger (default side).">
          <Button size="sm" variant="outline">
            Top
          </Button>
        </Tooltip>

        <Tooltip side="right" label="Tooltip on the right side.">
          <Button size="sm" variant="outline">
            Right
          </Button>
        </Tooltip>

        <Tooltip side="bottom" label="Tooltip below the trigger.">
          <Button size="sm" variant="outline">
            Bottom
          </Button>
        </Tooltip>

        <Tooltip side="left" label="Tooltip on the left side.">
          <Button size="sm" variant="outline">
            Left
          </Button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const WithField: Story = {
  name: 'With Field',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>With Field Label Helper</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="tooltip-field-input">
          <span style={labelRowStyle}>
            API Key
            <Tooltip side="right" size="sm" label="Your API key is hidden and encrypted at rest.">
              <Button type="button" variant="ghost" size="xs" aria-label="API key help">
                ?
              </Button>
            </Tooltip>
          </span>
        </FieldLabel>

        <FieldContent>
          <Input id="tooltip-field-input" placeholder="sk_live_xxxxxxxxxxxxx" />
          <FieldDescription>
            Combine Tooltip with Field to show contextual guidance inline.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const TooltipPlayground: Story = {
  name: 'Tooltip Playground',
  args: {
    label: 'Tooltip message appears near trigger.',
    size: 'md',
    side: 'auto',
    disabled: false,
    openDelay: 120,
    closeDelay: 70,
    withAction: false,
  },
  argTypes: {
    label: { control: 'text' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    side: {
      control: 'select',
      options: ['auto', 'left', 'top', 'bottom', 'right'],
    },
    disabled: { control: 'boolean' },
    openDelay: {
      control: { type: 'number', min: 0, step: 10 },
    },
    closeDelay: {
      control: { type: 'number', min: 0, step: 10 },
    },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' },
    onMouseEnter: { action: 'mouse-enter' },
    onMouseLeave: { action: 'mouse-leave' },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field style={frameStyle}>
        <FieldLabel htmlFor="tooltip-playground-button">Interactive Playground</FieldLabel>

        <FieldContent>
          <Tooltip
            key={`${args.size}-${args.side}-${args.disabled}-${args.openDelay}-${args.closeDelay}-${withAction}`}
            label={args.label}
            size={args.size}
            side={args.side}
            disabled={args.disabled}
            openDelay={args.openDelay}
            closeDelay={args.closeDelay}
            onAction={withAction ? args.onAction : undefined}
            onFocus={withAction ? args.onFocus : undefined}
            onBlur={withAction ? args.onBlur : undefined}
            onMouseEnter={withAction ? args.onMouseEnter : undefined}
            onMouseLeave={withAction ? args.onMouseLeave : undefined}
          >
            <Button id="tooltip-playground-button" type="button" variant="primary" size="sm">
              Hover or focus this trigger
            </Button>
          </Tooltip>

          <FieldDescription>
            Use controls to test size, side, and open/close delays.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
