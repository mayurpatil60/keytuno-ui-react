import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FiBell, FiHeart, FiMoon, FiSun } from 'react-icons/fi';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Toggle,
} from '@keytuno/ui-react';

const meta: Meta<typeof Toggle> = {
  title: 'Component/Toggle',
  component: Toggle,
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

const rowWrapStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  alignItems: 'center',
};

export const Basic: Story = {
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Basic</h3>

      <Field style={frameStyle}>
        <FieldLabel htmlFor="toggle-basic-alert">Alert Preference</FieldLabel>

        <FieldContent>
          <Toggle id="toggle-basic-alert" variant="outline" size="sm">
            <FiBell aria-hidden size={14} />
            <span>Enable Alerts</span>
          </Toggle>

          <FieldDescription>
            Toggled state keeps hover-like active color and icon fill.
          </FieldDescription>
        </FieldContent>
      </Field>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
      <div style={stackStyle}>
        <h3 style={{ margin: 0 }}>Controlled</h3>

        <Field style={frameStyle}>
          <FieldLabel htmlFor="toggle-controlled-theme">Theme Preference</FieldLabel>

          <FieldContent>
            <Toggle
              id="toggle-controlled-theme"
              variant="ghost"
              pressed={isDarkMode}
              onPressedChange={setIsDarkMode}
            >
              {isDarkMode ? <FiMoon aria-hidden size={14} /> : <FiSun aria-hidden size={14} />}
              <span>{isDarkMode ? 'Dark mode' : 'Light mode'}</span>
            </Toggle>

            <FieldDescription>
              Use pressed and onPressedChange when toggle state is controlled by parent.
            </FieldDescription>
          </FieldContent>
        </Field>
      </div>
    );
  },
};

export const SizesAndVariants: Story = {
  name: 'Sizes & Variants',
  render: () => (
    <div style={stackStyle}>
      <h3 style={{ margin: 0 }}>Sizes & Variants</h3>

      <FieldGroup style={frameStyle}>
        <div style={rowWrapStyle}>
          <Toggle size="xs" variant="outline" defaultPressed>
            <FiHeart aria-hidden size={12} />
            <span>XS</span>
          </Toggle>

          <Toggle size="sm" variant="secondary" defaultPressed>
            <FiHeart aria-hidden size={13} />
            <span>SM</span>
          </Toggle>

          <Toggle size="md" variant="ghost" defaultPressed>
            <FiHeart aria-hidden size={14} />
            <span>MD</span>
          </Toggle>

          <Toggle size="lg" variant="primary" defaultPressed>
            <FiHeart aria-hidden size={15} />
            <span>LG</span>
          </Toggle>
        </div>
      </FieldGroup>
    </div>
  ),
};

export const TogglePlayground: Story = {
  name: 'Toggle Playground',
  args: {
    children: 'Toggle Action',
    variant: 'outline',
    size: 'md',
    disabled: false,
    defaultPressed: false,
    fillIconOnPressed: true,
    type: 'button',
    withAction: false,
  },
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    defaultPressed: { control: 'boolean' },
    fillIconOnPressed: { control: 'boolean' },
    type: { control: 'select', options: ['button', 'submit', 'reset'] },
    withAction: { control: 'boolean' },
    onAction: { action: 'action' },
    onPressedChange: { action: 'pressed-change' },
    onClick: { action: 'click' },
    onFocus: { action: 'focus' },
    onBlur: { action: 'blur' },
    pressed: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  render: (args) => {
    const label = typeof args.children === 'string' ? args.children : 'Toggle Action';
    const withAction = args.withAction ?? false;

    return (
      <Field style={frameStyle}>
        <FieldLabel htmlFor="toggle-playground">Interactive Playground</FieldLabel>

        <FieldContent>
          <Toggle
            id="toggle-playground"
            key={`${args.variant}-${args.size}-${args.disabled}-${args.defaultPressed}-${args.fillIconOnPressed}-${withAction}`}
            variant={args.variant}
            size={args.size}
            disabled={args.disabled}
            defaultPressed={args.defaultPressed}
            fillIconOnPressed={args.fillIconOnPressed}
            type={args.type}
            onAction={withAction ? args.onAction : undefined}
            onPressedChange={withAction ? args.onPressedChange : undefined}
            onClick={withAction ? args.onClick : undefined}
            onFocus={withAction ? args.onFocus : undefined}
            onBlur={withAction ? args.onBlur : undefined}
          >
            <FiHeart aria-hidden size={14} />
            <span>{label}</span>
          </Toggle>

          <FieldDescription>
            Toggle keeps active color constant after press and can fill icons when active.
          </FieldDescription>
        </FieldContent>
      </Field>
    );
  },
};
