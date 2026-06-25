import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Card,
  CardContent,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Switch,
} from '@keytuno/ui-react';

const meta: Meta<typeof Switch> = {
  title: 'Actions/Switch',
  component: Switch,
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

const rowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

function ChoiceCardDemo(): JSX.Element {
  const [tradeAlerts, setTradeAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(false);

  return (
    <div style={rowStyle}>
      <Card size="sm" spacing="sm">
        <CardContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 500 }}>Trade Execution Alerts</p>
              <p
                style={{
                  margin: '0.2rem 0 0',
                  fontSize: '0.8rem',
                  color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
                }}
              >
                Real-time push when orders are filled or rejected.
              </p>
            </div>

            <Switch
              checked={tradeAlerts}
              onCheckedChange={setTradeAlerts}
              aria-label="Trade execution alerts"
            />
          </div>
        </CardContent>
      </Card>

      <Card size="sm" spacing="sm">
        <CardContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 500 }}>Market News Alerts</p>
              <p
                style={{
                  margin: '0.2rem 0 0',
                  fontSize: '0.8rem',
                  color: 'var(--ktn-text-secondary, var(--ktn-text-primary))',
                }}
              >
                Notify only for high-impact events and earnings releases.
              </p>
            </div>

            <Switch
              checked={newsAlerts}
              onCheckedChange={setNewsAlerts}
              aria-label="Market news alerts"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="switch-basic">Auto Invest</FieldLabel>

        <FieldContent>
          <Switch id="switch-basic" defaultChecked>
            Enable weekly auto-invest
          </Switch>
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
        <FieldLabel htmlFor="switch-description">Notifications</FieldLabel>

        <FieldContent>
          <Switch
            id="switch-description"
            defaultChecked
            description="Get notified instantly for filled orders and stop-loss triggers."
          >
            Push Notifications
          </Switch>

          <FieldDescription>
            Switch supports inline description text for additional context.
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
        <FieldLabel>Alert Preferences</FieldLabel>

        <FieldContent>
          <ChoiceCardDemo />
          <FieldDescription>
            Use existing Card component to present switch choices as cards.
          </FieldDescription>
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
          <FieldLabel htmlFor="switch-disabled-all">Disabled Field</FieldLabel>

          <FieldContent>
            <Switch id="switch-disabled-all" disabled defaultChecked>
              Brokerage Sync
            </Switch>
            <FieldDescription>Entire control disabled.</FieldDescription>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="switch-disabled-single">Partial Disabled</FieldLabel>

          <FieldContent>
            <Switch id="switch-disabled-single" disabled>
              Futures Segment Access
            </Switch>
            <FieldDescription>Individual switch can be disabled independently.</FieldDescription>
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
        <FieldLabel htmlFor="switch-invalid">Risk Disclaimer</FieldLabel>

        <FieldContent>
          <Switch id="switch-invalid" invalid>
            I accept the volatility disclosure.
          </Switch>
          <FieldError>You must accept this to continue.</FieldError>
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
        <Switch size="xs" defaultChecked>
          Extra Small
        </Switch>
        <Switch size="sm" defaultChecked>
          Small
        </Switch>
        <Switch size="md" defaultChecked>
          Medium
        </Switch>
        <Switch size="lg" defaultChecked>
          Large
        </Switch>
      </FieldGroup>
    </div>
  ),
};

export const SwitchPlayground: Story = {
  name: 'Switch Playground',
  args: {
    orientation: 'horizontal',
    size: 'md',
    disabled: false,
    invalid: false,
    defaultChecked: false,
    children: 'Switch Label',
    description: 'Optional helper text for this switch.',
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
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
    children: { control: 'text' },
    description: { control: 'text' },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onCheckedChange: { action: 'checked-change' },
    onChange: { action: 'change' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' },
    checked: { table: { disable: true } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  render: (args) => {
    const withAction = args.withAction ?? false;

    return (
      <Field invalid={args.invalid} disabled={args.disabled} style={frameStyle}>
        <FieldLabel htmlFor="switch-playground">Interactive Playground</FieldLabel>

        <FieldContent>
          <Switch
            key={`${args.orientation}-${args.size}-${args.disabled}-${args.invalid}-${args.defaultChecked}-${args.children}-${args.description}-${withAction}`}
            id="switch-playground"
            orientation={args.orientation}
            size={args.size}
            disabled={args.disabled}
            invalid={args.invalid}
            defaultChecked={args.defaultChecked}
            description={args.description}
            onAction={withAction ? args.onAction : undefined}
            onCheckedChange={withAction ? args.onCheckedChange : undefined}
            onChange={withAction ? args.onChange : undefined}
            onFocus={withAction ? args.onFocus : undefined}
            onBlur={withAction ? args.onBlur : undefined}
          >
            {args.children}
          </Switch>

          {args.invalid ? (
            <FieldError>Fix invalid state or toggle requirement.</FieldError>
          ) : (
            <FieldDescription>
              Use controls to test orientation, size, and state combinations.
            </FieldDescription>
          )}
        </FieldContent>
      </Field>
    );
  },
};
